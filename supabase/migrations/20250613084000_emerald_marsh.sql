/*
  # Add client archive and additional fields

  1. New Fields
    - archived: Boolean to mark archived clients
    - archive_reason: Reason for archiving (won, lost, etc.)
    - archived_at: Timestamp when client was archived
    - postal_code: Client postal code
    - city: Client city
    - country: Client country
    - avatar_url: Client profile picture URL
    - password_expired: Boolean to disable login

  2. Security
    - No changes to RLS policies needed
*/

-- Add new columns to clients table
DO $$
BEGIN
  -- Archive related fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'archived'
  ) THEN
    ALTER TABLE clients ADD COLUMN archived boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'archive_reason'
  ) THEN
    ALTER TABLE clients ADD COLUMN archive_reason text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'archived_at'
  ) THEN
    ALTER TABLE clients ADD COLUMN archived_at timestamptz;
  END IF;

  -- Additional address fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'postal_code'
  ) THEN
    ALTER TABLE clients ADD COLUMN postal_code text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'city'
  ) THEN
    ALTER TABLE clients ADD COLUMN city text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'country'
  ) THEN
    ALTER TABLE clients ADD COLUMN country text DEFAULT 'France';
  END IF;

  -- Profile picture
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE clients ADD COLUMN avatar_url text;
  END IF;

  -- Password expiration
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'password_expired'
  ) THEN
    ALTER TABLE clients ADD COLUMN password_expired boolean DEFAULT false;
  END IF;
END $$;