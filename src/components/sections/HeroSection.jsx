import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowRight, Sparkles, Activity, User, Compass, Terminal, Cpu, Bot } from 'lucide-react';
import { personalData } from '../../data/portfolioData';
import HeroCenterpieceCanvas from '../canvas/HeroCenterpieceCanvas';
import AIEntityPanel from '../../ai/AIEntityPanel';

export default function HeroSection() {
  const [isWireframe, setIsWireframe] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [entityState, setEntityState] = useState('idle');
  const primaryEdu = personalData.educationMilestones[0];
  const heroStatement = personalData.bio.heroStatement || "Exploring intelligent systems, building practical software, and turning complex problems into meaningful technology solutions.";

  return (
    <section id="hero" className="relative min-h-[92vh] flex flex-col justify-center pt-8 pb-16">
      
      {/* Top HUD Telemetry Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/5 text-[11px] font-mono text-zinc-500"
      >
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
          <span className="text-zinc-400">TELEMETRY // {personalData.location.toUpperCase()}</span>
        </div>
        <div className="flex items-center space-x-6 text-[11px]">
          <span className="text-zinc-400">{primaryEdu.institution.toUpperCase()} // {primaryEdu.degree}</span>
          <span className="text-cyan-glow/80">{primaryEdu.periodLabel}: {primaryEdu.periodValue}</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-8">
        
        {/* Left Column: Massive Editorial Typography, Human Connection & Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 space-y-8"
        >
          
          <div className="space-y-4">
            
            {/* Human Presence Continuity Badge */}
            <div className="inline-flex items-center space-x-3 px-3.5 py-1.5 rounded-full border border-cyan-glow/30 bg-cyan-glow/5 backdrop-blur-md text-xs font-mono">
              <div className="relative w-5 h-5 rounded-full overflow-hidden border border-cyan-glow/60 flex-shrink-0">
                <img 
                  src="/profile.jpg" 
                  alt="Niranjan Kumar" 
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <span className="text-cyan-glow font-medium">HUMAN-CENTERED APPLIED INTELLIGENCE</span>
              <span className="text-zinc-500 hidden sm:inline">•</span>
              <span className="text-zinc-400 hidden sm:inline">BIT MESRA 2027</span>
            </div>

            {/* Large Editorial Headline */}
            <h1 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-[5.5rem] tracking-tight text-white uppercase leading-[0.92] select-none">
              {personalData.name}
            </h1>

            {/* Subtitle with Electric Cyan Accent */}
            <div className="flex items-center space-x-3 pt-2">
              <div className="w-3.5 h-3.5 bg-cyan-glow rounded-sm rotate-45 shadow-[0_0_12px_rgba(0,229,255,0.8)]" />
              <p className="font-mono text-lg sm:text-2xl text-cyan-glow font-medium tracking-wider uppercase text-glow-cyan">
                / {personalData.title}
              </p>
            </div>
          </div>

          {/* Concise Professional Statement */}
          <p className="max-w-xl text-zinc-300 text-base sm:text-lg leading-relaxed font-light">
            "{heroStatement}"
          </p>

          {/* Primary Navigation Actions: Projects, Skills, About, Contact */}
          <div className="space-y-3 pt-2">
            
            {/* Main Primary Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <a 
                href="#projects"
                className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-full bg-white text-black font-mono text-xs font-bold tracking-wider hover:bg-cyan-glow hover:shadow-[0_0_25px_rgba(0,229,255,0.6)] transition-all duration-300 group"
              >
                <span>EXPLORE PROJECTS</span>
                <ArrowDownRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </a>

              <a 
                href="#skills"
                className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-full border border-cyan-glow/40 bg-cyan-glow/10 text-cyan-glow font-mono text-xs font-semibold tracking-wider hover:bg-cyan-glow hover:text-black hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all duration-300 group"
              >
                <span>EXPLORE SKILLS</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>

              <button
                type="button"
                onClick={() => setAiPanelOpen(true)}
                className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-full border border-cyan-glow/60 bg-black/80 text-white font-mono text-xs font-bold tracking-wider hover:bg-cyan-glow/20 hover:border-cyan-glow hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all duration-300 group"
                aria-label="Converse with Niranjan's AI Entity"
              >
                <Sparkles className="w-4 h-4 text-cyan-glow group-hover:rotate-12 transition-transform" />
                <span>CONVERSE WITH AI</span>
                <span className={`w-2 h-2 rounded-full ${
                  entityState === 'listening' ? 'bg-emerald-400 animate-ping' :
                  entityState === 'thinking' ? 'bg-amber-400 animate-pulse' :
                  entityState === 'speaking' ? 'bg-cyan-glow animate-bounce' :
                  'bg-cyan-glow animate-pulse'
                }`} />
              </button>
            </div>

            {/* Secondary Direct Section Links */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a 
                href="#about"
                className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:border-white/20 transition-all text-xs font-mono"
              >
                <User className="w-3 h-3 text-cyan-glow" />
                <span>// ABOUT NIRANJAN</span>
              </a>

              <a 
                href="#contact"
                className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:text-cyan-glow hover:border-cyan-glow/30 transition-all text-xs font-mono"
              >
                <Terminal className="w-3 h-3 text-cyan-glow" />
                <span>// INITIATE CONTACT</span>
              </a>
            </div>

          </div>

          {/* Minimal HUD Meta Row */}
          <div className="pt-4 flex flex-wrap items-center gap-6 text-[11px] font-mono text-zinc-500 border-t border-white/5">
            <div className="flex items-center space-x-2">
              <Activity className="w-3.5 h-3.5 text-cyan-glow" />
              <span>CHASSIS // SYNAPTIC CORE ENGAGED</span>
            </div>
            <div>// ARCHITECTURE: APPLIED INTELLIGENCE</div>
            <div>STATUS // ACTIVE EXPLORATION</div>
          </div>

        </motion.div>

        {/* Right Column: Recognizable Procedural Mechanical AI Centerpiece */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex justify-center lg:justify-end"
        >
          <div className="w-full relative">
            {/* Ambient Cyan Radial Glow */}
            <div className="absolute inset-0 bg-cyan-glow/10 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* 3D Mechanical AI Sculpture */}
            <HeroCenterpieceCanvas 
              isWireframe={isWireframe} 
              onToggleWireframe={() => setIsWireframe(!isWireframe)} 
              entityState={entityState}
              onOpenAIPanel={() => setAiPanelOpen(true)}
            />
          </div>
        </motion.div>

      </div>

      {/* Conversational Mechanical AI Entity Panel */}
      <AIEntityPanel 
        isOpen={aiPanelOpen} 
        onClose={() => setAiPanelOpen(false)} 
        entityState={entityState}
        onEntityStateChange={setEntityState}
      />

    </section>
  );
}
