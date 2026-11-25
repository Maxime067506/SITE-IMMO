-- Suivi des rappels de fiche voyageur deja envoyes (paliers J-7 / J-3 / J-1),
-- stockes en liste separee par virgules (ex. "7,3"). Rempli par le cron
-- api/cron/fiche-reminders.
alter table bookings add column if not exists fiche_reminders text not null default '';
