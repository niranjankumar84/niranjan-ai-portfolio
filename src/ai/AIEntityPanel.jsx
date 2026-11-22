import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Send, 
  X, 
  Volume2, 
  VolumeX, 
  Square, 
  RefreshCw, 
  Sparkles, 
  Bot, 
  User, 
  CornerDownLeft,
  AlertCircle
} from 'lucide-react';
import { sendChatMessage, synthesiseSpeech } from './api';
import { useVoiceInput } from './useVoiceInput';

const SUGGESTED_PROMPTS = [
  "Who is Niranjan Kumar?",
  "What projects has Niranjan built?",
  "What are Niranjan's core AI skills?",
  "How can I contact Niranjan?"
];

export default function AIEntityPanel({ 
  isOpen, 
  onClose, 
  entityState = 'idle', 
  onEntityStateChange 
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am Niranjan's Mechanical AI Entity. I can tell you about Niranjan's background, projects, skills, education at BIT Mesra, and aspirations in AI. How may I assist you today?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [captions, setCaptions] = useState('');

  const chatContainerRef = useRef(null);
  const currentAudioRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll chat transcript to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, captions, entityState]);

  // Focus input on panel open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      stopAudio();
    }
  }, [isOpen]);

  const stopAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.src = '';
      currentAudioRef.current = null;
    }
    setCaptions('');
    if (entityState === 'speaking') {
      onEntityStateChange?.('idle');
    }
  }, [entityState, onEntityStateChange]);

  // Speech Recognition hook
  const { listening, supported: micSupported, startListening, stopListening } = useVoiceInput({
    onTranscript: (transcript) => {
      if (transcript) {
        handleUserSend(transcript);
      }
    },
    onError: (err) => {
      setErrorMessage(err);
      onEntityStateChange?.('error');
      setTimeout(() => {
        onEntityStateChange?.('idle');
        setErrorMessage(null);
      }, 5000);
    }
  });

  // Keep entityState in sync when voice recognition is active
  useEffect(() => {
    if (listening) {
      onEntityStateChange?.('listening');
    } else if (entityState === 'listening') {
      onEntityStateChange?.('idle');
    }
  }, [listening]);

  const handleUserSend = async (userText) => {
    const text = (userText || inputValue).trim();
    if (!text) return;

    stopAudio();
    setInputValue('');
    setErrorMessage(null);

    const newHistory = [...messages, { role: 'user', content: text }];
    setMessages(newHistory);
    onEntityStateChange?.('thinking');

    try {
      const response = await sendChatMessage(
        newHistory.map(m => ({ role: m.role, content: m.content }))
      );

      const replyText = response.reply || "I am processing your inquiry.";
      setMessages(prev => [...prev, { role: 'assistant', content: replyText }]);

      // Execute navigational action if recommended
      if (response.action && response.action.section) {
        const targetEl = document.getElementById(response.action.section);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }

      // Voice output if not muted
      if (!isMuted) {
        onEntityStateChange?.('speaking');
        setCaptions(replyText);
        try {
          const audioUrl = await synthesiseSpeech(replyText);
          const audio = new Audio(audioUrl);
          currentAudioRef.current = audio;

          audio.onended = () => {
            currentAudioRef.current = null;
            setCaptions('');
            onEntityStateChange?.('idle');
          };

          audio.onerror = () => {
            currentAudioRef.current = null;
            setCaptions('');
            onEntityStateChange?.('idle');
          };

          await audio.play();
        } catch (audioErr) {
          console.warn('TTS playback error, continuing in text-only mode:', audioErr);
          setCaptions('');
          onEntityStateChange?.('idle');
        }
      } else {
        onEntityStateChange?.('idle');
      }

    } catch (err) {
      console.error('Chat error:', err);
      // Fallback response if backend is offline
      const fallbackReply = "The AI backend service is currently in offline mode. Niranjan Kumar is a Software Engineer with AI studying BCA at BIT Mesra (2024-2027), focused on building practical technology solutions using Python, Machine Learning, and Modern Web Engineering. Feel free to explore his projects and contact him directly via the links below!";
      setMessages(prev => [...prev, { role: 'assistant', content: fallbackReply }]);
      setErrorMessage("Backend offline: display local verified profile telemetry.");
      onEntityStateChange?.('idle');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserSend();
    }
  };

  const toggleMic = () => {
    if (listening) {
      stopListening();
    } else {
      stopAudio();
      startListening();
    }
  };

  const handlePromptClick = (prompt) => {
    handleUserSend(prompt);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-4 bottom-4 md:inset-auto md:right-8 md:bottom-8 md:w-[460px] max-h-[85vh] h-[640px] z-50 flex flex-col bg-black/90 backdrop-blur-2xl rounded-2xl border border-cyan-glow/30 shadow-[0_10px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(0,229,255,0.15)] overflow-hidden font-sans"
        role="dialog"
        aria-label="Mechanical AI Entity Conversation"
      >
        {/* Header HUD */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-cyan-glow/10 border border-cyan-glow/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-cyan-glow" />
              </div>
              <span 
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-black ${
                  entityState === 'listening' ? 'bg-emerald-400 animate-ping' :
                  entityState === 'thinking' ? 'bg-amber-400 animate-pulse' :
                  entityState === 'speaking' ? 'bg-cyan-glow animate-bounce' :
                  entityState === 'error' ? 'bg-rose-500' :
                  'bg-cyan-glow'
                }`} 
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-white tracking-wider">NIRANJAN.AI ENTITY</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-cyan-glow/40 text-cyan-glow bg-cyan-glow/10 uppercase">
                  {entityState}
                </span>
              </div>
              <div className="text-[10px] font-mono text-zinc-400">
                {entityState === 'listening' ? 'LISTENING // MICROPHONE ACTIVE' :
                 entityState === 'thinking' ? 'PROCESSING INTENT SYNAPSE...' :
                 entityState === 'speaking' ? 'TRANSMITTING SPOKEN VOCALS...' :
                 'CONVERSATIONAL INTELLIGENCE'}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Audio Toggle */}
            <button
              onClick={() => {
                if (!isMuted && currentAudioRef.current) stopAudio();
                setIsMuted(!isMuted);
              }}
              className={`p-2 rounded-lg transition-colors ${
                isMuted ? 'text-zinc-500 hover:text-zinc-300 bg-white/5' : 'text-cyan-glow bg-cyan-glow/10 border border-cyan-glow/30'
              }`}
              title={isMuted ? "Unmute Voice Responses" : "Mute Voice Responses"}
              aria-label={isMuted ? "Unmute Voice Responses" : "Mute Voice Responses"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Stop Audio Button (visible when speaking) */}
            {entityState === 'speaking' && (
              <button
                onClick={stopAudio}
                className="p-2 rounded-lg text-amber-400 bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20 transition-colors"
                title="Interrupt / Stop Voice"
                aria-label="Stop Speaking"
              >
                <Square className="w-4 h-4 fill-amber-400" />
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close AI Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Status Banner / Waveform */}
        {entityState === 'listening' && (
          <div className="px-5 py-2 bg-emerald-500/10 border-b border-emerald-500/30 flex items-center justify-between">
            <span className="text-[11px] font-mono text-emerald-400 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LISTENING... SPEAK YOUR QUESTION</span>
            </span>
            <div className="flex items-center space-x-1">
              <span className="w-1 h-3 bg-emerald-400 animate-pulse" />
              <span className="w-1 h-4 bg-emerald-400 animate-pulse delay-75" />
              <span className="w-1 h-2 bg-emerald-400 animate-pulse delay-150" />
              <span className="w-1 h-5 bg-emerald-400 animate-pulse" />
            </div>
          </div>
        )}

        {entityState === 'speaking' && captions && (
          <div className="px-5 py-2 bg-cyan-500/10 border-b border-cyan-500/30 flex items-center justify-between">
            <span className="text-[11px] font-mono text-cyan-300 flex items-center space-x-2 truncate pr-2">
              <span className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse flex-shrink-0" />
              <span className="truncate">VOCAL // "{captions}"</span>
            </span>
            <button
              onClick={stopAudio}
              className="text-[10px] font-mono text-cyan-400 underline hover:text-white flex-shrink-0"
            >
              STOP
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="px-5 py-2 bg-rose-500/10 border-b border-rose-500/30 text-[11px] font-mono text-rose-300 flex items-center space-x-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{errorMessage}</span>
          </div>
        )}

        {/* Conversation Transcript */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scroll-smooth"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-6 h-6 rounded-md bg-cyan-glow/10 border border-cyan-glow/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-cyan-glow" />
                </div>
              )}

              <div
                className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-cyan-glow/15 border border-cyan-glow/40 text-cyan-50 rounded-br-sm'
                    : 'bg-white/5 border border-white/10 text-zinc-200 rounded-bl-sm'
                }`}
              >
                <div className="text-[9px] font-mono uppercase tracking-wider mb-1 text-zinc-400">
                  {msg.role === 'user' ? 'YOU' : 'NIRANJAN.AI'}
                </div>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>

              {msg.role === 'user' && (
                <div className="w-6 h-6 rounded-md bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
          ))}

          {entityState === 'thinking' && (
            <div className="flex items-start space-x-2.5 justify-start">
              <div className="w-6 h-6 rounded-md bg-cyan-glow/10 border border-cyan-glow/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-cyan-glow" />
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-zinc-400 flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-ping" />
                <span className="font-mono text-[10px]">REASONING WITH VERIFIED TELEMETRY...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Prompts Pill Carousel */}
        <div className="px-5 py-2 border-t border-white/5 bg-black/40 overflow-x-auto no-scrollbar flex items-center space-x-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase flex-shrink-0">PROMPTS:</span>
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(prompt)}
              className="text-[11px] font-mono whitespace-nowrap px-3 py-1 rounded-full border border-white/10 bg-white/5 text-zinc-300 hover:text-cyan-glow hover:border-cyan-glow/40 hover:bg-cyan-glow/10 transition-all flex-shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02]">
          <div className="flex items-center space-x-2 bg-black/60 border border-white/15 rounded-xl px-3 py-1.5 focus-within:border-cyan-glow/60 transition-colors">
            
            {/* Microphone Button */}
            <button
              type="button"
              onClick={toggleMic}
              className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                listening 
                  ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.5)]' 
                  : 'text-zinc-400 hover:text-cyan-glow hover:bg-white/5'
              }`}
              title={listening ? "Stop Listening" : "Speak to AI (Voice Input)"}
              aria-label={listening ? "Stop Voice Input" : "Start Voice Input"}
            >
              {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Text Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={listening ? "Listening... (or type here)" : "Ask about Niranjan's background, skills..."}
              className="flex-1 bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none py-1.5"
            />

            {/* Send Button */}
            <button
              type="button"
              onClick={() => handleUserSend()}
              disabled={!inputValue.trim() || entityState === 'thinking'}
              className="p-2 rounded-lg bg-cyan-glow text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-cyan-300 transition-colors flex-shrink-0"
              aria-label="Send message"
            >
              <CornerDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

          </div>

          <div className="flex items-center justify-between pt-2 px-1 text-[9px] font-mono text-zinc-500">
            <span>MIC // EXPLICIT USER ACTIVATION</span>
            <span>VOICE // NATURAL US-ENGLISH NEURAL</span>
          </div>
        </div>

      </motion.div>
    </AnimatePresence>
  );
}
