import { readFileSync, appendFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { randomBytes } from 'node:crypto';
import pg from 'pg';

// Credentials never appear in stdout or command-line arguments.
const sourceFile = process.argv[2];
const apply = process.argv.includes('--apply');
if (!sourceFile) throw new Error('Provide the source env file path. Default: read-only inspection.');
const source = parseEnv(readFileSync(sourceFile, 'utf8'));
const connectionString = source.TZ_DATABASE_URL || source.DATABASE_URL;
if (!connectionString) throw new Error('No PostgreSQL configuration in source env.');
const database = 'tzolkin_institucional';
const role = 'tzolkin_institucional_app';
const admin = new pg.Client({ connectionString, connectionTimeoutMillis: 10000 });
let target;
try {
  await admin.connect();
  const { rows: [permissions] } = await admin.query('SELECT rolcreatedb, rolcreaterole, rolsuper FROM pg_roles WHERE rolname = current_user');
  const dbExists = (await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [database])).rowCount > 0;
  const roleExists = (await admin.query('SELECT 1 FROM pg_roles WHERE rolname = $1', [role])).rowCount > 0;
  console.log(JSON.stringify({ connected: true, permissions, targetDatabaseExists: dbExists, targetRoleExists: roleExists }));
  if (apply) {
    if (dbExists || roleExists) throw new Error('Target already exists; refusing to overwrite or rotate credentials.');
    if (!permissions.rolsuper && !(permissions.rolcreatedb && permissions.rolcreaterole)) throw new Error('Dedicated database provisioning requires CREATEDB and CREATEROLE.');
    const local = parseEnv(readFileSync('.env.local', 'utf8'));
    if (local.DATABASE_URL) throw new Error('Local DATABASE_URL already exists; refusing to overwrite.');
    const password = randomBytes(36).toString('hex');
    await admin.query(`CREATE ROLE ${role} LOGIN PASSWORD '${password}' NOSUPERUSER NOCREATEDB NOCREATEROLE`);
    await admin.query(`CREATE DATABASE ${database} OWNER ${role}`);
    await admin.query(`REVOKE ALL ON DATABASE ${database} FROM PUBLIC`);
    const url = new URL(connectionString);
    url.username = role;
    url.password = password;
    url.pathname = `/${database}`;
    // Save generated app credentials immediately, so retries never lose them.
    appendFileSync('.env.local', `\n# Dedicated institutional database (server only)\nDATABASE_URL=${url.href}\n`);
    target = new pg.Client({ connectionString: url.href, connectionTimeoutMillis: 10000 });
    await target.connect();
    await target.query(readFileSync('db/001_leads.sql', 'utf8'));
    await target.query('BEGIN');
    await target.query("INSERT INTO institucional.leads (full_name, email, whatsapp, service) VALUES ('Database verification', 'verification@example.invalid', '00000000000', 'verification')");
    await target.query('ROLLBACK');
    console.log(JSON.stringify({ created: database, dedicatedRole: role, schemaReady: true, insertRollbackTest: true, credentialsSaved: '.env.local' }));
  }
} catch (error) {
  // pg errors can include connection details; expose only the code.
  console.error(JSON.stringify({ failed: true, code: error.code || 'PROVISIONING_FAILED' }));
  process.exitCode = 1;
} finally {
  await target?.end();
  await admin.end();
}
