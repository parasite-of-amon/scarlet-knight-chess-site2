import { createClient } from './client';

export interface UploadImageOptions {
  bucket?: string;
  maxSizeInMB?: number;
  allowedTypes?: string[];
}

export interface UploadedImage {
  path: string;
  publicUrl: string;
}

const DEFAULT_OPTIONS: Required<UploadImageOptions> = {
  bucket: 'event-images',
  maxSizeInMB: 5,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
};

export async function uploadImage(
  file: File,
  options: UploadImageOptions = {}
): Promise<UploadedImage> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const supabase = createClient();

  // Validate file size
  const maxSizeInBytes = opts.maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    throw new Error(`File size must be less than ${opts.maxSizeInMB}MB`);
  }

  // Validate file type
  if (!opts.allowedTypes.includes(file.type)) {
    throw new Error(
      `File type must be one of: ${opts.allowedTypes.join(', ')}`
    );
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${fileName}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(opts.bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(opts.bucket).getPublicUrl(data.path);

  return {
    path: data.path,
    publicUrl,
  };
}

export async function deleteImage(
  path: string,
  bucket: string = 'event-images'
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

export async function listImages(
  folder: string = '',
  bucket: string = 'event-images'
): Promise<string[]> {
  const supabase = createClient();

  const { data, error } = await supabase.storage.from(bucket).list(folder);

  if (error) {
    throw new Error(`List failed: ${error.message}`);
  }

  return data.map((file) => file.name);
}

export function getPublicUrl(path: string, bucket: string = 'event-images'): string {
  const supabase = createClient();
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);
  return publicUrl;
}
