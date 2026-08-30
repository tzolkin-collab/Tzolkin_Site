import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import pg from 'pg';
const env = parseEnv(readFileSync('.env.local', 'utf8'));
if (!env.DATABASE_URL) throw new Error('DATABASE_URL missing');
const client = new pg.Client({ connectionString: env.DATABASE_URL, connectionTimeoutMillis: 10000 });
try {
  await client.connect();
  await client.query(readFileSync('db/002_lead_delivery.sql', 'utf8'));
  await client.query(readFileSync('db/003_email_worker.sql', 'utf8'));
  console.log('Lead delivery migration applied. No messages sent.');
} catch {
  console.error('Migration failed. Details suppressed to protect credentials.');
  process.exitCode = 1;
} finally { await client.end(); }
