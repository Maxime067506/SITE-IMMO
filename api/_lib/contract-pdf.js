/**
 * Generation SERVEUR du contrat de location (PDF), pour l'envoyer en piece
 * jointe des e-mails de confirmation. Utilise EXACTEMENT le meme code que la
 * page de telechargement (js/contract-builder.js) -> contrat identique.
 */
import pkg from 'jspdf';
import { build, filename } from '../../js/contract-builder.js';
import { DP_LOGO } from './logo-data.js';

const jsPDF = pkg.jsPDF || pkg;

/**
 * Rend le contrat en base64 pour une reservation.
 * @returns {{ filename: string, content: string, contentType: string }}
 */
export function generateContractPdf(booking, lang) {
  lang = lang === 'en' ? 'en' : 'fr';
  const doc = build(jsPDF, booking || {}, DP_LOGO, lang);
  const content = Buffer.from(doc.output('arraybuffer')).toString('base64');
  return { filename: filename(booking || {}), content: content, contentType: 'application/pdf' };
}
