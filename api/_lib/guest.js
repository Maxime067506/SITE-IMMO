/**
 * Coordonnees du voyageur — validation serveur
 * =============================================
 * Meme regles que js/guest-validate.js (cote navigateur). Le serveur refuse
 * toute reservation sans prenom, nom, e-mail et telephone valides : on ne
 * peut pas contourner le formulaire.
 *
 * Telephone : format international E.164. Un numero francais saisi en
 * 06 12 34 56 78 est converti en +33612345678.
 */

const NAME_RE = /^\p{L}[\p{L}\p{M}' .-]*$/u;
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i;

export function cleanName(v) {
  const s = String(v == null ? '' : v).trim().replace(/\s+/g, ' ');
  return s.length >= 2 && s.length <= 60 && NAME_RE.test(s) ? s : null;
}

export function cleanEmail(v) {
  const s = String(v == null ? '' : v).trim().toLowerCase();
  return s.length <= 200 && EMAIL_RE.test(s) ? s : null;
}

/** Renvoie le numero au format +XXXXXXXX, ou null s'il n'est pas valide. */
export function cleanPhone(v) {
  let s = String(v == null ? '' : v).trim().replace(/[\s.\-()/]/g, '');
  if (s.startsWith('00')) s = '+' + s.slice(2);
  if (/^0[1-9]\d{8}$/.test(s)) s = '+33' + s.slice(1); // numero francais local
  if (!/^\+[1-9]\d{7,14}$/.test(s)) return null;
  if (s.startsWith('+33') && !/^\+33[1-9]\d{8}$/.test(s)) return null; // France : 9 chiffres apres +33
  return s;
}

/**
 * @returns {{ ok:true, guest:{first_name,last_name,name,email,phone} }
 *          | { ok:false, fields:string[] }}
 */
export function validateGuest(p) {
  p = p || {};
  const first = cleanName(p.guest_first_name);
  const last = cleanName(p.guest_last_name);
  const email = cleanEmail(p.guest_email);
  const phone = cleanPhone(p.guest_phone);
  const fields = [];
  if (!first) fields.push('first_name');
  if (!last) fields.push('last_name');
  if (!email) fields.push('email');
  if (!phone) fields.push('phone');
  if (fields.length) return { ok: false, fields };
  return { ok: true, guest: { first_name: first, last_name: last, name: first + ' ' + last, email, phone } };
}
