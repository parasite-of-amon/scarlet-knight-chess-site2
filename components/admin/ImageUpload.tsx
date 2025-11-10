'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { X, Upload, Loader2, ImageIcon } from 'lucide-react';
import { uploadImage, deleteImage } from '@/lib/supabase/storage';
import { toast } from 'sonner';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  bucket?: string;
}

export function ImageUpload({
  value = [],
  onChange,
  maxImages = 5,
  bucket = 'event-images',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (value.length + acceptedFiles.length > maxImages) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return;
      }

      setUploading(true);
      const newUrls: string[] = [];

      try {
        for (const file of acceptedFiles) {
          const progressKey = file.name;
          setUploadProgress((prev) => ({ ...prev, [progressKey]: 0 }));

          try {
            const { publicUrl } = await uploadImage(file, { bucket });
            newUrls.push(publicUrl);
            setUploadProgress((prev) => ({ ...prev, [progressKey]: 100 }));
            toast.success(`${file.name} uploaded successfully`);
          } catch (error) {
            console.error('Upload error:', error);
            toast.error(
              error instanceof Error
                ? error.message
                : `Failed to upload ${file.name}`
            );
          }

          // Small delay to show progress
          await new Promise((resolve) => setTimeout(resolve, 300));
        }

        if (newUrls.length > 0) {
          onChange([...value, ...newUrls]);
        }
      } finally {
        setUploading(false);
        setUploadProgress({});
      }
    },
    [value, maxImages, bucket, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: uploading || value.length >= maxImages,
  });

  const handleRemove = async (urlToRemove: string, index: number) => {
    try {
      // Extract path from URL if it's a Supabase URL
      const urlObj = new URL(urlToRemove);
      const pathParts = urlObj.pathname.split('/');
      const path = pathParts[pathParts.length - 1];

      if (path && urlToRemove.includes('supabase')) {
        await deleteImage(path, bucket);
      }

      onChange(value.filter((_, i) => i !== index));
      toast.success('Image removed');
    } catch (error) {
      console.error('Delete error:', error);
      // Still remove from UI even if delete fails
      onChange(value.filter((_, i) => i !== index));
      toast.error('Failed to delete from storage, but removed from form');
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {value.length < maxImages && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8
            transition-colors cursor-pointer
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            {uploading ? (
              <>
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-sm text-gray-600">Uploading images...</p>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    or click to select files (max {maxImages} images, 5MB each)
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  Supported: JPG, PNG, WEBP
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([filename, progress]) => (
            <div key={filename} className="flex items-center gap-3">
              <ImageIcon className="w-4 h-4 text-gray-400" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{filename}</span>
                  <span className="text-xs text-gray-500">{progress}%</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div
              key={index}
              className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group"
            >
              <Image
                src={url}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemove(url, index)}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Remove
                </Button>
              </div>
              {/* Image number badge */}
              <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Text */}
      <p className="text-xs text-gray-500">
        {value.length} of {maxImages} images uploaded
      </p>
    </div>
  );
}
