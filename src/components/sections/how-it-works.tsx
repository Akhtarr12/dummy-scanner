import { motion } from "framer-motion";
import { Camera, Brain, FileText, MessageSquare } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Take a Photo",
    description: "Upload a clear photo of your skin concern"
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Our AI processes and analyzes your image"
  },
  {
    icon: FileText,
    title: "Get Results",
    description: "Receive detailed insights and recommendations"
  },
  {
    icon: MessageSquare,
    title: "Chat Support",
    description: "Discuss results with our specialized AI chatbot for personalized advice"
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">
            Get your skin analysis and expert AI consultation in four simple steps
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-white rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                <step.icon className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}