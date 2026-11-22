import React from 'react';
import { motion } from 'framer-motion';
import { personalData } from '../../data/portfolioData';
import { ExternalLink, Github, Terminal, Sparkles, Layers } from 'lucide-react';

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-20 border-t border-white/5">
      
      {/* Header */}
      <div className="space-y-2 pb-12">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-glow">
          <span>// 03</span>
          <span className="w-8 h-[1px] bg-cyan-glow/40"></span>
          <span>SELECTED WORK & PROTOTYPES</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight uppercase">
            Featured Projects
          </h2>
          <span className="text-xs font-mono text-zinc-500">
            [03 SYSTEMS IN ACTIVE DEVELOPMENT]
          </span>
        </div>
      </div>

      {/* Projects Grid (Responsive 3-column / 2-column / 1-column) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {personalData.projects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="rounded-2xl border border-white/10 bg-surface-card/60 backdrop-blur-xl p-8 flex flex-col justify-between hover:border-cyan-glow/40 transition-all duration-300 group relative overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-cyan-glow/5 rounded-full blur-2xl group-hover:bg-cyan-glow/10 transition-colors duration-500 pointer-events-none"></div>

            <div className="space-y-6">
              
              {/* Project Card Header: Index & Status */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <span className="font-mono text-xs text-zinc-500">
                  PROJECT // {project.number}
                </span>
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow font-mono text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-pulse"></span>
                  <span>{project.status.toUpperCase()}</span>
                </span>
              </div>

              {/* Title & Summary */}
              <div className="space-y-3">
                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white group-hover:text-cyan-glow transition-colors duration-200">
                  {project.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                  {project.summary}
                </p>
              </div>

              {/* Visual Placeholder (Screenshots / 3D Artifact Slot) */}
              <div className="w-full h-36 rounded-xl border border-white/5 bg-black/60 p-4 flex flex-col justify-between relative overflow-hidden">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-600">
                  <span>TELEMETRY</span>
                  <span>PREVIEW_SLOT</span>
                </div>
                
                {/* Center Blueprint Graphic */}
                <div className="flex flex-col items-center justify-center space-y-1.5 text-center">
                  <div className="w-8 h-8 rounded-lg border border-dashed border-cyan-glow/30 bg-cyan-glow/5 flex items-center justify-center">
                    <Terminal className="w-4 h-4 text-cyan-glow/80" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 tracking-wider">
                    {project.previewPlaceholder}
                  </span>
                </div>

                <div className="text-[9px] font-mono text-zinc-600 text-right">
                  // EDITABLE PLACEHOLDER
                </div>
              </div>

              {/* Detailed Description */}
              <p className="text-xs text-zinc-500 font-mono leading-relaxed">
                {project.description}
              </p>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {project.techStack.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 rounded-md border border-white/5 bg-white/5 text-[11px] font-mono text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

            </div>

            {/* Links & Actions (Editable Placeholders) */}
            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 text-xs font-mono text-zinc-400 hover:text-cyan-glow transition-colors duration-200"
              >
                <Github className="w-4 h-4" />
                <span>REPOSITORY</span>
              </a>

              <a
                href={project.links.demo}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-surface text-zinc-400 hover:border-cyan-glow/40 hover:text-cyan-glow text-xs font-mono transition-all duration-200"
              >
                <span>DEMO</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </motion.div>
        ))}
      </div>

    </section>
  );
}
