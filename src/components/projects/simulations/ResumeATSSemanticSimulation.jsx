import React, { useState } from 'react';
import { Layers, CheckCircle2, AlertCircle, FileSearch, Sparkles, Cpu, ArrowRight } from 'lucide-react';

const CANDIDATE_PROFILES = [
  {
    id: 'candidate-a',
    label: 'Candidate A (Applied AI & Python)',
    jobRole: 'Software Engineer with AI',
    extractedEntities: [
      { name: 'Python', category: 'Language', match: true },
      { name: 'FastAPI', category: 'Backend API', match: true },
      { name: 'Computer Vision', category: 'AI/ML', match: true },
      { name: 'PyTorch', category: 'Deep Learning', match: true },
      { name: 'RAG & Embeddings', category: 'Generative AI', match: true },
      { name: 'SQL', category: 'Database', match: true },
      { name: 'Git / GitHub', category: 'Tooling', match: true }
    ],
    targetRequirements: [
      { name: 'Python Proficiency', required: true, matched: true },
      { name: 'REST API Frameworks (FastAPI)', required: true, matched: true },
      { name: 'Machine Learning Foundations', required: true, matched: true },
      { name: 'Vector Search & RAG Concepts', required: true, matched: true },
      { name: 'Version Control (Git)', required: true, matched: true }
    ],
    alignmentScore: 'HIGH (GROUNDED FIT)',
    scoreBreakdown: [
      { category: 'Core Programming & Data Structures', score: 'VERIFIED MATCH', pass: true },
      { category: 'Applied Machine Learning & Vision', score: 'VERIFIED MATCH', pass: true },
      { category: 'API Architecture & Backend Design', score: 'VERIFIED MATCH', pass: true },
      { category: 'Vector Search & Generative AI', score: 'VERIFIED MATCH', pass: true }
    ],
    notes: "Direct match against foundational engineering and applied machine learning specifications. Strong alignment in Python and modern API development."
  },
  {
    id: 'candidate-b',
    label: 'Candidate B (General Web Focus)',
    jobRole: 'Software Engineer with AI',
    extractedEntities: [
      { name: 'HTML & CSS', category: 'Frontend', match: true },
      { name: 'JavaScript', category: 'Language', match: false },
      { name: 'React', category: 'Frontend', match: true },
      { name: 'Node.js', category: 'Backend', match: false },
      { name: 'SQL', category: 'Database', match: true }
    ],
    targetRequirements: [
      { name: 'Python Proficiency', required: true, matched: false },
      { name: 'REST API Frameworks (FastAPI)', required: true, matched: false },
      { name: 'Machine Learning Foundations', required: true, matched: false },
      { name: 'Vector Search & RAG Concepts', required: true, matched: false },
      { name: 'Version Control (Git)', required: true, matched: true }
    ],
    alignmentScore: 'PARTIAL (SKILL GAP IDENTIFIED)',
    scoreBreakdown: [
      { category: 'Core Programming & Data Structures', score: 'PARTIAL ALIGNMENT', pass: false },
      { category: 'Applied Machine Learning & Vision', score: 'SKILL GAP DETECTED', pass: false },
      { category: 'API Architecture & Backend Design', score: 'PARTIAL ALIGNMENT', pass: false },
      { category: 'Vector Search & Generative AI', score: 'SKILL GAP DETECTED', pass: false }
    ],
    notes: "Identified competency gap in Python and Machine Learning pipelines for specialized AI roles. Highlights specific areas for candidate upskilling."
  }
];

export default function ResumeATSSemanticSimulation() {
  const [selectedCandidateId, setSelectedCandidateId] = useState('candidate-a');

  const currentCandidate = CANDIDATE_PROFILES.find((c) => c.id === selectedCandidateId) || CANDIDATE_PROFILES[0];

  return (
    <div className="rounded-2xl border border-blue-500/30 bg-black/80 backdrop-blur-xl overflow-hidden p-4 sm:p-5 space-y-4">
      {/* Top Simulation HUD Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <FileSearch className="w-4 h-4 text-blue-400 animate-pulse" />
          <span className="text-white font-bold">SEMANTIC RESUME ATS SCORING ENGINE</span>
          <span className="text-zinc-600">//</span>
          <span className="text-blue-400 font-mono">NLP PARSER v1.0</span>
        </div>

        {/* Candidate Switcher */}
        <div className="flex items-center space-x-2">
          {CANDIDATE_PROFILES.map((cand) => (
            <button
              key={cand.id}
              onClick={() => setSelectedCandidateId(cand.id)}
              className={`px-3 py-1 rounded-md text-[11px] font-mono transition-colors ${
                selectedCandidateId === cand.id
                  ? 'bg-blue-500/20 border border-blue-400 text-blue-300 font-bold'
                  : 'text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              {cand.label}
            </button>
          ))}
        </div>
      </div>

      {/* Target Job Role Telemetry Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl border border-white/10 bg-white/[0.02] text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="text-zinc-400">TARGET ROLE:</span>
          <span className="text-white font-bold uppercase">{currentCandidate.jobRole}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-zinc-400">EVALUATION RESULT:</span>
          <span className={`font-bold px-2.5 py-0.5 rounded ${
            currentCandidate.alignmentScore.includes('HIGH')
              ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
              : 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
          }`}>
            {currentCandidate.alignmentScore}
          </span>
        </div>
      </div>

      {/* Dual Comparative Extraction Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Left Column: Parsed Resume Entities */}
        <div className="p-4 rounded-xl border border-white/10 bg-black/60 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-white/5 pb-2">
            <span className="flex items-center space-x-2">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>PARSED RESUME ENTITIES</span>
            </span>
            <span className="text-[10px] text-zinc-500">{currentCandidate.extractedEntities.length} EXTRACTED</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {currentCandidate.extractedEntities.map((ent, idx) => (
              <span
                key={idx}
                className={`px-2.5 py-1 rounded text-xs font-mono flex items-center space-x-1.5 border ${
                  ent.match
                    ? 'border-blue-400/40 bg-blue-500/10 text-blue-300'
                    : 'border-white/10 bg-white/5 text-zinc-400'
                }`}
              >
                <span>{ent.name}</span>
                <span className="text-[9px] text-zinc-500">({ent.category})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Target Job Description Requirements */}
        <div className="p-4 rounded-xl border border-white/10 bg-black/60 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-white/5 pb-2">
            <span className="flex items-center space-x-2">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>ROLE REQUIREMENTS ALIGNMENT</span>
            </span>
            <span className="text-[10px] text-zinc-500">MAPPING</span>
          </div>

          <div className="space-y-1.5">
            {currentCandidate.targetRequirements.map((req, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between text-xs font-mono p-1.5 rounded bg-white/[0.02]"
              >
                <span className="text-zinc-300">{req.name}</span>
                {req.matched ? (
                  <span className="text-emerald-400 flex items-center space-x-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ALIGNED</span>
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center space-x-1 text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>GAP</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Explainable Scoring Categories Breakdown */}
      <div className="p-4 rounded-xl border border-white/10 bg-black/60 space-y-2.5">
        <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
          EXPLAINABLE DIAGNOSTIC EVALUATION:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {currentCandidate.scoreBreakdown.map((item, idx) => (
            <div 
              key={idx}
              className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02] flex items-center justify-between text-xs font-mono"
            >
              <span className="text-zinc-300 truncate pr-2">{item.category}</span>
              <span className={`text-[10px] font-bold ${item.pass ? 'text-emerald-400' : 'text-amber-400'}`}>
                {item.score}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[11px] font-mono text-zinc-400 pt-1 leading-relaxed">
          {currentCandidate.notes}
        </p>
      </div>

      <div className="text-[11px] font-mono text-zinc-400 leading-relaxed bg-white/[0.02] p-3 rounded-lg border border-white/5">
        <span className="text-blue-400 font-bold">ATS ARCHITECTURE EXPLANATION:</span> Unlike primitive keyword filters that fail on synonym variations, this AI Resume ATS System uses Natural Language Processing and LLM embeddings to evaluate candidate qualifications semantically, providing explainable category scoring and diagnostic skill gap feedback.
      </div>
    </div>
  );
}
