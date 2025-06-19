/*
  # Initial Schema Setup

  1. Tables
    - admins: Store administrator accounts
    - clients: Store client information
    - projects: Track project details
    - blog_posts: Manage blog content

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
    - Add policies for client access to their projects
    - Add policies for public access to published blog posts
*/

-- Table des administrateurs
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'admins' AND policyname = 'Admins can manage admin accounts'
  ) THEN
    CREATE POLICY "Admins can manage admin accounts"
      ON admins
      USING (auth.role() = 'admin');
  END IF;
END $$;

-- Table des clients
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  address text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'clients' AND policyname = 'Admins can manage clients'
  ) THEN
    CREATE POLICY "Admins can manage clients"
      ON clients
      USING (auth.role() = 'admin');
  END IF;
END $$;

-- Table des projets
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  client_id uuid REFERENCES clients(id),
  status text NOT NULL DEFAULT 'draft',
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Admins can manage projects'
  ) THEN
    CREATE POLICY "Admins can manage projects"
      ON projects
      USING (auth.role() = 'admin');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Clients can view their own projects'
  ) THEN
    CREATE POLICY "Clients can view their own projects"
      ON projects
      FOR SELECT
      USING (auth.uid() = client_id);
  END IF;
END $$;

-- Table des articles de blog
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  author_id uuid REFERENCES admins(id),
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'Admins can manage blog posts'
  ) THEN
    CREATE POLICY "Admins can manage blog posts"
      ON blog_posts
      USING (auth.role() = 'admin');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'Public can view published blog posts'
  ) THEN
    CREATE POLICY "Public can view published blog posts"
      ON blog_posts
      FOR SELECT
      USING (status = 'published');
  END IF;
END $$;