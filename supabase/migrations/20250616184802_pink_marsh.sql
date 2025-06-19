/*
  # Fix RLS policy for project_features table

  1. Policy Updates
    - Drop the existing incorrect policy for project_features
    - Create the correct policy using auth.email() function
    - Allow admins to manage all project features

  2. Security
    - Admins can insert, update, delete, and select project features
    - Uses proper auth.email() function to check admin status
*/

-- Drop the existing incorrect policy
DROP POLICY IF EXISTS "Admins can manage project features" ON project_features;

-- Create the correct policy for admin management
CREATE POLICY "Admins can manage project features"
  ON project_features
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