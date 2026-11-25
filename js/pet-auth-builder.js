/* =====================================================================
   pet-auth-builder.js — Autorisation d'animal de compagnie (PDF)
   ---------------------------------------------------------------------
   Généré CÔTÉ SERVEUR (api/_lib/pet-auth-pdf.js) et joint à l'e-mail de
   confirmation quand le voyageur a déclaré un animal à la réservation.
   Même charte que le contrat : page unique, filigrane centré, signature
   du Loueur. jsPDF, logo et signature sont passés en paramètre.
   Réutilise la table des appartements (adresses) du contrat.
   ===================================================================== */

import { APT } from './contract-builder.js';

function fmt(d) { if (!d) return ''; var p = String(d).slice(0, 10).split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }

function todayStr(EN) {
  var d = new Date();
  var mFR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var mEN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return EN ? (d.getDate() + ' ' + mEN[d.getMonth()] + ' ' + d.getFullYear())
            : (d.getDate() + ' ' + mFR[d.getMonth()] + ' ' + d.getFullYear());
}

function petPhrase(b, EN) {
  var info = b && b.pet_info ? String(b.pet_info).trim() : '';
  if (EN) return 'their pet' + (info ? ' (' + info + ')' : '');
  return 'son animal de compagnie' + (info ? ' (' + info + ')' : '');
}

export function filename(b) {
  return 'autorisation-animal-delfosse-' + ((b && (b.ref || b.apartment_code)) || '') + '.pdf';
}

export function build(jsPDF, b, logo, signature, lang) {
  b = b || {};
  var EN = lang === 'en';
  function T(fr, en) { return EN ? en : fr; }

  var doc = new jsPDF({ unit: 'mm', format: 'a4' });
  var W = 210, L = 24, R = W - 24, cx = W / 2, ink = [26, 21, 18], muted = [110, 100, 90], gold = [150, 120, 70];
  var apt = APT[String(b.apartment_code || '')] || {};
  var aptCode = b.apartment_code || '';
  var name = b.guest_name || (EN ? 'the Guest' : 'le Voyageur');

  // --- En-tête : logo + titres ---
  var y = 20;
  if (logo) { var iw = 34, ih = iw * logo.ratio; try { doc.addImage(logo.data, 'JPEG', cx - iw / 2, y, iw, ih); y += ih + 8; } catch (e) { y += 10; } }
  doc.setFont('times', 'normal'); doc.setFontSize(13); doc.setTextColor.apply(doc, ink);
  doc.text('DELFOSSE PROPERTIES', cx, y, { align: 'center' }); y += 5;
  doc.setDrawColor.apply(doc, gold); doc.setLineWidth(0.5); doc.line(cx - 20, y, cx + 20, y); y += 12;
  doc.setFont('times', 'italic'); doc.setFontSize(19); doc.setTextColor.apply(doc, ink);
  doc.text(T("Attestation d'autorisation — animal de compagnie", 'Pet authorisation letter'), cx, y, { align: 'center' }); y += 6.5;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor.apply(doc, muted);
  doc.text(T('Pet authorisation letter', 'Autorisation d\'animal de compagnie'), cx, y, { align: 'center' }); y += 14;

  // --- Texte justifié ---
  function jline(line, last) {
    if (last) { doc.text(line, L, y); return; }
    var words = line.split(' ').filter(function (w) { return w.length; });
    if (words.length < 2) { doc.text(line, L, y); return; }
    var ws = 0, k; for (k = 0; k < words.length; k++) { ws += doc.getTextWidth(words[k]); }
    var gap = ((R - L) - ws) / (words.length - 1);
    if (!(gap > 0)) { doc.text(line, L, y); return; }
    var x = L; for (k = 0; k < words.length; k++) { doc.text(words[k], x, y); x += doc.getTextWidth(words[k]) + gap; }
  }
  function para(txt) {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10.5); doc.setTextColor.apply(doc, ink);
    var lines = doc.splitTextToSize(txt, R - L);
    for (var i = 0; i < lines.length; i++) { jline(lines[i], i === lines.length - 1); y += 5.4; }
  }
  function gap(n) { y += (n || 4); }

  var addr = apt.addr || (EN ? 'Nice' : 'Nice');
  var period = (b.check_in && b.check_out)
    ? T(', du ' + fmt(b.check_in) + ' au ' + fmt(b.check_out), ', from ' + fmt(b.check_in) + ' to ' + fmt(b.check_out))
    : '';

  para(T(
    'Je soussigné, Maxime Delfosse, entrepreneur individuel immatriculé sous le numéro SIRET 893 745 851 00020, propriétaire et loueur de l\'appartement meublé de tourisme situé ' + addr + ' (appartement n° ' + aptCode + '), déclare autoriser ' + name + ', locataire dudit logement, à séjourner en compagnie de ' + petPhrase(b, false) + ' pendant toute la durée de sa location' + period + '.',
    'I, the undersigned, Maxime Delfosse, sole trader registered under SIRET No. 893 745 851 00020, owner and host of the furnished tourist accommodation located at ' + addr + ' (apartment No. ' + aptCode + '), hereby authorise ' + name + ', tenant of the said accommodation, to stay with ' + petPhrase(b, true) + ' for the entire duration of their rental' + period + '.'
  ));
  gap(3);
  para(T(
    'Cette autorisation est accordée à titre exceptionnel et personnel. Le locataire demeure responsable de tout dommage éventuel causé par l\'animal, conformément aux articles 1732 et 1735 du Code civil, et s\'engage à laisser le logement dans un état de propreté équivalent à celui constaté à son arrivée.',
    'This authorisation is granted on an exceptional and personal basis. The tenant remains liable for any damage caused by the animal, in accordance with articles 1732 and 1735 of the French Civil Code, and undertakes to leave the accommodation in a state of cleanliness equivalent to that observed upon arrival.'
  ));
  gap(14);

  // --- Date + signature ---
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10.5); doc.setTextColor.apply(doc, ink);
  doc.text(T('Fait à Nice, le ' + todayStr(false), 'Done in Nice, ' + todayStr(true)), L, y); y += 12;
  doc.setFont('helvetica', 'bold'); doc.text(T('Le Loueur', 'The Host'), L, y);
  if (signature && signature.data) {
    var sw = 42, sh = sw * (signature.ratio || 0.5);
    try { doc.addImage(signature.data, 'PNG', L + 2, y + 2, sw, sh); } catch (e) { }
    var lineY = y + 2 + sh + 1;
    doc.setDrawColor.apply(doc, ink); doc.setLineWidth(0.3); doc.line(L, lineY, L + 84, lineY);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor.apply(doc, muted);
    doc.text('Maxime Delfosse — Delfosse Properties', L, lineY + 5);
  } else {
    doc.setDrawColor.apply(doc, ink); doc.setLineWidth(0.3); doc.line(L, y + 20, L + 84, y + 20);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor.apply(doc, muted);
    doc.text('Maxime Delfosse — Delfosse Properties', L, y + 25);
  }

  doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor.apply(doc, muted);
  doc.text('Delfosse Properties · Nice, French Riviera · delfosseproperties.com', cx, 290, { align: 'center' });
  return doc;
}
