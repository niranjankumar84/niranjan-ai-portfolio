import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personalData } from '../../data/portfolioData';
import ProjectPolyhedronCanvas from '../canvas/ProjectPolyhedronCanvas';
import ProjectWorldModal from '../projects/ProjectWorldModal';
import { 
  Terminal, 
  ArrowRight, 
  Sparkles, 
  Activity, 
  Github, 
  ExternalLink, 
  Layers, 
  Cpu, 
  Maximize2,
  ChevronRight,
  Command
} from 'lucide-react';

export default function ProjectsSection() {
  const [activeProjectId, setActiveProjectId] = useState(personalData.projects[0].id);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isWireframe, setIsWireframe] = useState(false);

  const activeProject = personalData.projects.find((p) => p.id === activeProjectId) || personalData.projects[0];
  const activeIndex = personalData.projects.findIndex((p) => p.id === activeProjectId);

  // Keyboard navigation: 1, 2, 3 to switch, Arrow keys to cycle, Enter to open dossier
  const handleKeyDown = useCallback((e) => {
    // If modal is open, let modal handle Esc/keys
    if (isDossierOpen) return;

    if (e.key === '1') {
      setActiveProjectId(personalData.projects[0].id);
    } else if (e.key === '2') {
      setActiveProjectId(personalData.projects[1].id);
    } else if (e.key === '3') {
      setActiveProjectId(personalData.projects[2].id);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = (activeIndex + 1) % personalData.projects.length;
      setActiveProjectId(personalData.projects[nextIdx].id);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIdx = (activeIndex - 1 + personalData.projects.length) % personalData.projects.length;
      setActiveProjectId(personalData.projects[prevIdx].id);
    } else if (e.key === 'Enter' && (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A')) {
      setIsDossierOpen(true);
    }
  }, [activeIndex, isDossierOpen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <section 
      id="projects" 
      className="py-24 border-t border-white/5 relative"
      aria-label="Projects and Innovation Architecture Laboratory"
    >
      {/* Background Ambient Radial Glow */}
      <div 
        className="absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 transition-colors duration-700 -z-10"
        style={{ backgroundColor: activeProject.accentColor }}
      />
      <div 
        className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-15 transition-colors duration-700 -z-10"
        style={{ backgroundColor: activeProject.accentColor }}
      />

      {/* Laboratory Telemetry Header */}
      <div className="space-y-3 pb-12">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-cyan-glow">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
            <span>LAB // 03</span>
            <span className="w-8 h-[1px] bg-cyan-glow/40" />
            <span className="text-zinc-400">RESEARCH & INNOVATION ARCHITECTURE</span>
          </div>
          <div className="flex items-center space-x-3 text-zinc-500 text-[11px]">
            <span className="hidden sm:inline">CONTROL: [KEYS 1, 2, 3 OR ARROWS]</span>
            <span className="text-cyan-glow/80">•</span>
            <span>SYSTEMS: 03 IN PROGRESS</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight uppercase">
              Innovation Lab
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base font-light max-w-2xl pt-2">
              Three computational research architectures engineered across Computer Vision, Statutory Legal Intelligence, and Semantic Natural Language Evaluation.
            </p>
          </div>

          <div className="text-xs font-mono text-zinc-500 flex items-center space-x-2 self-start md:self-end">
            <span className="px-2.5 py-1 rounded-md border border-white/10 bg-white/5">
              ACTIVE STATION: {activeProject.systemCode}
            </span>
          </div>
        </div>
      </div>

      {/* Laboratory Station Selector Tabs */}
      <div 
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-10"
        role="tablist"
        aria-label="Research project selector"
      >
        {personalData.projects.map((proj, idx) => {
          const isActive = proj.id === activeProjectId;

          return (
            <button
              key={proj.id}
              role="tab"
              id={`tab-${proj.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${proj.id}`}
              onClick={() => setActiveProjectId(proj.id)}
              className={`p-4 rounded-xl text-left border transition-all duration-300 relative group overflow-hidden ${
                isActive
                  ? 'bg-white/[0.04] shadow-[0_0_25px_rgba(0,0,0,0.8)]'
                  : 'bg-black/40 border-white/10 hover:border-white/20 opacity-60 hover:opacity-90'
              }`}
              style={{
                borderColor: isActive ? proj.accentColor : undefined,
              }}
            >
              {/* Active Indicator Top Accent Bar */}
              {isActive && (
                <div 
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: proj.accentColor }}
                />
              )}

              <div className="flex items-center justify-between pb-2 text-[10px] font-mono">
                <span className="text-zinc-400 flex items-center space-x-1.5">
                  <span className="font-bold text-white">0{proj.number}</span>
                  <span>// {proj.systemCode}</span>
                </span>
                <span 
                  className="px-1.5 py-0.5 rounded text-[9px] border"
                  style={{
                    borderColor: `${proj.accentColor}60`,
                    color: proj.accentColor,
                    backgroundColor: `${proj.accentColor}10`
                  }}
                >
                  KEY [{proj.keyboardKey}]
                </span>
              </div>

              <div className={`font-display font-bold text-base sm:text-lg uppercase tracking-tight transition-colors ${
                isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'
              }`}>
                {proj.title}
              </div>

              <div className="flex items-center space-x-2 pt-2 text-[10px] font-mono text-zinc-500">
                <span 
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: proj.accentColor }}
                />
                <span>{proj.status}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Split Command Center: Left Research Dossier / Right 3D Holographic Chamber */}
      <div 
        id={`panel-${activeProject.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeProject.id}`}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
      >
        
        {/* Left Column: Active Project Detailed Research Console */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              {/* System Metadata Tag */}
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono">
                  <span 
                    className="w-2 h-2 rounded-full animate-ping"
                    style={{ backgroundColor: activeProject.accentColor }} 
                  />
                  <span className="text-zinc-400">{activeProject.systemCode}</span>
                  <span className="text-zinc-600">•</span>
                  <span style={{ color: activeProject.accentColor }}>{activeProject.status}</span>
                </div>

                <h3 className="font-display font-extrabold text-3xl sm:text-5xl text-white uppercase tracking-tight">
                  {activeProject.title}
                </h3>

                <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed pt-1">
                  {activeProject.summary}
                </p>
              </div>

              {/* Technical Description */}
              <div className="p-5 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md space-y-2">
                <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
                  <Terminal className="w-3.5 h-3.5 text-cyan-glow" />
                  <span>TECHNICAL ARCHITECTURE OVERVIEW</span>
                </div>
                <p className="text-sm font-mono text-zinc-300 leading-relaxed">
                  {activeProject.description}
                </p>
              </div>

              {/* Computational Pipeline Flow Preview */}
              {activeProject.pipeline && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span className="flex items-center space-x-2">
                      <Layers className="w-3.5 h-3.5 text-cyan-glow" />
                      <span>COMPUTATIONAL PIPELINE</span>
                    </span>
                    <span className="text-[10px] text-zinc-500">3-STAGE VERIFIED FLOW</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {activeProject.pipeline.map((step, idx) => (
                      <div 
                        key={idx}
                        className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] hover:border-cyan-glow/30 transition-colors space-y-1"
                      >
                        <div className="text-[9px] font-mono font-bold" style={{ color: activeProject.accentColor }}>
                          {step.stage}
                        </div>
                        <div className="text-xs font-bold text-white uppercase truncate">
                          {step.label}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400 leading-snug line-clamp-2">
                          {step.detail}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Verified Tech Stack Chips */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
                  <Cpu className="w-3.5 h-3.5 text-cyan-glow" />
                  <span>CORE TECHNOLOGIES</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeProject.techStack.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-mono text-zinc-300 hover:border-cyan-glow/40 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Primary Interaction Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                {/* Inspect Deep-Dive Dossier Button */}
                <button
                  type="button"
                  onClick={() => setIsDossierOpen(true)}
                  className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-full font-mono text-xs font-bold tracking-wider transition-all duration-300 group shadow-lg cursor-pointer"
                  style={{
                    backgroundColor: activeProject.accentColor,
                    color: '#000000',
                    boxShadow: `0 0 25px ${activeProject.accentColor}50`
                  }}
                  aria-label={`Enter Project World and inspect research dossier for ${activeProject.title}`}
                >
                  <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
                  <span>ENTER PROJECT WORLD</span>
                  <Maximize2 className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                </button>

                {/* Source Code Link */}
                <a
                  href={activeProject.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-full border border-white/20 bg-white/5 text-white font-mono text-xs font-semibold tracking-wider hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                >
                  <Github className="w-4 h-4" />
                  <span>SOURCE REPOSITORY</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                </a>
              </div>

              {/* Bottom Quick Keyboard Hint */}
              <div className="flex items-center space-x-2 text-[11px] font-mono text-zinc-500 pt-2 border-t border-white/5">
                <Command className="w-3.5 h-3.5 text-cyan-glow" />
                <span>TIP: PRESS ENTER OR CLICK "INSPECT" FOR ARCHITECTURAL SCHEMATICS</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column: 3D Holographic Chamber */}
        <div className="lg:col-span-5 sticky top-28 flex flex-col items-center justify-center">
          <div className="w-full relative rounded-3xl border border-white/15 bg-black/90 backdrop-blur-2xl p-4 overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.9)]">
            
            {/* Top Chamber Bar */}
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pb-3 px-2 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <span 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: activeProject.accentColor }} 
                />
                <span className="text-white font-bold">{activeProject.systemCode}</span>
              </div>
              <span className="text-zinc-500 uppercase">{activeProject.polyhedronType} MODEL</span>
            </div>

            {/* 3D Polyhedron WebGL Canvas */}
            <ProjectPolyhedronCanvas
              projectType={activeProject.polyhedronType}
              accentColor={activeProject.accentColor}
              projectName={activeProject.title}
              systemCode={activeProject.systemCode}
              isWireframe={isWireframe}
              onToggleWireframe={setIsWireframe}
            />

            {/* Bottom Chamber Telemetry Footer */}
            <div className="pt-3 px-2 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-zinc-500">
              <span>INTERACTION: DRAG TO ROTATE</span>
              <button
                onClick={() => setIsDossierOpen(true)}
                className="text-cyan-glow hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <span>ENTER WORLD</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Immersive Project World Case Study Modal */}
      <ProjectWorldModal
        initialProjectId={activeProject.id}
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />

    </section>
  );
}
