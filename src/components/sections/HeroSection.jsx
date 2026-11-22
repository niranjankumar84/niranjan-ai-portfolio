import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, Terminal, Sparkles, ExternalLink } from 'lucide-react';
import { personalData } from '../../data/portfolioData';

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-[85vh] flex flex-col justify-center pt-12 pb-16">
      
      {/* Top HUD Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-white/5 text-xs font-mono text-zinc-500">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse"></span>
          <span className="text-zinc-400">TELEMETRY // {personalData.location.toUpperCase()}</span>
        </div>
        <div className="flex items-center space-x-6 text-[11px]">
          <span>BIT MESRA // BCA</span>
          <span>EST. GRADUATION: {personalData.education.expectedGraduation}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-10">
        
        {/* Left Column: Core Identity & Bio */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-7 space-y-8"
        >
          
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-cyan-glow/20 bg-cyan-glow/5 text-cyan-glow text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PORTFOLIO // 2026 ARCHITECTURE</span>
            </div>

            <h1 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight text-white uppercase leading-[0.95]">
              {personalData.name}
            </h1>

            <div className="flex items-center space-x-3 pt-2">
              <div className="w-3 h-3 bg-cyan-glow/80 rounded-sm rotate-45"></div>
              <p className="font-mono text-lg sm:text-2xl text-cyan-glow font-medium tracking-wide">
                / {personalData.title.toUpperCase()}
              </p>
            </div>
          </div>

          <p className="max-w-xl text-zinc-400 text-base sm:text-lg leading-relaxed font-light">
            {personalData.bio.statement}
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a 
              href="#projects"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-white text-black font-mono text-xs font-semibold tracking-wider hover:bg-cyan-glow hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all duration-300"
            >
              <span>EXPLORE PROJECTS</span>
              <ArrowDownRight className="w-4 h-4" />
            </a>

            <a 
              href="#contact"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full border border-white/10 bg-surface-card text-zinc-300 font-mono text-xs tracking-wider hover:border-cyan-glow/40 hover:text-cyan-glow transition-all duration-300"
            >
              <span>GET IN TOUCH</span>
            </a>
          </div>

          {/* Education Pill Badge */}
          <div className="pt-2 flex items-center space-x-3 text-xs font-mono text-zinc-500">
            <span className="text-zinc-400 font-medium">{personalData.education.degree}</span>
            <span>•</span>
            <span>{personalData.education.institution}</span>
          </div>

        </motion.div>

        {/* Right Column: Subtle Static 3D Centerpiece Placeholder */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-md aspect-square rounded-2xl border border-white/10 bg-surface-card/60 backdrop-blur-xl p-8 flex flex-col justify-between overflow-hidden group">
            
            {/* Background Ambient Glow */}
            <div className="absolute -top-20 -right-20 w-52 h-52 bg-cyan-glow/10 rounded-full blur-3xl group-hover:bg-cyan-glow/20 transition-all duration-700 pointer-events-none"></div>

            {/* Corner HUD Accent Markers */}
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
              <span className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow"></span>
                <span>NODE_ID: NK_01</span>
              </span>
              <span>STAGE // 02</span>
            </div>

            {/* Futuristic Geometric Wireframe Graphic (Static 3D Placeholder) */}
            <div className="my-auto flex flex-col items-center justify-center relative py-8">
              <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Outer Concentric Ring */}
                <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-spin" style={{ animationDuration: '40s' }}></div>
                {/* Middle Hexagonal Border */}
                <div className="absolute inset-4 rounded-full border border-cyan-glow/20"></div>
                {/* Inner Tilted Square / Diamond */}
                <div className="absolute inset-10 rounded-xl border border-white/25 rotate-45"></div>
                {/* Core Glyph */}
                <div className="relative flex flex-col items-center justify-center z-10 space-y-1">
                  <div className="w-12 h-12 rounded-lg bg-surface border border-cyan-glow/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                    <Terminal className="w-6 h-6 text-cyan-glow" />
                  </div>
                  <span className="font-mono text-[9px] text-zinc-400 tracking-wider">NEURAL_CORE</span>
                </div>
              </div>
            </div>

            {/* Bottom Staging Banner */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-zinc-500">// 3D CENTERPIECE</span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-glow/10 border border-cyan-glow/20 text-cyan-glow text-[10px]">
                STAGED FOR PHASE 4
              </span>
            </div>

          </div>
        </motion.div>

      </div>

    </section>
  );
}
