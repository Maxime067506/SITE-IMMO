-- =========================================================
-- Delfosse Properties — Prix au jour (calendrier de prix admin)
-- À exécuter UNE FOIS dans Supabase → SQL Editor → Run.
-- Ré-exécutable sans erreur (idempotent). N'altère aucune table existante.
-- =========================================================

create table if not exists pricing_days (
  apartment_code text not null references apartments(code) on delete cascade,
  date           date not null,
  price_cents    int  not null check (price_cents >= 1000),
  updated_at     timestamptz not null default now(),
  primary key (apartment_code, date)
);

-- Sécurité : RLS activé, AUCUN accès public (accès serveur uniquement).
alter table pricing_days enable row level security;
