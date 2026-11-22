import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Terminal, Cpu, Brain, Layers, Compass } from 'lucide-react';
import { personalData } from '../../data/portfolioData';
import AboutHologramCanvas from '../canvas/AboutHologramCanvas';

export default function AboutSection() {
  const primaryEdu = personalData.educationMilestones[0];

  return (
    <section id="about" className="py-24 border-t border-white/5 relative">
      
      {/* Background Ambient Radial Sheen */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-cyan-glow/5 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="space-y-2 pb-14">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-glow">
          <span>// 01</span>
          <span className="w-8 h-[1px] bg-cyan-glow/40" />
          <span>IDENTITY & HOLOGRAPHIC RECONSTRUCTION</span>
        </div>
        <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight uppercase">
          About Niranjan
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Editorial Typography & Exact Required Statement */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 space-y-8"
        >
          {/* Main Statement — Kept exactly as instructed */}
          <div className="relative pl-6 border-l-2 border-cyan-glow space-y-4">
            <span className="text-[11px] font-mono tracking-widest text-cyan-glow uppercase block">
              // CORE STATEMENT
            </span>
            <blockquote className="font-display font-normal text-xl sm:text-2xl lg:text-3xl text-white leading-relaxed tracking-tight">
              "{personalData.bio.statement}"
            </blockquote>
          </div>

          {/* Editorial Philosophy & Focus */}
          <div className="space-y-6 pt-4 text-zinc-400 text-base leading-relaxed font-light">
            <p>
              Operating at the intersection of classical software engineering and modern artificial intelligence. Dedicated to building dependable, scalable web services while actively researching retrieval pipelines, generative agent loops, and neural reasoning architectures.
            </p>
            <p className="text-sm font-mono text-zinc-500">
              ACADEMIC FOUNDATION // Currently pursuing <span className="text-zinc-300">{primaryEdu.degree}</span> at <span className="text-zinc-300">{primaryEdu.institution}</span> ({primaryEdu.periodLabel}: {primaryEdu.periodValue}).
            </p>
          </div>

          {/* Spatial Architectural Indicators (No conventional rectangular cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/5">
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">// VECTOR 01</div>
              <h3 className="font-display font-bold text-base text-white">Systematic Logic</h3>
              <p className="text-xs text-zinc-400 font-light">Breaking intricate algorithmic tasks into modular, maintainable code.</p>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">// VECTOR 02</div>
              <h3 className="font-display font-bold text-base text-white">Applied AI</h3>
              <p className="text-xs text-zinc-400 font-light">Translating generative models and vector embeddings into real-world tools.</p>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">// VECTOR 03</div>
              <h3 className="font-display font-bold text-base text-white">Adaptability</h3>
              <p className="text-xs text-zinc-400 font-light">Swift absorption of modern frameworks and engineering paradigms.</p>
            </div>
          </div>

        </motion.div>

        {/* Right Column: Holographic 3D Particle Portrait */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex justify-center"
        >
          <AboutHologramCanvas imageSrc="/profile.jpg" />
        </motion.div>

      </div>

    </section>
  );
}
