import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';

export const ImageUpload = ({ onImageUpload }: { onImageUpload: (file: File) => void }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        onImageUpload(file);
        toast.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false
  });

  return (
    <Card className="p-6">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg"
            />
            <Button
              variant="secondary"
              className="mt-4"
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
              }}
            >
              Upload New Image
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {isDragActive ? (
              <>
                <ImageIcon className="w-12 h-12 text-primary" />
                <p>Drop the image here...</p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-primary" />
                <p>Drag & drop an image here, or click to select</p>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};