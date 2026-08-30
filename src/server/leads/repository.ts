import 'server-only';
import { createHash } from 'node:crypto';
import { Pool } from 'pg';

let pool: Pool | undefined;
export async function saveLead(data: Record<string, string>, key: string) {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_NOT_CONFIGURED');
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 3, connectionTimeoutMillis: 8000, idleTimeoutMillis: 10000 });
  const client = await pool.connect();
  const hash = createHash('sha256').update(JSON.stringify(data)).digest('hex');
  try {
    await client.query('BEGIN');
    await client.query("SET LOCAL statement_timeout = '8s'");
    // Shared database locks, not process-local counters: works across serverless instances.
    await client.query('SELECT pg_advisory_xact_lock(hashtextextended($1, 0))', [key]);
    const existing = await client.query('SELECT request_hash FROM institucional.leads WHERE submission_key = $1', [key]);
    if (existing.rowCount) {
      if (existing.rows[0].request_hash !== hash) throw new Error('IDEMPOTENCY_CONFLICT');
      await client.query('COMMIT');
      return;
    }
    await client.query('SELECT pg_advisory_xact_lock(hashtextextended($1, 1))', [data.email]);
    const rate = await client.query("SELECT count(*)::int AS total FROM institucional.leads WHERE email = $1 AND created_at > now() - interval '1 hour'", [data.email]);
    if (rate.rows[0].total >= 5) throw new Error('RATE_LIMITED');
    const lead = await client.query(
      `INSERT INTO institucional.leads
       (full_name, email, whatsapp, company_name, company_size, employees, instagram, website, service, message, source, submission_key, request_hash)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'tzolkin.cloud',$11,$12) RETURNING id`,
      [data.fullName, data.email, data.whatsapp, data.companyName, data.companySize, data.employees,
        data.instagram, data.website, data.service, data.message, key, hash]);
    await client.query('INSERT INTO institucional.email_outbox (lead_id) VALUES ($1)', [lead.rows[0].id]);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally { client.release(); }
}
