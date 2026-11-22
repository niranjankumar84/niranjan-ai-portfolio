import React from 'react';
import { motion } from 'framer-motion';
import { personalData } from '../../data/portfolioData';
import { GraduationCap, Calendar, MapPin, BookOpen, Sparkles } from 'lucide-react';

export default function EducationSection() {
  const { education } = personalData;

  return (
    <section id="education" className="py-20 border-t border-white/5">
      
      {/* Header */}
      <div className="space-y-2 pb-12">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-glow">
          <span>// 04</span>
          <span className="w-8 h-[1px] bg-cyan-glow/40"></span>
          <span>WHERE IT STARTED</span>
        </div>
        <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight uppercase">
          Academic Foundation
        </h2>
      </div>

      {/* Main Education Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl rounded-2xl border border-white/10 bg-surface-card/60 backdrop-blur-xl p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-glow/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-white/5">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono tracking-widest text-cyan-glow">
                // UNDERGRADUATE DEGREE
              </span>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                {education.degree}
              </h3>
              <p className="text-base text-zinc-300 font-medium">
                {education.institution}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end space-y-2 font-mono text-xs">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-zinc-300">
              <Calendar className="w-3.5 h-3.5 text-cyan-glow" />
              <span>EXPECTED GRADUATION: {education.expectedGraduation}</span>
            </div>
            <span className="text-[11px] text-zinc-500">
              STATUS: {education.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Core Curriculum Focus Areas */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
            <BookOpen className="w-3.5 h-3.5 text-cyan-glow" />
            <span>CORE CURRICULUM & THEORETICAL FOUNDATIONS:</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {education.focusAreas.map((area, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg border border-white/5 bg-black/40 text-xs font-mono text-zinc-300 hover:border-cyan-glow/30 transition-colors duration-200"
              >
                {area}
              </span>
            ))}
          </div>
        </div>

      </motion.div>

    </section>
  );
}
