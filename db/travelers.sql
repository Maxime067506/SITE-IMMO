-- =========================================================
-- Delfosse Properties — Fiche voyageur / fiche individuelle de police
-- À exécuter dans Supabase → SQL Editor → Run. Idempotent.
--
-- Données de la fiche individuelle de police (CESEDA art. R814-1 à R814-3),
-- obligatoire pour les voyageurs étrangers, conservée 6 mois.
-- La COPIE de pièce d'identité (optionnelle) est stockée dans le bucket
-- privé 'guest-ids' et SUPPRIMÉE automatiquement après le départ.
-- =========================================================

create table if not exists booking_travelers (
  id                uuid primary key default gen_random_uuid(),
  booking_id        uuid not null references bookings(id) on delete cascade,
  first_name        text not null,
  last_name         text not null,
  birth_date        date,
  birth_place       text,
  nationality       text,
  home_address      text,
  is_lead           boolean not null default false,
  id_doc_path       text,            -- objet dans le bucket 'guest-ids' (null si pas d'upload)
  id_doc_deleted_at timestamptz,     -- horodatage de suppression auto après le séjour
  created_at        timestamptz not null default now()
);

create index if not exists booking_travelers_booking_idx on booking_travelers (booking_id);

-- Conservation 6 mois des DONNÉES (fiche de police). Index pour le ménage.
create index if not exists booking_travelers_created_idx on booking_travelers (created_at);

-- RLS : aucun accès public, tout passe par les fonctions serverless (service_role).
alter table booking_travelers enable row level security;
