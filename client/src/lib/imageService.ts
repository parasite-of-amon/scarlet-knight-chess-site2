export interface ImageCompressionResult {
  dataUrl: string;
  path: string;
  size: number;
}

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

const DEFAULT_OPTIONS: Required<CompressionOptions> = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
};

export const generateImagePath = (eventType: 'upcoming' | 'past' | 'calendar', originalName: string): string => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const nameParts = sanitizedName.split('.');
  const ext = nameParts.length > 1 ? nameParts.pop() : 'jpg';
  const baseName = nameParts.join('.');

  return `/events/images/${eventType}/${timestamp}_${randomId}_${baseName}.${ext}`;
};

export const compressImage = (
  file: File,
  options: CompressionOptions = {}
): Promise<ImageCompressionResult> => {
  return new Promise((resolve, reject) => {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read image file'));

    reader.onload = (e) => {
      const img = new Image();

      img.onerror = () => reject(new Error('Failed to load image'));

      img.onload = () => {
        let { width, height } = img;

        if (width > opts.maxWidth || height > opts.maxHeight) {
          const ratio = Math.min(opts.maxWidth / width, opts.maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }

            const blobReader = new FileReader();
            blobReader.onerror = () => reject(new Error('Failed to read compressed image'));
            blobReader.onload = (blobEvent) => {
              const dataUrl = blobEvent.target?.result as string;
              resolve({
                dataUrl,
                path: dataUrl,
                size: blob.size,
              });
            };
            blobReader.readAsDataURL(blob);
          },
          file.type.startsWith('image/') ? file.type : 'image/jpeg',
          opts.quality
        );
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Allowed types: JPG, PNG, GIF, WebP`,
    };
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum: 5MB`,
    };
  }

  return { valid: true };
};

export const compressMultipleImages = async (
  files: File[],
  eventType: 'upcoming' | 'past' | 'calendar',
  options: CompressionOptions = {},
  onProgress?: (current: number, total: number) => void
): Promise<ImageCompressionResult[]> => {
  const results: ImageCompressionResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const validation = validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const compressed = await compressImage(file, options);
    results.push(compressed);

    if (onProgress) {
      onProgress(i + 1, files.length);
    }
  }

  return results;
};
