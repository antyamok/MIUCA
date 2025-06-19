/*
  # Add Authentication Users

  1. Create test users in auth.users
    - Admin user (admin@miuca.fr)
    - Client user (client@miuca.fr)
  
  2. Link users to their respective tables
    - Link admin user to admins table
    - Link client user to clients table
*/

-- Création de l'utilisateur administrateur
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Check if admin email already exists in auth.users
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@miuca.fr'
  ) THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@miuca.fr',
      crypt('admin123', gen_salt('bf')),
      now(),
      now(),
      now()
    )
    RETURNING id INTO admin_user_id;

    -- Only insert into admins table if email doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM admins WHERE email = 'admin@miuca.fr'
    ) THEN
      INSERT INTO admins (id, email, role)
      VALUES (admin_user_id, 'admin@miuca.fr', 'admin');
    END IF;
  END IF;
END $$;

-- Création de l'utilisateur client
DO $$
DECLARE
  client_user_id uuid;
BEGIN
  -- Check if client email already exists in auth.users
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'client@miuca.fr'
  ) THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'client@miuca.fr',
      crypt('client123', gen_salt('bf')),
      now(),
      now(),
      now()
    )
    RETURNING id INTO client_user_id;

    -- Only insert into clients table if email doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM clients WHERE email = 'client@miuca.fr'
    ) THEN
      INSERT INTO clients (id, email, name)
      VALUES (client_user_id, 'client@miuca.fr', 'Client Test');
    END IF;
  END IF;
END $$;