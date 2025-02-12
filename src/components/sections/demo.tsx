import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, Loader2, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const demoImageUrl = "/assets/Eczema+right+Pic++_137059687.jpeg";

export default function Demo() {
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const handleAnalysis = () => {
    setAnalyzing(true);
    setProgress(0);
    setResult(null);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setAnalyzing(false);
          setResult("Potential signs of Eczema detected. Confidence: 92%");
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Why Early Detection Matters</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Early detection of skin conditions can significantly improve treatment outcomes. 
            Our AI technology helps identify potential concerns before they become serious issues.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="aspect-video bg-gray-100 rounded-lg mb-6 relative overflow-hidden">
                  <img
                    src={demoImageUrl}
                    alt="Skin Analysis Demo"
                    className="w-full h-full object-cover"
                  />
                  {analyzing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="bg-white p-6 rounded-lg w-3/4">
                        <Progress value={progress} className="mb-2" />
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Analyzing image...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {result ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold mb-2">Analysis Result</h3>
                      <p className="text-gray-700">{result}</p>
                    </div>
                    <Link href="/analysis" className="block">
                      <Button className="w-full" size="lg">
                        Try with Your Own Image
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button
                    onClick={handleAnalysis}
                    className="w-full"
                    size="lg"
                    disabled={analyzing}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Analyze Demo Image
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-semibold mb-4">Early Detection Benefits</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-semibold">1</span>
                  </div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Better Treatment Outcomes:</span> Early 
                    detection allows for more effective and less invasive treatment options.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-semibold">2</span>
                  </div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Cost-Effective:</span> Addressing skin 
                    conditions early typically requires less extensive and costly treatments.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-semibold">3</span>
                  </div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Peace of Mind:</span> Regular monitoring 
                    helps track changes in your skin health and reduces anxiety about potential issues.
                  </p>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}