import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  skillCategories, 
  SKILL_STATUS, 
  SKILL_PILLARS 
} from '../../data/skillsData';
import TechIcon from '../common/TechIcon';
import SkillsConstellationCanvas from '../canvas/SkillsConstellationCanvas';
import { 
  Globe, 
  LayoutGrid, 
  Sparkles, 
  Filter, 
  Search, 
  X, 
  CheckCircle2, 
  Info,
  Layers,
  Terminal,
  Cpu,
  ArrowRight
} from 'lucide-react';

export default function SkillsSection() {
  const [viewMode, setViewMode] = useState('2D'); // '2D' (Recruiter Focus) | '3D' (Spatial Graph)
  const [activePillar, setActivePillar] = useState('all');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Status Filter Options
  const statusOptions = [
    { id: 'ALL', label: 'All Levels', symbol: '✦' },
    { id: 'hands-on', label: 'Hands-on Experience', symbol: '●', color: 'text-emerald-400' },
    { id: 'familiar', label: 'Familiar with', symbol: '▲', color: 'text-sky-400' },
    { id: 'learning', label: 'Currently Learning', symbol: '◆', color: 'text-amber-400' }
  ];

  // Filter Categories and Skills
  const filteredCategories = useMemo(() => {
    return skillCategories
      .filter((cat) => {
        if (activePillar === 'all') return true;
        return cat.pillar === activePillar;
      })
      .map((cat) => {
        const matchingSkills = cat.skills.filter((skill) => {
          // Status filter
          if (statusFilter !== 'ALL' && skill.status.id !== statusFilter) {
            return false;
          }
          // Search query filter
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            return (
              skill.name.toLowerCase().includes(q) ||
              cat.title.toLowerCase().includes(q) ||
              (skill.context && skill.context.toLowerCase().includes(q))
            );
          }
          return true;
        });

        return {
          ...cat,
          skills: matchingSkills
        };
      })
      .filter((cat) => cat.skills.length > 0);
  }, [activePillar, statusFilter, searchQuery]);

  // Aggregate stats
  const totalSkillsCount = useMemo(() => {
    return skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0);
  }, []);

  const visibleSkillsCount = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.skills.length, 0);
  }, [filteredCategories]);

  return (
    <section 
      id="skills" 
      className="py-24 border-t border-white/5 relative"
      aria-label="Skills and Technical Expertise Architecture"
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-cyan-glow/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header & HUD View Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-glow">
            <span className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
            <span>LAB // 02</span>
            <span className="w-8 h-[1px] bg-cyan-glow/40" />
            <span>TECHNICAL ARCHITECTURE & COMPETENCY INVENTORY</span>
          </div>
          <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight uppercase">
            Technical Skills
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-light max-w-2xl">
            A verified engineering inventory of core programming languages, machine learning frameworks, data science pipelines, and cloud tooling.
          </p>
        </div>

        {/* View Mode Toggle: Interactive 2D Matrix vs 3D Constellation */}
        <div className="flex items-center space-x-2 p-1.5 rounded-full border border-white/10 bg-black/70 backdrop-blur-md self-start md:self-end">
          <button
            type="button"
            onClick={() => setViewMode('2D')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full font-mono text-xs transition-all duration-300 ${
              viewMode === '2D'
                ? 'bg-cyan-glow/20 border border-cyan-glow/50 text-cyan-glow shadow-[0_0_15px_rgba(0,229,255,0.3)] font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
            aria-label="Switch to Recruiter Interactive Matrix View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>INTERACTIVE MATRIX</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('3D')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full font-mono text-xs transition-all duration-300 ${
              viewMode === '3D'
                ? 'bg-cyan-glow/20 border border-cyan-glow/50 text-cyan-glow shadow-[0_0_15px_rgba(0,229,255,0.3)] font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
            aria-label="Switch to 3D Spatial Constellation View"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3D CONSTELLATION</span>
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
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            {/* 3D Constellation Canvas */}
            <SkillsConstellationCanvas onSelectNode={(node) => setSelectedSkill(node)} />

            {/* Selection Telemetry Bar */}
            {selectedSkill && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl border border-cyan-glow/30 bg-black/90 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl"
              >
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-cyan-glow uppercase tracking-wider">
                    // ACTIVE NODE TELEMETRY
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-display font-bold text-xl text-white">
                      {selectedSkill.name}
                    </span>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-white/10 text-zinc-300">
                      {selectedSkill.category}
                    </span>
                  </div>
                </div>

                {selectedSkill.status && (
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-cyan-glow/30 bg-cyan-glow/10 text-cyan-glow font-mono text-xs">
                    <span>{selectedSkill.status.symbol}</span>
                    <span>{selectedSkill.status.label}</span>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="2d-matrix"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="space-y-8"
          >
            {/* Filter & Search Command Row */}
            <div className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl space-y-4">
              
              {/* Category Pillar Filter Pills */}
              <div 
                className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
                role="tablist"
                aria-label="Skill category filter tabs"
              >
                {SKILL_PILLARS.map((pillar) => {
                  const isActive = activePillar === pillar.id;
                  return (
                    <button
                      key={pillar.id}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActivePillar(pillar.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                        isActive
                          ? 'bg-cyan-glow text-black font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                          : 'bg-white/5 border border-white/10 text-zinc-300 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      {pillar.label}
                    </button>
                  );
                })}
              </div>

              {/* Secondary Filter Controls: Competency Filter & Search Input */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/5">
                
                {/* Competency Status Filter */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                  <span className="text-zinc-500 mr-1 flex items-center space-x-1">
                    <Filter className="w-3 h-3" />
                    <span>LEVEL:</span>
                  </span>
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setStatusFilter(opt.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                        statusFilter === opt.id
                          ? 'bg-white/15 border border-cyan-glow/50 text-white font-medium'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span className={opt.color || 'text-zinc-300'}>{opt.symbol}</span>{' '}
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>

                {/* Instant Search Input */}
                <div className="relative min-w-[240px]">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search technology (e.g. Python, RAG)..."
                    className="w-full pl-8 pr-8 py-1.5 bg-black/60 border border-white/15 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-glow/60 transition-colors font-mono"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                      aria-label="Clear search query"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>

            </div>

            {/* Selected Skill Telemetry Drawer (when clicked) */}
            <AnimatePresence>
              {selectedSkill && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 rounded-2xl border border-cyan-glow/40 bg-black/85 backdrop-blur-xl relative space-y-2 shadow-2xl">
                    <button
                      onClick={() => setSelectedSkill(null)}
                      className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-md hover:bg-white/10"
                      aria-label="Close telemetry detail"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center space-x-2 text-[10px] font-mono text-cyan-glow uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-cyan-glow" />
                      <span>// VERIFIED COMPETENCY TELEMETRY</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="font-display font-extrabold text-2xl text-white">
                        {selectedSkill.name}
                      </h4>
                      <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded text-xs font-mono ${selectedSkill.status.color}`}>
                        <span>{selectedSkill.status.symbol}</span>
                        <span>{selectedSkill.status.label}</span>
                      </span>
                    </div>

                    <p className="text-sm font-mono text-zinc-300 pt-1 leading-relaxed max-w-3xl">
                      {selectedSkill.context || "Verified core technology in Niranjan Kumar's technical stack."}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Domain Groupings Grid */}
            {filteredCategories.length > 0 ? (
              <div className="space-y-6">
                {filteredCategories.map((category) => (
                  <div 
                    key={category.id}
                    className="p-6 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl space-y-4 hover:border-white/20 transition-all duration-300"
                  >
                    {/* Domain Category Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                      <div className="flex items-center space-x-3">
                        <span 
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: category.accentColor }} 
                        />
                        <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight">
                          {category.title}
                        </h3>
                        <span 
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                          style={{
                            borderColor: `${category.accentColor}50`,
                            backgroundColor: `${category.accentColor}15`,
                            color: category.accentColor
                          }}
                        >
                          {category.badge}
                        </span>
                      </div>

                      <span className="text-[11px] font-mono text-zinc-500">
                        {category.skills.length} VERIFIED {category.skills.length === 1 ? 'CAPABILITY' : 'CAPABILITIES'}
                      </span>
                    </div>

                    <p className="text-xs font-mono text-zinc-400">
                      {category.description}
                    </p>

                    {/* Skill Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-1">
                      {category.skills.map((skill, sIdx) => {
                        const isSelected = selectedSkill?.name === skill.name;

                        return (
                          <div
                            key={sIdx}
                            onClick={() => setSelectedSkill(skill)}
                            className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2 group ${
                              isSelected
                                ? 'bg-cyan-glow/10 border-cyan-glow shadow-[0_0_20px_rgba(0,229,255,0.2)]'
                                : 'bg-white/[0.02] border-white/10 hover:border-white/25 hover:bg-white/[0.04]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-zinc-300 group-hover:text-white transition-colors">
                                <TechIcon name={skill.icon} className="w-4 h-4 text-cyan-glow" />
                                <span className="font-mono text-xs font-semibold">{skill.name}</span>
                              </div>

                              <span
                                title={skill.status.label}
                                className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${skill.status.color}`}
                              >
                                {skill.status.symbol}
                              </span>
                            </div>

                            <div className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-400 truncate">
                              {skill.status.shortLabel}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl border border-white/10 bg-black/40 space-y-3 font-mono">
                <Info className="w-6 h-6 text-zinc-500 mx-auto" />
                <div className="text-sm text-zinc-300">No technologies found matching query "{searchQuery}"</div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                    setActivePillar('all');
                  }}
                  className="text-xs text-cyan-glow hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            )}

            {/* Recruiter Legend & Verification Notice */}
            <div className="p-5 rounded-2xl border border-white/5 bg-black/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-zinc-400">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-4 h-4 text-cyan-glow flex-shrink-0" />
                <div>
                  <span className="text-white font-semibold">RECRUITER NOTE:</span>{' '}
                  <span className="text-zinc-400">All competencies reflect verified hands-on academic and project application (zero arbitrary percentage bars).</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-[11px] flex-shrink-0">
                <span className="flex items-center space-x-1.5">
                  <span className="text-emerald-400 font-bold">●</span>
                  <span className="text-zinc-300">Hands-on Experience</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="text-sky-400 font-bold">▲</span>
                  <span className="text-zinc-300">Familiar with</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="text-amber-400 font-bold">◆</span>
                  <span className="text-zinc-300">Currently Learning</span>
                </span>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
