/*
  # Création du schéma d'authentification

  1. Création des utilisateurs de test
    - Un administrateur
    - Un client test
*/

-- Insertion d'un administrateur de test
INSERT INTO admins (email, role)
VALUES ('admin@miuca.fr', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insertion d'un client de test
INSERT INTO clients (name, email, phone, address)
VALUES (
  'John Doe',
  'client@miuca.fr',
  '+33 6 12 34 56 78',
  '123 Rue de la Paix, 75000 Paris'
)
ON CONFLICT (email) DO NOTHING;