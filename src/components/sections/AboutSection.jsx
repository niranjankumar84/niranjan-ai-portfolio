import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Terminal, Cpu, Brain, Compass, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { personalData } from '../../data/portfolioData';
import AboutHologramCanvas from '../canvas/AboutHologramCanvas';

export default function AboutSection() {
  const primaryEdu = personalData.educationMilestones[0];

  return (
    <section
      id="about"
      className="py-24 border-t border-white/5 relative"
      aria-label="About Niranjan Kumar - Personal Journey and Philosophy"
    >
      {/* Background Ambient Radial Sheen */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-cyan-glow/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="space-y-2 pb-14">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-glow">
          <span className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
          <span>LAB // 01</span>
          <span className="w-8 h-[1px] bg-cyan-glow/40" />
          <span>IDENTITY & PERSONAL JOURNEY</span>
        </div>
        <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight uppercase">
          About Niranjan
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

        {/* Left Column: Authentic Personal Journey Narrative */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 space-y-8"
        >
          {/* Main Statement — Kept strictly verified */}
          <div className="relative pl-6 border-l-2 border-cyan-glow space-y-3">
            <span className="text-[11px] font-mono tracking-widest text-cyan-glow uppercase block">
              // VERIFIED PERSONAL PHILOSOPHY
            </span>
            <blockquote className="font-display font-normal text-xl sm:text-2xl lg:text-3xl text-white leading-relaxed tracking-tight">
              "{personalData.bio.statement}"
            </blockquote>
          </div>

          {/* Authentic Personal Journey & Character Narrative */}
          <div className="space-y-4 pt-2 text-zinc-300 text-base leading-relaxed font-light">
            <p>
              My journey as a software engineer is driven by continuous curiosity and disciplined engineering practice. I focus on understanding the root mechanics of difficult computational challenges—whether designing performant backend interfaces, modeling geometric angles for computer vision, or architecting vector retrieval pipelines for statutory texts.
            </p>
            <p className="text-sm font-mono text-zinc-400">
              ACADEMIC ROOTS // Pursuing <span className="text-cyan-glow font-bold">{primaryEdu.degree}</span> at <span className="text-white font-medium">{primaryEdu.institution}</span> ({primaryEdu.periodLabel}: {primaryEdu.periodValue}).
            </p>
          </div>

          {/* Core Personal Vectors (Curiosity, Learning, Adaptability) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4 border-t border-white/5">
            <div className="p-4 rounded-xl border border-white/10 bg-black/40 space-y-1.5 hover:border-cyan-glow/30 transition-colors">
              <div className="flex items-center space-x-2 text-[10px] font-mono text-cyan-glow uppercase">
                <Brain className="w-3.5 h-3.5" />
                <span>CURIOSITY & LOGIC</span>
              </div>
              <h3 className="font-display font-bold text-base text-white">Systematic Explorer</h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Deconstructing complex algorithmic problems into clean, modular, and maintainable software systems.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-black/40 space-y-1.5 hover:border-cyan-glow/30 transition-colors">
              <div className="flex items-center space-x-2 text-[10px] font-mono text-sky-400 uppercase">
                <Cpu className="w-3.5 h-3.5" />
                <span>APPLIED AI</span>
              </div>
              <h3 className="font-display font-bold text-base text-white">Practical AI Builder</h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Bridging generative intelligence and mathematical algorithms into usable, dependable technology solutions.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-black/40 space-y-1.5 hover:border-cyan-glow/30 transition-colors">
              <div className="flex items-center space-x-2 text-[10px] font-mono text-emerald-400 uppercase">
                <Compass className="w-3.5 h-3.5" />
                <span>ADAPTABILITY</span>
              </div>
              <h3 className="font-display font-bold text-base text-white">Continuous Learner</h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                Rapidly assimilating emerging paradigms, state-of-the-art tooling, and modern software best practices.
              </p>
            </div>
          </div>

        </motion.div>

        {/* Right Column: The Digital Identity Core (Mechanical Energy Reactor) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex justify-center"
        >
          <AboutHologramCanvas />
        </motion.div>

      </div>

    </section>
  );
}
