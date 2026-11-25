-- Animal de compagnie déclaré à la réservation
-- (génère l'autorisation PDF signée à la confirmation).
alter table bookings add column if not exists has_pet boolean not null default false;
alter table bookings add column if not exists pet_info text;
