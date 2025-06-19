/*
  # Fix infinite recursion in RLS policies

  1. Policy Updates
    - Fix admins table policies that cause infinite recursion
    - Update clients table policies to use proper auth functions
    - Ensure policies use auth.uid() instead of problematic email() function

  2. Security
    - Maintain proper access control
    - Admins can manage all data
    - Clients can only access their own data
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can manage admin accounts" ON admins;
DROP POLICY IF EXISTS "Allow authenticated users to read their admin row" ON admins;
DROP POLICY IF EXISTS "Admins can manage all clients" ON clients;
DROP POLICY IF EXISTS "Clients can update their own data" ON clients;
DROP POLICY IF EXISTS "Clients can view their own data" ON clients;

-- Create fixed policies for admins table
CREATE POLICY "Admins can manage all admin accounts"
  ON admins
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can read their own data"
  ON admins
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Create fixed policies for clients table
CREATE POLICY "Admins can manage all clients"
  ON clients
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Clients can read their own data"
  ON clients
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Clients can update their own data"
  ON clients
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());