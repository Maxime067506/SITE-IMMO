-- Numéro de pièce d'identité (passeport / CNI) du voyageur, obligatoire
-- dans la fiche voyageur. Conservé 6 mois puis supprimé (comme le reste).
alter table booking_travelers add column if not exists id_document_number text;
