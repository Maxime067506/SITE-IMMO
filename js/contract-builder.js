/* =====================================================================
   contract-builder.js — SOURCE UNIQUE du contrat de location (PDF)
   ---------------------------------------------------------------------
   Utilisé À LA FOIS par :
     - les pages de confirmation (bouton « Télécharger le contrat »)
       via <script type="module"> qui expose window.DPContract ;
     - le serveur (api/_lib/contract-pdf.js) pour JOINDRE le contrat
       aux e-mails de confirmation.
   jsPDF est passé en paramètre (window.jspdf.jsPDF côté client,
   import 'jspdf' côté serveur) et le logo aussi (canvas côté client,
   image embarquée côté serveur). NE MODIFIER LE CONTRAT QU'ICI.
   ===================================================================== */

export var APT = {
  '01': { reg: '06088034969WF', addr: '5 rue Barla, 06300 Nice', cap: 4 },
  '02': { reg: '06088034969WF', addr: '5 rue Barla, 06300 Nice', cap: 4 },
  '03': { reg: '06088033084SB', addr: '27 avenue Notre-Dame, 06000 Nice', cap: 6 },
  '04': { reg: '06088034968SB', addr: '38 avenue Auber, 06000 Nice', cap: 4 },
  '05': { reg: '', addr: 'quartier des Musiciens, Nice', cap: 4 },
  '06': { reg: '', addr: 'quartier des Musiciens, Nice', cap: 4 },
  '07': { reg: '', addr: 'quartier des Musiciens, Nice', cap: 4 },
  '08': { reg: '06088041847DP', addr: '37 avenue Georges Clemenceau, 06000 Nice', cap: 4 }
};

export function filename(b) {
  return 'contrat-location-delfosse-' + ((b && (b.ref || b.apartment_code)) || '') + '.pdf';
}

function fmt(d) { if (!d) return ''; var p = String(d).slice(0, 10).split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }

/** Construit le document jsPDF du contrat. Retourne le doc (l'appelant fait save/output). */
export function build(jsPDF, b, logo, lang) {
  b = b || {};
  // Nombre de nuits : calcule depuis les dates si la donnee n'est pas fournie.
  if (!b.nights && b.check_in && b.check_out) {
    var _d = Math.round((new Date(b.check_out) - new Date(b.check_in)) / 86400000);
    if (_d > 0) { b = Object.assign({}, b, { nights: _d }); }
  }
  var EN = lang === 'en';
  function T(fr, en) { return EN ? en : fr; }
  function money(c) { if (typeof c === 'string') return c; return (Number(c || 0) / 100).toLocaleString(EN ? 'en-GB' : 'fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  var doc = new jsPDF({ unit: 'mm', format: 'a4' });
  var W = 210, L = 24, R = W - 24, cx = W / 2, ink = [26, 21, 18], muted = [110, 100, 90], gold = [150, 120, 70];
  var apt = APT[String(b.apartment_code || '')] || {};

  // --- Filigrane : marque « DELFOSSE PROPERTIES » en diagonale, gris tres clair,
  //     dessine AVANT le contenu => reste derriere le texte. Appele sur chaque page. ---
  function stamp() {
    var _pf = doc.getFont(), _ps = doc.getFontSize();            // sauvegarde police + taille courantes
    doc.setFont('times', 'normal'); doc.setFontSize(40); doc.setTextColor(231, 225, 215);
    // filigrane horizontal, centre H+V au centre exact de la page (105 x 148.5 mm) ; align center => centrage garanti.
    doc.text('DELFOSSE PROPERTIES', W / 2, 148.5, { align: 'center', baseline: 'middle' });
    doc.setFont(_pf.fontName, _pf.fontStyle); doc.setFontSize(_ps); doc.setTextColor.apply(doc, ink); // RESTAURE (evite le texte geant apres saut de page)
  }
  stamp(); // page de garde

  // --- PAGE 1 : page de garde (logo + titres uniquement) ---
  var y = 78;
  if (logo) { var iw = 44, ih = iw * logo.ratio; try { doc.addImage(logo.data, 'JPEG', cx - iw / 2, y, iw, ih); y += ih + 14; } catch (e) { y += 10; } }
  doc.setFont('times', 'normal'); doc.setFontSize(15); doc.setTextColor.apply(doc, ink);
  doc.text('DELFOSSE PROPERTIES', cx, y, { align: 'center' }); y += 7;
  doc.setDrawColor.apply(doc, gold); doc.setLineWidth(0.5); doc.line(cx - 22, y, cx + 22, y); y += 18;
  doc.setFont('times', 'italic'); doc.setFontSize(24); doc.setTextColor.apply(doc, ink);
  doc.text(T('Contrat de location saisonnière', 'Short-term rental agreement'), cx, y, { align: 'center' }); y += 12;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor.apply(doc, muted);
  doc.text(T('Meublé de tourisme — réservation en direct', 'Registered tourist accommodation — direct booking'), cx, y, { align: 'center' });
  doc.setFontSize(9); doc.text('Nice · French Riviera · delfosseproperties.com', cx, 280, { align: 'center' });
  doc.addPage(); y = 20; stamp();

  function brk() { if (y > 266) { doc.addPage(); y = 20; stamp(); } }
  function h(t) { brk(); doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor.apply(doc, gold); doc.text(t.toUpperCase(), L, y); y += 5; }
  function jline(line, last) { if (last) { doc.text(line, L, y); return; } var words = line.split(' ').filter(function (w) { return w.length; }); if (words.length < 2) { doc.text(line, L, y); return; } var ws = 0, k; for (k = 0; k < words.length; k++) { ws += doc.getTextWidth(words[k]); } var gap = ((R - L) - ws) / (words.length - 1); if (!(gap > 0)) { doc.text(line, L, y); return; } var x = L; for (k = 0; k < words.length; k++) { doc.text(words[k], x, y); x += doc.getTextWidth(words[k]) + gap; } }
  function p(t) { doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor.apply(doc, ink); var lines = doc.splitTextToSize(t, R - L); for (var i = 0; i < lines.length; i++) { brk(); doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor.apply(doc, ink); jline(lines[i], i === lines.length - 1); y += 4.9; } }
  function sp(n) { y += (n || 3); }

  h(T('Entre les parties', 'Between the parties'));
  p(T('Le Loueur : Maxime Delfosse, entrepreneur individuel (loueur en meublé non professionnel), SIRET 893 745 851 00020, 5 rue Barla, 06300 Nice — reservation@delfosseproperties.com. Ci-après « le Loueur ».',
      'The Host: Maxime Delfosse, sole trader (non-professional furnished-rental landlord), SIRET 893 745 851 00020, 5 rue Barla, 06300 Nice — reservation@delfosseproperties.com. Hereinafter "the Host".'));
  sp(2);
  p(T('Le Voyageur : ' + (b.guest_name || '—') + (b.guest_email ? (' — ' + b.guest_email) : '') + '. Ci-après « le Voyageur », responsable du séjour pour l\'ensemble des occupants.',
      'The Guest: ' + (b.guest_name || '—') + (b.guest_email ? (' — ' + b.guest_email) : '') + '. Hereinafter "the Guest", responsible for the stay on behalf of all occupants.'));
  sp(4);

  h(T('Le logement', 'The property'));
  p(T('Appartement meublé n° ' + (b.apartment_code || '') + (apt.addr ? (' — ' + apt.addr) : '') + '.',
      'Furnished apartment No. ' + (b.apartment_code || '') + (apt.addr ? (' — ' + apt.addr) : '') + '.'));
  p(T('N° d\'enregistrement (meublé de tourisme) : ' + (apt.reg || '[en cours de déclaration]') + '.',
      'Tourist registration No.: ' + (apt.reg || '[pending]') + '.'));
  p(T('Capacité maximale : ' + (apt.cap || b.guests_count || '') + ' voyageurs. Ce nombre ne peut être dépassé ; tout dépassement non autorisé pourra donner lieu à un supplément par personne et par nuit et/ou à la résiliation immédiate sans remboursement.',
      'Maximum capacity: ' + (apt.cap || b.guests_count || '') + ' guests. This number may not be exceeded; any unauthorised excess may give rise to an additional charge per person per night and/or to immediate termination without refund.'));
  sp(4);

  h(T('Le séjour', 'The stay'));
  p(T('Arrivée : ' + fmt(b.check_in) + ' à partir de 16h00. Départ : ' + fmt(b.check_out) + ' avant 11h00.',
      'Check-in: ' + fmt(b.check_in) + ' from 4:00 pm. Check-out: ' + fmt(b.check_out) + ' before 11:00 am.'));
  p(T('Durée : ' + (b.nights || '') + ' nuit(s) — ' + (b.guests_count || '') + ' voyageur(s). Remise des clés : boîtier sécurisé ou conciergerie KeyNest, modalités communiquées par e-mail avant l\'arrivée.',
      'Duration: ' + (b.nights || '') + ' night(s) — ' + (b.guests_count || '') + ' guest(s). Key handover: secure lockbox or KeyNest concierge, details sent by email before arrival.'));
  sp(4);

  h(T('État des lieux et inventaire', 'Inventory and condition'));
  p(T('Un inventaire du mobilier et des équipements, ainsi que des photographies de référence, sont tenus à la disposition du Voyageur. Le logement est réputé reçu en bon état et conforme à l\'inventaire si le Voyageur ne signale aucune anomalie, par e-mail, dans un délai de trois jours à compter de son arrivée (ou avant son départ si le séjour est plus court). Le Loueur peut établir un état des lieux de sortie ; le Voyageur peut demander qu\'il soit contradictoire.',
      'An inventory of the furniture and equipment, together with reference photographs, is made available to the Guest. The accommodation is deemed received in good condition and in accordance with the inventory unless the Guest reports any discrepancy, in writing (email), within three days of arrival (or before departure if the stay is shorter). The Host may draw up a check-out report; the Guest may request that it be contradictory (joint).'));
  sp(4);

  h(T('Responsabilité du Voyageur', 'Guest liability'));
  p(T('Le Voyageur répond des dégradations et des pertes survenues pendant la jouissance du logement, à moins qu\'il ne prouve qu\'elles ont eu lieu sans sa faute (art. 1732 du Code civil). Il répond également des dégradations causées par les personnes qu\'il héberge ou introduit dans les lieux : famille, co-occupants, invités (art. 1735 du Code civil). Une assurance de responsabilité civile villégiature est recommandée.',
      'The Guest is liable for any damage or loss occurring during their occupancy, unless they prove it occurred without their fault (art. 1732 of the French Civil Code). The Guest is also liable for damage caused by the persons they host or bring onto the premises: family, co-occupants, guests (art. 1735 of the French Civil Code). Civil-liability holiday insurance is recommended.'));
  sp(4);

  h(T('Conditions financières', 'Financial terms'));
  p(T('Montant total réglé : ' + money(b.total_cents) + ' EUR (nuitées + frais de ménage + taxe de séjour), encaissé en ligne par carte bancaire via Stripe au moment de la réservation. La taxe de séjour de la Métropole Nice Côte d\'Azur est collectée par le Loueur pour le compte de la collectivité.',
      'Total paid: ' + money(b.total_cents) + ' EUR (nights + cleaning fee + tourist tax), paid online by card via Stripe at the time of booking. The Métropole Nice Côte d\'Azur tourist tax is collected by the Host on behalf of the local authority.'));
  sp(4);

  h(T('Caution (dépôt de garantie)', 'Security deposit'));
  p(T('Un dépôt de garantie de ' + money(b.deposit_cents) + ' EUR garantit les obligations du Voyageur. Pour les séjours courts, il prend la forme d\'une empreinte bancaire (pré-autorisation) réalisée à l\'approche de l\'arrivée : elle n\'est pas débitée et ne garantit pas l\'encaissement ; il s\'agit d\'un blocage temporaire, débité uniquement en cas de dommage justifié, dans la limite du montant pré-autorisé. Pour les séjours longs, lorsqu\'une empreinte ne peut techniquement couvrir toute la période, le dépôt peut être encaissé puis remboursé, ou l\'empreinte placée peu avant le départ. L\'empreinte (ou le dépôt) est libérée/remboursé au plus tard sous sept jours après le départ en l\'absence de dommage. Le dépôt n\'est pas un plafond : le Voyageur demeure redevable du préjudice qui l\'excède (art. 1231-1 du Code civil). Le Voyageur peut demander communication des justificatifs.',
      'A security deposit of ' + money(b.deposit_cents) + ' EUR secures the Guest\'s obligations. For short stays it takes the form of a card hold (pre-authorisation) placed shortly before arrival: this is not a charge and does not guarantee collection; it is a temporary block that may be captured only in the event of justified damage, up to the pre-authorised amount. For longer stays, where a card hold cannot technically be maintained for the whole period, the deposit may instead be collected and then refunded, or the hold placed shortly before departure. The deposit (or hold) is released/refunded at the latest within seven days after departure where no damage is noted. The deposit is not a cap: the Guest remains liable for any loss exceeding it (art. 1231-1 of the French Civil Code). The Guest may request the supporting documents.'));
  sp(4);

  h(T('Constatation des dommages', 'Assessment of damage'));
  p(T('Les dommages sont établis par comparaison entre l\'état d\'entrée et de sortie, à l\'appui de photographies datées et, le cas échéant, d\'un état des lieux contradictoire ou d\'un constat de commissaire de justice. Le Loueur notifie le Voyageur par écrit dans les sept jours suivant le départ, avec justificatifs (devis ou facture). Le Voyageur peut demander ces pièces et contester le montant. Les frais correspondent au coût réel de remise en état, après abattement de la vétusté.',
      'Damage is established by comparison between the entry and exit condition, supported by dated photographs and, where appropriate, a joint check-out or a report by a commissaire de justice. The Host notifies the Guest in writing within seven days of departure, with supporting evidence (quote or invoice). The Guest may request these documents and may contest the amount. Charges reflect the actual cost of restoration, after allowance for wear and tear.'));
  sp(4);

  h(T('Frais en cas de dommage ou de manquement', 'Charges in case of damage or breach'));
  p(T('Les frais de remise en état sont déduits de la caution sur justificatif (devis ou facture), déduction faite de la vétusté (l\'usure normale n\'est pas à la charge du Voyageur, art. 1755 du Code civil). Les montants ci-dessous sont indicatifs et ne limitent pas le droit du Loueur à la réparation intégrale de son préjudice :',
      'Restoration costs are deducted from the deposit on supporting evidence (quote or invoice), after allowance for wear and tear (normal wear is not chargeable to the Guest, art. 1755 of the French Civil Code). The amounts below are indicative and do not limit the Host\'s right to full compensation for the loss:'));
  p(T('- Ménage supplémentaire / exceptionnel (état anormal) : frais réels, à partir de 60 EUR', '- Additional/exceptional cleaning (abnormal condition): actual cost, from EUR 60'));
  p(T('- Nettoyage et désodorisation (tabac, cannabis ou odeurs persistantes) : frais réels, à titre indicatif ~200 EUR', '- Cleaning and deodorising (smoking, cannabis or persistent odours): actual cost, indicatively ~EUR 200'));
  p(T('- Parquet, carrelage, murs, peintures ou plafonds : remise en état sur devis, déduction de vétusté', '- Flooring (parquet, tiles), walls, paint or ceilings: restoration on quote, less wear and tear'));
  p(T('- Mobilier, canapés, matelas, literie ou linge (taches, brûlures, déchirures) : nettoyage ou remplacement, déduction de vétusté', '- Furniture, sofas, mattress, bedding or linen (stains, burns, tears): cleaning or replacement, less wear and tear'));
  p(T('- Vaisselle, verrerie, petit équipement cassé : coût de remplacement', '- Broken dishes, glassware or small equipment: replacement cost'));
  p(T('- Électroménager ou téléviseur endommagé : coût de remplacement, déduction de vétusté', '- Damaged appliance or TV: replacement cost, less wear and tear'));
  p(T('- Clés, badges ou télécommandes perdus / changement de serrure si la sécurité l\'exige : coût réel', '- Lost keys, badges or remotes / lock replacement where security requires: actual cost'));
  p(T('- Déchets abandonnés ou objets détériorés : évacuation ou remplacement au coût réel', '- Abandoned waste or damaged items: removal or replacement at actual cost'));
  p(T('- Départ tardif non convenu : indemnité d\'occupation (jusqu\'à une nuitée) et préjudice', '- Unagreed late departure: occupancy indemnity (up to one night) plus any loss'));
  p(T('- Dépassement du nombre de voyageurs : supplément par personne et par nuit et/ou résiliation sans remboursement', '- Exceeding the declared number of guests: additional charge per person per night and/or termination without refund'));
  p(T('- Fête ou événement non autorisé : frais réels de remise en état et préjudice', '- Unauthorised party or event: actual restoration costs and loss'));
  p(T('Les frais réellement engagés, sur justificatif, prévalent sur ces montants indicatifs. Le Voyageur demeure redevable des dommages excédant le montant de la caution.',
      'Actual costs incurred, on supporting evidence, prevail over these indicative amounts. The Guest remains liable for damage exceeding the deposit amount.'));
  sp(4);

  h(T('Annulation', 'Cancellation'));
  p(T('Annulation par le Voyageur : plus de 14 jours avant l\'arrivée, remboursement intégral des nuitées ; entre 14 et 7 jours, 50 % des nuitées ; moins de 7 jours, nuitées non remboursables. Les frais de ménage et la taxe de séjour sont dans tous les cas intégralement remboursés. En cas de départ anticipé du fait du Voyageur, les nuitées non consommées ne sont pas remboursées (une assurance voyage est recommandée).',
      'Cancellation by the Guest: more than 14 days before arrival, full refund of the nights; between 14 and 7 days, 50% of the nights; less than 7 days, nights are non-refundable. The cleaning fee and tourist tax are refunded in full in all cases. In the event of early departure by the Guest, unused nights are not refunded (travel insurance is recommended).'));
  p(T('Annulation ou défaillance du fait du Loueur : remboursement intégral de toutes les sommes versées, sans préjudice du droit du Voyageur à réparation. En cas de force majeure, remboursement des sommes correspondant aux nuitées non consommées.',
      'Cancellation or default by the Host: full refund of all sums paid, without prejudice to the Guest\'s right to compensation. In the event of force majeure, a refund of the sums corresponding to the unused nights applies.'));
  p(T('En toutes circonstances, le Voyageur peut contacter le Loueur pour rechercher, d\'un commun accord, une solution amiable (report du séjour, remboursement partiel ou geste commercial).',
      'In all circumstances, the Guest may contact the Host to seek, by mutual agreement, an amicable solution (postponement of the stay, partial refund or goodwill gesture).'));
  sp(4);

  h(T('Règlement intérieur', 'House rules'));
  p(T('Logement non-fumeur (tabac et cannabis interdits). Animaux non admis sauf accord écrit préalable. Fêtes et événements interdits ; la capacité concerne les personnes qui dorment sur place, pas les visiteurs supplémentaires. Sous-location interdite (art. 1717 du Code civil). Respect du calme entre 22h00 et 8h00, de la jouissance paisible du voisinage et du règlement de copropriété. Le Voyageur trie et évacue les déchets et restitue le logement dans l\'état de remise.',
      'Non-smoking accommodation (tobacco and cannabis prohibited). No pets unless agreed in writing beforehand. Parties and events are prohibited; the capacity concerns overnight guests, not additional visitors. Subletting is prohibited (art. 1717 of the French Civil Code). Quiet hours between 10:00 pm and 8:00 am, peaceful enjoyment for the neighbourhood and compliance with the building rules. The Guest sorts and removes waste and returns the accommodation in the condition in which it was handed over.'));
  sp(4);

  h(T('Rétractation, identité et conditions générales', 'Withdrawal, identity and general terms'));
  p(T('Conformément à l\'article L221-28 12° du Code de la consommation, cette prestation d\'hébergement à dates déterminées n\'ouvre pas de droit de rétractation ; la réservation est ferme dès le paiement. Les voyageurs étrangers renseignent une fiche individuelle de police (art. R814-1 et s. du CESEDA). Toute somme due au titre d\'une pénalité est exigible après mise en demeure restée sans effet, sauf dommage définitivement constaté. Les données personnelles sont traitées uniquement pour gérer le séjour et satisfaire aux obligations légales (voir la Politique de confidentialité sur delfosseproperties.com/politique-confidentialite.html). En cas de litige non résolu, le Voyageur peut recourir gratuitement au médiateur de la consommation compétent. Le présent contrat est régi par les Conditions Générales de Location disponibles sur delfosseproperties.com/cgv, acceptées par le Voyageur lors de la réservation, et par le droit français.',
      'Under Article L221-28 12° of the French Consumer Code, this accommodation service provided on specific dates carries no right of withdrawal; the booking is firm upon payment. Foreign travellers complete an individual police record (CESEDA art. R814-1 et seq.). Any sum due as a contractual penalty is payable after a formal notice has remained without effect, save for definitively established damage. Personal data is processed solely to manage the stay and to meet legal obligations (see the Privacy Policy at delfosseproperties.com/en/privacy). In the event of an unresolved dispute, the Guest may refer the matter, free of charge, to the competent consumer mediator. This agreement is governed by the General Terms available at delfosseproperties.com/en/terms, accepted by the Guest at booking, and by French law.'));
  sp(4); brk();

  doc.setDrawColor.apply(doc, gold); doc.line(L, y, R, y); y += 6;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor.apply(doc, muted);
  var t = new Date(); var td = ('0' + t.getDate()).slice(-2) + '/' + ('0' + (t.getMonth() + 1)).slice(-2) + '/' + t.getFullYear();
  p(T('Fait à Nice, le ' + td + '. Contrat accepté par voie électronique lors de la réservation en ligne' + (b.ref ? (' (référence ' + b.ref + ')') : '') + '.',
      'Done in Nice, on ' + td + '. Agreement accepted electronically at the time of online booking' + (b.ref ? (' (reference ' + b.ref + ')') : '') + '.'));
  doc.setFont('times', 'normal'); doc.setFontSize(9); doc.setTextColor.apply(doc, ink);
  doc.text('DELFOSSE PROPERTIES — Nice, French Riviera', cx, 288, { align: 'center' });

  return doc;
}
