"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, X, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function JarvisAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Good day, Sir. How may I assist you? Try asking me about your net worth, habits, trades, or decisions.' }
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Speech Recognition instance
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          handleCommand(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 0.9;
      utterance.rate = 1.0;
      // Optionally find an english voice
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith('en-GB') || v.lang.startsWith('en-US'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Speech recognition is not supported in this browser.");
      }
    }
  };

  const handleCommand = async (command: string) => {
    if (!command.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: command };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    const lowerCmd = command.toLowerCase();
    let responseText = "I'm sorry, I didn't quite catch that. Try asking about your net worth, habits, trades, or decisions.";

    try {
      if (lowerCmd.includes("net worth") || lowerCmd.includes("money") || lowerCmd.includes("cash")) {
        const res = await fetch('/api/networth');
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            const latest = data[data.length - 1];
            responseText = `Your current net worth is $${latest.totalValue.toLocaleString()}. You have $${latest.liquidCash.toLocaleString()} in liquid cash.`;
          } else {
            responseText = "You haven't logged any net worth snapshots yet, Sir.";
          }
        }
      } 
      else if (lowerCmd.includes("habit") || lowerCmd.includes("routine")) {
        const res = await fetch('/api/habits');
        if (res.ok) {
          const data = await res.json();
          const completed = data.filter((h: any) => h.completed).length;
          responseText = `You have completed ${completed} out of ${data.length} habits today.`;
        }
      }
      else if (lowerCmd.includes("decision") || lowerCmd.includes("choice")) {
        const res = await fetch('/api/decisions');
        if (res.ok) {
          const data = await res.json();
          const open = data.filter((d: any) => d.status === 'OPEN').length;
          responseText = `You currently have ${open} open decisions pending review.`;
        }
      }
      else if (lowerCmd.includes("trade") || lowerCmd.includes("market") || lowerCmd.includes("streak")) {
        const res = await fetch('/api/trades');
        if (res.ok) {
          const data = await res.json();
          let streak = 0;
          for (let i = 0; i < data.length; i++) {
            if (Number(data[i].pnl) > 0) {
              streak++;
            } else {
              break;
            }
          }
          if (data.length === 0) {
            responseText = "You haven't logged any trades recently, Sir.";
          } else if (streak > 0) {
            responseText = `You are on a ${streak} trade win streak. Keep it up.`;
          } else {
            responseText = `Your last trade was a loss. I advise caution before entering the next position.`;
          }
        }
      }
      else if (lowerCmd.includes("clear") || lowerCmd.includes("reset")) {
        setMessages([{ id: '1', role: 'assistant', content: 'Chat cleared. How may I assist you?' }]);
        setIsThinking(false);
        return;
      }
    } catch (e) {
      console.error(e);
      responseText = "I'm having trouble connecting to your databases right now, Sir.";
    }

    const aiMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: responseText };
    setMessages(prev => [...prev, aiMessage]);
    speak(responseText);
    setIsThinking(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-white text-black shadow-lg hover:bg-gray-200 hover:scale-105 transition-transform"
          >
            <Bot className="w-6 h-6" />
          </Button>
        )}
      </div>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[500px] bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-gray-300" />
              <h3 className="font-bold uppercase tracking-widest text-sm">J.A.R.V.I.S</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-white text-black' : 'bg-white/10 text-white border border-white/20'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-white text-black rounded-tr-sm' 
                      : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[85%] flex-row">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white/10 text-white border border-white/20">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3 rounded-2xl text-sm bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-white/10 bg-black/50">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={toggleListen}
                className={`shrink-0 border-white/20 ${isListening ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
              >
                {isListening ? <Mic className="w-4 h-4 animate-pulse" /> : <MicOff className="w-4 h-4" />}
              </Button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask JARVIS..."
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-white/30"
              />
              <Button type="submit" disabled={!input.trim() || isThinking} size="icon" className="shrink-0 rounded-full bg-white text-black hover:bg-gray-200">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>

        </div>
      )}
    </>
  );
}
