import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { pathToFileURL } from 'node:url';
import pg from 'pg';

export async function sendResend(payload, key, apiKey, fetcher = fetch) {
  const response = await fetcher('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': key },
    body: JSON.stringify(payload), signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) return { ok: false, retryable: response.status >= 500 || [408, 409, 429].includes(response.status), code: `http_${response.status}` };
  const body = await response.json();
  if (typeof body.id !== 'string' || !body.id) throw new Error('INVALID_PROVIDER_RESPONSE');
  return { ok: true, id: body.id };
}

// One dedicated connection; session lock survives commits but is released on disconnect.
export async function processOne(client, send, config, onlyId = null) {
  const lock = await client.query('SELECT pg_try_advisory_lock(884421) AS acquired');
  if (!lock.rows[0].acquired) return 'busy';
  try {
    const result = await client.query(`SELECT o.*, l.full_name, l.email, l.whatsapp, l.service, l.message
      FROM institucional.email_outbox o JOIN institucional.leads l ON l.id=o.lead_id
      WHERE o.status='pending' AND o.next_attempt_at<=now() AND ($1::uuid IS NULL OR o.id=$1)
      ORDER BY o.created_at LIMIT 1`, [onlyId]);
    const row = result.rows[0];
    if (!row) return 'empty';
    // Resend deduplicates for 24h. Never auto-retry after that uncertainty window.
    if (row.attempts >= 5 || (row.first_attempt_at && Date.now() - new Date(row.first_attempt_at).getTime() >= 23 * 3600000)) {
      await client.query("UPDATE institucional.email_outbox SET status='failed',last_error='manual_review_required' WHERE id=$1", [row.id]);
      return 'failed';
    }
    const payload = row.payload ?? {
      from: config.from, to: [config.to], subject: 'Novo contato — TZOLKIN',
      text: `Nome: ${row.full_name}\nEmail: ${row.email}\nWhatsApp: ${row.whatsapp}\nInteresse: ${row.service}\nMensagem: ${row.message || '(não informada)'}`,
    };
    // Persist immutable request and attempt before external call, including crash recovery.
    await client.query(`UPDATE institucional.email_outbox SET payload=$2, attempts=attempts+1,
      first_attempt_at=coalesce(first_attempt_at,now()), next_attempt_at=now()+interval '5 minutes'
      WHERE id=$1`, [row.id, JSON.stringify(payload)]);
    let delivery;
    try { delivery = await send(payload, `institutional-lead/${row.id}`); }
    catch { delivery = { ok: false, retryable: true, code: 'provider_unconfirmed' }; }
    if (delivery.ok) {
      await client.query("UPDATE institucional.email_outbox SET status='sent',sent_at=now(),provider_id=$2,last_error=NULL WHERE id=$1", [row.id, delivery.id]);
      return 'sent'; // provider accepted, not proof of inbox delivery
    }
    const terminal = !delivery.retryable || row.attempts + 1 >= 5;
    await client.query(`UPDATE institucional.email_outbox SET status=$2,last_error=$3,
      next_attempt_at=now()+($4 * interval '1 minute') WHERE id=$1`,
      [row.id, terminal ? 'failed' : 'pending', delivery.code, Math.min(60, 5 * 2 ** row.attempts)]);
    return terminal ? 'failed' : 'retry';
  } finally { await client.query('SELECT pg_advisory_unlock(884421)'); }
}

async function main() {
  const env = { ...parseEnv(readFileSync('.env.local', 'utf8')), ...process.env };
  const live = process.argv.includes('--send');
  if (!env.DATABASE_URL) throw new Error('DATABASE_NOT_CONFIGURED');
  if (live && (!env.RESEND_API_KEY || !env.EMAIL_FROM || !env.EMAIL_INTERNAL_TO)) throw new Error('EMAIL_NOT_CONFIGURED');
  const client = new pg.Client({ connectionString: env.DATABASE_URL, connectionTimeoutMillis: 10000 });
  try {
    await client.connect();
    if (!live) {
      const result = await client.query('SELECT status,count(*)::int AS count FROM institucional.email_outbox GROUP BY status');
      console.log(JSON.stringify({ mode: 'dry-run', counts: result.rows, emailConfigured: Boolean(env.RESEND_API_KEY && env.EMAIL_FROM && env.EMAIL_INTERNAL_TO) }));
    } else {
      console.log(await processOne(client, (payload, key) => sendResend(payload, key, env.RESEND_API_KEY), { from: env.EMAIL_FROM, to: env.EMAIL_INTERNAL_TO }));
    }
  } finally { await client.end(); }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(() => { console.error('Email worker failed; no secrets or message payloads logged.'); process.exitCode = 1; });
}
