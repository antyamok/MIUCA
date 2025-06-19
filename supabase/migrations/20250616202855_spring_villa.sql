/*
  # Fix project gallery RLS policy

  1. Policy Updates
    - Drop the existing incorrect policy for project_gallery
    - Create the correct policy using auth.email() function
    - Allow admins to manage all project gallery items

  2. Security
    - Admins can insert, update, delete, and select project gallery items
    - Uses proper auth.email() function to check admin status
*/

-- Drop the existing policy for project_gallery
DROP POLICY IF EXISTS "Admins can manage project gallery" ON project_gallery;

-- Create a new policy that properly checks admin permissions using auth.email()
CREATE POLICY "Admins can manage project gallery"
  ON project_gallery
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