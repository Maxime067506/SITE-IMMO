-- Appartement 09 — Le Carré d'Or (27 rue Alphonse Karr, 06000 Nice)
-- A executer dans l'editeur SQL Supabase (production). Idempotent.
-- Studio : 4 voyageurs, 0 chambre (coin nuit), 1 salle d'eau, pas d'Airbnb.
-- Prix de base 69 EUR/nuit (6900 cents). Haute saison 165 EUR a configurer
-- dans l'admin (saisons) ou via pricing_seasons.

insert into apartments (code, name, airbnb_room_id, max_guests, bedrooms, bathrooms) values
 ('09','Le Carré d''Or', NULL, 4, 0, 1)
on conflict (code) do nothing;

insert into pricing (apartment_code, base_price_cents, min_nights) values
 ('09', 6900, 1)
on conflict (apartment_code) do nothing;
