import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skillCategories, SKILL_STATUS } from '../../data/skillsData';
import TechIcon from '../common/TechIcon';
import SkillsConstellationCanvas from '../canvas/SkillsConstellationCanvas';
import { Globe, LayoutGrid, Sparkles, Filter, CheckCircle2 } from 'lucide-react';

export default function SkillsSection() {
  const [viewMode, setViewMode] = useState('3D'); // '3D' | '2D'
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filterOptions = [
    { id: 'ALL', label: 'All Domains (15)' },
    { id: 'HANDS_ON', label: 'Hands-on Experience' },
    { id: 'FAMILIAR', label: 'Familiar with' },
    { id: 'LEARNING', label: 'Currently Learning' }
  ];

  return (
    <section id="skills" className="py-24 border-t border-white/5 relative">
      
      {/* Background Ambient Sheen */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-glow/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & HUD View Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-glow">
            <span>// 02</span>
            <span className="w-8 h-[1px] bg-cyan-glow/40" />
            <span>KINETIC ARCHITECTURE & COMPETENCY GRAPH</span>
          </div>
          <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight uppercase">
            Technical Skills
          </h2>
          <p className="text-sm font-mono text-zinc-500">
            15 CATEGORIZED DOMAINS • EDITABLE COMPETENCY STATUSES • SPATIAL 3D GRAPH
          </p>
        </div>

        {/* View Mode Toggle: 3D Constellation vs 2D Matrix */}
        <div className="flex items-center space-x-2 p-1.5 rounded-full border border-white/10 bg-black/60 backdrop-blur-md">
          <button
            onClick={() => setViewMode('3D')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full font-mono text-xs transition-all duration-300 ${
              viewMode === '3D'
                ? 'bg-cyan-glow/20 border border-cyan-glow/50 text-cyan-glow shadow-[0_0_15px_rgba(0,229,255,0.3)] font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3D CONSTELLATION</span>
          </button>

          <button
            onClick={() => setViewMode('2D')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full font-mono text-xs transition-all duration-300 ${
              viewMode === '2D'
                ? 'bg-cyan-glow/20 border border-cyan-glow/50 text-cyan-glow shadow-[0_0_15px_rgba(0,229,255,0.3)] font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>2D MATRIX VIEW</span>
          </button>
        </div>
      </div>

      {/* Main Presentation Area */}
      <AnimatePresence mode="wait">
        {viewMode === '3D' ? (
          <motion.div
            key="3d-constellation"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Interactive 3D Constellation Canvas */}
            <SkillsConstellationCanvas onSelectNode={(node) => setSelectedNode(node)} />

            {/* Selection Telemetry Bar */}
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl border border-cyan-glow/30 bg-black/80 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-cyan-glow uppercase tracking-wider">
                    // ACTIVE SELECTION TELEMETRY
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-display font-bold text-xl text-white">
                      {selectedNode.name}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-zinc-300">
                      {selectedNode.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {selectedNode.status && (
                    <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-cyan-glow/40 bg-cyan-glow/10 text-cyan-glow text-xs font-mono">
                      <span>{selectedNode.status.symbol}</span>
                      <span>{selectedNode.status.label}</span>
                    </div>
                  )}
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-xs font-mono text-zinc-500 hover:text-white transition-colors"
                  >
                    DISMISS [×]
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="2d-matrix"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Filter Tabs for 2D Matrix */}
            <div className="flex flex-wrap items-center gap-2 pb-2 text-xs font-mono">
              <span className="text-zinc-500 flex items-center space-x-1 mr-2">
                <Filter className="w-3 h-3" />
                <span>FILTER:</span>
              </span>
              {filterOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setActiveFilter(opt.id)}
                  className={`px-3 py-1 rounded-full border transition-all duration-200 ${
                    activeFilter === opt.id
                      ? 'bg-cyan-glow/15 border-cyan-glow/50 text-cyan-glow font-medium shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                      : 'bg-black/40 border-white/5 text-zinc-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Editorial Matrix Grid (Clean tabular rows / cells, no clumsy cards) */}
            <div className="border border-white/10 rounded-2xl bg-black/60 backdrop-blur-xl overflow-hidden divide-y divide-white/5">
              {skillCategories.map((cat, idx) => {
                const filteredSkills = cat.skills.filter((s) => {
                  if (activeFilter === 'ALL') return true;
                  if (activeFilter === 'HANDS_ON') return s.status.id === 'hands-on';
                  if (activeFilter === 'FAMILIAR') return s.status.id === 'familiar';
                  if (activeFilter === 'LEARNING') return s.status.id === 'learning';
                  return true;
                });

                if (filteredSkills.length === 0) return null;

                return (
                  <div
                    key={cat.id}
                    className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Category Label */}
                    <div className="lg:col-span-4 space-y-1">
                      <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-500">
                        <span>// 0{idx + 1}</span>
                        <span>•</span>
                        <span className="text-cyan-glow/90">{cat.badge}</span>
                      </div>
                      <h3 className="font-display font-bold text-base text-white">
                        {cat.title}
                      </h3>
                    </div>

                    {/* Skill Badges */}
                    <div className="lg:col-span-8 flex flex-wrap gap-2.5">
                      {filteredSkills.map((skill, sIdx) => (
                        <div
                          key={sIdx}
                          className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:border-cyan-glow/40 hover:bg-cyan-glow/5 transition-all text-xs font-mono"
                        >
                          <TechIcon name={skill.icon} className="w-3.5 h-3.5 text-zinc-400" />
                          <span className="text-zinc-200">{skill.name}</span>
                          <span
                            title={skill.status.label}
                            className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${skill.status.color}`}
                          >
                            {skill.status.symbol}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="p-4 rounded-xl border border-white/5 bg-black/40 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-400">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-glow" />
                <span className="text-zinc-300">STATUS LEGEND:</span>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-[11px]">
                <span className="flex items-center space-x-1.5">
                  <span className="text-emerald-400">●</span>
                  <span>Hands-on Experience</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="text-sky-400">▲</span>
                  <span>Familiar with</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="text-amber-400">◆</span>
                  <span>Currently Learning</span>
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
