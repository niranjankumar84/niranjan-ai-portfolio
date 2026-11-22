import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personalData } from '../../data/portfolioData';
import ProjectPolyhedronCanvas from '../canvas/ProjectPolyhedronCanvas';
import { ExternalLink, Github, Terminal, ArrowUpRight, Sparkles, Activity } from 'lucide-react';

export default function ProjectsSection() {
  const [activeProjectId, setActiveProjectId] = useState(personalData.projects[0].id);

  const activeProject = personalData.projects.find((p) => p.id === activeProjectId) || personalData.projects[0];

  return (
    <section id="projects" className="py-24 border-t border-white/5 relative">
      
      {/* Background Ambient Radial Sheen */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-glow/5 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="space-y-2 pb-14">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-glow">
          <span>// 03</span>
          <span className="w-8 h-[1px] bg-cyan-glow/40" />
          <span>EDITORIAL SYSTEMS & PROTOTYPES</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight uppercase">
            Featured Projects
          </h2>
          <span className="text-xs font-mono text-zinc-500">
            [03 SYSTEMS IN ACTIVE DEVELOPMENT • INTERACTIVE SELECTION]
          </span>
        </div>
      </div>

      {/* Editorial Split Layout: Left List / Right 3D Polyhedron */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Large Numbered Project List & Interactive Selection */}
        <div className="lg:col-span-7 space-y-6">
          {personalData.projects.map((project) => {
            const isActive = project.id === activeProjectId;

            return (
              <div
                key={project.id}
                onClick={() => setActiveProjectId(project.id)}
                className={`cursor-pointer transition-all duration-300 border-b border-white/10 pb-8 pt-4 ${
                  isActive ? 'opacity-100' : 'opacity-40 hover:opacity-80'
                }`}
              >
                {/* Number & Status Line */}
                <div className="flex items-center justify-between pb-2">
                  <span className="font-mono text-xs text-zinc-400">
                    SYSTEM // {project.number}
                  </span>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full border border-cyan-glow/30 bg-cyan-glow/10 text-cyan-glow font-mono text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-pulse" />
                    <span>{project.status}</span>
                  </div>
                </div>

                {/* Big Editorial Project Title */}
                <h3 className={`font-display font-extrabold text-2xl sm:text-4xl uppercase tracking-tight transition-colors duration-200 ${
                  isActive ? 'text-white text-glow-white' : 'text-zinc-400'
                }`}>
                  {project.title}
                </h3>

                {/* Expanded Editorial Content when Active */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35 }}
                      className="space-y-4 pt-4 overflow-hidden"
                    >
                      <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
                        {project.summary}
                      </p>

                      <p className="text-xs sm:text-sm text-zinc-500 font-mono leading-relaxed">
                        {project.description}
                      </p>

                      {/* Tech Stack Chips */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {project.techStack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 rounded-md border border-white/10 bg-white/5 text-[11px] font-mono text-zinc-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Action Links */}
                      <div className="pt-3 flex items-center space-x-6 text-xs font-mono">
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-2 text-cyan-glow hover:text-white transition-colors"
                        >
                          <Github className="w-4 h-4" />
                          <span>GITHUB REPOSITORY</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>

                        <span className="text-zinc-600">
                          // ACTIVE WORKSPACE [IN PROGRESS]
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Right Column: Animated 3D Faceted Crystal / Polyhedron Canvas */}
        <div className="lg:col-span-5 sticky top-28 flex flex-col items-center justify-center">
          <div className="w-full relative rounded-3xl border border-white/10 bg-black/80 backdrop-blur-xl p-4 overflow-hidden shadow-2xl">
            {/* Top Telemetry Tag */}
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pb-2 px-2 border-b border-white/5">
              <span>PROJECT // {activeProject.number}</span>
              <span className="text-cyan-glow">{activeProject.title.toUpperCase()}</span>
            </div>

            {/* 3D Polyhedron Canvas */}
            <ProjectPolyhedronCanvas
              projectType={activeProject.polyhedronType}
              accentColor={activeProject.accentColor}
            />

            {/* Bottom Telemetry Note */}
            <div className="pt-2 px-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-zinc-500">
              <span>GEOMETRY: {activeProject.polyhedronType.toUpperCase()}</span>
              <span>STATE: ACTIVE_TELEMETRY</span>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
