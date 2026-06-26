-- ============================================================================
-- SORA Casas — SEO / traffic automation schema
-- Run this once in Supabase → SQL Editor → Run.
-- Creates the history tables the daily cron writes to, plus the pg_cron job
-- that invokes the seo-cron Edge Function every morning.
-- ============================================================================

-- 1. Target keyword list (the keywords we actively rank-track via DataForSEO)
create table if not exists keywords (
  id          bigint generated always as identity primary key,
  keyword     text not null,
  pillar      text,                 -- Construir | Comprar | Visas | Comparar | Costo | Español
  target_url  text,
  locale      text default 'en-US', -- 'en-US' or 'es' (for casa llave en mano, etc.)
  location    text default 'Panama',
  active      boolean default true,
  unique (keyword, locale)
);

-- 2. Daily rank snapshot per keyword + source (gsc actuals vs dataforseo true-rank vs bing)
create table if not exists rank_history (
  id          bigint generated always as identity primary key,
  keyword_id  bigint references keywords(id) on delete cascade,
  date        date not null,
  position    numeric,
  impressions integer,
  clicks      integer,
  source      text not null,        -- 'gsc' | 'dataforseo' | 'bing'
  unique (keyword_id, date, source)
);

-- 3. Raw GSC query x page performance (what you already rank for)
create table if not exists gsc_query_daily (
  id          bigint generated always as identity primary key,
  date        date not null,
  query       text not null,
  page        text default '',
  clicks      integer,
  impressions integer,
  ctr         numeric,
  position    numeric,
  unique (date, query, page)
);

-- 4. GA4 channels
create table if not exists ga4_channel_daily (
  id          bigint generated always as identity primary key,
  date        date not null,
  channel     text not null,
  sessions    integer,
  users       integer,
  conversions integer default 0,
  unique (date, channel)
);

-- 5. Core Web Vitals (CrUX / PageSpeed)
create table if not exists cwv_daily (
  id      bigint generated always as identity primary key,
  date    date not null,
  url     text not null,
  lcp_p75 numeric,
  inp_p75 numeric,
  cls_p75 numeric,
  source  text default 'crux',
  unique (date, url, source)
);

-- ----------------------------------------------------------------------------
-- Row Level Security: the dashboard reads history with the public anon key,
-- the cron writes with the service-role key (which bypasses RLS).
-- ----------------------------------------------------------------------------
alter table keywords          enable row level security;
alter table rank_history      enable row level security;
alter table gsc_query_daily   enable row level security;
alter table ga4_channel_daily enable row level security;
alter table cwv_daily         enable row level security;

do $$
declare t text;
begin
  foreach t in array array['keywords','rank_history','gsc_query_daily','ga4_channel_daily','cwv_daily']
  loop
    execute format('drop policy if exists "anon_read_%1$s" on %1$s', t);
    execute format('create policy "anon_read_%1$s" on %1$s for select using (true)', t);
  end loop;
end $$;

-- ----------------------------------------------------------------------------
-- Seed the target keyword list (mirrors marketing.html priority pillars).
-- ----------------------------------------------------------------------------
insert into keywords (keyword, pillar, locale) values
  ('build a house in Panama','Construir','en-US'),
  ('cost to build a house in Panama','Construir','en-US'),
  ('turnkey home Costa Rica','Construir','en-US'),
  ('casa llave en mano Panamá','Construir','es'),
  ('Pedasi real estate','Comprar','en-US'),
  ('Boquete real estate','Comprar','en-US'),
  ('Coronado Panama real estate','Comprar','en-US'),
  ('terrenos en venta Panamá','Comprar','es'),
  ('Panama Friendly Nations Visa','Visas','en-US'),
  ('Panama Qualified Investor Visa','Visas','en-US'),
  ('Panama Pensionado Visa','Visas','en-US'),
  ('Panama vs Costa Rica retire','Comparar','en-US'),
  ('Boquete vs Volcan','Comparar','en-US'),
  ('best places to retire in Panama','Comparar','en-US'),
  ('cost of living Panama','Costo','en-US'),
  ('living in Boquete','Costo','en-US'),
  ('casas en venta Pedasí','Español','es')
on conflict (keyword, locale) do nothing;

-- ----------------------------------------------------------------------------
-- Daily cron: invoke the seo-cron Edge Function at 06:12 UTC every day.
-- Requires the pg_cron and pg_net extensions (enable in Database → Extensions).
-- Replace <PROJECT_REF> and <CRON_SECRET> below before running.
-- ----------------------------------------------------------------------------
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'sora-seo-daily',
  '12 6 * * *',
  $$
  select net.http_post(
    url     := 'https://<PROJECT_REF>.supabase.co/functions/v1/seo-cron',
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'Authorization','Bearer <CRON_SECRET>'
    ),
    body    := '{}'::jsonb
  );
  $$
);

-- To inspect / remove later:
--   select * from cron.job;
--   select cron.unschedule('sora-seo-daily');
