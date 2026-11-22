import React from 'react';
import { personalData } from '../../data/portfolioData';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left Navigation Links */}
        <nav className="flex items-center space-x-6 text-xs font-mono tracking-widest text-zinc-400">
          <a href="#about" className="hover:text-cyan-glow transition-colors duration-200">
            // ABOUT
          </a>
          <a href="#skills" className="hover:text-cyan-glow transition-colors duration-200">
            // SKILLS
          </a>
        </nav>

        {/* Center Glowing NK Monogram Logo */}
        <a href="#" className="group flex items-center justify-center relative p-2" aria-label="Niranjan Kumar Home">
          <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Ambient Cyan Glow */}
            <div className="absolute inset-0 bg-cyan-glow/20 rounded-lg blur-md group-hover:bg-cyan-glow/40 transition-all duration-300"></div>
            {/* Geometric Monogram Icon */}
            <div className="relative w-9 h-9 rounded-lg bg-surface-card border border-white/10 group-hover:border-cyan-glow/60 flex items-center justify-center transition-colors duration-300">
              <span className="font-display font-extrabold text-sm tracking-tighter text-white group-hover:text-cyan-glow transition-colors duration-200">
                NK
              </span>
            </div>
          </div>
        </a>

        {/* Right Navigation Links & Email Action */}
        <nav className="flex items-center space-x-6 text-xs font-mono tracking-widest text-zinc-400">
          <a href="#projects" className="hover:text-cyan-glow transition-colors duration-200">
            // PROJECTS
          </a>
          <a 
            href={`mailto:${personalData.email}`}
            className="px-3 py-1.5 rounded-full border border-white/10 bg-surface-card text-zinc-200 hover:text-cyan-glow hover:border-cyan-glow/40 transition-all duration-200"
          >
            CONNECT
          </a>
        </nav>

      </div>
    </header>
  );
}
