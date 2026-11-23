import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Layers, Cpu, Terminal, Database, Wrench, Users, X, ArrowUpRight } from 'lucide-react';

export const SEVEN_CLUSTERS = [
  {
    id: 'programming',
    title: 'Programming',
    color: '#00E5FF',
    icon: Terminal,
    technologies: ['Python'],
    description: 'Foundational algorithmic language for AI development, APIs, and computational problem-solving.'
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    color: '#38BDF8',
    icon: Cpu,
    technologies: ['Scikit-learn', 'PyTorch', 'LLMs', 'RAG', 'LangChain', 'Hugging Face', 'Gemini API'],
    description: 'Statistical modeling, deep learning architectures, dense vector retrieval, and generative orchestration.'
  },
  {
    id: 'data-science',
    title: 'Data Science',
    color: '#10B981',
    icon: Layers,
    technologies: ['NumPy', 'Pandas', 'Matplotlib', 'Seaborn'],
    description: 'High-performance vector mathematics, structured dataframe manipulation, and empirical visualizations.'
  },
  {
    id: 'web-backend',
    title: 'Web & Backend',
    color: '#A855F7',
    icon: Layers,
    technologies: ['React', 'HTML', 'CSS', 'FastAPI', 'Django', 'REST API Design'],
    description: 'Modern reactive component interfaces, asynchronous backend APIs, and distributed service endpoints.'
  },
  {
    id: 'databases',
    title: 'Databases',
    color: '#F59E0B',
    icon: Database,
    technologies: ['SQL', 'MongoDB', 'ChromaDB'],
    description: 'Relational data structures, document-oriented stores, and dense vector embedding stores.'
  },
  {
    id: 'devops-tools',
    title: 'Developer & DevOps',
    color: '#FB923C',
    icon: Wrench,
    technologies: ['Git', 'GitHub', 'Linux', 'VS Code', 'Jupyter', 'Docker', 'CI/CD', 'Kubernetes'],
    description: 'Version control paradigms, containerized environments, Linux kernel CLI, and automated delivery pipelines.'
  },
  {
    id: 'professional-skills',
    title: 'Professional Skills',
    color: '#34D399',
    icon: Users,
    technologies: ['Leadership', 'Communication', 'Public Speaking', 'Problem-Solving', 'Teamwork'],
    description: 'Human communication clarity, collaborative engineering leadership, and structured analytical problem-solving.'
  }
];

export default function Scene3TechConstellation() {
  const mountRef = useRef(null);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [hoveredCluster, setHoveredCluster] = useState(null);

  // Helper to generate crisp billboard text sprites
  const createClusterSprite = (title, colorHex, count) => {
    const canvas = document.createElement('canvas');
    const dpr = 2;
    const w = 240 * dpr;
    const h = 58 * dpr;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const actualW = w / dpr;
    const actualH = h / dpr;
    const radius = 12;

    // Pill background
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(actualW - radius, 0);
    ctx.quadraticCurveTo(actualW, 0, actualW, radius);
    ctx.lineTo(actualW, actualH - radius);
    ctx.quadraticCurveTo(actualW, actualH, actualW - radius, actualH);
    ctx.lineTo(radius, actualH);
    ctx.quadraticCurveTo(0, actualH, 0, actualH - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();

    ctx.fillStyle = 'rgba(6, 12, 22, 0.92)';
    ctx.fill();

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = colorHex;
    ctx.stroke();

    // Color indicator dot
    ctx.beginPath();
    ctx.arc(16, actualH / 2, 4, 0, Math.PI * 2);
    ctx.fillStyle = colorHex;
    ctx.shadowColor = colorHex;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Title Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 12px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, 28, actualH / 2 - 5);

    // Count badge
    ctx.fillStyle = colorHex;
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.fillText(`${count} TECHNOLOGIES`, 28, actualH / 2 + 8);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(1.4, 1.4 * (actualH / actualW), 1);
    return sprite;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 640;

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 340;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, isMobile ? 8.2 : 6.8);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const constellationGroup = new THREE.Group();
    scene.add(constellationGroup);

    const disposableResources = {
      geometries: [],
      materials: [],
      textures: [],
    };
    const regGeo = (g) => { disposableResources.geometries.push(g); return g; };
    const regMat = (m) => { disposableResources.materials.push(m); return m; };

    // 2. Central Core Sphere: NIRANJAN.AI
    const coreGeo = regGeo(new THREE.SphereGeometry(0.38, 24, 24));
    const coreMat = regMat(new THREE.MeshStandardMaterial({
      color: 0x00E5FF,
      emissive: 0x00E5FF,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.15,
    }));
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    constellationGroup.add(coreMesh);

    // Core central label
    const coreCanvas = document.createElement('canvas');
    coreCanvas.width = 256;
    coreCanvas.height = 70;
    const cCtx = coreCanvas.getContext('2d');
    cCtx.fillStyle = 'rgba(0, 229, 255, 0.15)';
    cCtx.roundRect(4, 4, 248, 62, 12);
    cCtx.fill();
    cCtx.strokeStyle = '#00E5FF';
    cCtx.lineWidth = 2;
    cCtx.stroke();
    cCtx.fillStyle = '#FFFFFF';
    cCtx.font = 'bold 20px "JetBrains Mono", monospace';
    cCtx.textAlign = 'center';
    cCtx.textBaseline = 'middle';
    cCtx.fillText('NIRANJAN.AI', 128, 35);

    const coreTexture = new THREE.CanvasTexture(coreCanvas);
    disposableResources.textures.push(coreTexture);
    const coreSpriteMat = regMat(new THREE.SpriteMaterial({ map: coreTexture, transparent: true, depthTest: false }));
    const coreSprite = new THREE.Sprite(coreSpriteMat);
    coreSprite.scale.set(1.4, 1.4 * (70 / 256), 1);
    coreSprite.position.set(0, 0.58, 0);
    constellationGroup.add(coreSprite);

    // 3. Circular Formation: 7 Skill Clusters
    const clusterNodes = [];
    const interactiveObjects = [];
    const hubGeo = regGeo(new THREE.SphereGeometry(0.18, 16, 16));
    const radius = isMobile ? 2.2 : 2.6;

    SEVEN_CLUSTERS.forEach((cluster, idx) => {
      const angle = (idx / SEVEN_CLUSTERS.length) * Math.PI * 2 - Math.PI / 2;
      const depth = Math.sin(idx * 1.8) * 0.45; // Varying depth for 3D perspective

      const basePos = new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * (radius * 0.75), // Elliptical height adjustment
        depth
      );

      const mat = regMat(new THREE.MeshStandardMaterial({
        color: new THREE.Color(cluster.color),
        emissive: new THREE.Color(cluster.color),
        emissiveIntensity: 0.7,
        metalness: 0.85,
        roughness: 0.2,
      }));

      const mesh = new THREE.Mesh(hubGeo, mat);
      mesh.position.copy(basePos);
      mesh.userData = { cluster };
      constellationGroup.add(mesh);
      interactiveObjects.push(mesh);

      // Billboard Text Label
      const sprite = createClusterSprite(cluster.title, cluster.color, cluster.technologies.length);
      disposableResources.materials.push(sprite.material);
      disposableResources.textures.push(sprite.material.map);
      sprite.position.set(basePos.x, basePos.y + 0.32, basePos.z);
      sprite.userData = { cluster };
      constellationGroup.add(sprite);
      interactiveObjects.push(sprite);

      clusterNodes.push({
        mesh,
        sprite,
        basePos: basePos.clone(),
        labelOffset: new THREE.Vector3(0, 0.32, 0),
        phase: idx * 0.95,
        color: new THREE.Color(cluster.color),
      });
    });

    // 4. Connecting Radial Lines from Core to Clusters
    const lineCount = SEVEN_CLUSTERS.length;
    const linePositions = new Float32Array(lineCount * 2 * 3);
    const lineColors = new Float32Array(lineCount * 2 * 3);

    clusterNodes.forEach((node, idx) => {
      const c = node.color;
      lineColors[idx * 6] = 0;
      lineColors[idx * 6 + 1] = 0.89;
      lineColors[idx * 6 + 2] = 1;
      lineColors[idx * 6 + 3] = c.r;
      lineColors[idx * 6 + 4] = c.g;
      lineColors[idx * 6 + 5] = c.b;
    });

    const linesGeo = regGeo(new THREE.BufferGeometry());
    linesGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    linesGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const linesMat = regMat(new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    }));
    const linesMesh = new THREE.LineSegments(linesGeo, linesMat);
    constellationGroup.add(linesMesh);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0x0a1420, 1.4);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0x00E5FF, 3.0, 15);
    scene.add(coreLight);

    // 6. Raycasting Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let currentlyHighlighted = null;

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const onClick = () => {
      if (currentlyHighlighted && currentlyHighlighted.userData?.cluster) {
        setSelectedCluster(currentlyHighlighted.userData.cluster);
      }
    };

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('click', onClick);

    // IntersectionObserver to pause offscreen
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 7. Continuous Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Continuous subtle orbital movement of the constellation
        constellationGroup.rotation.y = Math.sin(elapsed * 0.35) * 0.22;
        constellationGroup.position.y = Math.sin(elapsed * 0.6) * 0.08;

        // Independent harmonic floating motion for each node
        clusterNodes.forEach((node) => {
          const fx = Math.cos(elapsed * 0.5 + node.phase) * 0.06;
          const fy = Math.sin(elapsed * 0.7 + node.phase) * 0.07;
          const fz = Math.sin(elapsed * 0.4 + node.phase) * 0.05;

          node.mesh.position.set(
            node.basePos.x + fx,
            node.basePos.y + fy,
            node.basePos.z + fz
          );
          node.sprite.position.copy(node.mesh.position).add(node.labelOffset);
        });

        // Real-time radial lines update
        const posAttr = linesGeo.attributes.position.array;
        clusterNodes.forEach((node, idx) => {
          const tPos = node.mesh.position;
          const baseIdx = idx * 6;

          posAttr[baseIdx] = 0;
          posAttr[baseIdx + 1] = 0;
          posAttr[baseIdx + 2] = 0;

          posAttr[baseIdx + 3] = tPos.x;
          posAttr[baseIdx + 4] = tPos.y;
          posAttr[baseIdx + 5] = tPos.z;
        });
        linesGeo.attributes.position.needsUpdate = true;
      }

      // Raycast test
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects);

      if (intersects.length > 0) {
        const topHit = intersects[0].object;
        if (currentlyHighlighted !== topHit) {
          if (currentlyHighlighted && currentlyHighlighted.isMesh) {
            currentlyHighlighted.scale.set(1, 1, 1);
          }
          currentlyHighlighted = topHit;
          if (topHit.isMesh) {
            topHit.scale.set(1.35, 1.35, 1.35);
          }
          setHoveredCluster(topHit.userData.cluster);
        }
      } else {
        if (currentlyHighlighted) {
          if (currentlyHighlighted.isMesh) {
            currentlyHighlighted.scale.set(1, 1, 1);
          }
          currentlyHighlighted = null;
          setHoveredCluster(null);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      cancelAnimationFrame(animId);

      disposableResources.geometries.forEach((g) => g.dispose());
      disposableResources.materials.forEach((m) => m.dispose());
      disposableResources.textures.forEach((t) => t.dispose());

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[320px] sm:h-[350px] rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl overflow-hidden cursor-pointer select-none group shadow-2xl">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Top Banner */}
      <div className="absolute top-3 left-4 right-4 z-10 flex items-center justify-between pointer-events-none text-[10px] font-mono">
        <div className="flex items-center space-x-1.5 bg-black/70 px-2.5 py-1 rounded-full border border-white/10 text-cyan-glow">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-pulse" />
          <span>7 CAPABILITY CLUSTERS // CIRCULAR FORMATION</span>
        </div>
        <div className="text-zinc-500 hidden sm:block">
          CLICK CLUSTER TO INSPECT TECHNOLOGIES
        </div>
      </div>

      {/* Interactive Cluster Detail Modal / Inspector Drawer */}
      {selectedCluster && (
        <div className="absolute inset-x-3 bottom-3 z-20 p-4 rounded-xl border border-cyan-glow/40 bg-black/95 backdrop-blur-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedCluster.color }} />
                <h4 className="font-display font-bold text-sm text-white tracking-wide">
                  {selectedCluster.title.toUpperCase()}
                </h4>
              </div>
              <p className="text-[11px] font-mono text-zinc-400">
                {selectedCluster.description}
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedCluster(null); }}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/10 mt-2.5">
            {selectedCluster.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border border-white/10 bg-white/5 text-zinc-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
