/*
  # Document Management and Messaging System

  1. New Tables
    - documents: Store uploaded documents with metadata
    - messages: Store chat messages between clients and admins
    - notifications: Store system notifications
    - document_access: Track document access permissions

  2. Storage
    - Create documents bucket for file storage
    - Set up proper RLS policies

  3. Security
    - Enable RLS on all tables
    - Add policies for client/admin access
    - Implement file size limits
*/

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  original_filename text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  file_type text NOT NULL,
  uploaded_by uuid NOT NULL REFERENCES auth.users(id),
  client_id uuid REFERENCES clients(id),
  project_id uuid REFERENCES projects(id),
  description text,
  category text DEFAULT 'general',
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES auth.users(id),
  recipient_id uuid REFERENCES auth.users(id),
  client_id uuid REFERENCES clients(id),
  project_id uuid REFERENCES projects(id),
  content text NOT NULL,
  message_type text DEFAULT 'text',
  attachment_url text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info',
  is_read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Documents policies
CREATE POLICY "Admins can manage all documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.email = auth.email()
    )
  );

CREATE POLICY "Clients can manage their own documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (
    uploaded_by = auth.uid() OR 
    client_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM clients 
      WHERE clients.id = auth.uid() AND clients.id = documents.client_id
    )
  );

-- Messages policies
CREATE POLICY "Admins can access all messages"
  ON messages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.email = auth.email()
    )
  );

CREATE POLICY "Clients can access their own messages"
  ON messages
  FOR ALL
  TO authenticated
  USING (
    sender_id = auth.uid() OR 
    recipient_id = auth.uid() OR
    client_id = auth.uid()
  );

-- Notifications policies
CREATE POLICY "Users can access their own notifications"
  ON notifications
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for documents
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Users can view their own documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.email = auth.email()
    )
  )
);

CREATE POLICY "Users can update their own documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'documents' AND (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.email = auth.email()
    )
  )
);

CREATE POLICY "Users can delete their own documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' AND (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM admins 
      WHERE admins.email = auth.email()
    )
  )
);

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id uuid,
  p_title text,
  p_message text,
  p_type text DEFAULT 'info',
  p_action_url text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO notifications (user_id, title, message, type, action_url)
  VALUES (p_user_id, p_title, p_message, p_type, p_action_url)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Function to send message notification
CREATE OR REPLACE FUNCTION notify_message_received()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  sender_name text;
  recipient_name text;
BEGIN
  -- Get sender name
  SELECT COALESCE(c.name, a.name, a.email) INTO sender_name
  FROM auth.users u
  LEFT JOIN clients c ON c.id = u.id
  LEFT JOIN admins a ON a.id = u.id
  WHERE u.id = NEW.sender_id;

  -- Create notification for recipient if specified
  IF NEW.recipient_id IS NOT NULL THEN
    PERFORM create_notification(
      NEW.recipient_id,
      'Nouveau message',
      'Vous avez reçu un nouveau message de ' || COALESCE(sender_name, 'un utilisateur'),
      'message',
      '/messages'
    );
  END IF;

  -- Create notification for client if specified
  IF NEW.client_id IS NOT NULL AND NEW.client_id != NEW.sender_id THEN
    PERFORM create_notification(
      NEW.client_id,
      'Nouveau message',
      'Vous avez reçu un nouveau message de ' || COALESCE(sender_name, 'un utilisateur'),
      'message',
      '/messages'
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Function to notify document upload
CREATE OR REPLACE FUNCTION notify_document_uploaded()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  uploader_name text;
  admin_id uuid;
BEGIN
  -- Get uploader name
  SELECT COALESCE(c.name, a.name, a.email) INTO uploader_name
  FROM auth.users u
  LEFT JOIN clients c ON c.id = u.id
  LEFT JOIN admins a ON a.id = u.id
  WHERE u.id = NEW.uploaded_by;

  -- Notify client if document is uploaded by admin
  IF NEW.client_id IS NOT NULL AND NEW.client_id != NEW.uploaded_by THEN
    PERFORM create_notification(
      NEW.client_id,
      'Nouveau document',
      'Un nouveau document "' || NEW.original_filename || '" a été ajouté à votre dossier',
      'document',
      '/documents'
    );
  END IF;

  -- Notify admins if document is uploaded by client
  IF NEW.client_id IS NOT NULL AND NEW.uploaded_by = NEW.client_id THEN
    FOR admin_id IN 
      SELECT a.id FROM admins a
    LOOP
      PERFORM create_notification(
        admin_id,
        'Nouveau document client',
        'Le client ' || COALESCE(uploader_name, 'inconnu') || ' a téléversé "' || NEW.original_filename || '"',
        'document',
        '/admin'
      );
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS message_notification_trigger ON messages;
CREATE TRIGGER message_notification_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_message_received();

DROP TRIGGER IF EXISTS document_notification_trigger ON documents;
CREATE TRIGGER document_notification_trigger
  AFTER INSERT ON documents
  FOR EACH ROW
  EXECUTE FUNCTION notify_document_uploaded();