BEGIN;
ALTER TABLE institucional.leads ADD COLUMN IF NOT EXISTS submission_key uuid;
ALTER TABLE institucional.leads ADD COLUMN IF NOT EXISTS request_hash text;
CREATE UNIQUE INDEX IF NOT EXISTS leads_submission_key_idx ON institucional.leads(submission_key);
CREATE INDEX IF NOT EXISTS leads_email_created_idx ON institucional.leads(email, created_at DESC);
CREATE TABLE IF NOT EXISTS institucional.email_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL UNIQUE REFERENCES institucional.leads(id),
  kind text NOT NULL DEFAULT 'internal_lead_notification' CHECK (kind = 'internal_lead_notification'),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  attempts integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz
);
COMMIT;
