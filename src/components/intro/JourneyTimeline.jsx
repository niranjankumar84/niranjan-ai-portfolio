/**
 * JourneyTimeline.jsx
 * Interactive Personal Journey Timeline for Scene 3 (Human Philosophy)
 * Placed below the existing academic grounding grid.
 * Uses Framer Motion + Tailwind — no new dependencies.
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────── DATA ─────────────────────────── */
const MILESTONES = [
  {
    id: 'M01',
    index: 0,
    category: 'EDUCATION',
    categoryColor: '#00E5FF',
    title: 'Academic Foundation',
    headline: 'BCA · BIT Mesra · 2024–2027',
    detail:
      'Pursuing a Bachelor of Computer Applications at the Birla Institute of Technology, Mesra — building a rigorous foundation in computer science, mathematics, and software engineering.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.63 48.63 0 0 1 12 20.904a48.63 48.63 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-1.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
    tags: ['BCA', 'Computer Science', 'BIT Mesra'],
    status: 'ACTIVE',
  },
  {
    id: 'M02',
    index: 1,
    category: 'LEARNING',
    categoryColor: '#A855F7',
    title: 'Technical Exploration',
    headline: 'Python · Machine Learning · AI',
    detail:
      'Independently exploring machine learning, applied AI, and software engineering principles — translating curiosity into working knowledge through hands-on experimentation and research.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    tags: ['Python', 'Machine Learning', 'AI Research'],
    status: 'ONGOING',
  },
  {
    id: 'M03',
    index: 2,
    category: 'IN PROGRESS',
    categoryColor: '#F59E0B',
    title: 'Building Projects',
    headline: 'LexAI-India · AI Gym Trainer · AI Resume ATS',
    detail:
      'Actively developing three AI-powered projects: a legal intelligence system for Indian law, an AI personal trainer, and a semantic resume screening system — each applying verified technical skills to real problems.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25z" />
      </svg>
    ),
    tags: ['LexAI-India', 'AI Gym Trainer', 'ATS System'],
    status: 'BUILDING',
  },
  {
    id: 'M04',
    index: 3,
    category: 'FUTURE DIRECTION',
    categoryColor: '#10B981',
    title: 'The Next Chapter',
    headline: 'Growing into an AI-focused Software Engineer',
    detail:
      'Aiming to bridge academic understanding and production engineering — contributing to meaningful AI systems, developing depth in applied ML, and growing into a reliable, impact-driven software engineer.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
      </svg>
    ),
    tags: ['AI Engineering', 'Production ML', 'Impact'],
    status: 'AHEAD',
  },
];

/* ─────────────────────── SUB-COMPONENTS ───────────────────── */

function MilestoneNode({ milestone, isActive, onClick, lineProgress }) {
  const { id, category, categoryColor, title, headline, icon, status } = milestone;

  return (
    <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
      {/* Connector line + node row */}
      <div className="relative flex items-center w-full">
        {/* Left connector (not on first) */}
        {milestone.index > 0 && (
          <div className="flex-1 h-[1px] relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10" />
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-cyan-400 to-cyan-400"
              initial={{ width: '0%' }}
              animate={{ width: isActive || lineProgress ? '100%' : '0%' }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            />
            {/* Pulse dot on active line */}
            {(isActive || lineProgress) && (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,229,255,0.9)]"
                animate={{ left: ['0%', '100%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </div>
        )}

        {/* Node button */}
        <motion.button
          onClick={onClick}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.95 }}
          aria-pressed={isActive}
          aria-label={`Milestone ${id}: ${title}`}
          className="relative flex-shrink-0 w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400"
          style={{
            borderColor: isActive ? categoryColor : 'rgba(255,255,255,0.15)',
            backgroundColor: isActive ? `${categoryColor}20` : 'rgba(0,0,0,0.5)',
            color: isActive ? categoryColor : '#71717a',
            boxShadow: isActive ? `0 0 18px ${categoryColor}55` : 'none',
          }}
        >
          {icon}
          {/* Active pulse ring */}
          {isActive && (
            <motion.span
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: categoryColor }}
              animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
        </motion.button>

        {/* Right connector (not on last) */}
        {milestone.index < MILESTONES.length - 1 && (
          <div className="flex-1 h-[1px] bg-white/10" />
        )}
      </div>

      {/* Label below node */}
      <div className="text-center px-1 space-y-0.5">
        <div
          className="text-[9px] font-mono tracking-widest uppercase font-bold"
          style={{ color: categoryColor }}
        >
          {id} · {category}
        </div>
        <div
          className={`text-[11px] font-semibold leading-tight transition-colors duration-200 ${
            isActive ? 'text-white' : 'text-zinc-400'
          }`}
        >
          {title}
        </div>
      </div>
    </div>
  );
}

function MilestoneDetail({ milestone, onClose }) {
  const { id, category, categoryColor, title, headline, detail, tags, status, icon } = milestone;

  const statusConfig = {
    ACTIVE: { label: 'Active', color: '#00E5FF' },
    ONGOING: { label: 'Ongoing', color: '#A855F7' },
    BUILDING: { label: 'In Progress', color: '#F59E0B' },
    AHEAD: { label: 'Future', color: '#10B981' },
  };
  const st = statusConfig[status] || statusConfig.ACTIVE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative mt-5 rounded-xl border bg-black/70 backdrop-blur-md p-5 space-y-4"
      style={{ borderColor: `${categoryColor}40` }}
    >
      {/* Glow top bar */}
      <div
        className="absolute top-0 left-6 right-6 h-[1px] rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${categoryColor}80, transparent)` }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${categoryColor}18`, color: categoryColor }}
          >
            {icon}
          </div>
          <div>
            <div className="text-[10px] font-mono tracking-widest uppercase" style={{ color: categoryColor }}>
              {id} · {category}
            </div>
            <div className="text-white font-semibold text-sm leading-tight">{title}</div>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close detail view"
          className="text-zinc-500 hover:text-white transition-colors flex-shrink-0 mt-0.5"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Headline */}
      <div className="text-xs font-mono text-zinc-200 leading-relaxed border-l-2 pl-3" style={{ borderColor: categoryColor }}>
        {headline}
      </div>

      {/* Detail text */}
      <p className="text-xs text-zinc-400 leading-relaxed">{detail}</p>

      {/* Tags + status */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-full text-[10px] font-mono border"
            style={{ borderColor: `${categoryColor}35`, color: categoryColor, backgroundColor: `${categoryColor}10` }}
          >
            {tag}
          </span>
        ))}
        <span className="ml-auto flex items-center gap-1.5 text-[10px] font-mono" style={{ color: st.color }}>
          <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ backgroundColor: st.color }} />
          {st.label}
        </span>
      </div>
    </motion.div>
  );
}

/* ─────────────────────── MAIN COMPONENT ───────────────────── */
export default function JourneyTimeline() {
  const [activeId, setActiveId] = useState(null);

  const handleClick = useCallback((id) => {
    setActiveId((prev) => (prev === id ? null : id));
  }, []);

  const activeMilestone = MILESTONES.find((m) => m.id === activeId);

  return (
    <div className="pt-6 border-t border-white/[0.07] space-y-5">
      {/* Section header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
          <span className="w-4 h-[1px] bg-cyan-glow/50" />
          <span>NIRANJAN.AI // JOURNEY MAP</span>
        </div>
        <h3 className="text-lg font-semibold text-white leading-tight">The journey so far.</h3>
        <p className="text-xs text-zinc-500 font-mono">A continuous visual journey from learning to building.</p>
      </div>

      {/* Timeline row */}
      <div className="flex items-start gap-0 w-full">
        {MILESTONES.map((m, i) => (
          <MilestoneNode
            key={m.id}
            milestone={m}
            isActive={activeId === m.id}
            lineProgress={activeId !== null && MILESTONES.findIndex((x) => x.id === activeId) >= i}
            onClick={() => handleClick(m.id)}
          />
        ))}
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {activeMilestone && (
          <MilestoneDetail
            key={activeMilestone.id}
            milestone={activeMilestone}
            onClose={() => setActiveId(null)}
          />
        )}
      </AnimatePresence>

      {/* Hint when nothing selected */}
      {!activeMilestone && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] font-mono text-zinc-600 text-center"
        >
          ↑ tap a milestone to explore
        </motion.p>
      )}
    </div>
  );
}
