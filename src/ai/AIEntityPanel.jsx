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
  AlertCircle,
  Cpu,
  Layers,
  ChevronDown,
  ChevronUp,
  Minus,
  ExternalLink,
  CheckCircle2,
  Activity,
  Terminal
} from 'lucide-react';
import { sendChatMessage, synthesiseSpeech } from './api';
import { useVoiceInput } from './useVoiceInput';

const AGENT_PROMPTS = [
  "Compare Gym Trainer and LexAI",
  "Open the LexAI-India Project World",
  "What are your verified AI & Python skills?",
  "Take me to the Projects section",
  "How can I email Niranjan?"
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
      content: "Hello! I am Niranjan's Agentic AI Assistant. I have active tools to navigate sections, open immersive Project Worlds, compare research architectures, explore verified technical skills, and provide verified contact endpoints. How may I assist you?",
      agent_trace: null
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [captions, setCaptions] = useState('');
  const [expandedTraceIdx, setExpandedTraceIdx] = useState(null);
  const [currentExecutionStage, setCurrentExecutionStage] = useState(null);

  const chatContainerRef = useRef(null);
  const currentAudioRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll chat transcript to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, captions, entityState, currentExecutionStage]);

  // Focus input on panel open or un-minimize
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 250);
    } else {
      stopAudio();
    }
  }, [isOpen, isMinimized]);

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

    // Agentic lifecycle
    onEntityStateChange?.('thinking');
    setCurrentExecutionStage('Analyzing intent & evaluating portfolio tools...');

    try {
      const response = await sendChatMessage(
        newHistory.map(m => ({ role: m.role, content: m.content }))
      );

      // Inspect agent trace from backend
      if (response.agent_trace && response.agent_trace.length > 0) {
        const toolStep = response.agent_trace.find(s => s.stage === 'tool_selection');
        if (toolStep) {
          setCurrentExecutionStage(`Executing tool: ${toolStep.tool}()...`);
          onEntityStateChange?.('tool_execution');
        }
      }

      const replyText = response.reply || "Agent task evaluated.";
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: replyText,
          agent_trace: response.agent_trace || null,
          action: response.action || null
        }
      ]);

      // Execute actions returned by the agent tools
      if (response.action) {
        if (response.action.action === 'open_project_world') {
          const targetPid = response.action.target;
          window.dispatchEvent(new CustomEvent('open-project-world', { detail: { projectId: targetPid } }));
        } else if (response.action.action === 'navigate' && response.action.section) {
          const targetEl = document.getElementById(response.action.section);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }

      setCurrentExecutionStage(null);

      // Voice output if not muted
      if (!isMuted) {
        onEntityStateChange?.('speaking');
        setCaptions(replyText.slice(0, 160) + '...');
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
          setCaptions('');
          onEntityStateChange?.('idle');
        }
      } else {
        onEntityStateChange?.('idle');
      }

    } catch (err) {
      console.error('Agent chat error:', err);
      setCurrentExecutionStage(null);
      const errMsg = err?.message || 'Agent communication error';
      setErrorMessage(`Communication Issue: ${errMsg}`);
      onEntityStateChange?.('error');
      setTimeout(() => {
        onEntityStateChange?.('idle');
      }, 5000);
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

  if (!isOpen) return null;

  // Minimized Compact Floating Badge
  if (isMinimized) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.85, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 15 }}
        onClick={() => setIsMinimized(false)}
        className="fixed right-4 bottom-4 z-50 flex items-center space-x-2.5 px-4 py-2.5 rounded-full bg-black/90 border border-cyan-glow/50 text-white shadow-[0_0_25px_rgba(0,229,255,0.35)] backdrop-blur-xl cursor-pointer hover:border-cyan-glow hover:scale-105 transition-all font-mono text-xs"
        aria-label="Expand NIRANJAN.AI Assistant"
      >
        <span className={`w-2 h-2 rounded-full ${
          entityState === 'speaking' ? 'bg-cyan-glow animate-bounce' :
          entityState === 'thinking' ? 'bg-amber-400 animate-pulse' :
          entityState === 'error' ? 'bg-rose-500' :
          'bg-cyan-glow animate-pulse'
        }`} />
        <span className="font-bold tracking-wider">NIRANJAN.AI AGENT</span>
        <ChevronUp className="w-3.5 h-3.5 text-cyan-glow" />
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="fixed right-3 bottom-3 sm:right-6 sm:bottom-6 w-[calc(100vw-24px)] sm:w-[410px] h-[520px] max-h-[calc(100vh-90px)] z-50 flex flex-col bg-black/95 backdrop-blur-2xl rounded-2xl border border-cyan-glow/40 shadow-[0_10px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(0,229,255,0.2)] overflow-hidden font-sans"
        role="dialog"
        aria-modal="true"
        aria-label="Agentic AI Assistant Interface"
      >
        {/* Header HUD Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02] flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="relative">
              <div className="w-7 h-7 rounded-lg bg-cyan-glow/10 border border-cyan-glow/40 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-cyan-glow" />
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-black ${
                  entityState === 'listening' ? 'bg-emerald-400 animate-ping' :
                  entityState === 'thinking' ? 'bg-amber-400 animate-pulse' :
                  entityState === 'tool_execution' ? 'bg-purple-400 animate-ping' :
                  entityState === 'speaking' ? 'bg-cyan-glow animate-bounce' :
                  entityState === 'error' ? 'bg-rose-500' :
                  'bg-cyan-glow'
                }`}
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-white tracking-wider">NIRANJAN.AI AGENT</span>
                <span className="text-[8px] font-mono px-1 py-0.2 rounded border border-cyan-glow/40 text-cyan-glow bg-cyan-glow/10 uppercase">
                  {entityState}
                </span>
              </div>
              <div className="text-[9px] font-mono text-zinc-400">
                5 PORTFOLIO-SCOPED TOOLS ACTIVE
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {/* Audio Toggle */}
            <button
              onClick={() => {
                if (!isMuted && currentAudioRef.current) stopAudio();
                setIsMuted(!isMuted);
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                isMuted ? 'text-zinc-500 hover:text-zinc-300 bg-white/5' : 'text-cyan-glow bg-cyan-glow/10 border border-cyan-glow/30'
              }`}
              title={isMuted ? "Unmute Voice Output" : "Mute Voice Output"}
              aria-label={isMuted ? "Unmute Voice Output" : "Mute Voice Output"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Stop Speaking Button */}
            {entityState === 'speaking' && (
              <button
                onClick={stopAudio}
                className="p-1.5 rounded-lg text-amber-400 bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20 transition-colors"
                title="Interrupt Voice"
                aria-label="Stop Speaking"
              >
                <Square className="w-3.5 h-3.5 fill-amber-400" />
              </button>
            )}

            {/* Minimize Button */}
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Minimize Panel"
              aria-label="Minimize AI Panel"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Close Panel"
              aria-label="Close AI Panel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Execution Activity Banner */}
        {currentExecutionStage && (
          <div className="px-4 py-1.5 bg-purple-500/10 border-b border-purple-500/30 flex items-center justify-between flex-shrink-0">
            <span className="text-[10px] font-mono text-purple-300 flex items-center space-x-1.5 truncate pr-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping flex-shrink-0" />
              <span className="truncate">{currentExecutionStage}</span>
            </span>
            <span className="text-[9px] font-mono text-purple-400 flex-shrink-0">LOOP</span>
          </div>
        )}

        {/* Speaking Captions HUD */}
        {entityState === 'speaking' && captions && (
          <div className="px-4 py-1.5 bg-cyan-500/10 border-b border-cyan-500/30 flex items-center justify-between flex-shrink-0">
            <span className="text-[10px] font-mono text-cyan-300 flex items-center space-x-1.5 truncate pr-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-pulse flex-shrink-0" />
              <span className="truncate">VOCAL // "{captions}"</span>
            </span>
            <button
              onClick={stopAudio}
              className="text-[9px] font-mono text-cyan-400 underline hover:text-white flex-shrink-0"
            >
              STOP
            </button>
          </div>
        )}

        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="px-4 py-1.5 bg-rose-500/10 border-b border-rose-500/30 text-[10px] font-mono text-rose-300 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-1.5 truncate pr-2">
              <AlertCircle className="w-3 h-3 flex-shrink-0 text-rose-400" />
              <span className="truncate">{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white text-[9px] uppercase font-bold"
            >
              DISMISS
            </button>
          </div>
        )}

        {/* Conversation Transcript (Independently Scrollable) */}
        <div
          ref={chatContainerRef}
          className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-3.5 scroll-smooth"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-5 h-5 rounded bg-cyan-glow/10 border border-cyan-glow/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-3 h-3 text-cyan-glow" />
                </div>
              )}

              <div
                className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed space-y-1.5 ${
                  msg.role === 'user'
                    ? 'bg-cyan-glow/15 border border-cyan-glow/40 text-cyan-50 rounded-br-sm'
                    : 'bg-white/5 border border-white/10 text-zinc-200 rounded-bl-sm'
                }`}
              >
                <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                  <span>{msg.role === 'user' ? 'YOU' : 'NIRANJAN.AI AGENT'}</span>
                  {msg.action && (
                    <span className="text-cyan-glow font-bold">
                      ACTION: {msg.action.action}
                    </span>
                  )}
                </div>

                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Expandable Agent Execution Trace */}
                {msg.agent_trace && msg.agent_trace.length > 0 && (
                  <div className="pt-2 border-t border-white/10 space-y-1">
                    <button
                      onClick={() => setExpandedTraceIdx(expandedTraceIdx === idx ? null : idx)}
                      className="text-[9px] font-mono text-cyan-glow/90 hover:text-cyan-glow flex items-center space-x-1 cursor-pointer"
                    >
                      <span>AGENT EXECUTION TRACE ({msg.agent_trace.length} STEPS)</span>
                      {expandedTraceIdx === idx ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {expandedTraceIdx === idx && (
                      <div className="p-2 rounded-lg bg-black/80 border border-white/10 space-y-1.5 text-[9px] font-mono">
                        {msg.agent_trace.map((step, sIdx) => (
                          <div key={sIdx} className="space-y-0.5 border-b border-white/5 pb-1 last:border-0 last:pb-0">
                            <div className="flex items-center justify-between text-zinc-400">
                              <span className="text-cyan-glow font-bold">STEP 0{step.step} // {step.title}</span>
                              <span className="text-emerald-400 font-semibold">{step.status}</span>
                            </div>
                            {step.detail && <div className="text-zinc-300">{step.detail}</div>}
                            {step.tool && (
                              <div className="text-zinc-500">
                                TOOL: <span className="text-white">{step.tool}</span>
                                {step.args && <span> (ARGS: {JSON.stringify(step.args)})</span>}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-5 h-5 rounded bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          ))}

          {entityState === 'thinking' && (
            <div className="flex items-start space-x-2 justify-start">
              <div className="w-5 h-5 rounded bg-cyan-glow/10 border border-cyan-glow/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-3 h-3 text-cyan-glow" />
              </div>
              <div className="px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs text-zinc-400 flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-ping" />
                <span className="font-mono text-[10px]">REASONING WITH VERIFIED PORTFOLIO TOOLS...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Agent Prompts Carousel */}
        <div className="px-4 py-2 border-t border-white/5 bg-black/60 overflow-x-auto no-scrollbar flex items-center space-x-2 flex-shrink-0">
          <span className="text-[9px] font-mono text-zinc-500 uppercase flex-shrink-0">PROMPTS:</span>
          {AGENT_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleUserSend(prompt)}
              className="text-[10px] font-mono whitespace-nowrap px-2.5 py-0.5 rounded-full border border-white/10 bg-white/5 text-zinc-300 hover:text-cyan-glow hover:border-cyan-glow/40 hover:bg-cyan-glow/10 transition-all flex-shrink-0 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Command Line */}
        <div className="p-3 border-t border-white/10 bg-white/[0.02] flex-shrink-0">
          <div className="flex items-center space-x-2 bg-black/70 border border-white/15 rounded-xl px-2.5 py-1 focus-within:border-cyan-glow/60 transition-colors">

            {/* Microphone Button */}
            <button
              type="button"
              onClick={toggleMic}
              className={`p-1.5 rounded-lg transition-all flex-shrink-0 ${
                listening
                  ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                  : 'text-zinc-400 hover:text-cyan-glow hover:bg-white/5'
              }`}
              title={listening ? "Stop Listening" : "Speak to Agent (Voice Input)"}
              aria-label={listening ? "Stop Voice Input" : "Start Voice Input"}
            >
              {listening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>

            {/* Text Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={listening ? "Listening... (or type command)" : "Ask agent to open a project world, compare, or navigate..."}
              className="flex-1 bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none py-1 font-mono"
            />

            {/* Send Button */}
            <button
              type="button"
              onClick={() => handleUserSend()}
              disabled={!inputValue.trim() || entityState === 'thinking'}
              className="p-1.5 rounded-lg bg-cyan-glow text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-cyan-300 transition-colors flex-shrink-0 cursor-pointer"
              aria-label="Send agent command"
            >
              <CornerDownLeft className="w-3 h-3 stroke-[2.5]" />
            </button>

          </div>

          <div className="flex items-center justify-between pt-1.5 px-1 text-[8px] font-mono text-zinc-500">
            <span>5 TOOLS ACTIVE</span>
            <span>INTENT ENGINE // REAL-TIME</span>
          </div>
        </div>

      </motion.div>
    </AnimatePresence>
  );
}
