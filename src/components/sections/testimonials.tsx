import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1580281780460-82d277b0e3f8",
    content: "The AI analysis was surprisingly accurate. It helped me understand my skin condition better."
  },
  {
    name: "Dr. Michael Chen",
    role: "Dermatologist",
    image: "https://images.unsplash.com/photo-1676286168358-9b4ce60384d4",
    content: "As a dermatologist, I'm impressed by the accuracy of the AI diagnostics. It's a great screening tool."
  },
  {
    name: "Emily Rodriguez",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1576671081741-c538eafccfff",
    content: "Quick, easy, and informative. Saved me time and unnecessary doctor visits."
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">What People Say</h2>
          <p className="text-xl text-gray-600">
            Trusted by patients and professionals alike
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-600">{testimonial.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
