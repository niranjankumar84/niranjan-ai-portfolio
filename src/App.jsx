import React, { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { personalData } from './data/portfolioData';

export default function App() {
  // Initialize hardware-accelerated smooth scrolling via Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-cyan-glow/20 selection:text-cyan-glow">
      {/* Subtle Ambient Grid Background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Primary Navigation */}
      <Navbar />

      {/* Main Content Layout Container */}
      <main className="relative z-10 pt-28 px-6 max-w-7xl mx-auto space-y-32">
        
        {/* Phase 1 Scaffold: Hero Showcase */}
        <section className="min-h-[75vh] flex flex-col justify-center items-start space-y-6">
          <div className="flex items-center space-x-3 text-xs font-mono text-zinc-500 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse"></span>
            <span>SYSTEM INITIALIZED // PHASE 1 FOUNDATION</span>
          </div>

          <div className="space-y-3">
            <h1 className="font-display font-extrabold text-5xl md:text-8xl tracking-tight text-white uppercase">
              {personalData.name}
            </h1>
            <p className="font-mono text-lg md:text-2xl text-cyan-glow/90 font-medium">
              / {personalData.title.toUpperCase()}
            </p>
          </div>

          <p className="max-w-2xl text-zinc-400 text-sm md:text-base leading-relaxed">
            {personalData.bio.summary}
          </p>

          <div className="pt-4 flex flex-wrap gap-4 font-mono text-xs">
            <div className="px-4 py-2 rounded-lg border border-white/10 bg-surface-card text-zinc-300">
              EDUCATION: <span className="text-white font-medium">{personalData.education.degree}</span>
            </div>
            <div className="px-4 py-2 rounded-lg border border-white/10 bg-surface-card text-zinc-300">
              INSTITUTE: <span className="text-white font-medium">{personalData.education.institution}</span>
            </div>
            <div className="px-4 py-2 rounded-lg border border-white/10 bg-surface-card text-zinc-300">
              GRADUATION: <span className="text-cyan-glow font-medium">{personalData.education.expectedGraduation}</span>
            </div>
          </div>
        </section>

      </main>

      {/* Primary Footer */}
      <Footer />
    </div>
  );
}
