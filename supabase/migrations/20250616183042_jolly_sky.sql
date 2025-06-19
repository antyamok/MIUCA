/*
  # Enhanced Projects and Blog Schema

  1. Enhanced Projects Table
    - Add gallery, challenge, solution, location, type, sustainable_features
    - Add featured flag for homepage display
    - Add urgency tracking

  2. Enhanced Blog Posts Table
    - Add all missing fields for complete blog management
    - Add category, tags, featured image

  3. New Tables
    - sustainable_features: Reusable sustainable features list
    - project_features: Many-to-many relationship for project features
    - project_gallery: Store multiple images per project

  4. Security
    - Update RLS policies for new tables
*/

-- Add new columns to projects table
DO $$
BEGIN
  -- Project enhancement fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'challenge'
  ) THEN
    ALTER TABLE projects ADD COLUMN challenge text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'solution'
  ) THEN
    ALTER TABLE projects ADD COLUMN solution text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'location'
  ) THEN
    ALTER TABLE projects ADD COLUMN location text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'project_type'
  ) THEN
    ALTER TABLE projects ADD COLUMN project_type text DEFAULT 'résidentiel';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'featured'
  ) THEN
    ALTER TABLE projects ADD COLUMN featured boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'main_image'
  ) THEN
    ALTER TABLE projects ADD COLUMN main_image text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'year_completed'
  ) THEN
    ALTER TABLE projects ADD COLUMN year_completed text;
  END IF;
END $$;

-- Create sustainable features table
CREATE TABLE IF NOT EXISTS sustainable_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sustainable_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage sustainable features"
  ON sustainable_features
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Anyone can read sustainable features"
  ON sustainable_features
  FOR SELECT
  TO authenticated
  USING (true);

-- Create project gallery table
CREATE TABLE IF NOT EXISTS project_gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE project_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage project gallery"
  ON project_gallery
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Anyone can read project gallery"
  ON project_gallery
  FOR SELECT
  TO authenticated
  USING (true);

-- Create project features junction table
CREATE TABLE IF NOT EXISTS project_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  feature_id uuid REFERENCES sustainable_features(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_id, feature_id)
);

ALTER TABLE project_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage project features"
  ON project_features
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Anyone can read project features"
  ON project_features
  FOR SELECT
  TO authenticated
  USING (true);

-- Add new columns to blog_posts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'category'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN category text DEFAULT 'Design Durable';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'tags'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN tags text[];
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'featured_image'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN featured_image text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'reading_time'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN reading_time integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'featured'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN featured boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'slug'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN slug text;
  END IF;
END $$;

-- Add name column to admins table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admins' AND column_name = 'name'
  ) THEN
    ALTER TABLE admins ADD COLUMN name text;
  END IF;
END $$;

-- Insert some default sustainable features
INSERT INTO sustainable_features (name, description) VALUES
  ('Panneaux solaires', 'Installation de panneaux photovoltaïques pour l''énergie renouvelable'),
  ('Isolation haute performance', 'Isolation thermique optimisée pour réduire la consommation énergétique'),
  ('Récupération d''eau de pluie', 'Système de collecte et réutilisation des eaux pluviales'),
  ('Matériaux locaux', 'Utilisation de matériaux sourcés localement pour réduire l''empreinte carbone'),
  ('Ventilation naturelle', 'Système de ventilation utilisant les flux d''air naturels'),
  ('Toiture végétalisée', 'Toit recouvert de végétation pour l''isolation et la biodiversité'),
  ('Géothermie', 'Système de chauffage/refroidissement utilisant l''énergie géothermique'),
  ('Éclairage LED', 'Éclairage basse consommation avec technologie LED'),
  ('Matériaux recyclés', 'Utilisation de matériaux recyclés ou récupérés'),
  ('Design biophilique', 'Intégration d''éléments naturels dans l''architecture')
ON CONFLICT (name) DO NOTHING;