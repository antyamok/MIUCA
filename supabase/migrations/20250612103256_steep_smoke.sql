/*
  # Add last_seen column to clients table

  1. Changes
    - Add last_seen column to track when clients were last active
    - This will help show online status in admin interface

  2. Security
    - No changes to RLS policies needed
*/

-- Add last_seen column to clients table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'last_seen'
  ) THEN
    ALTER TABLE clients ADD COLUMN last_seen timestamptz;
  END IF;
END $$;