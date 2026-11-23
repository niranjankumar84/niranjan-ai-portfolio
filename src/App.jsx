import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HeroSection from './components/sections/HeroSection';
import AboutSection from './components/sections/AboutSection';
import SkillsSection from './components/sections/SkillsSection';
import ProjectsSection from './components/sections/ProjectsSection';
import EducationSection from './components/sections/EducationSection';
import AchievementsSection from './components/sections/AchievementsSection';
import ContactSection from './components/sections/ContactSection';
import CinematicIntro from './components/intro/CinematicIntro';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const bgCanvasRef = useRef(null);
  const lenisRef = useRef(null);

  // Initialize hardware-accelerated smooth scrolling via Lenis
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Control body scroll lock when Cinematic Intro is active
  useEffect(() => {
    if (showIntro) {
      document.body.style.overflow = 'hidden';
      if (lenisRef.current) lenisRef.current.stop();
    } else {
      document.body.style.overflow = 'unset';
      if (lenisRef.current) lenisRef.current.start();
      window.scrollTo(0, 0);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showIntro]);

  // Subtle Atmospheric Background Dust Particles
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particleCount = Math.min(65, Math.floor(width / 25));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      speedY: -(Math.random() * 0.25 + 0.08),
      opacity: Math.random() * 0.4 + 0.1,
      cyan: Math.random() > 0.6
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.cyan
          ? `rgba(0, 229, 255, ${p.opacity})`
          : `rgba(255, 255, 255, ${p.opacity * 0.7})`;
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

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-cyan-glow/20 selection:text-cyan-glow overflow-x-hidden">
      
      {/* Dynamic Background Star-Dust Canvas */}
      <canvas
        ref={bgCanvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-60"
      />

      {/* Subtle Ambient Spatial Grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02] z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 229, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.2) 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Cinematic Opening Sequence Modal */}
      <AnimatePresence>
        {showIntro && (
          <CinematicIntro
            onComplete={() => {
              setShowIntro(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Primary Sticky Header with Replay Intro Trigger */}
      <Navbar onReplayIntro={() => setShowIntro(true)} />

      {/* Main Portfolio Experience with Grand Dimensional Entrance */}
      <motion.main
        role="main"
        aria-label="Portfolio Main Content"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ 
          opacity: showIntro ? 0.3 : 1, 
          scale: showIntro ? 0.98 : 1,
          filter: showIntro ? 'blur(8px)' : 'blur(0px)'
        }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 px-4 sm:px-8 max-w-7xl mx-auto space-y-12"
      >
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <EducationSection />
        <AchievementsSection />
        <ContactSection />
      </motion.main>

      {/* Primary Footer */}
      <Footer />
    </div>
  );
}
