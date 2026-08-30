BEGIN;
CREATE SCHEMA IF NOT EXISTS institucional;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
CREATE TABLE IF NOT EXISTS institucional.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (length(full_name) BETWEEN 1 AND 200),
  email text NOT NULL CHECK (length(email) BETWEEN 3 AND 254),
  whatsapp text NOT NULL CHECK (length(whatsapp) BETWEEN 1 AND 40),
  company_name text,
  company_size text,
  employees text,
  instagram text,
  website text,
  service text NOT NULL CHECK (length(service) BETWEEN 1 AND 200),
  message text CHECK (length(message) <= 5000),
  source text NOT NULL DEFAULT 'tzolkin.cloud',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON institucional.leads (created_at DESC);
COMMIT;
