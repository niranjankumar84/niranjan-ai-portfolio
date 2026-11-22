import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personalData } from '../../data/portfolioData';
import { Award, CheckCircle2, ShieldCheck, X, FileText, Sparkles } from 'lucide-react';

export default function AchievementsSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const achievement = personalData.achievements[0];

  return (
    <section id="achievements" className="py-24 border-t border-white/5 relative">
      
      {/* Background Ambient Radial Sheen */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-glow/5 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="space-y-2 pb-14">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-glow">
          <span>// 05</span>
          <span className="w-8 h-[1px] bg-cyan-glow/40" />
          <span>VERIFIED CREDENTIALS & SPECIALIZED COURSEWORK</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight uppercase">
            Certifications
          </h2>
          <span className="text-xs font-mono text-zinc-500">
            [01 VERIFIED PROFESSIONAL COURSEWORK]
          </span>
        </div>
      </div>

      {/* Editorial Credential Showcase (Single verified entry, no generic cards) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-black/70 backdrop-blur-xl p-8 sm:p-12 relative overflow-hidden shadow-2xl space-y-8 group"
      >
        {/* Corner Cyber Accents */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-glow/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-glow/20 transition-all duration-700" />
        <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-cyan-glow pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-cyan-glow pointer-events-none" />

        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 text-xs font-mono">
          <div className="flex items-center space-x-2 text-cyan-glow">
            <ShieldCheck className="w-4 h-4" />
            <span>VERIFIED CREDENTIAL // ENTRY {achievement.number}</span>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-mono text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{achievement.status.toUpperCase()}</span>
          </div>
        </div>

        {/* Title & Organization */}
        <div className="space-y-3">
          <div className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
            // ISSUING ACADEMY: {achievement.issuer.toUpperCase()}
          </div>
          <h3 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight group-hover:text-cyan-glow transition-colors duration-300">
            {achievement.title}
          </h3>
          <p className="font-mono text-lg sm:text-xl text-cyan-glow">
            {achievement.subtitle}
          </p>
        </div>

        {/* Curriculum & Description */}
        <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed max-w-3xl">
          {achievement.description}
        </p>

        {/* Action & Verification Telemetry */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center space-x-3 text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-pulse" />
            <span>CURRICULUM: MACHINE LEARNING & NEURAL FOUNDATIONS</span>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full border border-cyan-glow/40 bg-cyan-glow/10 text-cyan-glow hover:bg-cyan-glow hover:text-black hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all duration-300 font-bold"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>INSPECT CREDENTIAL DETAILS</span>
          </button>
        </div>

      </motion.div>

      {/* Modal Dialog */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl rounded-3xl border border-white/15 bg-black/95 p-8 shadow-2xl space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full border border-white/10 text-zinc-400 hover:text-white hover:border-white/30 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2">
                <span className="text-xs font-mono text-cyan-glow">// VERIFIED CERTIFICATION</span>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                  {achievement.title} — {achievement.subtitle}
                </h3>
              </div>

              {/* Documentation Placeholder Frame */}
              <div className="w-full h-44 rounded-2xl border border-dashed border-cyan-glow/30 bg-white/[0.02] p-6 flex flex-col items-center justify-center space-y-2 text-center">
                <Award className="w-8 h-8 text-cyan-glow" />
                <span className="font-mono text-xs text-zinc-300">
                  APNA COLLEGE AI/ML VERIFIED COURSEWORK
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  Curriculum completed with distinction across fundamental ML paradigms.
                </span>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono text-zinc-400">CURRICULUM SPECIFICATION:</div>
                <p className="text-sm text-zinc-300 leading-relaxed font-light">
                  {achievement.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>PRESS [ESC] OR CLICK OUTSIDE TO DISMISS</span>
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-white/10 hover:border-cyan-glow/40 text-zinc-300 hover:text-cyan-glow transition-colors"
                >
                  DISMISS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
