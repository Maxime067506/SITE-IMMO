/**
 * Prix au jour (table pricing_days)
 * =================================
 * Charge les prix fixes jour par jour depuis l'admin, pour un appartement
 * et une plage [from, to[. Renvoie { 'YYYY-MM-DD': cents }.
 *
 * Tolerant : si la table n'existe pas encore (SQL pas encore lance dans
 * Supabase), on renvoie {} -> les prix habituels s'appliquent, rien ne casse.
 */

import { sbSelect } from './supabase.js';
import { dayPriceMap } from './pricing.js';

export async function loadDayPrices(apt, from, to) {
  try {
    const rows = await sbSelect(
      'pricing_days?apartment_code=eq.' +
        apt +
        '&date=gte.' +
        encodeURIComponent(from) +
        '&date=lt.' +
        encodeURIComponent(to) +
        '&select=date,price_cents'
    );
    return dayPriceMap(rows);
  } catch (err) {
    console.warn('[pricing_days] ignore :', err.message);
    return {};
  }
}
