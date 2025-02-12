import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Shield, Users, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center bg-gradient-to-b from-blue-50 via-white to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="inline-block">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                AI-Powered Healthcare
              </span>
            </div>

            <h1 className="text-5xl font-bold leading-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Professional Skin Analysis Using Advanced AI Technology
            </h1>

            <p className="text-xl text-gray-600">
              Get instant, accurate skin assessments and personalized recommendations from our 
              advanced AI technology. Backed by dermatological expertise.
            </p>

            <div className="flex gap-4">
              <Link href="/analysis">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Start Free Analysis
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </a>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold">HIPAA Compliant</h3>
                <p className="text-sm text-gray-500">Secure & Private</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold">50K+</h3>
                <p className="text-sm text-gray-500">Users Trust Us</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Star className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold">95%</h3>
                <p className="text-sm text-gray-500">Accuracy Rate</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-20"></div>
            <img
             src="/assets/portrait-young-pretty-caucasian-woman-260nw-1717579036.webp"
              alt="AI Dermatology"
              className="relative rounded-lg shadow-xl w-full"
            />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg w-3/4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">AI Analysis Result</p>
                  <p className="text-xs text-gray-500">Processed in &lt; 30 seconds</p>
                </div>
                <div className="bg-green-100 px-3 py-1 rounded-full">
                  <span className="text-green-600 text-sm font-medium">98% Match</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}