/*
  # Initial Data Seeding

  1. Create test users
    - Admin user
    - Test client
*/

-- Insert test admin
INSERT INTO admins (email, role)
VALUES ('admin@miuca.fr', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert test client
INSERT INTO clients (name, email, phone, address)
VALUES (
  'John Doe',
  'client@miuca.fr',
  '+33 6 12 34 56 78',
  '123 Rue de la Paix, 75000 Paris'
)
ON CONFLICT (email) DO NOTHING;