import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Languages
} from 'lucide-react';
import { UserProfile } from '../types';

interface AssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  currentLanguage: string;
  onChangeLanguage: (lang: string) => void;
  onNavigateTab: (tab: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AssistantDrawer: React.FC<AssistantDrawerProps> = ({
  isOpen,
  onClose,
  user,
  currentLanguage,
  onChangeLanguage,
  onNavigateTab
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello ${user.name}! I am your AI Campus Assistant. You can speak or type in ${currentLanguage}. I can answer questions about academic schedules, document requests, hostel rules, verify deceptive course claims on PromiseCheck, or check CampusFind.`,
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Voice speech synthesis helper
  const speakText = (text: string) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      if (currentLanguage === 'Hindi') utterance.lang = 'hi-IN';
      else if (currentLanguage === 'Spanish') utterance.lang = 'es-ES';
      else if (currentLanguage === 'French') utterance.lang = 'fr-FR';
      else if (currentLanguage === 'Telugu') utterance.lang = 'te-IN';
      else utterance.lang = 'en-US';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  // Web Speech recognition setup
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      if (currentLanguage === 'Hindi') recognition.lang = 'hi-IN';
      else if (currentLanguage === 'Spanish') recognition.lang = 'es-ES';
      else if (currentLanguage === 'French') recognition.lang = 'fr-FR';
      else if (currentLanguage === 'Telugu') recognition.lang = 'te-IN';
      else recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        // Automatically send voice query
        handleSend(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language: currentLanguage,
          conversationHistory: messages,
          userContext: {
            name: user.name,
            rollNo: user.rollNo,
            dept: user.department,
            year: user.year,
            hostel: user.hostelBlock
          }
        })
      });

      const data = await response.json();
      const reply = data.reply || "I am here to assist with campus requests, academic info, or PromiseCheck claims.";
      
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
      speakText(reply);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: "I experienced a connection hitch, but as your Campus Assistant: you can download Bonafides in 'Documents', submit grievances under 'Complaints', or audit suspicious coaching ads with 'PromiseCheck AI'!",
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const PROMPT_SUGGESTIONS = [
    { label: 'How to get a Bonafide Certificate?', tab: 'documents' },
    { label: 'What are the hostel night outpass rules?', tab: 'hostel' },
    { label: 'Audit a 100% placement coaching ad', tab: 'promisecheck' },
    { label: 'Report a lost item on CampusFind', tab: 'campusfind' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs transition-opacity">
      <div className="bg-[#FFFDF9] border-l-2 border-slate-900 w-full max-w-md h-full flex flex-col shadow-2xl text-slate-950">
        {/* Header */}
        <div className="p-4 border-b-2 border-slate-900 flex items-center justify-between bg-yellow-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-yellow-300 border-2 border-slate-900 flex items-center justify-center text-slate-950 shadow-[2px_2px_0px_#0f172a]">
              <Bot className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-slate-950">AI Campus Assistant</h3>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-900" />
              </div>
              <p className="text-[11px] text-slate-700 font-bold">Voice &amp; Multilingual Campus Companion</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              title={ttsEnabled ? 'Voice Read-aloud ON' : 'Voice Read-aloud OFF'}
              className={`p-2 rounded-xl border-2 border-slate-900 transition-all cursor-pointer ${
                ttsEnabled ? 'text-slate-950 bg-yellow-300 shadow-[1.5px_1.5px_0px_#0f172a]' : 'text-slate-600 bg-white hover:bg-slate-100'
              }`}
            >
              {ttsEnabled ? <Volume2 className="w-4 h-4 stroke-[2.5]" /> : <VolumeX className="w-4 h-4 stroke-[2.5]" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border-2 border-slate-900 text-slate-950 bg-white hover:bg-yellow-300 shadow-[1.5px_1.5px_0px_#0f172a] transition-all cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Language Pill Bar */}
        <div className="px-4 py-2.5 bg-yellow-50 border-b-2 border-slate-900 flex items-center gap-2 text-xs overflow-x-auto">
          <Languages className="w-4 h-4 text-slate-900 shrink-0 stroke-[2.5]" />
          {['English', 'Hindi', 'Spanish', 'French', 'Telugu'].map((lang) => (
            <button
              key={lang}
              onClick={() => onChangeLanguage(lang)}
              className={`px-3 py-1 rounded-full text-[11px] font-black transition-all shrink-0 border-2 border-slate-900 cursor-pointer ${
                currentLanguage === lang
                  ? 'bg-yellow-300 text-slate-950 shadow-[1.5px_1.5px_0px_#0f172a]'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FFFDF9]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a] ${
                  m.sender === 'user'
                    ? 'bg-yellow-300 text-slate-950'
                    : 'bg-white text-slate-950'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4 stroke-[2.5]" /> : <Bot className="w-4 h-4 stroke-[2.5]" />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] ${
                  m.sender === 'user'
                    ? 'bg-yellow-300 text-slate-950 font-bold rounded-tr-xs'
                    : 'bg-white text-slate-900 font-medium rounded-tl-xs whitespace-pre-wrap'
                }`}
              >
                {m.text}
                <div
                  className={`text-[10px] mt-1.5 text-right font-bold ${
                    m.sender === 'user' ? 'text-slate-700' : 'text-slate-500'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2.5 text-slate-700 text-xs py-1">
              <div className="w-7 h-7 rounded-xl bg-white border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a] flex items-center justify-center text-slate-950">
                <Bot className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="flex items-center gap-1.5 bg-yellow-100 px-3 py-2 rounded-xl border-2 border-slate-900 shadow-[1.5px_1.5px_0px_#0f172a] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-spin stroke-[2.5]" />
                <span>Generating campus guidance...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Quick Chips */}
        <div className="px-4 py-2.5 border-t-2 border-slate-900 bg-yellow-50">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
            Quick Queries
          </p>
          <div className="flex flex-wrap gap-1.5">
            {PROMPT_SUGGESTIONS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  handleSend(item.label);
                  if (item.tab) onNavigateTab(item.tab);
                }}
                className="text-[11px] px-2.5 py-1 rounded-xl bg-white hover:bg-yellow-200 text-slate-950 border-2 border-slate-900 font-bold shadow-[1.5px_1.5px_0px_#0f172a] transition-all text-left cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar with Voice Button */}
        <div className="p-3 border-t-2 border-slate-900 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-xl border-2 border-slate-900 transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-400 text-slate-950 animate-pulse shadow-[2px_2px_0px_#0f172a]'
                  : 'bg-yellow-300 text-slate-950 hover:bg-yellow-400 shadow-[2px_2px_0px_#0f172a]'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Click to Speak'}
            >
              <Mic className="w-4 h-4 stroke-[2.5]" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? 'Listening to speech...' : `Ask anything in ${currentLanguage}...`}
              className="flex-1 bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-950 font-bold focus:outline-none focus:bg-yellow-50 placeholder-slate-500 shadow-[1.5px_1.5px_0px_#0f172a]"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 rounded-xl neo-btn bg-yellow-300 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 shadow-[2px_2px_0px_#0f172a]"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
          {isListening && (
            <p className="text-[10px] text-rose-600 mt-1 text-center font-black animate-pulse">
              ● Recording audio... Speak clearly into your microphone
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
