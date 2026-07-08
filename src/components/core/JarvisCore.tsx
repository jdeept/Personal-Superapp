"use client";

import { useState, useEffect, useRef } from "react";
import { useAppStore } from "@/store/appStore";
import { Mic, MicOff } from "lucide-react";

export function JarvisCore() {
  const { setIsJarvisMode } = useAppStore();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [jarvisResponse, setJarvisResponse] = useState("System Online. Waiting for authorization.");
  
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
          const text = event.results[0][0].transcript;
          setTranscript(text);
          handleCommand(text);
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

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 0.8;
      utterance.rate = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith('en-GB') || v.lang.startsWith('en-US'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCommand = async (command: string) => {
    const lowerCmd = command.toLowerCase();
    
    if (lowerCmd.includes("open") && (lowerCmd.includes("dock") || lowerCmd.includes("dashboard") || lowerCmd.includes("shell"))) {
      const response = "Accessing your dock, Sir.";
      setJarvisResponse(response);
      speak(response);
      
      // Wait for speech to mostly finish before switching views
      setTimeout(() => {
        setIsJarvisMode(false);
      }, 1500);
      return;
    }

    let responseText = "I'm sorry, I didn't quite catch that. Try asking about your net worth, habits, trades, or tell me to open the dock.";

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
    } catch (e) {
      console.error(e);
      responseText = "I'm having trouble connecting to your databases right now, Sir.";
    }

    setJarvisResponse(responseText);
    speak(responseText);
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-cyan-400 overflow-hidden relative">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Arc Reactor / JARVIS Core */}
      <div 
        className="relative flex items-center justify-center cursor-pointer group"
        onClick={toggleListen}
      >
        
        {/* Outer Ring */}
        <div className={`absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-cyan-500/30 border-dashed ${isListening ? 'animate-spin-slow shadow-[0_0_50px_rgba(6,182,212,0.3)]' : ''}`} style={{ animationDuration: '20s' }} />
        
        {/* Middle Ring */}
        <div className={`absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border-[2px] border-cyan-400/50 ${isListening ? 'animate-pulse shadow-[0_0_30px_rgba(6,182,212,0.5)]' : ''}`} />
        
        {/* Inner Core */}
        <div className={`w-40 h-40 sm:w-52 sm:h-52 rounded-full bg-cyan-950/40 border-4 border-cyan-300 shadow-[inset_0_0_20px_rgba(6,182,212,0.8),0_0_20px_rgba(6,182,212,0.8)] flex items-center justify-center backdrop-blur-sm transition-all duration-500 ${isListening ? 'scale-105 bg-cyan-900/60 shadow-[inset_0_0_40px_rgba(6,182,212,1),0_0_40px_rgba(6,182,212,1)]' : 'group-hover:scale-105'}`}>
          {isListening ? (
            <Mic className="w-12 h-12 text-cyan-200 animate-pulse" />
          ) : (
            <MicOff className="w-12 h-12 text-cyan-500/50" />
          )}
        </div>
      </div>

      {/* Text Logs Area */}
      <div className="mt-16 sm:mt-24 text-center max-w-2xl px-6 z-10 space-y-4">
        {transcript && (
          <p className="text-gray-400 italic text-sm sm:text-base uppercase tracking-widest fade-in">
            "{transcript}"
          </p>
        )}
        <p className="text-cyan-300 font-mono text-base sm:text-xl font-bold min-h-[60px] fade-in">
          {jarvisResponse}
        </p>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 text-xs uppercase tracking-widest text-center w-full">
        <p>Tap the core to speak</p>
        <p className="mt-2 text-cyan-500/50">"Open my dock"</p>
      </div>

    </div>
  );
}
