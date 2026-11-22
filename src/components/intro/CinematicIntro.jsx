import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Volume2, VolumeX, SkipForward, Compass, Mic, MicOff } from 'lucide-react';
import { personalData } from '../../data/portfolioData';

/**
 * CinematicIntro — Human-Centered Opening Experience with Voice Narration
 *
 * Voice Experience A: Pre-generated MP3 narration (en-US-ChristopherNeural)
 * synchronised with the four cinematic scenes.
 *
 * Scene 0 → audio/intro_scene1.mp3  "Hello, and welcome."
 * Scene 1 → audio/intro_scene2.mp3  "I'm Niranjan Kumar, a Software Engineer with AI."
 * Scene 2 → audio/intro_scene3.mp3  "I am a curious and adaptable..."
 * Scene 3 → audio/intro_scene4.mp3  "Welcome to my digital world. Let's explore."
 *
 * Rules:
 * - No audio until the visitor explicitly opts in (audio toggle).
 * - Falls back gracefully if audio files fail to load.
 * - Each scene waits for its narration to finish before auto-advancing.
 * - Skip/ESC always works immediately.
 */

const SCENE_AUDIO = [
  '/audio/intro_scene1.mp3',
  '/audio/intro_scene2.mp3',
  '/audio/intro_scene3.mp3',
  '/audio/intro_scene4.mp3',
];

const SCENE_CAPTIONS = [
  'Hello, and welcome.',
  "I'm Niranjan Kumar, a Software Engineer with AI.",
  'I am a curious and adaptable Software Engineer with an interest in Artificial Intelligence. I enjoy understanding complex problems, researching efficient approaches, and turning ideas into practical technology solutions.',
  "Welcome to my digital world. Let's explore.",
];

// Time-budgets used when audio is OFF or fails (ms)
const SCENE_DURATIONS_SILENT = [4000, 4000, 7000, 0];

export default function CinematicIntro({ onComplete }) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isTransitioningOut, setIsTransitioningOut] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [captionVisible, setCaptionVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const canvasRef = useRef(null);
  const audioRef = useRef(null);         // current HTMLAudioElement
  const advanceTimerRef = useRef(null);  // silent-fallback timer
  const sceneRef = useRef(currentScene); // stable ref inside closures

  // Sync ref
  useEffect(() => { sceneRef.current = currentScene; }, [currentScene]);

  // Reduced-motion detection
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const h = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  // Ambient particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const pts = Array.from({ length: 50 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      s: Math.random() * 1.8 + 0.4, vy: -(Math.random() * 0.3 + 0.08),
      vx: (Math.random() - 0.5) * 0.15, o: Math.random() * 0.5 + 0.15,
      cyan: Math.random() > 0.4,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < 0) { p.y = h; p.x = Math.random() * w; }
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fillStyle = p.cyan ? `rgba(0,229,255,${p.o})` : `rgba(255,255,255,${p.o * 0.7})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId); };
  }, []);

  // ── Audio helpers ────────────────────────────────────────────────────────
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    setAudioPlaying(false);
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }, []);

  const advanceScene = useCallback(() => {
    setCurrentScene((prev) => {
      if (prev >= 3) return prev; // scene 3 stays — user clicks "STEP INSIDE"
      return prev + 1;
    });
  }, []);

  const playSceneAudio = useCallback((sceneIdx) => {
    stopAudio();
    const src = SCENE_AUDIO[sceneIdx];
    const audio = new Audio(src);
    audioRef.current = audio;

    audio.onplay = () => setAudioPlaying(true);
    audio.onended = () => {
      setAudioPlaying(false);
      if (sceneIdx < 3) advanceScene(); // auto-advance after narration
    };
    audio.onerror = () => {
      setAudioPlaying(false);
      // Fallback: use silent timer
      if (sceneIdx < 3 && SCENE_DURATIONS_SILENT[sceneIdx] > 0) {
        advanceTimerRef.current = setTimeout(advanceScene, SCENE_DURATIONS_SILENT[sceneIdx]);
      }
    };

    audio.play().catch(() => {
      // Autoplay blocked — user will re-toggle
      setAudioPlaying(false);
    });
  }, [stopAudio, advanceScene]);

  // When voice is toggled or scene changes, manage audio
  useEffect(() => {
    stopAudio();
    if (voiceEnabled && !prefersReducedMotion) {
      playSceneAudio(currentScene);
    } else if (currentScene < 3 && !prefersReducedMotion) {
      // Silent timer for auto-advance
      const duration = SCENE_DURATIONS_SILENT[currentScene];
      if (duration > 0) {
        advanceTimerRef.current = setTimeout(advanceScene, duration);
      }
    }
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScene, voiceEnabled, prefersReducedMotion]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { handleExit(); }
      else if ((e.key === ' ' || e.key === 'ArrowRight') && e.target === document.body) {
        e.preventDefault();
        if (currentScene < 3) {
          stopAudio();
          setCurrentScene((p) => p + 1);
        } else {
          handleExit();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentScene]); // eslint-disable-line

  const handleExit = useCallback(() => {
    stopAudio();
    setIsTransitioningOut(true);
    setTimeout(() => onComplete(), 820);
  }, [stopAudio, onComplete]);

  const handleVoiceToggle = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    if (!next) stopAudio();
  };

  const handleManualSceneClick = (idx) => {
    stopAudio();
    setCurrentScene(idx);
  };

  const sceneTitles = ['THE REVEAL', 'IDENTITY', 'MY STORY', 'ENTER WORLD'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: isTransitioningOut ? 0 : 1,
        scale: isTransitioningOut ? 1.07 : 1,
        filter: isTransitioningOut ? 'blur(14px)' : 'blur(0px)',
      }}
      transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col bg-black text-white select-none overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Cinematic Personal Introduction"
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-55" />

      {/* Studio lighting beam */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_38%,rgba(0,229,255,0.09)_0%,rgba(0,0,0,0.75)_55%,#000_100%)] z-0" />
      <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[680px] h-[680px] bg-gradient-to-b from-cyan-glow/14 via-cyan-glow/4 to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      {/* ── TOP HUD ─────────────────────────────────────────────────────── */}
      <header className="relative z-20 flex items-center justify-between px-5 py-5 sm:px-10">
        {/* Presence pill */}
        <div className="flex items-center space-x-2 text-[11px] font-mono text-zinc-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-glow opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-glow" />
          </span>
          <span className="hidden sm:inline tracking-widest uppercase">NIRANJAN.AI // HUMAN IDENTITY SEQUENCE</span>
          <span className="sm:hidden tracking-widest uppercase text-zinc-500">INTRO</span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Voice narration toggle */}
          <button
            onClick={handleVoiceToggle}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-mono transition-all ${
              voiceEnabled
                ? 'border-cyan-glow/50 bg-cyan-glow/15 text-cyan-glow shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                : 'border-white/10 bg-black/50 text-zinc-400 hover:text-cyan-glow hover:border-cyan-glow/30'
            }`}
            aria-label={voiceEnabled ? 'Mute narration' : 'Enable voice narration'}
            title={voiceEnabled ? 'Mute narration' : 'Enable voice narration (American English)'}
          >
            {voiceEnabled ? (
              <Volume2 className={`w-3.5 h-3.5 ${audioPlaying ? 'text-cyan-glow animate-pulse' : ''}`} />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{voiceEnabled ? (audioPlaying ? 'SPEAKING...' : 'VOICE: ON') : 'VOICE: OFF'}</span>
          </button>

          {/* Skip */}
          <button
            onClick={handleExit}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-full border border-white/20 bg-white/8 text-white hover:bg-cyan-glow hover:text-black hover:border-cyan-glow transition-all duration-280 text-xs font-mono font-medium tracking-wider group"
            aria-label="Skip Introduction"
          >
            <span>SKIP</span>
            <span className="hidden sm:inline text-[10px] text-zinc-400 group-hover:text-black transition-colors">[ESC]</span>
            <SkipForward className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </header>

      {/* ── CAPTION BAND (shown when voice is on and audio is playing) ─── */}
      <AnimatePresence>
        {voiceEnabled && audioPlaying && captionVisible && (
          <motion.div
            key={`caption-${currentScene}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-20 mx-auto max-w-2xl px-5 text-center"
          >
            <p className="inline-block px-4 py-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-zinc-200 text-sm sm:text-base font-light leading-relaxed italic">
              "{SCENE_CAPTIONS[currentScene]}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN STAGE ───────────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-8 py-4">
        <div className="max-w-5xl w-full mx-auto">
          <AnimatePresence mode="wait">

            {/* SCENE 0 — Human Reveal */}
            {currentScene === 0 && (
              <motion.div
                key="scene-0"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center space-y-6"
              >
                {/* Portrait */}
                <div className="relative group">
                  <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-cyan-glow/25 via-transparent to-cyan-glow/25 blur-xl opacity-55 animate-pulse-slow" />
                  <div className="relative w-52 h-68 sm:w-60 sm:h-80 rounded-2xl overflow-hidden border border-white/20 bg-zinc-950 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
                    <img
                      src="/profile.jpg"
                      alt="Niranjan Kumar"
                      className="w-full h-full object-cover object-top brightness-[1.03] contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/15 pointer-events-none" />
                    <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-cyan-glow pointer-events-none" />
                    <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-cyan-glow pointer-events-none" />
                    <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-cyan-glow pointer-events-none" />
                    <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-cyan-glow pointer-events-none" />
                    <div className="absolute bottom-3 inset-x-3 text-center">
                      <span className="inline-block px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300 tracking-wider">
                        HUMAN PRESENCE // VERIFIED
                      </span>
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, delay: 0.3 }}
                  className="space-y-3 max-w-md"
                >
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow text-xs font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>A HUMAN-CENTERED DIGITAL EXPERIENCE</span>
                  </div>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
                    Before the technology, meet the person.
                  </h2>
                  <p className="text-zinc-400 text-sm sm:text-base font-light">
                    Built around real curiosity, continuous learning, and software engineering.
                  </p>
                </motion.div>

                <motion.button
                  onClick={() => handleManualSceneClick(1)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.65 }}
                  className="inline-flex items-center space-x-2 text-xs font-mono text-zinc-400 hover:text-cyan-glow transition-colors"
                >
                  <span>CONTINUE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </motion.div>
            )}

            {/* SCENE 1 — Identity */}
            {currentScene === 1 && (
              <motion.div
                key="scene-1"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -22, filter: 'blur(8px)' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
              >
                <div className="md:col-span-4 flex justify-center">
                  <div className="relative w-40 h-52 sm:w-48 sm:h-60 rounded-2xl overflow-hidden border border-white/15 bg-zinc-950 shadow-2xl">
                    <img src="/profile.jpg" alt="Niranjan Kumar" className="w-full h-full object-cover object-top brightness-[1.02]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-cyan-glow bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-sm border border-cyan-glow/20">
                      <span>NK // 2026</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-pulse" />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-8 text-left space-y-5">
                  <div className="space-y-3">
                    <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-glow tracking-widest uppercase">
                      <Compass className="w-3.5 h-3.5" />
                      <span>// ARCHITECT & EXPLORER</span>
                    </div>
                    <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl tracking-tight text-white uppercase leading-[0.95]">
                      NIRANJAN KUMAR
                    </h1>
                    <div className="flex items-center space-x-3 pt-1">
                      <div className="w-3 h-3 bg-cyan-glow rounded-sm rotate-45 shadow-[0_0_12px_rgba(0,229,255,0.8)]" />
                      <p className="font-mono text-lg sm:text-2xl text-cyan-glow font-medium tracking-wider uppercase text-glow-cyan">
                        / Software Engineer with AI
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {['CURIOSITY', 'ADAPTABILITY', 'ENGINEERING REASONING', 'CONTINUOUS LEARNING'].map((t) => (
                      <span key={t} className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] font-mono text-zinc-300">
                        {t}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleManualSceneClick(2)}
                    className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-glow hover:underline tracking-wider pt-2"
                  >
                    <span>HEAR MY PHILOSOPHY</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* SCENE 2 — My Story */}
            {currentScene === 2 && (
              <motion.div
                key="scene-2"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.03, filter: 'blur(8px)' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl mx-auto text-left space-y-7"
              >
                <div className="flex items-center space-x-3 text-xs font-mono text-cyan-glow">
                  <span>// 03</span>
                  <span className="w-10 h-[1px] bg-cyan-glow/40" />
                  <span>THE HUMAN PHILOSOPHY</span>
                </div>

                <blockquote className="relative pl-6 sm:pl-8 border-l-2 border-cyan-glow">
                  <p className="font-display font-medium text-2xl sm:text-3xl lg:text-[2rem] text-white leading-snug tracking-tight">
                    "I am a curious and adaptable Software Engineer with an interest in Artificial Intelligence. I enjoy understanding complex problems, researching efficient approaches, and turning ideas into practical technology solutions."
                  </p>
                </blockquote>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs font-mono text-zinc-400">
                  <div className="space-y-1">
                    <div className="text-zinc-500 uppercase">// ACADEMIC GROUNDING</div>
                    <div className="text-zinc-200 font-medium">Birla Institute of Technology, Mesra</div>
                    <div className="text-cyan-glow">Bachelor of Computer Applications (BCA) · 2027</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-zinc-500 uppercase">// LONG-TERM ASPIRATION</div>
                    <div className="text-zinc-200 font-medium">Software Engineer with AI Expertise</div>
                    <div className="text-zinc-400">Translating complex AI research into reliable production systems.</div>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleManualSceneClick(3)}
                    className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-white text-black font-mono text-xs font-bold tracking-wider hover:bg-cyan-glow hover:shadow-[0_0_20px_rgba(0,229,255,0.6)] transition-all"
                  >
                    <span>ENTER MY DIGITAL WORLD</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* SCENE 3 — Enter World */}
            {currentScene === 3 && (
              <motion.div
                key="scene-3"
                initial={{ opacity: 0, scale: 0.93 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.14, filter: 'blur(16px)' }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="text-center space-y-8 max-w-xl mx-auto"
              >
                <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-cyan-glow/35 animate-ping" style={{ animationDuration: '3s' }} />
                  <div className="absolute inset-2 rounded-full border border-dashed border-cyan-glow animate-spin" style={{ animationDuration: '20s' }} />
                  <div className="w-12 h-12 rounded-full bg-cyan-glow/20 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.8)] border border-cyan-glow">
                    <Sparkles className="w-6 h-6 text-cyan-glow animate-pulse" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-mono text-cyan-glow tracking-widest uppercase">
                    // SYSTEM STATUS: SYNAPTIC LINK READY
                  </div>
                  <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight uppercase">
                    Welcome to My Digital World
                  </h2>
                  <p className="text-zinc-400 text-sm sm:text-base font-light max-w-md mx-auto">
                    Where human engineering meets artificial intelligence, interactive 3D spaces, and conversational AI.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleExit}
                    className="inline-flex items-center space-x-3 px-8 py-4 rounded-full bg-cyan-glow text-black font-mono text-sm font-extrabold tracking-widest hover:bg-white hover:shadow-[0_0_35px_rgba(0,229,255,0.8)] transition-all duration-300 transform hover:scale-105 active:scale-95 group shadow-[0_0_25px_rgba(0,229,255,0.4)]"
                  >
                    <span>STEP INSIDE</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
                <div className="text-[11px] font-mono text-zinc-500">
                  PRESS <span className="text-zinc-300">[ENTER]</span> OR <span className="text-zinc-300">[SPACE]</span> TO PROCEED
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* ── BOTTOM HUD ───────────────────────────────────────────────────── */}
      <footer className="relative z-20 flex flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-10 border-t border-white/5 bg-black/35 backdrop-blur-md">
        <div className="flex items-center space-x-3 text-[11px] font-mono text-zinc-500">
          <span>NIRANJAN KUMAR</span>
          <span>·</span>
          <span className="text-zinc-400">BIT MESRA // 2027</span>
        </div>

        {/* Scene stepper */}
        <nav aria-label="Introduction scenes" className="flex items-center space-x-1.5">
          {sceneTitles.map((title, idx) => {
            const isActive = currentScene === idx;
            const isDone = currentScene > idx;
            return (
              <button
                key={title}
                onClick={() => handleManualSceneClick(idx)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-mono transition-all ${
                  isActive
                    ? 'border border-cyan-glow/60 bg-cyan-glow/15 text-cyan-glow shadow-[0_0_8px_rgba(0,229,255,0.3)]'
                    : isDone
                    ? 'border border-white/10 text-zinc-400 hover:text-white'
                    : 'border border-transparent text-zinc-600 hover:text-zinc-400'
                }`}
                aria-current={isActive ? 'step' : undefined}
                aria-label={`Scene ${idx + 1}: ${title}`}
              >
                <span>0{idx + 1}</span>
                <span className="hidden md:inline">{title}</span>
              </button>
            );
          })}
        </nav>

        <div className="text-[11px] font-mono text-zinc-500 flex items-center space-x-2">
          {voiceEnabled && audioPlaying && (
            <span className="text-cyan-glow animate-pulse">♪ NARRATING</span>
          )}
          {!voiceEnabled && <span>VOICE: OFF · CLICK 🔊 TO ENABLE</span>}
          {voiceEnabled && !audioPlaying && <span className="text-zinc-400">HUMAN_TOUCH // ENGAGED</span>}
        </div>
      </footer>
    </motion.div>
  );
}
