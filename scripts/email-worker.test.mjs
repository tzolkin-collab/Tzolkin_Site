import test from 'node:test';
import assert from 'node:assert/strict';
import { sendResend } from './email-worker.mjs';
test('provider receives stable idempotency key and plain text payload', async () => {
  const payload = { from: 'from@example.invalid', to: ['to@example.invalid'], text: 'test' };
  const result = await sendResend(payload, 'stable-key', 'fake-key', async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    assert.equal(options.headers['Idempotency-Key'], 'stable-key');
    assert.deepEqual(JSON.parse(options.body), payload);
    return Response.json({ id: 'fake-provider-id' });
  });
  assert.deepEqual(result, { ok: true, id: 'fake-provider-id' });
});
for (const status of [400, 401, 403, 408, 409, 429, 500]) {
  test(`provider status ${status} classified safely`, async () => {
    const result = await sendResend({}, 'key', 'fake', async () => new Response('', { status }));
    assert.equal(result.ok, false);
    assert.equal(result.retryable, [408, 409, 429, 500].includes(status));
  });
}
test('invalid success response is not accepted', async () => {
  await assert.rejects(sendResend({}, 'key', 'fake', async () => Response.json({})), /INVALID_PROVIDER_RESPONSE/);
});
