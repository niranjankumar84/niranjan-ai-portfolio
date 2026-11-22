import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projectWorlds } from '../../data/projectWorldsData';
import GymTrainerKinematicsSimulation from './simulations/GymTrainerKinematicsSimulation';
import LexAIVectorSpaceSimulation from './simulations/LexAIVectorSpaceSimulation';
import ResumeATSSemanticSimulation from './simulations/ResumeATSSemanticSimulation';
import { 
  X, 
  Github, 
  ExternalLink, 
  Activity, 
  Cpu, 
  Layers, 
  Terminal, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Compass,
  ArrowRight,
  Maximize2
} from 'lucide-react';

export default function ProjectWorldModal({ isOpen, onClose, initialProjectId = 'gym-trainer' }) {
  const [activeProjectId, setActiveProjectId] = useState(initialProjectId);
  const [activeTab, setActiveTab] = useState('blueprint'); // 'blueprint' | 'simulation' | 'progress'

  useEffect(() => {
    if (initialProjectId) {
      setActiveProjectId(initialProjectId);
    }
  }, [initialProjectId]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && e.altKey) {
        // Alt + ArrowRight: Next project
        const currentIdx = projectWorlds.findIndex((p) => p.id === activeProjectId);
        const nextIdx = (currentIdx + 1) % projectWorlds.length;
        setActiveProjectId(projectWorlds[nextIdx].id);
      } else if (e.key === 'ArrowLeft' && e.altKey) {
        // Alt + ArrowLeft: Prev project
        const currentIdx = projectWorlds.findIndex((p) => p.id === activeProjectId);
        const prevIdx = (currentIdx - 1 + projectWorlds.length) % projectWorlds.length;
        setActiveProjectId(projectWorlds[prevIdx].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, activeProjectId]);

  if (!isOpen) return null;

  const currentProject = projectWorlds.find((p) => p.id === activeProjectId) || projectWorlds[0];
  const { caseStudy } = currentProject;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-world-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl max-h-[92vh] bg-black/95 rounded-2xl border shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col font-sans z-10"
          style={{ borderColor: `${currentProject.accentColor}50` }}
        >
          {/* Top Project Switcher & Telemetry Bar */}
          <div className="flex flex-wrap items-center justify-between px-5 sm:px-6 py-3.5 border-b border-white/10 bg-white/[0.02] gap-3">
            
            {/* World Switcher Tabs */}
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
              {projectWorlds.map((proj) => {
                const isActive = proj.id === activeProjectId;
                return (
                  <button
                    key={proj.id}
                    onClick={() => {
                      setActiveProjectId(proj.id);
                      setActiveTab('blueprint');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                      isActive
                        ? 'bg-white/10 font-bold border'
                        : 'text-zinc-400 hover:text-white border border-transparent hover:border-white/10'
                    }`}
                    style={{
                      borderColor: isActive ? proj.accentColor : undefined,
                      color: isActive ? proj.accentColor : undefined
                    }}
                  >
                    <span>0{proj.number}</span>
                    <span className="hidden sm:inline">// {proj.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Status & Close Controls */}
            <div className="flex items-center space-x-3">
              <div 
                className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono border"
                style={{
                  borderColor: `${currentProject.accentColor}60`,
                  backgroundColor: `${currentProject.accentColor}10`,
                  color: currentProject.accentColor
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: currentProject.accentColor }} />
                <span>{currentProject.status}</span>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors border border-white/10 text-xs font-mono flex items-center space-x-1"
                aria-label="Close project world modal"
              >
                <X className="w-4 h-4" />
                <span className="text-[10px] text-zinc-500 hidden sm:inline">[ESC]</span>
              </button>
            </div>

          </div>

          {/* Project Identity Hero Bar */}
          <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-white/5 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <span className="text-zinc-400 flex items-center space-x-2">
                <span className="text-white font-bold">{currentProject.systemCode}</span>
                <span>//</span>
                <span style={{ color: currentProject.accentColor }}>{currentProject.themeBadge}</span>
              </span>
              <span className="text-zinc-500 text-[10px]">VERIFIED CASE STUDY DOSSIER</span>
            </div>

            <h2 
              id="project-world-title" 
              className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight uppercase"
            >
              {currentProject.title}
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed max-w-4xl">
              {currentProject.heroStatement}
            </p>

            {/* Interior Sub-Navigation Tabs */}
            <div className="flex items-center space-x-2 pt-3 border-t border-white/5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('blueprint')}
                className={`px-4 py-2 rounded-lg text-xs font-mono transition-all flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === 'blueprint'
                    ? 'bg-white/10 text-white font-bold border'
                    : 'text-zinc-400 hover:text-white'
                }`}
                style={{
                  borderColor: activeTab === 'blueprint' ? currentProject.accentColor : 'transparent',
                  color: activeTab === 'blueprint' ? currentProject.accentColor : undefined
                }}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>01 // ARCHITECTURAL BLUEPRINT</span>
              </button>

              <button
                onClick={() => setActiveTab('simulation')}
                className={`px-4 py-2 rounded-lg text-xs font-mono transition-all flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === 'simulation'
                    ? 'bg-white/10 text-white font-bold border shadow-[0_0_15px_rgba(0,0,0,0.5)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
                style={{
                  borderColor: activeTab === 'simulation' ? currentProject.accentColor : 'transparent',
                  color: activeTab === 'simulation' ? currentProject.accentColor : undefined
                }}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>02 // LIVE TELEMETRY SIMULATION</span>
              </button>

              <button
                onClick={() => setActiveTab('progress')}
                className={`px-4 py-2 rounded-lg text-xs font-mono transition-all flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === 'progress'
                    ? 'bg-white/10 text-white font-bold border'
                    : 'text-zinc-400 hover:text-white'
                }`}
                style={{
                  borderColor: activeTab === 'progress' ? currentProject.accentColor : 'transparent',
                  color: activeTab === 'progress' ? currentProject.accentColor : undefined
                }}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>03 // TECH STACK & ROADMAP</span>
              </button>
            </div>
          </div>

          {/* Scrollable Main Content Body */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
            
            {/* TAB 1: ARCHITECTURAL BLUEPRINT */}
            {activeTab === 'blueprint' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Problem & Objective Dual Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
                    <div className="text-xs font-mono text-zinc-400 uppercase flex items-center space-x-2">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                      <span>THE PROBLEM LANDSCAPE</span>
                    </div>
                    <p className="text-xs sm:text-sm font-mono text-zinc-300 leading-relaxed">
                      {caseStudy.problem}
                    </p>
                  </div>

                  <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
                    <div className="text-xs font-mono text-zinc-400 uppercase flex items-center space-x-2">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-glow" />
                      <span>TECHNICAL OBJECTIVE</span>
                    </div>
                    <p className="text-xs sm:text-sm font-mono text-zinc-300 leading-relaxed">
                      {caseStudy.objective}
                    </p>
                  </div>
                </div>

                {/* Algorithmic Approach */}
                <div className="p-5 rounded-xl border border-white/10 bg-black/50 space-y-2">
                  <div className="text-xs font-mono text-zinc-400 uppercase flex items-center space-x-2">
                    <Compass className="w-3.5 h-3.5" style={{ color: currentProject.accentColor }} />
                    <span>ALGORITHMIC & SYSTEM APPROACH</span>
                  </div>
                  <p className="text-xs sm:text-sm font-mono text-zinc-300 leading-relaxed">
                    {caseStudy.approach}
                  </p>
                </div>

                {/* 4-Stage Computational Pipeline */}
                <div className="space-y-3">
                  <div className="text-xs font-mono text-zinc-400 uppercase flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Layers className="w-3.5 h-3.5" style={{ color: currentProject.accentColor }} />
                      <span>END-TO-END COMPUTATIONAL PIPELINE</span>
                    </span>
                    <span className="text-[10px] text-zinc-500">4-STAGE FLOW</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {caseStudy.pipeline.map((step, idx) => (
                      <div 
                        key={idx}
                        className="p-4 rounded-xl border border-white/10 bg-black/60 space-y-2 hover:border-white/25 transition-colors"
                      >
                        <div 
                          className="text-[10px] font-mono font-bold"
                          style={{ color: currentProject.accentColor }}
                        >
                          {step.stage}
                        </div>
                        <div className="text-xs font-bold text-white uppercase">
                          {step.title}
                        </div>
                        <div className="text-[11px] font-mono text-zinc-400 leading-relaxed">
                          {step.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB 2: LIVE TELEMETRY SIMULATION */}
            {activeTab === 'simulation' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {currentProject.id === 'gym-trainer' && <GymTrainerKinematicsSimulation />}
                {currentProject.id === 'lexai-india' && <LexAIVectorSpaceSimulation />}
                {currentProject.id === 'ai-resume-ats' && <ResumeATSSemanticSimulation />}
              </motion.div>
            )}

            {/* TAB 3: TECH STACK & ROADMAP */}
            {activeTab === 'progress' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Verified Core Technologies */}
                <div className="space-y-3">
                  <div className="text-xs font-mono text-zinc-400 uppercase flex items-center space-x-2">
                    <Cpu className="w-3.5 h-3.5" style={{ color: currentProject.accentColor }} />
                    <span>VERIFIED CORE TECHNOLOGIES</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {caseStudy.technologies.map((t, idx) => (
                      <div 
                        key={idx}
                        className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] space-y-1"
                      >
                        <div className="text-[10px] font-mono text-zinc-500 uppercase">
                          {t.category}
                        </div>
                        <div className="text-xs font-bold text-white font-mono flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentProject.accentColor }} />
                          <span>{t.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Development Progress Roadmap */}
                <div className="space-y-3">
                  <div className="text-xs font-mono text-zinc-400 uppercase flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5" style={{ color: currentProject.accentColor }} />
                      <span>DEVELOPMENT PROGRESS ROADMAP</span>
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">STATUS: {currentProject.status}</span>
                  </div>

                  <div className="space-y-2 border border-white/10 rounded-xl p-4 bg-black/60 divide-y divide-white/5">
                    {caseStudy.developmentProgress.map((phase, idx) => (
                      <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center space-x-2.5">
                          <CheckCircle2 className={`w-4 h-4 ${phase.completed ? 'text-emerald-400' : 'text-zinc-600'}`} />
                          <span className={phase.completed ? 'text-zinc-200' : 'text-zinc-400'}>
                            {phase.phase}
                          </span>
                        </div>
                        <span 
                          className="text-[10px] px-2 py-0.5 rounded border"
                          style={{
                            borderColor: phase.completed ? `${currentProject.accentColor}50` : 'rgba(255,255,255,0.1)',
                            color: phase.completed ? currentProject.accentColor : '#71717A',
                            backgroundColor: phase.completed ? `${currentProject.accentColor}10` : 'transparent'
                          }}
                        >
                          {phase.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Editable Placeholders & Benchmark Notices */}
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2 font-mono text-xs">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold">
                    <ShieldAlert className="w-4 h-4" />
                    <span>HONEST ENGINEERING BENCHMARK NOTICE</span>
                  </div>
                  <div className="space-y-1 text-zinc-400 text-[11px] leading-relaxed">
                    <div>• <span className="text-zinc-300">{caseStudy.placeholders.benchmarkMetrics}</span></div>
                    <div>• <span className="text-zinc-300">{caseStudy.placeholders.deploymentUrl}</span></div>
                    <div>• <span className="text-zinc-300">{caseStudy.placeholders.sampleData}</span></div>
                  </div>
                </div>

              </motion.div>
            )}

          </div>

          {/* Modal Footer Command Bar */}
          <div className="px-6 sm:px-8 py-4 border-t border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-4">
            <div className="text-[11px] font-mono text-zinc-500">
              NIRANJAN.AI // RESEARCH WORLD 0{currentProject.number} • STATUS: {currentProject.status}
            </div>

            <div className="flex items-center space-x-3">
              <a
                href={currentProject.links.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full font-mono text-xs font-bold tracking-wider transition-colors shadow-lg"
                style={{
                  backgroundColor: currentProject.accentColor,
                  color: '#000000',
                  boxShadow: `0 0 20px ${currentProject.accentColor}40`
                }}
              >
                <Github className="w-4 h-4" />
                <span>EXPLORE ON GITHUB</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-white/20 hover:border-white/40 text-white font-mono text-xs transition-colors"
              >
                CLOSE WORLD
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
