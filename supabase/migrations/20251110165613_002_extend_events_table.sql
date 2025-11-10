/*
  # Extend Events Table for Comprehensive Management
  
  ## Changes
  - Add slug column for URL-friendly identifiers
  - Add time_start and time_end columns (replacing event_time)
  - Add images array for multiple photos
  - Add winners_image for podium photos
  - Add participants, rounds, rating columns for tournaments
  - Add status column (upcoming/past/live)
  - Add tags array for filtering
  - Add registration/info/resource link columns with labels
  - Create winners table for tournament results
  - Add indexes for performance
  
  ## Security
  - Maintain existing RLS policies
  - Ensure public read, authenticated write access
*/

-- Add new columns to events table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'slug') THEN
    ALTER TABLE events ADD COLUMN slug text UNIQUE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'time_start') THEN
    ALTER TABLE events ADD COLUMN time_start text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'time_end') THEN
    ALTER TABLE events ADD COLUMN time_end text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'images') THEN
    ALTER TABLE events ADD COLUMN images text[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'winners_image') THEN
    ALTER TABLE events ADD COLUMN winners_image text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'participants') THEN
    ALTER TABLE events ADD COLUMN participants integer;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'rounds') THEN
    ALTER TABLE events ADD COLUMN rounds integer;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'rating') THEN
    ALTER TABLE events ADD COLUMN rating text CHECK (rating IN ('USCF', 'Casual', 'Unrated'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'status') THEN
    ALTER TABLE events ADD COLUMN status text NOT NULL CHECK (status IN ('upcoming', 'past', 'live')) DEFAULT 'upcoming';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'tags') THEN
    ALTER TABLE events ADD COLUMN tags text[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'registration_link') THEN
    ALTER TABLE events ADD COLUMN registration_link text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'registration_label') THEN
    ALTER TABLE events ADD COLUMN registration_label text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'info_link') THEN
    ALTER TABLE events ADD COLUMN info_link text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'info_label') THEN
    ALTER TABLE events ADD COLUMN info_label text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'resource_link') THEN
    ALTER TABLE events ADD COLUMN resource_link text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'resource_label') THEN
    ALTER TABLE events ADD COLUMN resource_label text;
  END IF;
END $$;

-- Create winners table
CREATE TABLE IF NOT EXISTS winners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  place integer NOT NULL,
  name text NOT NULL,
  score text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_tags ON events USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_winners_event_id ON winners(event_id);

-- Enable RLS on winners table
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;

-- RLS Policies for winners
CREATE POLICY "Winners are publicly readable"
  ON winners FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create winners"
  ON winners FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update winners"
  ON winners FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete winners"
  ON winners FOR DELETE
  TO authenticated
  USING (true);

-- Function to auto-generate slugs from titles
CREATE OR REPLACE FUNCTION generate_slug_for_event()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
    NEW.slug := trim(both '-' from NEW.slug);
    
    -- Ensure uniqueness
    IF EXISTS (SELECT 1 FROM events WHERE slug = NEW.slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) THEN
      NEW.slug := NEW.slug || '-' || floor(extract(epoch from now()))::text;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for slug generation
DROP TRIGGER IF EXISTS generate_event_slug ON events;
CREATE TRIGGER generate_event_slug
  BEFORE INSERT OR UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION generate_slug_for_event();
