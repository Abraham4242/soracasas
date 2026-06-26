// ============================================================================
// SORA Casas — seo-cron Edge Function (Deno / Supabase)
// Runs once a day (invoked by pg_cron, see ../../schema.sql). It:
//   1. Pulls Search Console (queries, pages, daily totals) via a service account
//   2. Pulls GA4 channels via the same service account
//   3. Pulls true keyword rank for the target list via DataForSEO (server-side only)
//   4. Upserts dated rows so the dashboard can draw trend lines
//
// Deploy:   supabase functions deploy seo-cron --no-verify-jwt
// Secrets:  see ../../README.md  (supabase secrets set ...)
// ============================================================================

import { createClient } from "jsr:@supabase/supabase-js@2";

// ---- env / secrets ---------------------------------------------------------
const env = (k: string) => Deno.env.get(k) ?? "";
const SUPABASE_URL        = env("SUPABASE_URL");
const SERVICE_ROLE_KEY    = env("SERVICE_ROLE_KEY");          // writes bypass RLS
const CRON_SECRET         = env("CRON_SECRET");               // shared with schema.sql
const GOOGLE_SA_JSON      = env("GOOGLE_SA_JSON");            // service account key JSON (string)
const GSC_SITE_URL        = env("GSC_SITE_URL");              // e.g. "sc-domain:sora.la"
const GA4_PROPERTY_ID     = env("GA4_PROPERTY_ID");           // numeric id, optional
const DATAFORSEO_LOGIN    = env("DATAFORSEO_LOGIN");
const DATAFORSEO_PASSWORD = env("DATAFORSEO_PASSWORD");

const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const ymd = (d: Date) => d.toISOString().slice(0, 10);

// ---- Google service-account auth (RS256 JWT -> access token) ---------------
async function googleToken(scopes: string[]): Promise<string> {
  const sa = JSON.parse(GOOGLE_SA_JSON);
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: sa.client_email,
    scope: scopes.join(" "),
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  const b64 = (o: unknown) =>
    btoa(JSON.stringify(o)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const unsigned = `${b64(header)}.${b64(claim)}`;

  // import the PEM private key and sign
  const pem = sa.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    "pkcs8", der.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned),
  );
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const jwt = `${unsigned}.${sigB64}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const j = await res.json();
  if (!j.access_token) throw new Error("Google token error: " + JSON.stringify(j));
  return j.access_token;
}

// ---- 1 + 2. Search Console + GA4 -------------------------------------------
async function pullGoogle(today: string) {
  const token = await googleToken([
    "https://www.googleapis.com/auth/webmasters.readonly",
    "https://www.googleapis.com/auth/analytics.readonly",
  ]);
  const end = ymd(new Date(Date.now() - 3 * 864e5));        // GSC lags ~2-3 days
  const start = ymd(new Date(Date.now() - 31 * 864e5));
  const gscBody = (dims: string[], rowLimit = 1000) => JSON.stringify({
    startDate: start, endDate: end, dimensions: dims, rowLimit,
  });
  const gsc = (path: string, dims: string[], rowLimit?: number) =>
    fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE_URL)}/searchAnalytics/query`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: gscBody(dims, rowLimit),
    }).then((r) => r.json());

  // queries (latest available day -> rank_history source 'gsc' + gsc_query_daily)
  const byQuery = await gsc("q", ["query", "page"], 5000);
  const qrows = byQuery.rows ?? [];
  if (qrows.length) {
    await db.from("gsc_query_daily").upsert(
      qrows.map((r: any) => ({
        date: end, query: r.keys[0], page: r.keys[1] ?? "",
        clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position,
      })),
      { onConflict: "date,query,page" },
    );
    // map onto target keywords for rank_history
    const { data: kws } = await db.from("keywords").select("id,keyword").eq("active", true);
    const byKw: Record<string, any> = {};
    for (const r of qrows) byKw[r.keys[0].toLowerCase()] = r;
    const rows = (kws ?? [])
      .map((k: any) => ({ k, r: byKw[k.keyword.toLowerCase()] }))
      .filter((x: any) => x.r)
      .map((x: any) => ({
        keyword_id: x.k.id, date: end, source: "gsc",
        position: +x.r.position.toFixed(1), impressions: x.r.impressions, clicks: x.r.clicks,
      }));
    if (rows.length) await db.from("rank_history").upsert(rows, { onConflict: "keyword_id,date,source" });
  }

  // GA4 channels
  if (GA4_PROPERTY_ID) {
    const ga = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        dateRanges: [{ startDate: "yesterday", endDate: "yesterday" }],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }, { name: "totalUsers" }, { name: "conversions" }],
      }),
    }).then((r) => r.json());
    const grows = ga.rows ?? [];
    if (grows.length) {
      await db.from("ga4_channel_daily").upsert(
        grows.map((r: any) => ({
          date: today, channel: r.dimensionValues[0].value,
          sessions: +r.metricValues[0].value, users: +r.metricValues[1].value,
          conversions: +(r.metricValues[2]?.value ?? 0),
        })),
        { onConflict: "date,channel" },
      );
    }
  }
  return { gscQueries: qrows.length };
}

// ---- 3. True rank tracking via DataForSEO (server-side only) ---------------
async function pullRanks(today: string) {
  if (!DATAFORSEO_LOGIN) return { ranks: 0 };
  const { data: kws } = await db.from("keywords").select("id,keyword,location,locale").eq("active", true);
  if (!kws?.length) return { ranks: 0 };
  const auth = "Basic " + btoa(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`);
  // batch task (Standard queue = cheapest); here we use the live endpoint per keyword for simplicity
  const rows: any[] = [];
  for (const k of kws) {
    const body = [{
      keyword: k.keyword,
      location_name: k.location || "Panama",
      language_code: (k.locale || "en-US").startsWith("es") ? "es" : "en",
      depth: 100,
    }];
    const res = await fetch("https://api.dataforseo.com/v3/serp/google/organic/live/advanced", {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => r.json()).catch(() => null);
    const items = res?.tasks?.[0]?.result?.[0]?.items ?? [];
    // TODO: set your own domain so we capture OUR position, not the #1 overall
    const ours = items.find((it: any) => /soracasas\.com|sora\.la/i.test(it.url ?? it.domain ?? ""));
    if (ours) rows.push({ keyword_id: k.id, date: today, source: "dataforseo", position: ours.rank_absolute });
  }
  if (rows.length) await db.from("rank_history").upsert(rows, { onConflict: "keyword_id,date,source" });
  return { ranks: rows.length };
}

// ---- handler ---------------------------------------------------------------
Deno.serve(async (req) => {
  // simple shared-secret gate (pg_cron sends it in the Authorization header)
  const auth = req.headers.get("Authorization") ?? "";
  if (CRON_SECRET && auth !== `Bearer ${CRON_SECRET}`) {
    return new Response("unauthorized", { status: 401 });
  }
  const today = ymd(new Date());
  const out: Record<string, unknown> = { date: today };
  try { Object.assign(out, await pullGoogle(today)); } catch (e) { out.googleError = String(e); }
  try { Object.assign(out, await pullRanks(today)); }  catch (e) { out.ranksError = String(e); }
  return new Response(JSON.stringify(out), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
