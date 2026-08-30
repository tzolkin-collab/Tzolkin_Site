import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { randomUUID } from 'node:crypto';
import pg from 'pg';

const origin = 'http://localhost:3000';
const env = parseEnv(readFileSync('.env.local', 'utf8'));
const client = new pg.Client({ connectionString: env.DATABASE_URL, connectionTimeoutMillis: 10000 });
const key = randomUUID();
const email = `integration-${key}@example.invalid`;
const body = { fullName: 'Integration Test', email, whatsapp: '11999999999', service: 'Outro' };
const send = (data, requestOrigin = origin) => fetch(`${origin}/api/leads`, {
  method: 'POST', headers: { Origin: requestOrigin, 'Content-Type': 'application/json', 'Idempotency-Key': key }, body: JSON.stringify(data),
});
try {
  await client.connect();
  assert.equal((await send({ ...body, tenant_id: 'forged' })).status, 400);
  assert.equal((await send(body, 'https://untrusted.invalid')).status, 403);
  assert.equal((await send({ ...body, email: 'invalid' })).status, 400);
  assert.equal((await send(body)).status, 200);
  assert.equal((await send(body)).status, 200);
  assert.equal((await send({ ...body, message: 'changed' })).status, 409);
  const result = await client.query(`SELECT l.source, count(o.id)::int AS notifications
    FROM institucional.leads l JOIN institucional.email_outbox o ON o.lead_id = l.id
    WHERE l.submission_key = $1 AND l.email = $2 GROUP BY l.id`, [key, email]);
  assert.equal(result.rowCount, 1);
  assert.equal(result.rows[0].notifications, 1);
  assert.equal(result.rows[0].source, 'tzolkin.cloud');
  console.log('PASS: validation, origin, persistence, retry deduplication, conflict, atomic outbox. No emails sent.');
} catch {
  console.error('Integration test failed; inspect status locally without logging contact data.');
  process.exitCode = 1;
} finally {
  // Delete only synthetic records created by this exact test invocation.
  await client.query('BEGIN');
  await client.query('DELETE FROM institucional.email_outbox WHERE lead_id IN (SELECT id FROM institucional.leads WHERE submission_key = $1 AND email = $2)', [key, email]);
  await client.query('DELETE FROM institucional.leads WHERE submission_key = $1 AND email = $2', [key, email]);
  await client.query('COMMIT');
  await client.end();
}
