-- =========================================================
-- Delfosse Properties — Réservation directe
-- Schéma de base de données (lot 3a)
-- À exécuter UNE FOIS dans Supabase → SQL Editor → Run.
-- Ré-exécutable sans erreur (idempotent).
-- Montants en CENTIMES (int) pour éviter les erreurs d'arrondi.
-- =========================================================

create extension if not exists btree_gist;

-- 1) Appartements (référence des 8 logements)
create table if not exists apartments (
  code           text primary key,            -- '01'..'08'
  name           text not null,
  airbnb_room_id text,
  max_guests     int  not null default 4,
  bedrooms       int  not null default 1,
  bathrooms      int  not null default 1,
  active         boolean not null default true,
  created_at     timestamptz not null default now()
);

-- 2) Tarifs par appartement (Option A : grille manuelle, modifiable dans l'admin)
create table if not exists pricing (
  apartment_code      text primary key references apartments(code) on delete cascade,
  base_price_cents    int not null default 10000,  -- prix/nuit en semaine
  weekend_price_cents int,                          -- prix/nuit ven+sam (optionnel ; sinon = base)
  min_nights          int not null default 1,
  updated_at          timestamptz not null default now()
);

-- 3) Surcharges saisonnières (plages de dates qui écrasent le prix de base)
create table if not exists pricing_seasons (
  id             bigint generated always as identity primary key,
  apartment_code text references apartments(code) on delete cascade,  -- null = tous les apparts
  date_start     date not null,
  date_end       date not null,               -- inclus
  price_cents    int  not null,
  label          text,
  created_at     timestamptz not null default now(),
  check (date_end >= date_start)
);

-- 4) Réservations + verrous (cœur anti-double-réservation)
do $$ begin
  create type booking_status as enum ('hold','confirmed','cancelled','expired');
exception when duplicate_object then null; end $$;
do $$ begin
  create type booking_source as enum ('direct','airbnb_ical','manual');
exception when duplicate_object then null; end $$;

create table if not exists bookings (
  id                       uuid primary key default gen_random_uuid(),
  apartment_code           text not null references apartments(code),
  check_in                 date not null,
  check_out                date not null,       -- exclusif (nuit de départ non comptée)
  status                   booking_status not null default 'hold',
  source                   booking_source not null default 'direct',
  guest_name               text,
  guest_email              text,
  guest_phone              text,
  guests_count             int,
  nights                   int,
  nightly_total_cents      int,
  cleaning_fee_cents       int,
  tourist_tax_cents        int,
  total_cents              int,
  deposit_cents            int,
  stripe_payment_intent_id text,
  stripe_deposit_intent_id text,
  hold_expires_at          timestamptz,
  notes                    text,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),
  check (check_out > check_in)
);

-- Empêche tout chevauchement de dates pour un même appart
-- tant que la réservation est active (hold ou confirmée).
alter table bookings drop constraint if exists bookings_no_overlap;
alter table bookings
  add constraint bookings_no_overlap
  exclude using gist (
    apartment_code with =,
    daterange(check_in, check_out, '[)') with &&
  ) where (status in ('hold','confirmed'));

create index if not exists bookings_apt_dates_idx on bookings (apartment_code, check_in, check_out);
create index if not exists bookings_hold_exp_idx  on bookings (hold_expires_at) where status = 'hold';

-- 5) Réglages globaux (une seule ligne, modifiable dans l'admin)
create table if not exists settings (
  id                       int primary key default 1,
  cleaning_fee_cents       int  not null default 6500,   -- 65,00 €
  deposit_cents            int  not null default 30000,  -- 300,00 € (à ajuster)
  tax_percent              numeric not null default 5.0,  -- taxe séjour meublé non classé Nice (À CONFIRMER)
  tax_additional_percent   numeric not null default 34.0, -- taxe additionnelle départementale
  tax_cap_cents_per_night  int  not null default 643,     -- plafond /pers/nuit (À CONFIRMER)
  min_lead_days            int  not null default 2,       -- délai mini avant arrivée (résa directe)
  hold_minutes             int  not null default 15,      -- durée du verrou pendant le paiement
  cancellation_policy      text default 'Flexible',
  updated_at               timestamptz not null default now(),
  check (id = 1)
);
insert into settings (id) values (1) on conflict (id) do nothing;

-- 6) Seed des 8 appartements
insert into apartments (code, name, airbnb_room_id, max_guests, bedrooms, bathrooms) values
 ('01','Notre appartement du port',     '1361669686960380718',4,1,1),
 ('02','Son jumeau du port',            '1361686663866337495',4,1,1),
 ('03','Appartement avenue Notre-Dame', '1563266584925477319',6,2,1),
 ('04','Appartement Art Déco (gare)',   '1361628609886141688',4,0,1),
 ('05','Appartement ultra design',      '1446914329011561138',4,1,1),
 ('06','Appartement rue Gounod',        '1361447215596892211',4,1,1),
 ('07','Appartement design',            '1447097634568506909',4,1,1),
 ('08','Nouvel appartement Musiciens',  '1705198304588120041',4,1,1)
on conflict (code) do nothing;

-- Tarifs de départ = min Airbnb (tu les ajusteras dans l'admin)
insert into pricing (apartment_code, base_price_cents, min_nights) values
 ('01',8000,1),('02',8000,1),('03',9800,1),('04',7500,1),
 ('05',8000,1),('06',6000,1),('07',8000,1),('08',9800,1)
on conflict (apartment_code) do nothing;

-- 7) Sécurité : RLS activé, AUCUN accès public.
-- Tous les accès passent par les fonctions serverless (clé service_role, qui bypass RLS).
alter table apartments      enable row level security;
alter table pricing         enable row level security;
alter table pricing_seasons enable row level security;
alter table bookings        enable row level security;
alter table settings        enable row level security;
