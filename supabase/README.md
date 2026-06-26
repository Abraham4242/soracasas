# SORA Casas — daily SEO/traffic cron

A once-a-day server job that records keyword rank, Search Console performance, and
GA4 channels into Supabase so the marketing dashboard can draw real trend lines —
with no one having to open the page.

```
supabase/
  schema.sql                  tables + RLS + the daily pg_cron job
  functions/seo-cron/index.ts the Edge Function the cron invokes
```

## What it costs
- **Free:** Search Console + GA4 (service account) + the Supabase free tier.
- **~$3–5/month:** DataForSEO Standard, for true rank tracking of the ~17 target keywords daily. This is the only paid piece, and it is the only thing that can tell you your rank for a keyword you don't yet rank for. Skip it and you still get GSC actuals for keywords you already rank for.

## One-time setup

### 1. Create the tables
Supabase → **SQL Editor** → paste `schema.sql` → **Run**. Before running, edit the bottom of the file: replace `<PROJECT_REF>` and `<CRON_SECRET>` (pick any long random string for the secret). Enable the `pg_cron` and `pg_net` extensions in **Database → Extensions** if the `create extension` lines error.

### 2. Make a Google service account
Google Cloud Console → **IAM → Service Accounts → Create**. Create a **JSON key** and download it. Then grant it read access:
- **Search Console:** Settings → Users and permissions → add the service-account `client_email` as a **delegated owner** of the property.
- **GA4:** Admin → Property Access Management → add the same email as **Viewer**.

Enable the **Search Console API** and **Google Analytics Data API** for the project.

### 3. Set the secrets
```bash
supabase secrets set \
  SERVICE_ROLE_KEY="<your service_role key>" \
  CRON_SECRET="<same secret you put in schema.sql>" \
  GOOGLE_SA_JSON="$(cat path/to/service-account.json)" \
  GSC_SITE_URL="sc-domain:sora.la" \
  GA4_PROPERTY_ID="123456789" \
  DATAFORSEO_LOGIN="<dataforseo login>" \
  DATAFORSEO_PASSWORD="<dataforseo password>"
```
`SUPABASE_URL` is injected automatically. (Use `sc-domain:soracasas.com` once that domain is live and verified.)

### 4. Deploy the function
```bash
supabase functions deploy seo-cron --no-verify-jwt
```
Test it once by hand:
```bash
curl -X POST "https://<PROJECT_REF>.supabase.co/functions/v1/seo-cron" \
  -H "Authorization: Bearer <CRON_SECRET>"
```
You should get a JSON summary and see rows appear in `rank_history` / `gsc_query_daily` / `ga4_channel_daily`.

The `cron.schedule(...)` call in `schema.sql` already wires it to run daily at 06:12 UTC.

## Keep-alive (so the free tier doesn't pause)
Supabase free projects pause after 7 days of inactivity, which stops pg_cron. Add a tiny free GitHub Actions ping (public repo) that hits any Supabase REST endpoint daily, or run the pull from GitHub Actions instead of pg_cron. One scheduled workflow line is enough:
```yaml
on: { schedule: [{ cron: "12 6 * * *" }] }
```

## How the dashboard reads it
`marketing.html` can fetch the accumulated history with the public **anon** key (RLS is read-only on these tables) and plot `position` over `date` per keyword — one line per `source` (GSC actuals vs DataForSEO true-rank). That replaces today's seeded demo numbers with real, daily-updated data.

## Notes
- In `functions/seo-cron/index.ts`, `pullRanks` looks for `soracasas.com` / `sora.la` in the SERP to capture **our** position. Update that regex when the primary domain is decided.
- DataForSEO here uses the `live/advanced` endpoint (simplest). For the cheapest bill, switch to the Standard task queue (`task_post` + `task_get`) once volume grows.
