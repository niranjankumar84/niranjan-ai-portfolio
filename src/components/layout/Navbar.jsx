import React, { useState, useEffect } from 'react';
import { personalData } from '../../data/portfolioData';
import { Menu, X, Sparkles } from 'lucide-react';

export default function Navbar({ onReplayIntro }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'ABOUT', href: '#about' },
    { label: 'SKILLS', href: '#skills' },
    { label: 'PROJECTS', href: '#projects' },
    { label: 'EDUCATION', href: '#education' },
    { label: 'CERTIFICATIONS', href: '#achievements' },
    { label: 'CONTACT', href: '#contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-40 px-4 sm:px-8 py-4 transition-all duration-300 ${
      scrolled ? 'bg-black/85 backdrop-blur-md border-b border-white/5 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)]' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left Links (Desktop) */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-mono tracking-widest text-zinc-400">
          <a href="#about" className="hover:text-cyan-glow transition-colors duration-200">
            // ABOUT
          </a>
          <a href="#skills" className="hover:text-cyan-glow transition-colors duration-200">
            // SKILLS
          </a>
          <a href="#projects" className="hover:text-cyan-glow transition-colors duration-200">
            // PROJECTS
          </a>
        </nav>

        {/* Center Glowing NK Monogram Logo */}
        <a href="#hero" className="group flex items-center justify-center relative p-1" aria-label="Niranjan Kumar Home">
          <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Ambient Cyan Glow */}
            <div className="absolute inset-0 bg-cyan-glow/20 rounded-lg blur-md group-hover:bg-cyan-glow/50 transition-all duration-300" />
            {/* Monogram Box */}
            <div className="relative w-9 h-9 rounded-lg bg-black border border-white/10 group-hover:border-cyan-glow/60 flex items-center justify-center transition-colors duration-300 shadow-[0_0_15px_rgba(0,229,255,0.15)]">
              <span className="font-display font-extrabold text-sm tracking-tighter text-white group-hover:text-cyan-glow transition-colors duration-200">
                NK
              </span>
            </div>
          </div>
        </a>

        {/* Right Links (Desktop) */}
        <nav className="hidden md:flex items-center space-x-5 text-xs font-mono tracking-widest text-zinc-400">
          <a href="#education" className="hover:text-cyan-glow transition-colors duration-200">
            // EDUCATION
          </a>
          <a href="#achievements" className="hover:text-cyan-glow transition-colors duration-200">
            // CERTIFICATIONS
          </a>

          {/* Replay Introduction Button */}
          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-zinc-300 hover:text-cyan-glow hover:border-cyan-glow/40 transition-all text-xs font-mono"
              title="Replay Cinematic Personal Introduction"
            >
              <Sparkles className="w-3 h-3 text-cyan-glow" />
              <span>INTRO</span>
            </button>
          )}

          <a 
            href="#contact"
            className="px-4 py-1.5 rounded-full border border-cyan-glow/40 bg-cyan-glow/10 text-cyan-glow hover:bg-cyan-glow hover:text-black font-semibold shadow-[0_0_12px_rgba(0,229,255,0.25)] transition-all duration-200"
          >
            TRANSMIT
          </a>
        </nav>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center space-x-3">
          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              className="px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-zinc-300 text-[10px] font-mono flex items-center space-x-1"
              aria-label="Replay Introduction"
            >
              <Sparkles className="w-3 h-3 text-cyan-glow" />
              <span>INTRO</span>
            </button>
          )}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-white/10 bg-black/80 text-zinc-300 hover:text-cyan-glow transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/95 border-b border-white/10 p-6 space-y-4 backdrop-blur-2xl shadow-2xl">
          <nav className="flex flex-col space-y-4 text-sm font-mono tracking-wider text-zinc-300">
            {onReplayIntro && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onReplayIntro();
                }}
                className="py-1 text-left text-cyan-glow border-b border-white/5 transition-colors flex items-center space-x-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>// REPLAY CINEMATIC INTRO</span>
              </button>
            )}
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-cyan-glow border-b border-white/5 transition-colors"
              >
                // {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-center rounded-full bg-cyan-glow text-black font-bold tracking-wider"
            >
              TRANSMIT
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
