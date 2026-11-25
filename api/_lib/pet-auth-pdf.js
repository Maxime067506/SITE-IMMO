/**
 * Génération SERVEUR de l'autorisation d'animal (PDF), pour la joindre aux
 * e-mails de confirmation quand le voyageur a déclaré un animal. Utilise le
 * même module de rendu que le reste du site (js/pet-auth-builder.js), le logo
 * embarqué, et la signature du Loueur (variable d'environnement, hors git).
 */
import pkg from 'jspdf';
import { build, filename } from '../../js/pet-auth-builder.js';
import { DP_LOGO } from './logo-data.js';
import { HOST_SIGNATURE } from './signature-data.js';

const jsPDF = pkg.jsPDF || pkg;

/** @returns {{ filename: string, content: string, contentType: string }} */
export function generatePetAuthPdf(booking, lang) {
  lang = lang === 'en' ? 'en' : 'fr';
  const doc = build(jsPDF, booking || {}, DP_LOGO, HOST_SIGNATURE, lang);
  const content = Buffer.from(doc.output('arraybuffer')).toString('base64');
  return { filename: filename(booking || {}), content: content, contentType: 'application/pdf' };
}
