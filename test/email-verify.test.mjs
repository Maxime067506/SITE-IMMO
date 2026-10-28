/**
 * Tests du code de verification e-mail (node --test).
 */
import test from 'node:test';
import assert from 'node:assert/strict';

process.env.EMAIL_VERIFY_SECRET = 'secret-de-test';
const { issueCode, checkCode } = await import('../api/_lib/email-verify.js');

test('le bon code est accepte', () => {
  const { code, token } = issueCode('jean@exemple.fr');
  assert.match(code, /^\d{6}$/);
  assert.equal(checkCode('jean@exemple.fr', code, token), 'ok');
});

test('mauvais code, autre e-mail ou jeton modifie refuses', () => {
  const { code, token } = issueCode('jean@exemple.fr');
  const wrong = code === '000000' ? '111111' : '000000';
  assert.equal(checkCode('jean@exemple.fr', wrong, token), 'invalid');
  assert.equal(checkCode('autre@exemple.fr', code, token), 'invalid');
  assert.equal(checkCode('jean@exemple.fr', code, token.slice(0, -2) + 'xx'), 'invalid');
  assert.equal(checkCode('jean@exemple.fr', code, ''), 'invalid');
  assert.equal(checkCode('jean@exemple.fr', '', token), 'invalid');
});

test('code expire apres 15 minutes', () => {
  const t0 = Date.now();
  const { code, token } = issueCode('jean@exemple.fr', t0);
  assert.equal(checkCode('jean@exemple.fr', code, token, t0 + 14 * 60000), 'ok');
  assert.equal(checkCode('jean@exemple.fr', code, token, t0 + 16 * 60000), 'expired');
});
