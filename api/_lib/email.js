/**
 * Envoi d'e-mails (Resend, via fetch, sans dependance)
 * ====================================================
 * Deux e-mails a la confirmation d'une reservation :
 *   - au voyageur : confirmation + recap
 *   - a l'hote    : notification de nouvelle resa directe
 *
 * Config (env Vercel) :
 *   RESEND_API_KEY   cle API Resend (SECRET)
 *   EMAIL_FROM       ex: "Delfosse Properties <reservation@delfosseproperties.com>"
 *   HOST_EMAIL       ou recevoir les notifs hote (ex: delfossemaximepro@gmail.com)
 *
 * Si RESEND_API_KEY n'est pas defini, on NE jette PAS : la reservation
 * reste confirmee, seules les notifications sont sautees (retour {sent:false}).
 */

const API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM || 'Delfosse Properties <onboarding@resend.dev>';
const HOST_EMAIL = process.env.HOST_EMAIL || 'delfossemaximepro@gmail.com';
const REPLY_TO = process.env.EMAIL_REPLY_TO || HOST_EMAIL;

export function emailConfigured() { return Boolean(API_KEY); }

/** Rend les deux e-mails en HTML (apercu / test, sans envoi). */
export function renderBookingEmails(booking, lang) {
  lang = lang === 'en' ? 'en' : 'fr';
  return { guest: guestHtml(booking, lang), host: hostHtml(booking) };
}

function eur(c) { return (Number(c || 0) / 100).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function fmtDate(d, lang) {
  if (!d) return '';
  const p = String(d).slice(0, 10).split('-');
  return lang === 'en' ? p[2] + '/' + p[1] + '/' + p[0] : p[2] + '/' + p[1] + '/' + p[0];
}
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

async function resendSend(msg) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(msg),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error('Resend ' + res.status + ': ' + body);
  }
  return res.json();
}

/** Envoie les e-mails voyageur + hote. Ne jette jamais. */
export async function sendBookingEmails(booking, lang) {
  if (!emailConfigured()) return { sent: false, reason: 'no_api_key' };
  lang = lang === 'en' ? 'en' : 'fr';
  const tasks = [];
  if (booking.guest_email) {
    tasks.push(resendSend({
      from: FROM, to: [booking.guest_email], reply_to: REPLY_TO,
      subject: lang === 'en' ? 'Your booking is confirmed — Delfosse Properties'
                             : 'Votre réservation est confirmée — Delfosse Properties',
      html: guestHtml(booking, lang),
    }));
  }
  tasks.push(resendSend({
    from: FROM, to: [HOST_EMAIL], reply_to: booking.guest_email || REPLY_TO,
    subject: 'Nouvelle réservation directe — appart ' + booking.apartment_code + ' (' + fmtDate(booking.check_in, 'fr') + ')',
    html: hostHtml(booking),
  }));
  try {
    const r = await Promise.allSettled(tasks);
    const ok = r.some(function (x) { return x.status === 'fulfilled'; });
    const errs = r.filter(function (x) { return x.status === 'rejected'; }).map(function (x) { return String(x.reason && x.reason.message || x.reason); });
    return { sent: ok, errors: errs.length ? errs : undefined };
  } catch (e) {
    return { sent: false, reason: e.message };
  }
}

/** Envoie le code de verification a 6 chiffres. Jette en cas d'echec. */
export async function sendVerificationCode(email, code, lang) {
  if (!emailConfigured()) throw new Error('E-mails non configures.');
  lang = lang === 'en' ? 'en' : 'fr';
  const t = lang === 'en'
    ? { subject: 'Your verification code — Delfosse Properties', title: 'Your <span style="color:#D4B77E">code.</span>', p: 'Enter this code on the booking page to confirm your email address. It is valid for 15 minutes.', p2: 'If you did not request this code, you can ignore this email.' }
    : { subject: 'Votre code de vérification — Delfosse Properties', title: 'Votre <span style="color:#D4B77E">code.</span>', p: 'Saisissez ce code sur la page de réservation pour confirmer votre adresse e-mail. Il est valable 15 minutes.', p2: 'Si vous n\'êtes pas à l\'origine de cette demande, ignorez simplement cet e-mail.' };
  const html = shell(
    '<tr><td style="padding:10px 36px 0;text-align:center"><h1 style="font-family:Georgia,serif;font-weight:normal;font-style:italic;color:#F5EDE0;font-size:30px;margin:6px 0 14px">' + t.title + '</h1>' +
    '<p style="color:rgba(245,237,224,.7);font-size:14px;line-height:1.65;margin:0 0 20px">' + t.p + '</p>' +
    '<div style="display:inline-block;padding:16px 26px;border:1px solid rgba(201,169,97,.45);border-radius:10px;font-family:monospace;font-size:34px;letter-spacing:10px;color:#F5EDE0">' + esc(code) + '</div>' +
    '<p style="color:rgba(245,237,224,.45);font-size:12px;line-height:1.6;margin:20px 0 0">' + t.p2 + '</p></td></tr>'
  );
  return resendSend({ from: FROM, to: [email], reply_to: REPLY_TO, subject: t.subject, html });
}

// --- gabarits HTML (styles inline, compatibles clients mail) ---
function shell(inner) {
  return '<div style="background:#0A1628;padding:32px 0;font-family:Arial,Helvetica,sans-serif">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">' +
    '<table role="presentation" width="520" cellpadding="0" cellspacing="0" style="width:520px;max-width:92%;background:#0d1b30;border:1px solid rgba(201,169,97,.28);border-radius:12px;overflow:hidden">' +
    '<tr><td style="padding:32px 36px 10px;text-align:center">' +
      '<img src="https://delfosseproperties.com/img/delfosse-icon-white.png" width="52" height="52" alt="Delfosse Properties" style="display:inline-block;margin:0 auto 10px" />' +
      '<div style="font-family:Georgia,serif;color:#F5EDE0;font-size:12px;letter-spacing:5px;text-transform:uppercase">Delfosse <span style="color:#D4B77E">Properties</span></div>' +
    '</td></tr>' +
    inner +
    '<tr><td style="padding:18px 36px 30px;border-top:1px solid rgba(201,169,97,.18)"><p style="color:rgba(245,237,224,.45);font-size:12px;line-height:1.6;margin:14px 0 0">Delfosse Properties — Nice, French Riviera<br>delfosseproperties.com</p></td></tr>' +
    '</table></td></tr></table></div>';
}
function detailRows(b, lang) {
  const L = lang === 'en'
    ? { apt: 'Apartment', in: 'Check-in', out: 'Check-out', guests: 'Guests', total: 'Total paid', dep: 'Deposit (pre-authorised, not charged)' }
    : { apt: 'Appartement', in: 'Arrivée', out: 'Départ', guests: 'Voyageurs', total: 'Total réglé', dep: 'Caution (pré-autorisation, non débitée)' };
  function row(k, v) { return '<tr><td style="padding:7px 0;color:rgba(245,237,224,.7);font-size:14px">' + k + '</td><td style="padding:7px 0;text-align:right;color:#F5EDE0;font-size:14px;font-family:monospace">' + v + '</td></tr>'; }
  return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(201,169,97,.2);border-bottom:1px solid rgba(201,169,97,.2);margin:6px 0 4px">' +
    row(L.apt, 'N° ' + esc(b.apartment_code)) +
    row(L.in, fmtDate(b.check_in, lang)) +
    row(L.out, fmtDate(b.check_out, lang)) +
    (b.guests_count ? row(L.guests, b.guests_count) : '') +
    (b.total_cents != null ? row(L.total, eur(b.total_cents) + ' €') : '') +
    (b.deposit_cents ? row(L.dep, eur(b.deposit_cents) + ' €') : '') +
    '</table>';
}
function guestHtml(b, lang) {
  const t = lang === 'en'
    ? { title: 'Booking <span style="color:#D4B77E">confirmed.</span>', hi: 'Dear ' + esc(b.guest_name || 'guest') + ',', p1: 'Thank you — your stay is confirmed. We look forward to welcoming you. You will receive your check-in details (keybox code, Wi-Fi, directions) a few days before arrival.', p2: 'Any question? Simply reply to this email.' }
    : { title: 'Réservation <span style="color:#D4B77E">confirmée.</span>', hi: 'Bonjour ' + esc(b.guest_name || '') + ',', p1: 'Merci — votre séjour est confirmé. Nous avons hâte de vous accueillir. Vous recevrez les informations d\'arrivée (code de la boîte à clés, Wi-Fi, accès) quelques jours avant votre venue.', p2: 'Une question ? Répondez simplement à cet e-mail.' };
  return shell(
    '<tr><td style="padding:10px 36px 0"><h1 style="font-family:Georgia,serif;font-weight:normal;font-style:italic;color:#F5EDE0;font-size:30px;margin:6px 0 14px">' + t.title + '</h1>' +
    '<p style="color:rgba(245,237,224,.78);font-size:15px;line-height:1.6;margin:0 0 6px">' + t.hi + '</p>' +
    '<p style="color:rgba(245,237,224,.68);font-size:14px;line-height:1.65;margin:0 0 18px">' + t.p1 + '</p>' +
    detailRows(b, lang) +
    '<p style="color:rgba(245,237,224,.6);font-size:13px;line-height:1.6;margin:16px 0 0">' + t.p2 + '</p></td></tr>'
  );
}
function hostHtml(b) {
  return shell(
    '<tr><td style="padding:10px 36px 0"><h1 style="font-family:Georgia,serif;font-weight:normal;font-style:italic;color:#F5EDE0;font-size:28px;margin:6px 0 14px">Nouvelle réservation <span style="color:#D4B77E">directe.</span></h1>' +
    detailRows(b, 'fr') +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px">' +
    '<tr><td style="padding:6px 0;color:rgba(245,237,224,.7);font-size:14px">Voyageur</td><td style="padding:6px 0;text-align:right;color:#F5EDE0;font-size:14px">' + esc(b.guest_name || '—') + '</td></tr>' +
    '<tr><td style="padding:6px 0;color:rgba(245,237,224,.7);font-size:14px">E-mail</td><td style="padding:6px 0;text-align:right;color:#F5EDE0;font-size:14px">' + esc(b.guest_email || '—') + '</td></tr>' +
    '<tr><td style="padding:6px 0;color:rgba(245,237,224,.7);font-size:14px">Téléphone</td><td style="padding:6px 0;text-align:right;color:#F5EDE0;font-size:14px">' + esc(b.guest_phone || '—') + '</td></tr>' +
    '</table>' +
    '<p style="color:rgba(245,237,224,.5);font-size:12px;margin:16px 0 0">Pense à pré-autoriser la caution dans l\'admin à l\'approche de l\'arrivée.</p></td></tr>'
  );
}
