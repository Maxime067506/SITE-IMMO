/**
 * Signature manuscrite du Loueur, pour signer les PDF générés côté serveur
 * (autorisation d'animal). Volontairement HORS du dépôt git : elle est lue
 * dans la variable d'environnement Vercel HOST_SIGNATURE_PNG, qui contient le
 * PNG en base64 (avec ou sans préfixe « data:image/png;base64, »). Le ratio
 * (hauteur/largeur) est calculé depuis l'en-tête PNG (IHDR).
 *
 * Si la variable n'est pas définie, HOST_SIGNATURE vaut null : l'autorisation
 * est alors générée avec une ligne de signature vide (non signée).
 */

function pngRatio(buf) {
  // En-tête PNG : largeur sur 4 octets à l'offset 16, hauteur à l'offset 20 (big-endian).
  if (!buf || buf.length < 24) return 0.5;
  var w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  return w > 0 ? h / w : 0.5;
}

var SIG = null;
try {
  var raw = process.env.HOST_SIGNATURE_PNG;
  if (raw && raw.length > 100) {
    var b64 = raw.indexOf(',') !== -1 ? raw.slice(raw.indexOf(',') + 1) : raw;
    b64 = b64.replace(/\s+/g, '');
    var buf = Buffer.from(b64, 'base64');
    SIG = { ratio: pngRatio(buf), data: 'data:image/png;base64,' + b64 };
  }
} catch (e) { SIG = null; }

export const HOST_SIGNATURE = SIG;
