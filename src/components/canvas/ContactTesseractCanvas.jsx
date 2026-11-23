import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { personalData } from '../../data/portfolioData';

/**
 * 3D Contact Constellation Hub
 *
 * Requirements:
 * - Replaces decorative Tesseract with a functional 3D Contact Hub.
 * - Exact visual language of SkillsConstellationCanvas: node design, connecting lines, floating animation, permanent typography.
 * - Central node: "NIRANJAN KUMAR"
 * - 4 floating satellite nodes:
 *   1. Email — Envelope icon & permanent label, opens default email composer
 *   2. GitHub — Official GitHub branding & permanent label, opens repository profile
 *   3. LinkedIn — Official LinkedIn branding & permanent label, opens professional profile
 *   4. Instagram — Official Instagram branding & permanent label, opens visual diary
 * - Clicking any node opens its destination immediately.
 * - Reduced motion support & offscreen rendering pause via IntersectionObserver.
 */
export default function ContactTesseractCanvas() {
  const mountRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Helper to generate billboard text sprites with embedded vector icons
  const createContactSprite = (title, handle, colorHex, iconType = 'core') => {
    const canvas = document.createElement('canvas');
    const dpr = 2;
    const isCore = iconType === 'core';
    const w = (isCore ? 280 : 250) * dpr;
    const h = (isCore ? 64 : 60) * dpr;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const actualW = w / dpr;
    const actualH = h / dpr;
    const radius = 14;

    // Pill container background
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

    ctx.fillStyle = isCore ? 'rgba(4, 10, 22, 0.94)' : 'rgba(8, 14, 24, 0.90)';
    ctx.fill();

    ctx.lineWidth = isCore ? 2 : 1.5;
    ctx.strokeStyle = colorHex;
    ctx.stroke();

    // Draw recognizable vector platform icon
    ctx.save();
    const iconX = 22;
    const iconY = actualH / 2;

    if (iconType === 'core') {
      // Core glowing pulse dot
      ctx.beginPath();
      ctx.arc(iconX, iconY, 6, 0, Math.PI * 2);
      ctx.fillStyle = colorHex;
      ctx.shadowColor = colorHex;
      ctx.shadowBlur = 10;
      ctx.fill();
    } else if (iconType === 'email') {
      // Envelope icon
      ctx.strokeStyle = colorHex;
      ctx.lineWidth = 1.8;
      ctx.strokeRect(iconX - 9, iconY - 6, 18, 12);
      ctx.beginPath();
      ctx.moveTo(iconX - 9, iconY - 6);
      ctx.lineTo(iconX, iconY + 1);
      ctx.lineTo(iconX + 9, iconY - 6);
      ctx.stroke();
    } else if (iconType === 'github') {
      // GitHub Octocat silhouette / stylized logo
      ctx.fillStyle = colorHex;
      ctx.beginPath();
      ctx.arc(iconX, iconY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#080E18';
      ctx.beginPath();
      ctx.arc(iconX, iconY - 2, 4.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (iconType === 'linkedin') {
      // LinkedIn badge
      ctx.fillStyle = colorHex;
      ctx.fillRect(iconX - 8, iconY - 8, 16, 16);
      ctx.fillStyle = '#080E18';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('in', iconX, iconY);
    } else if (iconType === 'instagram') {
      // Instagram camera glyph
      ctx.strokeStyle = colorHex;
      ctx.lineWidth = 1.8;
      ctx.strokeRect(iconX - 8, iconY - 8, 16, 16);
      ctx.beginPath();
      ctx.arc(iconX, iconY, 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = colorHex;
      ctx.beginPath();
      ctx.arc(iconX + 4.5, iconY - 4.5, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Permanent Text: Title & Handle
    ctx.fillStyle = '#FFFFFF';
    ctx.font = isCore ? 'bold 14px "JetBrains Mono", sans-serif' : '600 13px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, 42, actualH / 2 - (handle ? 7 : 0));

    if (handle) {
      ctx.fillStyle = colorHex;
      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.fillText(handle, 42, actualH / 2 + 8);
    }

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
    const spriteScale = isCore ? 1.6 : 1.45;
    sprite.scale.set(spriteScale, spriteScale * (actualH / actualW), 1);
    return sprite;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const width = container.clientWidth || 420;
    const height = container.clientHeight || 420;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.8);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const constellationGroup = new THREE.Group();
    scene.add(constellationGroup);

    // Track resources for disposal
    const disposableResources = {
      geometries: [],
      materials: [],
      textures: [],
    };
    const regGeo = (g) => { disposableResources.geometries.push(g); return g; };
    const regMat = (m) => { disposableResources.materials.push(m); return m; };

    const interactiveObjects = [];
    const dynamicNodes = [];

    // Geometries
    const coreGeo = regGeo(new THREE.SphereGeometry(0.32, 24, 24));
    const satGeo = regGeo(new THREE.SphereGeometry(0.18, 20, 20));

    // 2. Central Node: NIRANJAN KUMAR
    const coreMat = regMat(new THREE.MeshStandardMaterial({
      color: 0x00E5FF,
      emissive: 0x00E5FF,
      emissiveIntensity: 0.85,
      metalness: 0.9,
      roughness: 0.15,
    }));
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(0, 0, 0);
    coreMesh.userData = {
      type: 'core',
      name: 'NIRANJAN KUMAR',
      handle: 'IDENTITY CORE',
      url: null,
    };
    constellationGroup.add(coreMesh);
    interactiveObjects.push(coreMesh);

    const coreSprite = createContactSprite('NIRANJAN KUMAR', 'IDENTITY // TRANSMIT', '#00E5FF', 'core');
    disposableResources.materials.push(coreSprite.material);
    disposableResources.textures.push(coreSprite.material.map);
    coreSprite.position.set(0, 0.58, 0);
    constellationGroup.add(coreSprite);
    coreSprite.userData = coreMesh.userData;
    interactiveObjects.push(coreSprite);

    const coreNodeEntry = {
      mesh: coreMesh,
      sprite: coreSprite,
      basePos: new THREE.Vector3(0, 0, 0),
      labelOffset: new THREE.Vector3(0, 0.58, 0),
      phase: 0,
      speedX: 0.4,
      speedY: 0.5,
      ampX: 0.08,
      ampY: 0.08,
      ampZ: 0.05,
    };
    dynamicNodes.push(coreNodeEntry);

    // 3. Four Floating Satellite Contact Nodes
    const satelliteConfig = [
      {
        id: 'email',
        name: 'Direct Email',
        handle: personalData.email,
        url: `mailto:${personalData.email}`,
        pos: [-2.1, 1.5, 0.3],
        color: '#10B981',
        iconType: 'email',
      },
      {
        id: 'github',
        name: 'GitHub',
        handle: '@niranjankumar84',
        url: 'https://github.com/niranjankumar84',
        pos: [2.1, 1.5, -0.2],
        color: '#00E5FF',
        iconType: 'github',
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        handle: 'in/niranjan-kumar84',
        url: 'https://www.linkedin.com/in/niranjan-kumar84',
        pos: [-2.1, -1.4, -0.3],
        color: '#38BDF8',
        iconType: 'linkedin',
      },
      {
        id: 'instagram',
        name: 'Instagram',
        handle: '@this_is_niranjans',
        url: 'https://www.instagram.com/this_is_niranjans/',
        pos: [2.1, -1.4, 0.3],
        color: '#E1306C',
        iconType: 'instagram',
      },
    ];

    const connectingLinesData = [];

    satelliteConfig.forEach((cfg, idx) => {
      const basePos = new THREE.Vector3(...cfg.pos);

      const mat = regMat(new THREE.MeshStandardMaterial({
        color: new THREE.Color(cfg.color),
        emissive: new THREE.Color(cfg.color),
        emissiveIntensity: 0.75,
        metalness: 0.88,
        roughness: 0.18,
      }));

      const mesh = new THREE.Mesh(satGeo, mat);
      mesh.position.copy(basePos);
      mesh.userData = {
        type: 'channel',
        name: cfg.name,
        handle: cfg.handle,
        url: cfg.url,
        color: cfg.color,
      };
      constellationGroup.add(mesh);
      interactiveObjects.push(mesh);

      const sprite = createContactSprite(cfg.name, cfg.handle, cfg.color, cfg.iconType);
      disposableResources.materials.push(sprite.material);
      disposableResources.textures.push(sprite.material.map);
      sprite.position.set(basePos.x, basePos.y + 0.34, basePos.z);
      constellationGroup.add(sprite);

      sprite.userData = mesh.userData;
      interactiveObjects.push(sprite);

      const nodeEntry = {
        mesh,
        sprite,
        basePos: basePos.clone(),
        labelOffset: new THREE.Vector3(0, 0.34, 0),
        phase: (idx + 1) * 1.35,
        speedX: 0.55 + idx * 0.1,
        speedY: 0.65 + idx * 0.12,
        ampX: 0.12,
        ampY: 0.14,
        ampZ: 0.1,
      };
      dynamicNodes.push(nodeEntry);

      // Connection line from Center Core to this Satellite Node
      connectingLinesData.push({
        source: coreNodeEntry,
        target: nodeEntry,
        color: new THREE.Color(cfg.color),
      });
    });

    // 4. Connecting Lines Mesh
    const totalLines = connectingLinesData.length;
    const linePositions = new Float32Array(totalLines * 2 * 3);
    const lineColors = new Float32Array(totalLines * 2 * 3);

    connectingLinesData.forEach((line, idx) => {
      const c = line.color;
      lineColors[idx * 6] = c.r;
      lineColors[idx * 6 + 1] = c.g;
      lineColors[idx * 6 + 2] = c.b;
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
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    }));
    const linesMesh = new THREE.LineSegments(linesGeo, linesMat);
    constellationGroup.add(linesMesh);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0x061220, 1.3);
    scene.add(ambientLight);

    const cyanPoint = new THREE.PointLight(0x00E5FF, 3.2, 20);
    cyanPoint.position.set(0, 0, 3);
    scene.add(cyanPoint);

    // 6. Interaction: Raycasting, Click to Launch, Drag to Rotate
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let currentlyHighlighted = null;

    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let targetRotation = { x: 0.05, y: 0 };
    let currentRotation = { x: 0.05, y: 0 };

    const onPointerDown = (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;
        targetRotation.y += deltaX * 0.006;
        targetRotation.x += deltaY * 0.006;
        prevMousePos = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const handleClick = () => {
      if (currentlyHighlighted && currentlyHighlighted.userData) {
        const { url, name } = currentlyHighlighted.userData;
        if (url) {
          if (url.startsWith('mailto:')) {
            window.location.href = url;
          } else {
            window.open(url, '_blank', 'noopener,noreferrer');
          }
        }
      }
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('click', handleClick);

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
        // Continuous organic network breathing motion
        constellationGroup.position.x = Math.sin(elapsed * 0.5) * 0.15;
        constellationGroup.position.y = Math.cos(elapsed * 0.6) * 0.12;

        // Independent floating motion for each node
        dynamicNodes.forEach((node) => {
          const fx = Math.cos(elapsed * node.speedX + node.phase) * node.ampX;
          const fy = Math.sin(elapsed * node.speedY + node.phase) * node.ampY;
          const fz = Math.sin(elapsed * (node.speedX * 0.7) + node.phase) * node.ampZ;

          node.mesh.position.set(
            node.basePos.x + fx,
            node.basePos.y + fy,
            node.basePos.z + fz
          );
          node.sprite.position.copy(node.mesh.position).add(node.labelOffset);
        });

        // Real-Time line update
        const posAttr = linesGeo.attributes.position.array;
        connectingLinesData.forEach((line, idx) => {
          const sPos = line.source.mesh.position;
          const tPos = line.target.mesh.position;
          const baseIdx = idx * 6;

          posAttr[baseIdx] = sPos.x;
          posAttr[baseIdx + 1] = sPos.y;
          posAttr[baseIdx + 2] = sPos.z;

          posAttr[baseIdx + 3] = tPos.x;
          posAttr[baseIdx + 4] = tPos.y;
          posAttr[baseIdx + 5] = tPos.z;
        });
        linesGeo.attributes.position.needsUpdate = true;
      }

      // Smooth inertia rotation lerp
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;
      constellationGroup.rotation.x = currentRotation.x;
      constellationGroup.rotation.y = currentRotation.y;

      // Raycast hover test
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
          setHoveredNode(topHit.userData);
        }
      } else {
        if (currentlyHighlighted) {
          if (currentlyHighlighted.isMesh) {
            currentlyHighlighted.scale.set(1, 1, 1);
          }
          currentlyHighlighted = null;
          setHoveredNode(null);
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
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('click', handleClick);
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
    <div className="relative w-full aspect-square rounded-3xl border border-white/10 bg-black/90 backdrop-blur-2xl p-2 flex flex-col items-center justify-center shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing group">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Futuristic Obsidian Ambient Gradients */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(0,229,255,0.06)_0%,transparent_70%)]" />

      {/* Top HUD Telemetry Banner */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none text-[10px] font-mono">
        <div className="flex items-center space-x-2 bg-black/75 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
          <span className="text-cyan-glow tracking-widest font-semibold uppercase">3D CONTACT CONDUIT</span>
        </div>
        <div className="bg-black/75 px-2.5 py-1.5 rounded-full border border-white/10 text-zinc-400 backdrop-blur-md hidden sm:block">
          <span>CLICK NODE TO TRANSMIT</span>
        </div>
      </div>

      {/* Corner Brackets */}
      <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-cyan-glow/50 pointer-events-none" />
      <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-cyan-glow/50 pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-cyan-glow/50 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-cyan-glow/50 pointer-events-none" />

      {/* Bottom Interactive HUD Pill */}
      <div className="absolute bottom-3 left-3 right-3 px-3.5 py-2 rounded-2xl border border-white/10 bg-black/85 backdrop-blur-md text-[10px] font-mono text-zinc-400 flex items-center justify-between pointer-events-none">
        <span className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-pulse" />
          <span className="text-zinc-200 font-medium">
            {hoveredNode?.url ? `TARGET: ${hoveredNode.name.toUpperCase()} (CLICK TO LAUNCH)` : 'CONSTELLATION // READY'}
          </span>
        </span>
        <span className="text-cyan-glow font-bold">4 CHANNELS</span>
      </div>
    </div>
  );
}
