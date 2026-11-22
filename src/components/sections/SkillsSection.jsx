import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skillCategories, SKILL_STATUS } from '../../data/skillsData';
import TechIcon from '../common/TechIcon';
import { Layers, Globe, Filter, Sparkles } from 'lucide-react';

export default function SkillsSection() {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filterOptions = [
    { id: 'ALL', label: 'All Domains (15)' },
    { id: 'HANDS_ON', label: 'Hands-on Experience' },
    { id: 'FAMILIAR', label: 'Familiar with' },
    { id: 'LEARNING', label: 'Currently Learning' }
  ];

  return (
    <section id="skills" className="py-20 border-t border-white/5">
      
      {/* Header & HUD Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-glow">
            <span>// 02</span>
            <span className="w-8 h-[1px] bg-cyan-glow/40"></span>
            <span>CAPABILITIES & SYSTEMS ARCHITECTURE</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight uppercase">
            Technical Skills
          </h2>
          <p className="text-sm font-mono text-zinc-500">
            15 CATEGORIZED DOMAINS • EDITABLE COMPETENCY STATUSES
          </p>
        </div>

        {/* 3D Constellation Staging Pill */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-full border border-white/10 bg-surface-card text-zinc-400 flex items-center space-x-2">
            <Globe className="w-3.5 h-3.5 text-zinc-500" />
            <span>3D CONSTELLATION: STAGED FOR PHASE 4</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-8 text-xs font-mono">
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
                ? 'bg-cyan-glow/15 border-cyan-glow/50 text-cyan-glow font-medium'
                : 'bg-surface-card border-white/5 text-zinc-400 hover:border-white/20 hover:text-white'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 15 Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((cat, idx) => {
          // Filter skills if a specific filter is chosen
          const filteredSkills = cat.skills.filter(s => {
            if (activeFilter === 'ALL') return true;
            if (activeFilter === 'HANDS_ON') return s.status.id === 'hands-on';
            if (activeFilter === 'FAMILIAR') return s.status.id === 'familiar';
            if (activeFilter === 'LEARNING') return s.status.id === 'learning';
            return true;
          });

          if (filteredSkills.length === 0) return null;

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.03 }}
              className="p-6 rounded-xl border border-white/5 bg-surface-card/70 hover:border-cyan-glow/30 hover:bg-surface-hover transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                  <span className="text-[10px] font-mono tracking-widest text-zinc-500">
                    // 0{idx + 1}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-glow/90">
                    {cat.badge}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-white tracking-wide mb-4 group-hover:text-cyan-glow transition-colors duration-200">
                  {cat.title}
                </h3>

                {/* Skill Pills */}
                <div className="flex flex-wrap gap-2">
                  {filteredSkills.map((skill, sIdx) => (
                    <div
                      key={sIdx}
                      className="inline-flex items-center space-x-2 px-2.5 py-1.5 rounded-lg border border-white/5 bg-black/40 hover:border-cyan-glow/30 transition-all duration-200"
                    >
                      <TechIcon name={skill.icon} className="w-3.5 h-3.5 text-zinc-400 group-hover:text-cyan-glow" />
                      <span className="text-xs font-mono text-zinc-200">{skill.name}</span>
                      <span 
                        title={skill.status.label}
                        className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${skill.status.color}`}
                      >
                        {skill.status.symbol}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Footer Indicator */}
              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>{filteredSkills.length} {filteredSkills.length === 1 ? 'SKILL' : 'SKILLS'}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-cyan-glow">
                  STATUS: VERIFIED
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend Indicator */}
      <div className="mt-8 p-4 rounded-xl border border-white/5 bg-surface/30 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-400">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-glow" />
          <span className="text-zinc-300">STATUS LEGEND:</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
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

    </section>
  );
}
