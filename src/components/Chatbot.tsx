import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Mic, MicOff, Send } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface Message {
  content: string;
  sender: 'user' | 'bot';
}

export const Chatbot = ({ imageAnalysis }: { imageAnalysis?: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageAnalysis) {
      setMessages(prev => [...prev, {
        content: `I've analyzed your image. ${imageAnalysis}`,
        sender: 'bot'
      }]);
    }
  }, [imageAnalysis]);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { content: input, sender: 'user' }]);
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        content: "I'm a demo chatbot. In the full version, I'll provide detailed responses about skin conditions.",
        sender: 'bot'
      }]);
    }, 1000);
    setInput('');
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In full version, implement actual voice recording
    if (!isRecording) {
      toast({
        title: "Voice Recording",
        description: "Voice recording feature will be available in the full version"
      });
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="flex flex-col h-[600px]">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">AI Assistant</h2>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Button
            variant={isRecording ? "destructive" : "outline"}
            size="icon"
            onClick={toggleRecording}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};