import React, { useState, useEffect, useRef } from 'react';
import { Search, Database, FileText, ArrowRight, Sparkles, Compass } from 'lucide-react';

const SAMPLE_LEGAL_QUERIES = [
  {
    query: "What constitutes a valid contract under Indian law?",
    matchedStatute: "Indian Contract Act (1872) — Section 10",
    cluster: "CONTRACTS",
    similarity: 0.914,
    excerpt: "All agreements are contracts if they are made by the free consent of parties competent to contract, for a lawful consideration and with a lawful object."
  },
  {
    query: "Admissibility of electronic records and digital certificates in court",
    matchedStatute: "Indian Evidence Act (1872) — Section 65B",
    cluster: "EVIDENCE",
    similarity: 0.892,
    excerpt: "Admissibility of electronic records: Any information contained in an electronic record printed on paper, stored, recorded or copied shall be deemed to be a document."
  },
  {
    query: "Protection of life and personal liberty fundamental guarantees",
    matchedStatute: "Constitution of India — Article 21",
    cluster: "CONSTITUTIONAL",
    similarity: 0.946,
    excerpt: "No person shall be deprived of his life or personal liberty except according to procedure established by law."
  }
];

const STATUTE_NODES = [
  { id: 'ipc-300', title: 'IPC § 300', cluster: 'CRIMINAL', x: 0.22, y: 0.35 },
  { id: 'ipc-420', title: 'IPC § 420', cluster: 'CRIMINAL', x: 0.28, y: 0.25 },
  { id: 'contract-10', title: 'Contract § 10', cluster: 'CONTRACTS', x: 0.72, y: 0.32 },
  { id: 'contract-73', title: 'Contract § 73', cluster: 'CONTRACTS', x: 0.82, y: 0.42 },
  { id: 'const-21', title: 'Const Art 21', cluster: 'CONSTITUTIONAL', x: 0.52, y: 0.75 },
  { id: 'const-19', title: 'Const Art 19', cluster: 'CONSTITUTIONAL', x: 0.45, y: 0.85 },
  { id: 'evidence-65b', title: 'Evidence § 65B', cluster: 'EVIDENCE', x: 0.78, y: 0.78 },
  { id: 'it-43a', title: 'IT Act § 43A', cluster: 'CYBER', x: 0.25, y: 0.72 }
];

export default function LexAIVectorSpaceSimulation() {
  const canvasRef = useRef(null);
  const [selectedQueryIndex, setSelectedQueryIndex] = useState(0);
  const [customQuery, setCustomQuery] = useState('');
  const [hoveredNode, setHoveredNode] = useState(null);

  const activeQuery = SAMPLE_LEGAL_QUERIES[selectedQueryIndex];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.clientWidth || 500);
    let height = (canvas.height = 320);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 320;
    };
    window.addEventListener('resize', handleResize);

    let animId;
    let t = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      t += 0.02;

      ctx.clearRect(0, 0, width, height);

      // Cybernetic vector grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
      ctx.lineWidth = 1;
      const step = 28;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Query vector origin (center-left)
      const queryX = width * 0.15;
      const queryY = height * 0.5;

      // Locate target node matching active query cluster
      const targetNode = STATUTE_NODES.find((n) => n.cluster === activeQuery.cluster) || STATUTE_NODES[2];
      const targetX = targetNode.x * width;
      const targetY = targetNode.y * height;

      // Draw cluster semantic connection rays
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 1;
      for (let i = 0; i < STATUTE_NODES.length; i++) {
        for (let j = i + 1; j < STATUTE_NODES.length; j++) {
          if (STATUTE_NODES[i].cluster === STATUTE_NODES[j].cluster) {
            ctx.beginPath();
            ctx.moveTo(STATUTE_NODES[i].x * width, STATUTE_NODES[i].y * height);
            ctx.lineTo(STATUTE_NODES[j].x * width, STATUTE_NODES[j].y * height);
            ctx.stroke();
          }
        }
      }

      // Animated Retrieval Vector Beam from Query to Target Node
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.lineDashOffset = -t * 20;
      ctx.beginPath();
      ctx.moveTo(queryX, queryY);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      // Pulse traveling along the vector beam
      const beamProgress = (t * 0.8) % 1;
      const pulseX = queryX + (targetX - queryX) * beamProgress;
      const pulseY = queryY + (targetY - queryY) * beamProgress;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(pulseX, pulseY, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Draw Query Vector Node
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(queryX, queryY, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(queryX, queryY, 12 + Math.sin(t * 3) * 2, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText('EMBEDDED_QUERY', queryX - 35, queryY - 18);

      // Draw Statutory Vector Nodes
      STATUTE_NODES.forEach((node) => {
        const nx = node.x * width;
        const ny = node.y * height;
        const isTarget = node.id === targetNode.id;

        // Outer glow for target
        if (isTarget) {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(nx, ny, 16 + Math.sin(t * 4) * 3, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = isTarget ? '#38BDF8' : 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(nx, ny, isTarget ? 6 : 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isTarget ? '#38BDF8' : 'rgba(255, 255, 255, 0.6)';
        ctx.font = `${isTarget ? 'bold 11px' : '9px'} JetBrains Mono, monospace`;
        ctx.fillText(node.title, nx + 10, ny + 3);
      });
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [activeQuery]);

  return (
    <div className="rounded-2xl border border-sky-400/30 bg-black/80 backdrop-blur-xl overflow-hidden p-4 sm:p-5 space-y-4">
      {/* Top Simulation HUD Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-sky-400 animate-pulse" />
          <span className="text-white font-bold">DENSE VECTOR SPACE // RAG RETRIEVAL</span>
          <span className="text-zinc-600">//</span>
          <span className="text-sky-400 font-mono">FASTAPI + CHROMADB SIM</span>
        </div>

        <div className="text-[11px] font-mono text-zinc-400 flex items-center space-x-2">
          <span>TOP SIMILARITY:</span>
          <span className="text-sky-400 font-bold px-2 py-0.5 rounded bg-sky-400/10 border border-sky-400/30">
            {activeQuery.similarity} COSINE
          </span>
        </div>
      </div>

      {/* Preset Query Selector Pills */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-mono text-zinc-500 uppercase">
          TEST INQUIRY SELECTION (SAMPLE STATUTORY INTENTS):
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {SAMPLE_LEGAL_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedQueryIndex(idx)}
              className={`p-2.5 rounded-lg text-left text-xs font-mono transition-all border ${
                selectedQueryIndex === idx
                  ? 'bg-sky-400/15 border-sky-400 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                  : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
              }`}
            >
              <div className="text-[9px] text-sky-400/80 mb-1">PROMPT 0{idx + 1}</div>
              <div className="truncate font-medium">"{q.query}"</div>
            </button>
          ))}
        </div>
      </div>

      {/* 2D Canvas Vector Map */}
      <div className="relative w-full h-[320px] bg-black/90 rounded-xl border border-white/10 overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Telemetry Readout Box inside Canvas */}
        <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-black/85 border border-sky-400/40 backdrop-blur-md text-xs font-mono space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sky-400 font-bold flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>RETRIEVED STATUTORY CLAUSE: {activeQuery.matchedStatute}</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">CONFIDENCE: STRICT_GROUNDED</span>
          </div>
          <p className="text-[11px] text-zinc-300 font-serif italic leading-relaxed truncate">
            "{activeQuery.excerpt}"
          </p>
        </div>
      </div>

      <div className="text-[11px] font-mono text-zinc-400 leading-relaxed bg-white/[0.02] p-3 rounded-lg border border-white/5">
        <span className="text-sky-400 font-bold">RAG PIPELINE EXPLANATION:</span> In LexAI-India, natural language legal questions are converted into dense vector embeddings. A high-performance FastAPI service conducts cosine similarity queries across statutory Indian legislation, retrieving the most relevant statutory provisions to strictly constrain model responses and eliminate legal hallucinations.
      </div>
    </div>
  );
}
