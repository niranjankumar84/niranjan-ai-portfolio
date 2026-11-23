import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { skillCategories } from '../../data/skillsData';

/**
 * SkillsConstellationCanvas — Premium 3D Technology Universe
 *
 * Renders authentic brand logos loaded from Simple Icons CDN and Devicon CDN
 * onto floating 3D quads. Every logo moves independently and simultaneously
 * via unique harmonic oscillation. No geometry-approximated logos.
 *
 * Authentic logo sources:
 *   Simple Icons CDN — https://cdn.simpleicons.org/{slug}/{hexColor}
 *   Devicon CDN      — https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/…
 *
 * Missing logos (no authentic source found): reported below.
 * Missing: Seaborn, ChromaDB, DSA in Python, ML Algorithms, RAG, LLMs,
 *          REST API Design, Leadership & Teamwork, Technical Communication,
 *          Problem-Solving & Logic, Public Speaking, Adaptive Learning.
 *   → For concept-skills and professional skills, appropriate SVG symbols are used.
 *   → For missing tech logos, an initialised hex-badge fallback is shown.
 */

/* ─────────────────── AUTHENTIC LOGO URL MAP ────────────────── */
// source: 'si'      → Simple Icons CDN  (SVG icon in custom color on dark card)
// source: 'devicon' → Devicon CDN       (colored SVG icon)
// source: 'symbol'  → SVG data URI      (concept/professional skill symbol)
// source: 'missing' → no authentic logo found; hex-badge fallback shown

const LOGO_SOURCES = {
  /* ── Programming ─────────────────────────────────────── */
  'Python':          { source: 'si', slug: 'python',               iconColor: 'FFD343', bg: '#1e2a3a', accent: '#3776AB' },
  'DSA in Python':   { source: 'si', slug: 'python',               iconColor: '3776AB', bg: '#0d1520', accent: '#3776AB', label: 'DSA' },

  /* ── Machine Learning ────────────────────────────────── */
  'Scikit-learn':    { source: 'si', slug: 'scikitlearn',          iconColor: 'F7931E', bg: '#1a1200', accent: '#F7931E' },
  'PyTorch':         { source: 'si', slug: 'pytorch',              iconColor: 'EE4C2C', bg: '#200a06', accent: '#EE4C2C' },
  'ML Algorithms':   { source: 'symbol', symbol: 'ml-algo',        bg: '#080f1a', accent: '#38BDF8' },
  'LLMs':            { source: 'symbol', symbol: 'llm',            bg: '#0d0820', accent: '#8B5CF6' },
  'RAG':             { source: 'symbol', symbol: 'rag',            bg: '#050815', accent: '#00E5FF' },
  'LangChain':       { source: 'si', slug: 'langchain',            iconColor: '00C48C', bg: '#001510', accent: '#00C48C' },
  'Hugging Face':    { source: 'si', slug: 'huggingface',          iconColor: 'FFD21E', bg: '#1a1500', accent: '#FFD21E' },
  'Gemini API':      { source: 'si', slug: 'googlegemini',         iconColor: '8E75B2', bg: '#100820', accent: '#4285F4' },

  /* ── Data Science ────────────────────────────────────── */
  'NumPy':           { source: 'si', slug: 'numpy',                iconColor: '4DABCF', bg: '#001820', accent: '#4BA3C7' },
  'Pandas':          { source: 'si', slug: 'pandas',               iconColor: 'E9DCFF', bg: '#080220', accent: '#E8DFFF' },
  'Matplotlib':      { source: 'devicon', slug: 'matplotlib',      file: 'matplotlib-original.svg', bg: '#0a0a14', accent: '#11557C' },
  'Seaborn':         { source: 'symbol', symbol: 'heatmap',        bg: '#0a0a14', accent: '#6B9BD2' },

  /* ── Web & Backend ───────────────────────────────────── */
  'React':           { source: 'si', slug: 'react',                iconColor: '61DAFB', bg: '#061420', accent: '#61DAFB' },
  'HTML':            { source: 'si', slug: 'html5',                iconColor: 'E34F26', bg: '#1a0800', accent: '#E34F26' },
  'CSS':             { source: 'si', slug: 'css3',                 iconColor: '1572B6', bg: '#030c18', accent: '#1572B6' },
  'FastAPI':         { source: 'si', slug: 'fastapi',              iconColor: '009688', bg: '#001512', accent: '#009688' },
  'Django':          { source: 'si', slug: 'django',               iconColor: '44B78B', bg: '#001508', accent: '#44B78B' },
  'REST API Design': { source: 'symbol', symbol: 'rest',           bg: '#080812', accent: '#A855F7' },

  /* ── Databases ───────────────────────────────────────── */
  'SQL':             { source: 'si', slug: 'sqlite',               iconColor: '44A8DF', bg: '#050d14', accent: '#44A8DF' },
  'MongoDB':         { source: 'si', slug: 'mongodb',              iconColor: '47A248', bg: '#011008', accent: '#47A248' },
  'ChromaDB':        { source: 'symbol', symbol: 'vectordb',       bg: '#060612', accent: '#EC4899' },

  /* ── Tools & Platforms ───────────────────────────────── */
  'Git':             { source: 'si', slug: 'git',                  iconColor: 'F05032', bg: '#180500', accent: '#F05032' },
  'GitHub':          { source: 'si', slug: 'github',               iconColor: 'FFFFFF', bg: '#0d1117', accent: '#8B949E' },
  'Linux':           { source: 'si', slug: 'linux',                iconColor: 'FCC624', bg: '#141000', accent: '#FCC624' },
  'VS Code':         { source: 'si', slug: 'visualstudiocode',     iconColor: '007ACC', bg: '#001520', accent: '#007ACC' },
  'Jupyter':         { source: 'si', slug: 'jupyter',              iconColor: 'F37626', bg: '#180a00', accent: '#F37626' },
  'Docker':          { source: 'si', slug: 'docker',               iconColor: '2496ED', bg: '#030c18', accent: '#2496ED' },
  'CI/CD':           { source: 'si', slug: 'githubactions',        iconColor: '2088FF', bg: '#030c18', accent: '#2088FF' },
  'Kubernetes':      { source: 'si', slug: 'kubernetes',           iconColor: '326CE5', bg: '#040820', accent: '#326CE5' },
  'Netlify':         { source: 'si', slug: 'netlify',              iconColor: '00C7B7', bg: '#001514', accent: '#00C7B7' },

  /* ── Professional / Soft Skills (symbols) ────────────── */
  'Leadership & Teamwork':     { source: 'symbol', symbol: 'leadership',    bg: '#001508', accent: '#34D399' },
  'Technical Communication':   { source: 'symbol', symbol: 'comms',         bg: '#080812', accent: '#34D399' },
  'Problem-Solving & Logic':   { source: 'symbol', symbol: 'puzzle',        bg: '#0d0820', accent: '#8B5CF6' },
  'Public Speaking':           { source: 'symbol', symbol: 'mic',           bg: '#001508', accent: '#34D399' },
  'Adaptive Learning':         { source: 'symbol', symbol: 'brain',         bg: '#0d0820', accent: '#34D399' },
};

/* ─────────────────── PROFESSIONAL SKILL SVG SYMBOLS ─────────── */
// Inline SVG data-URIs for concept/professional skills that have
// no authentic brand logo. These are symbols, not invented logos.
const SYMBOL_SVG = {
  'ml-algo': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2338BDF8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v4M8.5 17l3.5-6 3.5 6"/></svg>`,
  'llm':     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%238B5CF6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h8M8 14h5"/></svg>`,
  'rag':     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2300E5FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><circle cx="12" cy="12" r="1"/></svg>`,
  'heatmap': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%236B9BD2" stroke-width="1.5"><rect x="3" y="3" width="4" height="4" fill="%234B6FA0" rx="0.5"/><rect x="10" y="3" width="4" height="4" fill="%236B9BD2" rx="0.5"/><rect x="17" y="3" width="4" height="4" fill="%233a5a8a" rx="0.5"/><rect x="3" y="10" width="4" height="4" fill="%236B9BD2" rx="0.5"/><rect x="10" y="10" width="4" height="4" fill="%234B6FA0" rx="0.5"/><rect x="17" y="10" width="4" height="4" fill="%238ab4e0" rx="0.5"/><rect x="3" y="17" width="4" height="4" fill="%233a5a8a" rx="0.5"/><rect x="10" y="17" width="4" height="4" fill="%238ab4e0" rx="0.5"/><rect x="17" y="17" width="4" height="4" fill="%234B6FA0" rx="0.5"/></svg>`,
  'rest':    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23A855F7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`,
  'vectordb':`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23EC4899" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6"/><path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6"/></svg>`,
  'leadership':`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2334D399" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  'comms':   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2334D399" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  'puzzle':  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%238B5CF6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
  'mic':     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2334D399" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></svg>`,
  'brain':   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2334D399" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>`,
};

/* ───────────────── TEXTURE BUILDER ───────────────────────────
 * Creates a dark rounded card, then loads the authentic logo onto it.
 * Returns the CanvasTexture immediately (with a dark placeholder);
 * updates needsUpdate when the real logo loads.
 * ───────────────────────────────────────────────────────────── */
const SIZE = 256;

function drawCard(ctx, bgColor, accentColor) {
  ctx.clearRect(0, 0, SIZE, SIZE);
  // Background
  ctx.fillStyle = bgColor;
  const r = 32;
  ctx.beginPath();
  ctx.moveTo(r, 0); ctx.lineTo(SIZE-r, 0);
  ctx.arcTo(SIZE, 0, SIZE, r, r);
  ctx.lineTo(SIZE, SIZE-r);
  ctx.arcTo(SIZE, SIZE, SIZE-r, SIZE, r);
  ctx.lineTo(r, SIZE);
  ctx.arcTo(0, SIZE, 0, SIZE-r, r);
  ctx.lineTo(0, r);
  ctx.arcTo(0, 0, r, 0, r);
  ctx.closePath();
  ctx.fill();
  // Subtle accent border
  ctx.strokeStyle = accentColor + '55';
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawInitialFallback(ctx, label, accentColor) {
  const initials = (label || '?').split(/[\s\-\/]/).map(w => w[0] || '').join('').slice(0, 2).toUpperCase();
  ctx.fillStyle = accentColor + 'CC';
  ctx.font = `bold ${SIZE * 0.26}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, SIZE / 2, SIZE / 2);
}

function buildLogoTexture(skillName, source, disposable) {
  const info = LOGO_SOURCES[skillName] || { source: 'missing', bg: '#0a0a0a', accent: '#00E5FF' };
  const bgColor   = info.bg || '#0a0a1a';
  const accent    = info.accent || '#00E5FF';

  const canvas = document.createElement('canvas');
  canvas.width  = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');

  // Initial placeholder
  drawCard(ctx, bgColor, accent);
  drawInitialFallback(ctx, info.label || skillName, accent);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  disposable.textures.push(texture);

  if (info.source === 'si') {
    /* ── Simple Icons CDN ── */
    const url = `https://cdn.simpleicons.org/${info.slug}/${info.iconColor || 'FFFFFF'}`;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      drawCard(ctx, bgColor, accent);
      const pad = SIZE * 0.18;
      ctx.drawImage(img, pad, pad, SIZE - pad * 2, SIZE - pad * 2);
      texture.needsUpdate = true;
    };
    img.onerror = () => {
      // Keep initials fallback — logo reported as missing
      console.warn(`[Skills] Simple Icons not found for "${skillName}" (slug: ${info.slug})`);
    };
    img.src = url;

  } else if (info.source === 'devicon') {
    /* ── Devicon CDN ── */
    const url = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${info.slug}/${info.file}`;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      drawCard(ctx, bgColor, accent);
      const pad = SIZE * 0.18;
      ctx.drawImage(img, pad, pad, SIZE - pad * 2, SIZE - pad * 2);
      texture.needsUpdate = true;
    };
    img.onerror = () => {
      console.warn(`[Skills] Devicon not found for "${skillName}"`);
    };
    img.src = url;

  } else if (info.source === 'symbol') {
    /* ── Inline SVG symbol (concept / professional skill) ── */
    const svgStr = SYMBOL_SVG[info.symbol];
    if (svgStr) {
      const svgDataUrl = `data:image/svg+xml,${svgStr}`;
      const img = new Image();
      img.onload = () => {
        drawCard(ctx, bgColor, accent);
        const pad = SIZE * 0.2;
        ctx.drawImage(img, pad, pad, SIZE - pad * 2, SIZE - pad * 2);
        texture.needsUpdate = true;
      };
      img.src = svgDataUrl;
    }
  }
  // 'missing' → keep initials placeholder

  return { texture, canvas, ctx };
}

/* ───────────────── LABEL SPRITE BUILDER ──────────────────── */
function buildLabelSprite(text, accentColor, statusColor, disposable) {
  const dpr = 2;
  const W = 220, H = 42;
  const canvas = document.createElement('canvas');
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const r = 10;
  ctx.beginPath();
  ctx.moveTo(r, 0); ctx.lineTo(W-r, 0); ctx.arcTo(W, 0, W, r, r);
  ctx.lineTo(W, H-r); ctx.arcTo(W, H, W-r, H, r);
  ctx.lineTo(r, H); ctx.arcTo(0, H, 0, H-r, r);
  ctx.lineTo(0, r); ctx.arcTo(0, 0, r, 0, r); ctx.closePath();
  ctx.fillStyle = 'rgba(4,8,16,0.90)'; ctx.fill();
  ctx.lineWidth = 1.5; ctx.strokeStyle = accentColor + '70'; ctx.stroke();

  ctx.beginPath(); ctx.arc(14, H/2, 4, 0, Math.PI*2);
  ctx.fillStyle = statusColor;
  ctx.shadowColor = statusColor; ctx.shadowBlur = 5; ctx.fill(); ctx.shadowBlur = 0;

  ctx.fillStyle = '#FAFAFA';
  ctx.font = '600 12px "Inter", sans-serif';
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillText(text.length > 20 ? text.slice(0, 19) + '…' : text, 26, H/2 + 1);

  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter; tex.generateMipmaps = false;
  disposable.textures.push(tex);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false });
  disposable.materials.push(mat);
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(1.55, 0.3, 1);
  return sprite;
}

/* ─────────── FLAT SKILL LIST FROM skillCategories ─────────── */
function buildFlatSkillList() {
  const all = [];
  skillCategories.forEach(cat => {
    cat.skills.forEach(skill => {
      all.push({
        name:          skill.name,
        category:      cat.title,
        categoryColor: cat.accentColor || '#00E5FF',
        status:        skill.status,
        context:       skill.context || '',
      });
    });
  });
  return all;
}

/* ─────────── POSITION SEEDS (Fibonacci sphere) ────────────── */
function generatePositions(count) {
  const phi = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const y   = 1 - (i / (count - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th  = phi * i;
    const sc  = 5.2 + (i % 6) * 0.5;
    return new THREE.Vector3(Math.cos(th) * rad * sc, y * 4.0, Math.sin(th) * rad * sc);
  });
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function SkillsConstellationCanvas({ onSelectNode }) {
  const mountRef   = useRef(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [hoveredSkill,  setHoveredSkill]  = useState(null);
  const onSelectNodeRef = useRef(onSelectNode);
  useEffect(() => { onSelectNodeRef.current = onSelectNode; }, [onSelectNode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const W = container.clientWidth  || 800;
    const H = container.clientHeight || 580;

    /* ── Renderer ───────────────────────────────────────────── */
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch { return; }
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    /* ── Scene & Camera ─────────────────────────────────────── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    const baseZ  = isMobile ? 18 : 14;
    camera.position.set(0, 0, baseZ);

    /* ── Lights ─────────────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0x0a1424, 2.5));
    const cKey = new THREE.PointLight(0x00E5FF, 4.0, 40); cKey.position.set(8, 8, 10); scene.add(cKey);
    const bFil = new THREE.PointLight(0x3B82F6, 3.0, 40); bFil.position.set(-8,-8, 8); scene.add(bFil);
    const pRim = new THREE.PointLight(0x8B5CF6, 1.5, 30); pRim.position.set(0,-10,-5); scene.add(pRim);

    /* ── Disposable resource tracking ───────────────────────── */
    const disposable = { geometries: [], materials: [], textures: [] };
    const regGeo = g => { disposable.geometries.push(g); return g; };
    const regMat = m => { disposable.materials.push(m); return m; };

    /* ── Background stars ───────────────────────────────────── */
    const starCount = isMobile ? 60 : 110;
    const starGeo   = regGeo(new THREE.BufferGeometry());
    const starPos   = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i*3]   = (Math.random()-.5)*32;
      starPos[i*3+1] = (Math.random()-.5)*22;
      starPos[i*3+2] = (Math.random()-.5)*22;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, regMat(new THREE.PointsMaterial({
      color: 0x00E5FF, size: 0.038, transparent: true, opacity: 0.28
    }))));

    /* ── Build skill list ───────────────────────────────────── */
    const skills    = buildFlatSkillList();
    const positions = generatePositions(skills.length);
    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    const interactive = [];
    const nodes       = [];   // { mesh, sprite, ring, basePos, … }

    /* Shared card geometry (all logos same quad, scaled individually) */
    const cardGeo = regGeo(new THREE.PlaneGeometry(1, 1));

    skills.forEach((skill, i) => {
      const basePos = positions[i];

      /* Status colour */
      let statusColor = '#10B981';
      if (skill.status?.id === 'familiar') statusColor = '#38BDF8';
      if (skill.status?.id === 'learning') statusColor = '#F59E0B';

      const info = LOGO_SOURCES[skill.name] || {};
      const accent = info.accent || skill.categoryColor || '#00E5FF';

      /* ── Logo card quad ─── */
      const { texture } = buildLogoTexture(skill.name, skill.source, disposable);
      const logoMat = regMat(new THREE.MeshStandardMaterial({
        map:            texture,
        transparent:    true,
        alphaTest:      0.02,
        metalness:      0.08,
        roughness:      0.45,
        emissiveMap:    texture,
        emissive:       new THREE.Color(accent),
        emissiveIntensity: 0.10,
        side:           THREE.DoubleSide,
      }));
      const cardSize = isMobile ? 0.78 : 0.96;
      const mesh = new THREE.Mesh(cardGeo, logoMat);
      mesh.scale.setScalar(cardSize);
      mesh.position.copy(basePos);
      mesh.userData = {
        type:          'skill',
        name:          skill.name,
        category:      skill.category,
        categoryColor: skill.categoryColor,
        status:        skill.status,
        context:       skill.context,
      };
      logoGroup.add(mesh);
      interactive.push(mesh);

      /* ── Label sprite ─── */
      const label = buildLabelSprite(skill.name, accent, statusColor, disposable);
      label.position.copy(basePos).add(new THREE.Vector3(0, -(cardSize * 0.5 + 0.22), 0));
      label.userData = mesh.userData;
      logoGroup.add(label);
      interactive.push(label);

      /* ── Glow ring ─── */
      const ringGeo = regGeo(new THREE.TorusGeometry(cardSize * 0.58, 0.015, 8, 48));
      const ringMat = regMat(new THREE.MeshBasicMaterial({
        color: new THREE.Color(accent),
        transparent: true, opacity: 0.15,
        blending: THREE.AdditiveBlending,
      }));
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(basePos);
      logoGroup.add(ring);

      /* ── Independent float params (golden-ratio seeded) ─── */
      const s = i * 1.6180339887 + 0.3;
      nodes.push({
        mesh, label, ring,
        basePos:     basePos.clone(),
        labelOffset: new THREE.Vector3(0, -(cardSize * 0.5 + 0.22), 0),
        phX: s,         phY: s * 1.31,    phZ: s * 0.71,
        spX: 0.26 + (i % 7) * 0.055,
        spY: 0.33 + (i % 5) * 0.062,
        spZ: 0.21 + (i % 9) * 0.038,
        amX: 0.22 + (i % 4) * 0.08,
        amY: 0.20 + (i % 3) * 0.09,
        amZ: 0.17 + (i % 6) * 0.06,
        rotX: (0.18 + (i%5)*0.07) * (i%2===0?1:-1),
        rotY: (0.28 + (i%7)*0.05) * (i%3===0?1:-1),
        paused: false,
      });
    });

    /* ── Ambient connecting web between nearby nodes ─────────── */
    const webPairs = [];
    for (let a = 0; a < nodes.length; a++)
      for (let b = a+1; b < nodes.length; b++)
        if (positions[a].distanceTo(positions[b]) < 3.8)
          webPairs.push([nodes[a], nodes[b]]);

    const webPos   = new Float32Array(webPairs.length * 6);
    const webGeo   = regGeo(new THREE.BufferGeometry());
    webGeo.setAttribute('position', new THREE.BufferAttribute(webPos, 3));
    scene.add(new THREE.LineSegments(webGeo, regMat(new THREE.LineBasicMaterial({
      color: 0x00E5FF, transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending,
    }))));

    /* ── Camera / drag state ──────────────────────────────────── */
    let isDragging = false, prev = { x:0, y:0 };
    let tRotX = 0.06, tRotY = 0, cRotX = 0.06, cRotY = 0;
    let tZoom = baseZ, cZoom = baseZ;
    const mouse2D = new THREE.Vector2(-999, -999);
    const raycaster = new THREE.Raycaster();
    let highlighted = null;

    const onPD = e => { isDragging = true; prev = { x:e.clientX, y:e.clientY }; };
    const onPM = e => {
      const r = container.getBoundingClientRect();
      mouse2D.x = ((e.clientX-r.left)/r.width)*2-1;
      mouse2D.y = -(((e.clientY-r.top)/r.height)*2-1);
      if (isDragging) {
        tRotY += (e.clientX-prev.x)*0.004;
        tRotX += (e.clientY-prev.y)*0.004;
        prev = { x:e.clientX, y:e.clientY };
      }
    };
    const onPU = () => { isDragging = false; };
    const onWh = e => { e.preventDefault(); tZoom = Math.max(8, Math.min(22, tZoom + e.deltaY*0.007)); };
    const onClick = () => {
      if (highlighted?.userData?.name) {
        setSelectedSkill(highlighted.userData);
        if (onSelectNodeRef.current) onSelectNodeRef.current(highlighted.userData);
        const node = nodes.find(n => n.mesh===highlighted || n.label===highlighted);
        if (node) { node.paused=true; setTimeout(()=>{ node.paused=false; }, 3000); }
      }
    };

    /* Touch support */
    const onTC = e => {
      if (e.touches.length===1) { prev={x:e.touches[0].clientX, y:e.touches[0].clientY}; isDragging=true; }
    };
    const onTM = e => {
      if (isDragging && e.touches.length===1) {
        tRotY += (e.touches[0].clientX-prev.x)*0.004;
        tRotX += (e.touches[0].clientY-prev.y)*0.004;
        prev={x:e.touches[0].clientX, y:e.touches[0].clientY};
      }
    };
    const onTE = () => { isDragging=false; };

    container.addEventListener('pointerdown', onPD);
    window.addEventListener('pointermove', onPM);
    window.addEventListener('pointerup', onPU);
    container.addEventListener('wheel', onWh, { passive:false });
    container.addEventListener('click', onClick);
    container.addEventListener('touchstart', onTC, { passive:true });
    container.addEventListener('touchmove', onTM, { passive:true });
    container.addEventListener('touchend', onTE);

    /* ── IntersectionObserver ───────────────────────────────── */
    let visible = true;
    const obs = new IntersectionObserver(([e])=>{ visible=e.isIntersecting; }, { threshold:0.05 });
    obs.observe(container);

    /* ── Animation loop ─────────────────────────────────────── */
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!visible) return;
      const t = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        logoGroup.position.x = Math.sin(t*0.17)*0.14;
        logoGroup.position.y = Math.cos(t*0.21)*0.11;
        camera.position.x    = Math.sin(t*0.13)*0.28;
        camera.position.y    = Math.cos(t*0.16)*0.20;

        /* ★ Every logo moves independently and simultaneously ★ */
        nodes.forEach(nd => {
          if (nd.paused) return;
          const fx = Math.sin(t*nd.spX+nd.phX)*nd.amX + Math.cos(t*nd.spX*0.6+nd.phZ)*nd.amX*0.4;
          const fy = Math.cos(t*nd.spY+nd.phY)*nd.amY + Math.sin(t*nd.spY*0.7+nd.phX)*nd.amY*0.3;
          const fz = Math.sin(t*nd.spZ+nd.phZ)*nd.amZ + Math.cos(t*nd.spZ*0.5+nd.phY)*nd.amZ*0.5;
          const nx = nd.basePos.x+fx, ny = nd.basePos.y+fy, nz = nd.basePos.z+fz;

          nd.mesh.position.set(nx, ny, nz);
          nd.ring.position.set(nx, ny, nz);
          nd.label.position.set(nx+nd.labelOffset.x, ny+nd.labelOffset.y, nz+nd.labelOffset.z);

          nd.mesh.rotation.y += nd.rotY * 0.012;
          nd.ring.rotation.z += 0.007;
          nd.mesh.lookAt(camera.position);       // billboards face camera
        });

        /* Update connecting web */
        webPairs.forEach(([a, b], idx) => {
          const ap=a.mesh.position, bp=b.mesh.position, base=idx*6;
          webPos[base]=ap.x; webPos[base+1]=ap.y; webPos[base+2]=ap.z;
          webPos[base+3]=bp.x; webPos[base+4]=bp.y; webPos[base+5]=bp.z;
        });
        webGeo.attributes.position.needsUpdate = true;
      }

      /* Smooth drag rotation */
      cRotX += (tRotX-cRotX)*0.07; cRotY += (tRotY-cRotY)*0.07;
      logoGroup.rotation.x = cRotX; logoGroup.rotation.y = cRotY;

      /* Smooth zoom */
      cZoom += (tZoom-cZoom)*0.07;
      camera.position.z = cZoom;
      camera.lookAt(0, 0, 0);

      /* Raycasting hover */
      raycaster.setFromCamera(mouse2D, camera);
      const hits = raycaster.intersectObjects(interactive, false);
      if (hits.length > 0) {
        const top = hits[0].object;
        if (highlighted !== top) {
          if (highlighted?.isMesh) highlighted.scale.setScalar(1);
          highlighted = top;
          if (top.isMesh) top.scale.setScalar(1.28);
          setHoveredSkill(top.userData);
          container.style.cursor = 'pointer';
        }
      } else {
        if (highlighted) {
          if (highlighted.isMesh) highlighted.scale.setScalar(1);
          highlighted = null; setHoveredSkill(null);
          container.style.cursor = 'grab';
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    /* ── Resize handler ─────────────────────────────────────── */
    const onResize = () => {
      if (!container) return;
      const w=container.clientWidth, h=container.clientHeight;
      camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    /* ── Cleanup ─────────────────────────────────────────────── */
    return () => {
      container.removeEventListener('pointerdown', onPD);
      window.removeEventListener('pointermove', onPM);
      window.removeEventListener('pointerup', onPU);
      container.removeEventListener('wheel', onWh);
      container.removeEventListener('click', onClick);
      container.removeEventListener('touchstart', onTC);
      container.removeEventListener('touchmove', onTM);
      container.removeEventListener('touchend', onTE);
      window.removeEventListener('resize', onResize);
      obs.disconnect();
      cancelAnimationFrame(animId);
      disposable.geometries.forEach(g => g.dispose());
      disposable.materials.forEach(m => m.dispose());
      disposable.textures.forEach(t => t.dispose());
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && container.contains(renderer.domElement))
          container.removeChild(renderer.domElement);
      }
    };
  }, []);

  /* ── Status labels ── */
  const STATUS_META = {
    'hands-on': { label:'Hands-on Experience', color:'#10B981' },
    'familiar':  { label:'Familiar with',      color:'#38BDF8' },
    'learning':  { label:'Currently Learning', color:'#F59E0B' },
  };

  return (
    <div
      className="relative w-full rounded-3xl border border-white/10 bg-black/95 backdrop-blur-2xl overflow-hidden select-none shadow-[0_0_60px_rgba(0,0,0,0.9)]"
      style={{ height: '600px' }}
    >
      {/* 3D canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Ambient radial glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,229,255,0.04)_0%,transparent_70%)]" />

      {/* HUD — top-left */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none space-y-1">
        <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-glow bg-black/75 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
          <span className="font-semibold tracking-wider uppercase">
            3D TECHNOLOGY UNIVERSE // {skillCategories.reduce((a,c)=>a+c.skills.length,0)} SKILLS
          </span>
        </div>
        <div className="text-[9px] font-mono text-zinc-500 pl-1">
          DRAG TO ORBIT · SCROLL TO ZOOM · CLICK ANY LOGO
        </div>
      </div>

      {/* Legend — top-right */}
      <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-3 text-[10px] font-mono bg-black/75 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md pointer-events-none">
        <div className="flex items-center gap-1.5 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400"/><span>Hands-on</span></div>
        <div className="flex items-center gap-1.5 text-sky-400"><span className="w-2 h-2 rounded-full bg-sky-400"/><span>Familiar</span></div>
        <div className="flex items-center gap-1.5 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-400"/><span>Learning</span></div>
      </div>

      {/* Hover tooltip */}
      {hoveredSkill?.name && !selectedSkill && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-10 pointer-events-none p-3.5 rounded-2xl border border-white/15 bg-black/90 backdrop-blur-xl shadow-2xl sm:min-w-[240px] animate-in fade-in zoom-in-95 duration-100">
          <div className="text-[9px] font-mono uppercase tracking-widest mb-1" style={{ color: hoveredSkill.categoryColor }}>
            {hoveredSkill.category}
          </div>
          <div className="font-semibold text-sm text-white">{hoveredSkill.name}</div>
          <div className="mt-2 pt-2 border-t border-white/10 text-[9px] font-mono text-cyan-glow">CLICK TO INSPECT →</div>
        </div>
      )}

      {/* Selected skill detail */}
      {selectedSkill && (
        <div
          className="absolute bottom-4 left-4 right-4 z-10 p-4 rounded-2xl border bg-black/95 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200"
          style={{ borderColor: (selectedSkill.categoryColor || '#00E5FF') + '50' }}
        >
          <div className="absolute top-0 left-8 right-8 h-[1px] rounded-full"
            style={{ background:`linear-gradient(90deg,transparent,${selectedSkill.categoryColor}80,transparent)` }}/>

          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[9px] font-mono tracking-widest uppercase mb-1"
                style={{ color: selectedSkill.categoryColor }}>
                {selectedSkill.category}
              </div>
              <div className="text-white font-semibold text-base leading-tight">{selectedSkill.name}</div>
            </div>
            <button onClick={() => setSelectedSkill(null)} aria-label="Close"
              className="text-zinc-500 hover:text-white transition-colors flex-shrink-0 mt-1">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {selectedSkill.status && (() => {
            const st = STATUS_META[selectedSkill.status.id];
            return st ? (
              <div className="mt-2 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border"
                  style={{ color:st.color, borderColor:st.color+'40', backgroundColor:st.color+'12' }}>
                  {st.label}
                </span>
              </div>
            ) : null;
          })()}

          {selectedSkill.context && (
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">{selectedSkill.context}</p>
          )}
        </div>
      )}
    </div>
  );
}
