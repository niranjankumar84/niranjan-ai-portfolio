import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Github, 
  ExternalLink, 
  Terminal, 
  Cpu, 
  Activity, 
  Layers, 
  ArrowRight,
  ShieldAlert,
  Sparkles,
  GitBranch
} from 'lucide-react';

export default function ProjectDossierModal({ project, isOpen, onClose }) {
  // Listen for Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dossier-modal-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-black/95 rounded-2xl border border-cyan-glow/40 shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_35px_rgba(0,229,255,0.2)] overflow-hidden flex flex-col font-sans z-10"
        >
          {/* Top HUD Telemetry Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-glow animate-pulse" />
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="text-cyan-glow font-bold">{project.systemCode}</span>
                <span className="text-zinc-600">//</span>
                <span className="text-zinc-400 uppercase">RESEARCH DOSSIER</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border border-cyan-glow/40 bg-cyan-glow/10 text-cyan-glow font-mono text-[11px]">
                <Activity className="w-3 h-3 text-cyan-glow" />
                <span>{project.status}</span>
              </div>

              {/* Close Button with ESC hint */}
              <button
                onClick={onClose}
                className="flex items-center space-x-1.5 p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors border border-white/10 text-xs font-mono"
                aria-label="Close dossier modal"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline text-[10px] text-zinc-500">[ESC]</span>
              </button>
            </div>
          </div>

          {/* Modal Content Scrollable Area */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-8">
            
            {/* Project Header */}
            <div className="space-y-3">
              <div className="text-xs font-mono text-cyan-glow tracking-widest">
                SYSTEM // 0{project.number}
              </div>
              <h2 
                id="dossier-modal-title" 
                className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight uppercase"
              >
                {project.title}
              </h2>
              <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
                {project.summary}
              </p>
            </div>

            {/* Architectural Deep-Dive Statement */}
            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400 uppercase">
                <Terminal className="w-3.5 h-3.5 text-cyan-glow" />
                <span>ARCHITECTURAL INTENT</span>
              </div>
              <p className="text-sm text-zinc-300 font-mono leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Architectural Pipeline Schematics */}
            {project.pipeline && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-3.5 h-3.5 text-cyan-glow" />
                    <span className="uppercase">COMPUTATIONAL PIPELINE ARCHITECTURE</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">3-STAGE FLOW</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {project.pipeline.map((step, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-xl border border-white/10 bg-black/50 hover:border-cyan-glow/40 transition-colors space-y-1.5"
                    >
                      <div className="text-[10px] font-mono text-cyan-glow/90 font-bold">
                        {step.stage}
                      </div>
                      <div className="text-xs font-bold text-white uppercase">
                        {step.label}
                      </div>
                      <div className="text-[11px] font-mono text-zinc-400 leading-snug">
                        {step.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Core Technology Stack */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400 uppercase">
                <Cpu className="w-3.5 h-3.5 text-cyan-glow" />
                <span>VERIFIED CORE TECHNOLOGIES</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-3 py-1.5 rounded-lg border border-cyan-glow/30 bg-cyan-glow/5 text-xs font-mono text-cyan-300 flex items-center space-x-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow" />
                    <span>{tech}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Benchmark Status & Honest Engineering Notice */}
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-1.5">
              <div className="flex items-center space-x-2 text-xs font-mono text-amber-400">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>BENCHMARK & CALIBRATION NOTICE</span>
              </div>
              <p className="text-xs font-mono text-zinc-300 leading-relaxed">
                {project.benchmarkNote}
              </p>
              <div className="text-[10px] font-mono text-amber-400/80 pt-1">
                [SYSTEM BENCHMARK: PENDING FORMAL EVALUATION UPON PROTOTYPE STABILIZATION]
              </div>
            </div>

          </div>

          {/* Footer Action Bar */}
          <div className="px-6 sm:px-8 py-4 border-t border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-4">
            <div className="text-[11px] font-mono text-zinc-500">
              NIRANJAN.AI // RESEARCH EXPERIMENT 0{project.number}
            </div>

            <div className="flex items-center space-x-3">
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-cyan-glow text-black font-mono text-xs font-bold tracking-wider hover:bg-cyan-300 transition-colors shadow-[0_0_20px_rgba(0,229,255,0.4)]"
              >
                <Github className="w-4 h-4" />
                <span>EXPLORE GITHUB REPO</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-white/20 hover:border-white/40 text-white font-mono text-xs transition-colors"
              >
                CLOSE
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
