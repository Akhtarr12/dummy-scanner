import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';
import axios from 'axios';

interface DetectionResult {
  annotated_image?: string;
  bounding_boxes?: number[][];
  class_names?: string[];
  confidence_scores?: number[];
}

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const detectSkinCondition = async (file: File) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      // Use the backend URL from environment variables
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      console.log('Sending request to:', `${backendUrl}/api/detect`);

      const response = await axios.post(`${backendUrl}/api/detect`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setDetectionResult(response.data);
      toast.success('Detection completed');
    } catch (error: unknown) {
      console.error('Detection error:', error);
      toast.error('Error detecting skin condition');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onImageUpload(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        toast.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);

      // Call the backend for detection
      detectSkinCondition(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false,
  });

  return (
    <Card className="p-6">
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
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
                // Reset for a new upload
                setPreview(null);
                setDetectionResult(null);
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

      {loading && <p className="mt-4">Detecting skin condition...</p>}

      {detectionResult && (
        <div className="mt-4">
          {detectionResult.class_names && detectionResult.class_names.length > 0 ? (
            <>
              <h2 className="text-xl font-bold">
                Prediction: {detectionResult.class_names[0]}
              </h2>
              {detectionResult.confidence_scores && detectionResult.confidence_scores[0] !== undefined && (
                <p>
                  Confidence: {(detectionResult.confidence_scores[0] * 100).toFixed(2)}%
                </p>
              )}
              {detectionResult.annotated_image && (
                <img
                  src={detectionResult.annotated_image}
                  alt="Annotated Result"
                  className="mt-2 rounded-lg"
                />
              )}
            </>
          ) : (
            <p>Sorry, I am unable to detect this. Please seek help from our chatbot.</p>
          )}
        </div>
      )}
    </Card>
  );
};
