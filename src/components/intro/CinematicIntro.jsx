import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Volume2, VolumeX, SkipForward, Compass, CheckCircle2 } from 'lucide-react';
import { personalData } from '../../data/portfolioData';

/**
 * CinematicIntro — The Human-Centered Opening Experience
 * 
 * Scene 1: The Human Reveal (Photographic portrait with dramatic studio lighting)
 * Scene 2: My Identity (Editorial typography, title, engineering presence)
 * Scene 3: My Story (Authentic philosophy, BIT Mesra background, learning drive)
 * Scene 4: Enter My Digital World (Dimensional transition into the Hero environment)
 */
export default function CinematicIntro({ onComplete }) {
  // Current scene: 0 (Reveal), 1 (Identity), 2 (Story), 3 (Enter Digital World)
  const [currentScene, setCurrentScene] = useState(0);
  const [isTransitioningOut, setIsTransitioningOut] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Keyboard accessibility: ESC or Space to skip/progress
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleExit();
      } else if (e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentScene < 3) {
          setCurrentScene((prev) => prev + 1);
        } else {
          handleExit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScene]);

  // Automatic timeline progression if user doesn't manually click
  useEffect(() => {
    if (prefersReducedMotion) return; // Allow manual browsing under reduced motion

    let timer;
    if (currentScene === 0) {
      // Scene 1: The Human Reveal (4.5s)
      timer = setTimeout(() => setCurrentScene(1), 4500);
    } else if (currentScene === 1) {
      // Scene 2: Identity (4.0s)
      timer = setTimeout(() => setCurrentScene(2), 4000);
    } else if (currentScene === 2) {
      // Scene 3: Story (6.5s)
      timer = setTimeout(() => setCurrentScene(3), 6500);
    }
    return () => clearTimeout(timer);
  }, [currentScene, prefersReducedMotion]);

  // Subtle ambient synthesized audio (warm harmonic chord, 100% optional)
  useEffect(() => {
    if (!audioEnabled) {
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
        audioCtxRef.current = null;
      }
      return;
    }

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      // Soft ambient chord: C3, G3, D4 with gentle low-pass filter
      const freqs = [130.81, 196.0, 293.66];
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.04, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      masterGain.connect(filter);
      filter.connect(ctx.destination);

      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.connect(masterGain);
        osc.start();
      });
    } catch (e) {
      console.warn('AudioContext not supported or blocked:', e);
    }

    return () => {
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
        audioCtxRef.current = null;
      }
    };
  }, [audioEnabled]);

  // Ambient stardust / atmospheric particles on 2D canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: -(Math.random() * 0.3 + 0.1),
      opacity: Math.random() * 0.5 + 0.2,
      cyan: Math.random() > 0.4
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.cyan
          ? `rgba(0, 229, 255, ${p.opacity})`
          : `rgba(255, 255, 255, ${p.opacity * 0.8})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Trigger cinematic exit transition into the main digital world
  const handleExit = () => {
    setIsTransitioningOut(true);
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
    }
    // Hand off to parent after exit animation completes
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  const sceneTitles = ['THE REVEAL', 'IDENTITY', 'MY STORY', 'ENTER WORLD'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isTransitioningOut ? 0 : 1,
        scale: isTransitioningOut ? 1.08 : 1,
        filter: isTransitioningOut ? 'blur(12px)' : 'blur(0px)'
      }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black text-white select-none overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Cinematic Personal Introduction"
    >
      {/* Dynamic Ambient Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-60" />

      {/* Atmospheric Vignette & Studio Lighting Sheen */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(0,229,255,0.08)_0%,rgba(0,0,0,0.8)_60%,#000000_100%)] z-0" />

      {/* Subtle Studio Lighting Beam */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-b from-cyan-glow/15 via-cyan-glow/5 to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      {/* ========================================================
          TOP HUD BAR: Controls & Audio
          ======================================================== */}
      <header className="relative z-20 flex items-center justify-between px-6 py-6 sm:px-12">
        {/* Left: Telemetry Presence Tag */}
        <div className="flex items-center space-x-3 text-xs font-mono text-zinc-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-glow opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-glow" />
          </span>
          <span className="tracking-widest uppercase text-zinc-300">
            TRANSMISSION // HUMAN IDENTITY SEQUENCE
          </span>
        </div>

        {/* Right: Audio Toggle & Skip Control */}
        <div className="flex items-center space-x-4">
          {/* Optional Ambient Audio Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-black/60 text-zinc-400 hover:text-cyan-glow hover:border-cyan-glow/40 transition-all text-xs font-mono"
            aria-label={audioEnabled ? 'Mute ambient sound' : 'Enable ambient sound'}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-glow" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{audioEnabled ? 'SOUND: ON' : 'SOUND: OFF'}</span>
          </button>

          {/* Visible Skip Introduction Control */}
          <button
            onClick={handleExit}
            className="flex items-center space-x-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white hover:bg-cyan-glow hover:text-black hover:border-cyan-glow hover:shadow-[0_0_20px_rgba(0,229,255,0.6)] transition-all duration-300 text-xs font-mono font-medium tracking-wider group"
            aria-label="Skip Introduction and enter portfolio"
          >
            <span>SKIP INTRO</span>
            <span className="text-[10px] text-zinc-400 group-hover:text-black transition-colors hidden sm:inline">[ESC]</span>
            <SkipForward className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </header>

      {/* ========================================================
          CENTER STAGE: The 4 Cinematic Scenes
          ======================================================== */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-8 py-4">
        <div className="max-w-5xl w-full mx-auto">
          
          <AnimatePresence mode="wait">
            
            {/* ----------------------------------------------------
                SCENE 1: THE HUMAN REVEAL
                Authentic Photograph Revealed with Dramatic Studio Lighting
                ---------------------------------------------------- */}
            {currentScene === 0 && (
              <motion.div
                key="scene-1"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center space-y-6"
              >
                {/* Real Photographic Portrait with Studio Rim Lighting */}
                <div className="relative group">
                  {/* Outer Concentric Cyan Aura */}
                  <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-cyan-glow/30 via-transparent to-cyan-glow/30 blur-xl opacity-60 animate-pulse-slow" />

                  {/* Frame Container */}
                  <div className="relative w-56 h-72 sm:w-64 sm:h-80 rounded-2xl overflow-hidden border border-white/20 bg-zinc-950 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
                    {/* The Real Photograph */}
                    <img
                      src="/profile.jpg"
                      alt="Niranjan Kumar"
                      className="w-full h-full object-cover object-top filter contrast-[1.06] brightness-[1.02] transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Studio Gradient Sheen & Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                    {/* Framing Corner Markers */}
                    <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-cyan-glow pointer-events-none" />
                    <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-cyan-glow pointer-events-none" />
                    <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-cyan-glow pointer-events-none" />
                    <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-cyan-glow pointer-events-none" />

                    {/* Authentic Identification Badge */}
                    <div className="absolute bottom-3 inset-x-3 text-center">
                      <span className="inline-block px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300 tracking-wider">
                        HUMAN PRESENCE // VERIFIED
                      </span>
                    </div>
                  </div>
                </div>

                {/* Introductory Headline & Philosophy Tag */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="space-y-3 max-w-lg"
                >
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow text-xs font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-glow" />
                    <span>A HUMAN-CENTERED DIGITAL EXPERIENCE</span>
                  </div>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
                    Before the technology, meet the person.
                  </h2>
                  <p className="text-zinc-400 text-sm sm:text-base font-light">
                    Built around real curiosity, continuous learning, and software engineering.
                  </p>
                </motion.div>

                {/* Progress Cue */}
                <motion.button
                  onClick={() => setCurrentScene(1)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="inline-flex items-center space-x-2 text-xs font-mono text-zinc-400 hover:text-cyan-glow transition-colors pt-2"
                >
                  <span>CONTINUE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </motion.div>
            )}

            {/* ----------------------------------------------------
                SCENE 2: MY IDENTITY
                Bold Editorial Typography & Engineering Presence
                ---------------------------------------------------- */}
            {currentScene === 1 && (
              <motion.div
                key="scene-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -25, filter: 'blur(8px)' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
              >
                {/* Left: Compact Portrait Anchor */}
                <div className="md:col-span-4 flex justify-center">
                  <div className="relative w-44 h-56 sm:w-52 sm:h-64 rounded-2xl overflow-hidden border border-white/15 bg-zinc-950 shadow-2xl">
                    <img
                      src="/profile.jpg"
                      alt="Niranjan Kumar"
                      className="w-full h-full object-cover object-top filter contrast-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-cyan-glow bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-sm border border-cyan-glow/20">
                      <span>NK // 2026</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Right: Bold Editorial Typography */}
                <div className="md:col-span-8 text-left space-y-6">
                  
                  <div className="space-y-3">
                    <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-glow tracking-widest uppercase">
                      <Compass className="w-3.5 h-3.5" />
                      <span>// ARCHITECT & EXPLORER</span>
                    </div>

                    {/* Massive Name Reveal */}
                    <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl tracking-tight text-white uppercase leading-[0.95]">
                      NIRANJAN KUMAR
                    </h1>

                    {/* Professional Title with Electric Cyan Accent */}
                    <div className="flex items-center space-x-3 pt-2">
                      <div className="w-3 h-3 bg-cyan-glow rounded-sm rotate-45 shadow-[0_0_12px_rgba(0,229,255,0.8)]" />
                      <p className="font-mono text-xl sm:text-2xl text-cyan-glow font-medium tracking-wider uppercase text-glow-cyan">
                        / Software Engineer with AI
                      </p>
                    </div>
                  </div>

                  {/* Character Traits */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    {['CURIOSITY', 'ADAPTABILITY', 'ENGINEERING REASONING', 'CONTINUOUS LEARNING'].map((trait) => (
                      <span
                        key={trait}
                        className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] font-mono text-zinc-300"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>

                  {/* Progress Prompt */}
                  <div className="pt-4">
                    <button
                      onClick={() => setCurrentScene(2)}
                      className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-glow hover:underline tracking-wider"
                    >
                      <span>HEAR MY PHILOSOPHY</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </motion.div>
            )}

            {/* ----------------------------------------------------
                SCENE 3: MY STORY & PHILOSOPHY
                Authentic Human Narrative & BIT Mesra Foundation
                ---------------------------------------------------- */}
            {currentScene === 2 && (
              <motion.div
                key="scene-3"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.03, filter: 'blur(8px)' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl mx-auto text-left space-y-8"
              >
                {/* Header Tag */}
                <div className="flex items-center space-x-3 text-xs font-mono text-cyan-glow">
                  <span>// 03</span>
                  <span className="w-10 h-[1px] bg-cyan-glow/40" />
                  <span>THE HUMAN PHILOSOPHY</span>
                </div>

                {/* The Exact Required Statement — Styled with High Editorial Grace */}
                <blockquote className="relative pl-6 sm:pl-8 border-l-2 border-cyan-glow space-y-4">
                  <p className="font-display font-medium text-2xl sm:text-3xl lg:text-4xl text-white leading-snug tracking-tight">
                    "I am a curious and adaptable Software Engineer with an interest in Artificial Intelligence. I enjoy understanding complex problems, researching efficient approaches, and turning ideas into practical technology solutions."
                  </p>
                </blockquote>

                {/* Verified Academic Foundation & Ambition */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs font-mono text-zinc-400">
                  <div className="space-y-1">
                    <div className="text-zinc-500 uppercase">// ACADEMIC GROUNDING</div>
                    <div className="text-zinc-200 font-medium">Birla Institute of Technology, Mesra</div>
                    <div className="text-cyan-glow">Bachelor of Computer Applications (BCA) • 2027</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-zinc-500 uppercase">// LONG-TERM ASPIRATION</div>
                    <div className="text-zinc-200 font-medium">Software Engineer with AI Expertise</div>
                    <div className="text-zinc-400">Translating complex AI research into reliable production systems.</div>
                  </div>
                </div>

                {/* Transition Action to Scene 4 */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setCurrentScene(3)}
                    className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-white text-black font-mono text-xs font-bold tracking-wider hover:bg-cyan-glow hover:shadow-[0_0_20px_rgba(0,229,255,0.6)] transition-all"
                  >
                    <span>ENTER MY DIGITAL WORLD</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ----------------------------------------------------
                SCENE 4: ENTER MY DIGITAL WORLD
                The Dimensional Transition Threshold
                ---------------------------------------------------- */}
            {currentScene === 3 && (
              <motion.div
                key="scene-4"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.15, filter: 'blur(16px)' }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="text-center space-y-8 max-w-xl mx-auto"
              >
                {/* Concentric Portal Beacon */}
                <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-cyan-glow/40 animate-ping" style={{ animationDuration: '3s' }} />
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
                    Where human engineering meets artificial intelligence, interactive 3D spaces, and agentic systems.
                  </p>
                </div>

                {/* Primary Enter Action Button */}
                <div className="pt-4">
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

      {/* ========================================================
          BOTTOM HUD BAR: Scene Progression & Replay Telemetry
          ======================================================== */}
      <footer className="relative z-20 flex flex-wrap items-center justify-between gap-4 px-6 py-6 sm:px-12 border-t border-white/5 bg-black/40 backdrop-blur-md">
        
        {/* Left: Location & Academic Affiliation */}
        <div className="flex items-center space-x-4 text-[11px] font-mono text-zinc-500">
          <span>NIRANJAN KUMAR</span>
          <span>•</span>
          <span className="text-zinc-400">BIT MESRA // 2027</span>
        </div>

        {/* Center: Interactive Scene Timeline Stepper */}
        <nav aria-label="Introduction scene navigation" className="flex items-center space-x-2">
          {sceneTitles.map((title, idx) => {
            const isActive = currentScene === idx;
            const isCompleted = currentScene > idx;

            return (
              <button
                key={title}
                onClick={() => setCurrentScene(idx)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono transition-all ${
                  isActive
                    ? 'border border-cyan-glow/60 bg-cyan-glow/15 text-cyan-glow shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                    : isCompleted
                    ? 'border border-white/10 text-zinc-400 hover:text-white'
                    : 'border border-transparent text-zinc-600 hover:text-zinc-400'
                }`}
                aria-label={`Jump to Scene ${idx + 1}: ${title}`}
                aria-current={isActive ? 'step' : undefined}
              >
                <span>0{idx + 1}</span>
                <span className="hidden md:inline">{title}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Telemetry Mode */}
        <div className="text-[11px] font-mono text-zinc-500 flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow" />
          <span>HUMAN_TOUCH // ENGAGED</span>
        </div>

      </footer>

    </motion.div>
  );
}
