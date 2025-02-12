import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How accurate is the AI analysis?",
    answer: "Our AI system has been trained on millions of dermatological images and achieves an accuracy rate of over 90% for common skin conditions. However, it should be used as a screening tool and not replace professional medical advice."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take data privacy very seriously. All images and personal information are encrypted and stored securely. We comply with HIPAA and GDPR regulations."
  },
  {
    question: "How long does the analysis take?",
    answer: "The AI analysis typically takes less than 30 seconds to complete once you've uploaded your image."
  },
  {
    question: "What skin conditions can it detect?",
    answer: "Our AI can detect common skin conditions including acne, eczema, psoriasis, and potential signs of skin cancer. However, always consult a healthcare professional for definitive diagnosis."
  }
];

export default function FAQ() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">
            Get answers to common questions about our service
          </p>
        </motion.div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}