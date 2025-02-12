import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Mic, MicOff, Send, Loader2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { useToast } from "@/hooks/use-toast";

interface Message {
  content: string;
  sender: 'user' | 'bot';
  error?: boolean;
}

export const Chatbot = ({ imageAnalysis }: { imageAnalysis?: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
 // const recognitionRef = useRef<SpeechRecognition | null>(null);

  const CHATBOT_ENDPOINT = "http://localhost:5001/api/chatbot";

  useEffect(() => {
    if (imageAnalysis) {
      setMessages(prev => [
        ...prev,
        { content: `I've analyzed your image. ${imageAnalysis}`, sender: 'bot' }
      ]);
    }
  }, [imageAnalysis]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message immediately
    setMessages(prev => [...prev, { content: userMessage, sender: 'user' }]);

    try {
      const response = await fetch(CHATBOT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          message: userMessage, 
          imageAnalysis 
        }),
        credentials: 'include' // Include cookies if needed
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.response) {
        throw new Error('Invalid response format from server');
      }

      setMessages(prev => [...prev, { content: data.response, sender: 'bot' }]);
    } catch (error) {
      console.error('Chatbot Error:', error);
      
      // Show error toast
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to connect to the chatbot",
        variant: "destructive"
      });

      // Add error message to chat
      setMessages(prev => [
        ...prev,
        { 
          content: "Sorry, I'm having trouble connecting. Please try again.", 
          sender: 'bot',
          error: true 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(prev => !prev);
    if (!isRecording) {
      toast({
        title: "Voice Recording",
        description: "Voice recording feature will be available in the full version",
      });
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="flex flex-col h-[600px]">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">AI Assistant</h2>
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
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
                    : message.error 
                      ? 'bg-destructive/10 text-destructive'
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
            disabled={isLoading}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
