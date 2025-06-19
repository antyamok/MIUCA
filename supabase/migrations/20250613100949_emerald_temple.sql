/*
  # Fix Avatar Storage Policies

  1. Storage Policies
    - Create policies for the 'avatars' storage bucket
    - Allow admins to insert/update avatar files
    - Allow authenticated users to read avatar files
  
  2. Security
    - Admins can upload and update avatars for any client
    - All authenticated users can view avatars
    - Public users can also view avatars (for client-facing features)
*/

-- Create the avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the avatars bucket
UPDATE storage.buckets 
SET public = true 
WHERE id = 'avatars';

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

-- Allow admins to upload avatars
CREATE POLICY "Admins can upload avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.email()
  )
);

-- Allow admins to update avatars
CREATE POLICY "Admins can update avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.email()
  )
)
WITH CHECK (
  bucket_id = 'avatars' 
  AND EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.email()
  )
);

-- Allow admins to delete avatars
CREATE POLICY "Admins can delete avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.email = auth.email()
  )
);

-- Allow anyone to view avatars (since they're public)
CREATE POLICY "Anyone can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');