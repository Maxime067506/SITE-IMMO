/**
 * Helper Stripe (sans dependance npm)
 * ===================================
 * Appels directs a l'API REST Stripe en fetch + corps form-urlencoded.
 * La cle secrete (STRIPE_SECRET_KEY) vit uniquement cote serveur (env Vercel).
 *
 * Securite de confirmation : on ne fait jamais confiance au corps d'un
 * webhook seul. On RE-RECUPERE la session depuis Stripe avec notre cle
 * secrete (getCheckoutSession) ; une session payee qui existe dans NOTRE
 * compte est forcement authentique (personne d'autre n'a la cle secrete).
 */

const SECRET = process.env.STRIPE_SECRET_KEY;
const BASE = 'https://api.stripe.com/v1/';

export function stripeConfigured() {
  return Boolean(SECRET);
}

/** Aplatit un objet en paires Stripe (a[b][c]=v, a[0]=v...). */
function encodeForm(obj, prefix, out) {
  out = out || [];
  for (const key in obj) {
    const val = obj[key];
    if (val === undefined || val === null) continue;
    const k = prefix ? prefix + '[' + key + ']' : key;
    if (typeof val === 'object' && !Array.isArray(val)) {
      encodeForm(val, k, out);
    } else if (Array.isArray(val)) {
      val.forEach(function (v, i) {
        if (typeof v === 'object') encodeForm(v, k + '[' + i + ']', out);
        else out.push(encodeURIComponent(k + '[' + i + ']') + '=' + encodeURIComponent(v));
      });
    } else {
      out.push(encodeURIComponent(k) + '=' + encodeURIComponent(val));
    }
  }
  return out;
}

async function stripeRequest(method, path, params) {
  const res = await fetch(BASE + path, {
    method: method,
    headers: {
      Authorization: 'Bearer ' + SECRET,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params ? encodeForm(params).join('&') : undefined,
  });
  const json = await res.json();
  if (!res.ok) {
    const err = new Error((json.error && json.error.message) || 'Stripe error ' + res.status);
    err.status = res.status;
    err.stripe = json.error;
    throw err;
  }
  return json;
}

/** Cree une session Checkout. Retourne l'objet session (dont .url, .id). */
export function createCheckoutSession(params) {
  return stripeRequest('POST', 'checkout/sessions', params);
}

/** Recupere une session Checkout (source de verite pour la confirmation). */
export function getCheckoutSession(id) {
  return stripeRequest('GET', 'checkout/sessions/' + encodeURIComponent(id));
}

/** Recupere un PaymentIntent (ex: pour la caution). */
export function getPaymentIntent(id) {
  return stripeRequest('GET', 'payment_intents/' + encodeURIComponent(id));
}

/** Cree un PaymentIntent (utilise pour l'empreinte de caution). */
export function createPaymentIntent(params) {
  return stripeRequest('POST', 'payment_intents', params);
}

/** Capture un PaymentIntent a capture manuelle (debite la caution). */
export function capturePaymentIntent(id, amountCents) {
  const params = amountCents != null ? { amount_to_capture: amountCents } : undefined;
  return stripeRequest('POST', 'payment_intents/' + encodeURIComponent(id) + '/capture', params);
}

/** Annule un PaymentIntent (libere l'empreinte de caution). */
export function cancelPaymentIntent(id) {
  return stripeRequest('POST', 'payment_intents/' + encodeURIComponent(id) + '/cancel');
}
