import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Cpu, Compass, Sparkles } from 'lucide-react';
import { personalData } from '../../data/portfolioData';

export default function AboutSection() {
  const highlights = [
    {
      icon: Brain,
      title: "Analytical Problem Solver",
      description: "Approaching algorithmic and structural challenges with systematic curiosity, breaking complex problems into clean, modular solutions."
    },
    {
      icon: Cpu,
      title: "Applied AI & Engineering",
      description: "Dedicated to modern software engineering best practices while actively exploring generative pipelines, RAG frameworks, and intelligent agents."
    },
    {
      icon: Compass,
      title: "Continuous Adaptability",
      description: "Quick to assimilate emerging technologies, architectural patterns, and practical engineering paradigms to build reliable systems."
    }
  ];

  return (
    <section id="about" className="py-20 border-t border-white/5">
      
      {/* Section Header */}
      <div className="space-y-2 pb-12">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-glow">
          <span>// 01</span>
          <span className="w-8 h-[1px] bg-cyan-glow/40"></span>
          <span>IDENTITY & BACKGROUND</span>
        </div>
        <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight uppercase">
          About Me
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Main Narrative Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 space-y-6"
        >
          <div className="p-8 rounded-2xl border border-white/10 bg-surface-card/60 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-glow/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <p className="text-xl sm:text-2xl text-white font-light leading-relaxed">
              "{personalData.bio.statement}"
            </p>
            
            <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-glow" />
                <span>PRIMARY PRINCIPLE</span>
              </span>
              <span className="text-zinc-500">NIRANJAN KUMAR</span>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-white/5 bg-surface/40 text-sm text-zinc-400 leading-relaxed space-y-2">
            <div className="font-mono text-xs text-zinc-300 uppercase tracking-wider">
              // CURRENT FOCUS & ACADEMIC BACKING
            </div>
            <p>
              Pursuing a Bachelor of Computer Applications (BCA) at Birla Institute of Technology, Mesra (expected 2027), focusing on rigorous software foundations, data structures, and practical machine learning architectures.
            </p>
          </div>
        </motion.div>

        {/* Core Pillars / Characteristics Cards */}
        <div className="lg:col-span-5 space-y-4">
          {highlights.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-5 rounded-xl border border-white/5 bg-surface-card hover:border-cyan-glow/30 transition-all duration-300 group"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 group-hover:border-cyan-glow/40 group-hover:bg-cyan-glow/10 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-cyan-glow" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-sm text-white group-hover:text-cyan-glow transition-colors duration-200">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-light">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
