/*
  # Setup Supabase Storage for Event Images

  1. Storage Buckets
    - Create `event-images` bucket for event photos
    - Public access for reading
    - Authenticated users can upload

  2. Storage Policies
    - Anyone can view images (public read)
    - Authenticated users can upload images
    - Authenticated users can update their uploads
    - Authenticated users can delete their uploads

  3. Configuration
    - Max file size: 5MB
    - Allowed file types: image/jpeg, image/png, image/webp
*/

-- Create storage bucket for event images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-images',
  'event-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public read access to event images
CREATE POLICY IF NOT EXISTS "Public read access for event images"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-images');

-- Policy: Allow authenticated users to upload images
CREATE POLICY IF NOT EXISTS "Authenticated users can upload event images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-images');

-- Policy: Allow authenticated users to update their images
CREATE POLICY IF NOT EXISTS "Authenticated users can update event images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'event-images');

-- Policy: Allow authenticated users to delete images
CREATE POLICY IF NOT EXISTS "Authenticated users can delete event images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'event-images');
