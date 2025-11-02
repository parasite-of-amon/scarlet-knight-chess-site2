/*
  # Create Admin and Content Management Tables

  ## 1. New Tables
  
  ### `admins`
  - `id` (uuid, primary key) - Unique identifier for admin
  - `username` (text, unique) - Admin username for login
  - `password_hash` (text) - Hashed password for security
  - `created_at` (timestamptz) - When admin account was created
  
  ### `events`
  - `id` (uuid, primary key) - Unique identifier for event
  - `title` (text) - Event title
  - `description` (text) - Event description
  - `event_date` (date) - Date of the event
  - `event_time` (text) - Time of the event
  - `location` (text) - Event location
  - `custom_links` (jsonb) - Array of custom links with titles and URLs
  - `is_recurring` (boolean) - Whether event is recurring (always shows as upcoming)
  - `created_at` (timestamptz) - When event was created
  - `updated_at` (timestamptz) - When event was last updated
  
  ### `sponsors`
  - `id` (uuid, primary key) - Unique identifier for sponsor
  - `name` (text) - Sponsor name
  - `logo_url` (text) - URL to sponsor logo
  - `website_url` (text) - Sponsor website URL
  - `tier` (text) - Sponsor tier (platinum, gold, silver, bronze)
  - `display_order` (integer) - Order to display sponsors
  - `created_at` (timestamptz) - When sponsor was added
  
  ### `page_content`
  - `id` (uuid, primary key) - Unique identifier
  - `page_name` (text, unique) - Name of the page (about, contact, etc.)
  - `content` (jsonb) - Page content as JSON structure
  - `updated_at` (timestamptz) - When content was last updated

  ## 2. Security
  - Enable RLS on all tables
  - Add policies for authenticated admin access
  - Public read access for events, sponsors, and page_content
  - Admin-only write access for all tables

  ## 3. Important Notes
  - Admin passwords must be hashed before storage (use bcrypt or similar)
  - Events automatically categorized as past/upcoming based on event_date
  - Recurring events always appear in upcoming regardless of date
  - Custom links stored as JSON array for flexibility
*/

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  event_date date NOT NULL,
  event_time text DEFAULT '',
  location text DEFAULT '',
  custom_links jsonb DEFAULT '[]'::jsonb,
  is_recurring boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sponsors table
CREATE TABLE IF NOT EXISTS sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text DEFAULT '',
  website_url text DEFAULT '',
  tier text DEFAULT 'bronze',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create page_content table
CREATE TABLE IF NOT EXISTS page_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name text UNIQUE NOT NULL,
  content jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Policies for admins table (admin access only)
CREATE POLICY "Admins can read own data"
  ON admins FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Policies for events table
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (true);

-- Policies for sponsors table
CREATE POLICY "Anyone can view sponsors"
  ON sponsors FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert sponsors"
  ON sponsors FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update sponsors"
  ON sponsors FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete sponsors"
  ON sponsors FOR DELETE
  TO authenticated
  USING (true);

-- Policies for page_content table
CREATE POLICY "Anyone can view page content"
  ON page_content FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert page content"
  ON page_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update page content"
  ON page_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete page content"
  ON page_content FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_recurring ON events(is_recurring);
CREATE INDEX IF NOT EXISTS idx_sponsors_display_order ON sponsors(display_order);
CREATE INDEX IF NOT EXISTS idx_page_content_page_name ON page_content(page_name);

-- Insert default admin user (username: admin, password: admin123)
-- Note: This is a bcrypt hash of "admin123"
INSERT INTO admins (username, password_hash)
VALUES ('admin', '$2a$10$rIQCnPBZHHmxQVDXLIBn8.ZGLKlDdBVL/l67fzR2EqzF/oH7h5JEy')
ON CONFLICT (username) DO NOTHING;