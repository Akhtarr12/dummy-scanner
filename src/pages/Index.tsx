import React, { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { Chatbot } from '@/components/Chatbot';
import { Card } from '@/components/ui/card';
import { motion } from "framer-motion";
import { Camera, MessageSquare, ShieldCheck } from 'lucide-react';

const Index= () => {
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    // Simulate API analysis
    setTimeout(() => {
      setAnalysis("I've detected what appears to be a skin condition in the image. Would you like me to provide more details about what I observe?");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            AI SKIN ANALYSIS
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload a clear photo of your skin concern and receive instant AI analysis with 
            personalized recommendations from our medical AI assistant.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="overflow-hidden">
                <div className="p-6">
                  <ImageUpload onImageUpload={handleImageUpload} />
                </div>
              </Card>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <Camera className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <h3 className="text-sm font-semibold">High Quality</h3>
                  <p className="text-xs text-gray-500">Clear, well-lit photos</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <MessageSquare className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <h3 className="text-sm font-semibold">AI Support</h3>
                  <p className="text-xs text-gray-500">24/7 assistance</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <ShieldCheck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <h3 className="text-sm font-semibold">Secure</h3>
                  <p className="text-xs text-gray-500">HIPAA compliant</p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Chatbot imageAnalysis={analysis || undefined} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
export default Index;