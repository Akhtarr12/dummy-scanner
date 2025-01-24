import React, { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { Chatbot } from '@/components/Chatbot';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    // Simulate API analysis
    setTimeout(() => {
      setAnalysis("I've detected what appears to be a skin condition in the image. Would you like me to provide more details about what I observe?");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary">DERMA AI SCANNER</h1>
          <p className="text-muted-foreground">
            Upload an image for AI-powered skin analysis and chat with our assistant
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ImageUpload onImageUpload={handleImageUpload} />
            {analysis && (
              <Card className="p-4 bg-muted">
                <h3 className="font-semibold mb-2">Analysis Result</h3>
                <p>{analysis}</p>
              </Card>
            )}
          </div>
          <Chatbot imageAnalysis={analysis || undefined} />
        </div>
      </div>
    </div>
  );
};

export default Index;