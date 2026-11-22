import React from 'react';
import { motion } from 'framer-motion';
import { personalData } from '../../data/portfolioData';
import { GraduationCap, Calendar, Award, Sparkles } from 'lucide-react';

export default function EducationSection() {
  const milestones = personalData.educationMilestones;

  return (
    <section id="education" className="py-24 border-t border-white/5 relative">
      
      {/* Background Ambient Radial Sheen */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-cyan-glow/5 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="space-y-2 pb-16">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-glow">
          <span>// 04</span>
          <span className="w-8 h-[1px] bg-cyan-glow/40" />
          <span>ACADEMIC FOUNDATION & VERIFIED TIMELINE</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight uppercase">
            Education
          </h2>
          <span className="text-xs font-mono text-zinc-500">
            [VERIFIED RECORDS • CHRONOLOGICAL ACADEMIC PROGRESSION]
          </span>
        </div>
      </div>

      {/* Elegant Editorial Academic Timeline (No generic cards) */}
      <div className="relative max-w-4xl mx-auto">
        
        {/* Glowing Vertical Spine Line */}
        <div className="absolute top-4 bottom-4 left-4 sm:left-8 w-[2px] bg-gradient-to-b from-cyan-glow via-cyan-glow/40 to-transparent pointer-events-none" />

        <div className="space-y-12 sm:space-y-16">
          {milestones.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="relative pl-12 sm:pl-20 group"
            >
              {/* Timeline Glowing Node Marker */}
              <div className="absolute left-2.5 sm:left-6.5 top-2 -translate-x-1/2 w-4 h-4 rounded-full bg-black border-2 border-cyan-glow flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.7)] group-hover:scale-125 transition-transform duration-300">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-glow" />
              </div>

              {/* Editorial Item Content */}
              <div className="border-b border-white/10 pb-8 space-y-4">
                
                {/* Meta Tag & Period Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center space-x-2 text-cyan-glow">
                    <span>// {item.number}</span>
                    <span>•</span>
                    <span className="tracking-widest uppercase text-[11px] text-zinc-400">{item.tag}</span>
                  </div>

                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-zinc-300">
                    <Calendar className="w-3.5 h-3.5 text-cyan-glow" />
                    <span>{item.periodLabel}: {item.periodValue}</span>
                  </div>
                </div>

                {/* Qualification Title */}
                <div className="space-y-1">
                  <h3 className="font-display font-extrabold text-2xl sm:text-4xl text-white uppercase tracking-tight group-hover:text-cyan-glow transition-colors duration-200">
                    {item.qualification}
                  </h3>

                  {item.degree && item.institution && (
                    <div className="flex flex-wrap items-center gap-x-3 text-base sm:text-lg text-zinc-300 font-light">
                      <span className="text-cyan-glow font-mono font-medium">DEGREE: {item.degree}</span>
                      <span>•</span>
                      <span>{item.institution}</span>
                    </div>
                  )}
                </div>

                {/* Prominently Highlighted Academic Percentage */}
                {item.scoreValue && (
                  <div className="pt-2 flex items-baseline space-x-3">
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                      {item.scoreLabel}:
                    </span>
                    <span className="font-display font-black text-3xl sm:text-4xl text-cyan-glow tracking-tight text-glow-cyan">
                      {item.scoreValue}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      [ACADEMIC MERIT]
                    </span>
                  </div>
                )}

                {/* Status Indicator */}
                <div className="pt-1 flex items-center space-x-2 text-[10px] font-mono text-zinc-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow" />
                  <span>STATUS: {item.status}</span>
                </div>

              </div>

            </motion.div>
          ))}
        </div>

      </div>

    </section>
  );
}
