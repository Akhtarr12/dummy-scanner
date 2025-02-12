import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { toast } from '@/hooks/use-toast';
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
  const [retryCount, setRetryCount] = useState(0);

  const checkImageClarity = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        // Basic check for image dimensions
        if (img.width < 200 || img.height < 200) {
          resolve(false);
        } else {
          resolve(true);
        }
      };

      img.src = objectUrl;
    });
  };

  const detectSkinCondition = async (file: File) => {
    setLoading(true);
    try {
      const isImageClear = await checkImageClarity(file);

      if (!isImageClear) {
        toast({
          title: "Image Quality Issue",
          description: "Please upload a clearer image with better resolution",
          variant: "destructive"
        });
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.post(`${backendUrl}/api/detect`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      

      setDetectionResult(response.data);
      setRetryCount(0);
      toast({
        title: "Success",
        description: 'Detection completed'
      });
    } catch (error: unknown) {
      console.error('Detection error:', error);

      if (retryCount < 2) {
        toast({
          title: "Detection Failed",
          description: "Please try uploading the image again",
          variant: "destructive"
        });
        setRetryCount(prev => prev + 1);
      } else {
        toast({
          title: "Service Unavailable",
          description: "Please use our chatbot service for assistance",
          variant: "destructive"
        });
        setRetryCount(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      onImageUpload(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        toast({
          title: "Success",
          description: 'Image uploaded successfully'
        });
      };
      reader.readAsDataURL(file);

      detectSkinCondition(file);
    }
  }, [onImageUpload, retryCount]);

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
                setPreview(null);
                setDetectionResult(null);
                setRetryCount(0);
              }}
            >
              Upload New Image
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 p-8 border-2 border-dashed rounded-lg hover:bg-muted/50 transition-colors">
            {isDragActive ? (
              <>
                <ImageIcon className="w-12 h-12 text-primary" />
                <p>Drop the image here...</p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-primary" />
                <p>Drag & drop an image here, or click to select</p>
                <p className="text-sm text-muted-foreground">
                  Upload a clear, well-lit image for best results
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {loading && (
        <div className="mt-4 space-y-2">
          <Progress value={100} className="animate-pulse" />
          <p className="text-center text-sm text-muted-foreground">Detecting skin condition...</p>
        </div>
      )}

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
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-center">
                Unable to analyze this image. Please try uploading a clearer image or use our chatbot for assistance.
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
