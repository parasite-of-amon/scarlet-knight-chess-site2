/*
  # Update Admin Credentials

  1. Purpose
    - Update admin user credentials to match expected login
    - Username: administrator
    - Password: RutgersChess@123

  2. Changes
    - Delete old admin user if exists
    - Insert new admin user with correct credentials
    - Ensure password is properly hashed with bcrypt

  3. Security Notes
    - Password hash generated with bcrypt (10 rounds)
    - Hash: $2b$10$nWFhuHABgqw1oZecVxhzD.zLDrNJewcbyf.n2gtkPEn5tKbuoMowC
    - Corresponds to password: RutgersChess@123
*/

-- Remove old admin user
DELETE FROM admins WHERE username = 'admin';

-- Insert new admin user with correct credentials
-- Username: administrator
-- Password: RutgersChess@123 (hashed with bcrypt)
INSERT INTO admins (username, password_hash)
VALUES ('administrator', '$2b$10$nWFhuHABgqw1oZecVxhzD.zLDrNJewcbyf.n2gtkPEn5tKbuoMowC')
ON CONFLICT (username) DO UPDATE
SET password_hash = EXCLUDED.password_hash;
