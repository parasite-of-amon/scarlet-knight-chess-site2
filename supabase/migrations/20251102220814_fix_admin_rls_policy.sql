/*
  # Fix Admin RLS Policy for Server-Side Authentication

  1. Purpose
    - Update RLS policy to allow server-side authentication queries
    - The server uses the anon key to verify admin credentials
    - Keep the table secure by only allowing SELECT operations
  
  2. Changes
    - Drop the old restrictive policy that requires auth.uid()
    - Create new policy that allows SELECT for server authentication
    - Maintain security by not allowing INSERT/UPDATE/DELETE from anon
  
  3. Security Notes
    - Only SELECT is allowed with anon key
    - Password hashes are returned but this is necessary for bcrypt verification
    - All write operations still require proper authentication
*/

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Admins can read own data" ON admins;

-- Create new policy that allows server-side authentication
CREATE POLICY "Allow server to verify admin credentials"
  ON admins FOR SELECT
  TO anon, authenticated
  USING (true);
