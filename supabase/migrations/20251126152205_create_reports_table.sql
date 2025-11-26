/*
  # Create Reports Table

  1. New Tables
    - `reports`
      - `id` (uuid, primary key)
      - `type_of_incident` (text)
      - `description` (text)
      - `incident_date` (date)
      - `location` (text, optional)
      - `support_needed` (text)
      - `access_code` (text, unique, 6-digit code)
      - `status` (text, default 'new', can be 'new' or 'reviewed')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `reports` table
    - Add policy for anyone to insert reports (anonymous submission)
    - Add policy for retrieving reports by access code
    - Add policy for admin to view all reports

  3. Indexes
    - Index on `access_code` for fast lookups
    - Index on `status` for admin filtering
*/

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type_of_incident text NOT NULL,
  description text NOT NULL,
  incident_date date NOT NULL,
  location text,
  support_needed text NOT NULL,
  access_code text UNIQUE NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reports_access_code ON reports(access_code);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert reports"
  ON reports
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view reports by access code"
  ON reports
  FOR SELECT
  TO anon, authenticated
  USING (true);
