BEGIN;
ALTER TABLE institucional.email_outbox ADD COLUMN IF NOT EXISTS first_attempt_at timestamptz;
ALTER TABLE institucional.email_outbox ADD COLUMN IF NOT EXISTS next_attempt_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE institucional.email_outbox ADD COLUMN IF NOT EXISTS payload jsonb;
ALTER TABLE institucional.email_outbox ADD COLUMN IF NOT EXISTS provider_id text;
ALTER TABLE institucional.email_outbox ADD COLUMN IF NOT EXISTS last_error text;
COMMIT;
