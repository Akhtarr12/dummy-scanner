import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Search, Shield, Clock, MessageSquare, Bot } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Advanced AI Analysis",
    description: "State-of-the-art machine learning algorithms for accurate skin condition detection"
  },
  {
    icon: Bot,
    title: "AI Dermatology Chat",
    description: "24/7 access to our specialized skin health chatbot for immediate guidance and support"
  },
  {
    icon: Search,
    title: "Detailed Reports",
    description: "Comprehensive analysis with detailed explanations and recommended actions"
  },
  {
    icon: MessageSquare,
    title: "Personalized Advice",
    description: "Get tailored skincare recommendations through interactive chat sessions"
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data is encrypted and handled with the highest security standards"
  },
  {
    icon: Clock,
    title: "Instant Results",
    description: "Get your analysis results and chat support within seconds, not days"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Key Features</h2>
          <p className="text-xl text-gray-600">
            Cutting-edge technology meets dermatological expertise with AI-powered chat support
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="pt-6">
                  <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}