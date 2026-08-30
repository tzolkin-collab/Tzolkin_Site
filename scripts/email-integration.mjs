import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { randomUUID } from 'node:crypto';
import pg from 'pg';
import { processOne } from './email-worker.mjs';
const env = parseEnv(readFileSync('.env.local', 'utf8'));
const client = new pg.Client({ connectionString: env.DATABASE_URL });
const leadId = randomUUID();
const outboxId = randomUUID();
const config = { from: 'test@example.invalid', to: 'test@example.invalid' };
let calls = 0;
let stablePayload;
const retry = async (payload, key) => {
  calls++;
  assert.equal(key, `institutional-lead/${outboxId}`);
  stablePayload ??= payload;
  assert.deepEqual(payload, stablePayload);
  return { ok: false, retryable: true, code: 'test_retry' };
};
try {
  await client.connect();
  await client.query("INSERT INTO institucional.leads (id,full_name,email,whatsapp,service) VALUES ($1,'Email Integration','email-test@example.invalid','11999999999','Outro')", [leadId]);
  await client.query('INSERT INTO institucional.email_outbox (id,lead_id) VALUES ($1,$2)', [outboxId, leadId]);
  assert.equal(await processOne(client, retry, config, outboxId), 'retry');
  assert.equal(await processOne(client, retry, config, outboxId), 'empty'); // backoff
  await client.query('UPDATE institucional.email_outbox SET next_attempt_at=now() WHERE id=$1', [outboxId]);
  assert.equal(await processOne(client, async (payload, key) => {
    await retry(payload, key);
    return { ok: true, id: 'fake-provider-id' };
  }, { from: 'changed@example.invalid', to: 'changed@example.invalid' }, outboxId), 'sent');
  assert.equal(await processOne(client, retry, config, outboxId), 'empty');
  assert.equal(calls, 2);
  await client.query("UPDATE institucional.email_outbox SET status='pending',next_attempt_at=now(),first_attempt_at=now()-interval '24 hours' WHERE id=$1", [outboxId]);
  assert.equal(await processOne(client, retry, config, outboxId), 'failed');
  assert.equal(calls, 2); // expired uncertainty must never resend
  await client.query("UPDATE institucional.email_outbox SET status='pending',attempts=0,first_attempt_at=NULL,next_attempt_at=now() WHERE id=$1", [outboxId]);
  assert.equal(await processOne(client, async () => ({ ok: false, retryable: false, code: 'http_403' }), config, outboxId), 'failed');
  console.log('PASS: retry, backoff, immutable payload, success, no resend, expired-window stop, permanent failure. Provider mocked; no emails sent.');
} catch {
  console.error('Email integration failed; no message payloads logged.');
  process.exitCode = 1;
} finally {
  await client.query('BEGIN');
  await client.query('DELETE FROM institucional.email_outbox WHERE id=$1 AND lead_id=$2', [outboxId, leadId]);
  await client.query("DELETE FROM institucional.leads WHERE id=$1 AND email='email-test@example.invalid'", [leadId]);
  await client.query('COMMIT');
  await client.end();
}
