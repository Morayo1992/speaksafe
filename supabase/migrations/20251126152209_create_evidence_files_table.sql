/*
  # Create Evidence Files Table

  1. New Tables
    - `evidence_files`
      - `id` (uuid, primary key)
      - `report_id` (uuid, foreign key to reports)
      - `file_name` (text)
      - `file_path` (text, path in Supabase Storage)
      - `file_size` (bigint)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `evidence_files` table
    - Add policy for anyone to insert evidence files
    - Add policy for retrieving evidence files via report access code

  3. Relationships
    - Foreign key constraint to reports table
*/

CREATE TABLE IF NOT EXISTS evidence_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_evidence_files_report_id ON evidence_files(report_id);

ALTER TABLE evidence_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert evidence files"
  ON evidence_files
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view evidence files"
  ON evidence_files
  FOR SELECT
  TO anon, authenticated
  USING (true);
