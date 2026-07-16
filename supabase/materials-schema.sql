-- ============================================================================
-- SORA Casas — Materials Encyclopedia · live supplier quotes
-- Run this once in Supabase → SQL Editor → Run.
-- Backs the "Enciclopedia de Materiales" tab in sorainternalresources.html.
--
-- This is a separate file from schema.sql on purpose: schema.sql's tables
-- (keywords, rank_history, ...) are written by an unattended cron with the
-- service-role key and read publicly with the anon key. material_quotes is
-- the opposite — written interactively by Abraham and Yendri through the
-- password-gated internal tool, using only the anon key. Mixing the two
-- trust models in one file would blur what's actually protecting what.
-- ============================================================================

-- Live-sourced supplier price quotes, one row per confirmed quote.
-- material_slug is a plain indexed text column, not a foreign key — the
-- materials encyclopedia itself lives in git (materials-encyclopedia-data.js),
-- not in Postgres, so there is nothing here to key against server-side.
-- Validate the slug against window.SORA_MATERIALS client-side before insert.
create table if not exists material_quotes (
  id            bigint generated always as identity primary key,
  material_slug text not null,          -- key into window.SORA_MATERIALS[].slug
  price         numeric not null,
  currency      text default 'USD',
  unit          text not null,          -- 'm2' | 'm3' | 'unidad' | 'saco' | 'kg' | 'ml' ...
  supplier      text,
  region        text,                   -- Pedasí | Boquete | Bocas | Volcán | a Costa Rica market, etc.
  country       text,                   -- 'PA' | 'CR'
  quoted_by     text,                   -- 'Abraham' | 'Yendri'
  confirmed_by  text,                   -- who at the supplier confirmed it
  quote_date    date not null default current_date,
  notes         text,
  created_at    timestamptz default now()
);

create index if not exists idx_material_quotes_slug on material_quotes(material_slug);
create index if not exists idx_material_quotes_date on material_quotes(quote_date desc);

alter table material_quotes enable row level security;

-- Interno: permitir lectura/escritura con la anon key, igual que sora_state
-- (para producción, usa Supabase Auth y restringe por usuario)
drop policy if exists "equipo_sora_quotes" on material_quotes;
create policy "equipo_sora_quotes" on material_quotes
  for all using (true) with check (true);
