/*
  # Fix RLS policies for admin access to clients

  1. Update RLS policies
    - Allow authenticated users to read their own client data
    - Allow admin users to read all client data
    - Allow admin users to insert new clients
    - Add proper policies for admin management

  2. Security
    - Ensure admins can manage all clients
    - Ensure clients can only see their own data
*/

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Admins can manage clients" ON clients;
DROP POLICY IF EXISTS "Clients can view own data" ON clients;
DROP POLICY IF EXISTS "Allow authenticated users to read their client row" ON clients;
DROP POLICY IF EXISTS "Allow authenticated insert on clients" ON clients;

-- Create comprehensive policies for clients table
CREATE POLICY "Admins can manage all clients"
  ON clients
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.email = auth.email()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.email = auth.email()
    )
  );

CREATE POLICY "Clients can view their own data"
  ON clients
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Clients can update their own data"
  ON clients
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Update admin policies to use email-based authentication
DROP POLICY IF EXISTS "Admins can manage admin accounts" ON admins;
DROP POLICY IF EXISTS "Allow authenticated users to read their admin row" ON admins;

CREATE POLICY "Admins can manage admin accounts"
  ON admins
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.email = auth.email()
    )
  );

CREATE POLICY "Allow authenticated users to read their admin row"
  ON admins
  FOR SELECT
  TO authenticated
  USING (email = auth.email());

-- Update project policies
DROP POLICY IF EXISTS "Admins can manage projects" ON projects;
DROP POLICY IF EXISTS "Clients can view own projects" ON projects;
DROP POLICY IF EXISTS "Clients can view their own projects" ON projects;

CREATE POLICY "Admins can manage all projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.email = auth.email()
    )
  );

CREATE POLICY "Clients can view their own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

-- Update blog post policies
DROP POLICY IF EXISTS "Admins can manage blog posts" ON blog_posts;

CREATE POLICY "Admins can manage all blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.email = auth.email()
    )
  );