import React from 'react';
import { personalData } from '../../data/portfolioData';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/5 bg-surface/50 py-12 px-6 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Metadata */}
        <div className="flex flex-col items-center md:items-start space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse"></span>
            <span className="font-mono text-xs tracking-wider text-zinc-300">
              {personalData.name.toUpperCase()}
            </span>
          </div>
          <p className="font-mono text-[11px] text-zinc-500">
            {personalData.title} • {personalData.education.institution}
          </p>
        </div>

        {/* Email Direct Link */}
        <div className="text-center">
          <a 
            href={`mailto:${personalData.email}`}
            className="font-mono text-xs text-zinc-400 hover:text-cyan-glow transition-colors duration-200"
          >
            {personalData.email}
          </a>
        </div>

        {/* Copyright & Region */}
        <div className="font-mono text-[11px] text-zinc-600 text-center md:text-right">
          © {currentYear} • DESIGNED FOR PERFORMANCE
        </div>

      </div>
    </footer>
  );
}
