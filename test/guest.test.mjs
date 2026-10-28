/**
 * Tests de la validation des coordonnees voyageur (node --test).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanName, cleanEmail, cleanPhone, validateGuest } from '../api/_lib/guest.js';

test('telephone francais local converti au format international', () => {
  assert.equal(cleanPhone('06 12 34 56 78'), '+33612345678');
  assert.equal(cleanPhone('06.12.34.56.78'), '+33612345678');
  assert.equal(cleanPhone('+33 6 12 34 56 78'), '+33612345678');
  assert.equal(cleanPhone('0033612345678'), '+33612345678');
});

test('telephone etranger accepte avec indicatif', () => {
  assert.equal(cleanPhone('+44 7911 123456'), '+447911123456');
  assert.equal(cleanPhone('+1 (415) 555-2671'), '+14155552671');
});

test('telephone invalide refuse', () => {
  for (const v of ['', '12345', '06 12 34', '+33 06 12 34 56 78', '7911123456', 'abc', '+0612345678']) {
    assert.equal(cleanPhone(v), null, v);
  }
});

test('e-mail', () => {
  assert.equal(cleanEmail(' Jean.Dupont@Gmail.com '), 'jean.dupont@gmail.com');
  for (const v of ['', 'jean', 'jean@', 'jean@gmail', 'jean @gmail.com', 'jean@gmail.c']) {
    assert.equal(cleanEmail(v), null, v);
  }
});

test('prenom et nom', () => {
  assert.equal(cleanName('  Jean-Éric '), 'Jean-Éric');
  assert.equal(cleanName("O'Neil"), "O'Neil");
  for (const v of ['', 'J', '123', '<script>']) assert.equal(cleanName(v), null, v);
});

test('validateGuest liste les champs manquants', () => {
  assert.deepEqual(validateGuest({ guest_first_name: 'Jean', guest_email: 'x' }).fields, ['last_name', 'email', 'phone']);
  const ok = validateGuest({ guest_first_name: 'Jean', guest_last_name: 'Dupont', guest_email: 'jean@ex.fr', guest_phone: '0612345678' });
  assert.equal(ok.ok, true);
  assert.equal(ok.guest.name, 'Jean Dupont');
  assert.equal(ok.guest.phone, '+33612345678');
});
