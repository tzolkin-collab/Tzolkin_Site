import test from 'node:test';
import assert from 'node:assert/strict';
import { validateLead, readLimitedJson } from '../src/server/leads/validation.mjs';
const valid = { fullName: 'Teste Interno', email: 'TEST@example.invalid', whatsapp: '(11) 99999-9999', service: 'Outro' };
test('normalizes contact on the server', () => {
  const lead = validateLead(valid);
  assert.equal(lead.email, 'test@example.invalid');
  assert.equal(lead.whatsapp, '11999999999');
});
for (const field of ['tenant_id', 'price', 'plan', 'permissions', 'source']) {
  test(`rejects browser-controlled ${field}`, () => assert.throws(() => validateLead({ ...valid, [field]: 'forged' })));
}
test('rejects missing, malformed and oversized input', () => {
  for (const data of [null, [], {}, { ...valid, email: 'invalid' }, { ...valid, whatsapp: 'abc' }, { ...valid, service: 'forged' }, { ...valid, message: 'x'.repeat(5001) }, { ...valid, fullName: {} }]) assert.throws(() => validateLead(data));
});
test('custom project requires details on server', () => assert.throws(() => validateLead({ ...valid, service: 'Sob Demanda' })));
test('body size is measured, not trusted from Content-Length', async () => {
  const request = new Request('http://localhost/api/leads', { method: 'POST', body: JSON.stringify(valid) });
  assert.deepEqual(await readLimitedJson(request), valid);
  const oversized = new Request('http://localhost/api/leads', { method: 'POST', body: 'x'.repeat(17000) });
  await assert.rejects(readLimitedJson(oversized), /BODY_TOO_LARGE/);
});
