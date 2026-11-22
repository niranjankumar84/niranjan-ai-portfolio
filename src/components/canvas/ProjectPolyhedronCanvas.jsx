import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function ProjectPolyhedronCanvas({
  projectType = 'icosahedron',
  accentColor = '#00E5FF',
  projectName = 'AI-POWERED GYM TRAINER',
  systemCode = 'SYS-CV-01',
  isWireframe = false,
  onToggleWireframe
}) {
  const mountRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [localWireframe, setLocalWireframe] = useState(isWireframe);

  const currentTypeRef = useRef(projectType);
  const currentColorRef = useRef(accentColor);
  const isWireframeRef = useRef(isWireframe);
  const transitionRef = useRef({ progress: 1, targetType: projectType, targetColor: accentColor });

  // Sync external wireframe state if provided
  useEffect(() => {
    isWireframeRef.current = isWireframe;
    setLocalWireframe(isWireframe);
  }, [isWireframe]);

  // Handle project transitions
  useEffect(() => {
    if (projectType !== currentTypeRef.current || accentColor !== currentColorRef.current) {
      transitionRef.current = {
        progress: 0,
        targetType: projectType,
        targetColor: accentColor
      };
      currentTypeRef.current = projectType;
      currentColorRef.current = accentColor;
    }
  }, [projectType, accentColor]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // WebGL availability check
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch (e) {
      setWebglSupported(false);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const width = container.clientWidth || 420;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.4);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      setWebglSupported(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.domElement.style.touchAction = 'none';
    container.appendChild(renderer.domElement);

    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Track geometries and materials for disposal
    const allGeometries = [];
    const allMaterials = [];
    const regGeo = (g) => { allGeometries.push(g); return g; };
    const regMat = (m) => { allMaterials.push(m); return m; };

    // Factory to construct geometries based on research system
    const createGeometry = (type) => {
      switch (type) {
        case 'octahedron': // LexAI-India (RAG & Vector Search)
          return regGeo(new THREE.OctahedronGeometry(1.68, 0));
        case 'dodecahedron': // AI Resume ATS (NLP & Semantic Parsing)
          return regGeo(new THREE.DodecahedronGeometry(1.52, 0));
        case 'icosahedron': // Gym Trainer (CV & Pose Estimation)
        default:
          return regGeo(new THREE.IcosahedronGeometry(1.62, 0));
      }
    };

    // Shaded Faceted Crystal Material
    const crystalMat = regMat(new THREE.MeshStandardMaterial({
      color: 0x0a1424,
      roughness: 0.14,
      metalness: 0.94,
      flatShading: true,
      emissive: 0x001d33,
      emissiveIntensity: 0.45
    }));

    // Wireframe Outer Cage Material
    const wireframeMat = regMat(new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentColor),
      wireframe: true,
      transparent: true,
      opacity: 0.65
    }));

    let activeGeo = createGeometry(projectType);
    const crystalMesh = new THREE.Mesh(activeGeo, isWireframeRef.current ? wireframeMat : crystalMat);
    const wireframeMesh = new THREE.Mesh(activeGeo, wireframeMat);
    wireframeMesh.scale.setScalar(1.025);

    masterGroup.add(crystalMesh);
    masterGroup.add(wireframeMesh);

    // Orbiting Concentric Cyber Telemetry Rings
    const ringGeo = regGeo(new THREE.TorusGeometry(2.45, 0.018, 16, 90));
    const ringMat = regMat(new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentColor),
      wireframe: true,
      transparent: true,
      opacity: 0.45
    }));
    const primaryRing = new THREE.Mesh(ringGeo, ringMat);
    masterGroup.add(primaryRing);

    const secondaryRingGeo = regGeo(new THREE.TorusGeometry(2.8, 0.012, 16, 80));
    const secondaryRingMat = regMat(new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    }));
    const secondaryRing = new THREE.Mesh(secondaryRingGeo, secondaryRingMat);
    secondaryRing.rotation.x = Math.PI / 2;
    masterGroup.add(secondaryRing);

    // Floating Telemetry Joint / Node Points
    const nodeCount = 14;
    const nodeGeo = regGeo(new THREE.SphereGeometry(0.045, 8, 8));
    const nodeMat = regMat(new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentColor),
      wireframe: false
    }));
    const nodeGroup = new THREE.Group();
    for (let n = 0; n < nodeCount; n++) {
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      const theta = (n / nodeCount) * Math.PI * 2;
      nodeMesh.position.set(
        Math.cos(theta) * 2.45,
        Math.sin(theta) * 2.45,
        0
      );
      nodeGroup.add(nodeMesh);
    }
    masterGroup.add(nodeGroup);

    // Ambient Research Dust Particles
    const particleCount = 220;
    const particleGeo = regGeo(new THREE.BufferGeometry());
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 9;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 7;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const particleMat = regMat(new THREE.PointsMaterial({
      color: new THREE.Color(accentColor),
      size: 0.038,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    }));
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const accentLight = new THREE.PointLight(new THREE.Color(accentColor), 5.0, 15);
    accentLight.position.set(3, 3, 3);
    scene.add(accentLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 3.5, 14);
    blueLight.position.set(-4, -3, 3);
    scene.add(blueLight);

    // Interactive Drag / Inertia Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      prevMouseY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    };

    const onPointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        velocityX = deltaX * 0.008;
        velocityY = deltaY * 0.008;
        masterGroup.rotation.y += velocityX;
        masterGroup.rotation.x += velocityY;
        prevMouseX = clientX;
        prevMouseY = clientY;
      } else {
        const rect = container.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((clientY - rect.top) / rect.height) * 2 - 1);
        targetTiltY = x * 0.45;
        targetTiltX = y * 0.35;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);

    // IntersectionObserver to pause when off-screen
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Geometry Transition Handling
      if (transitionRef.current.progress < 1) {
        transitionRef.current.progress += delta * 3.8;
        if (transitionRef.current.progress >= 1) {
          transitionRef.current.progress = 1;
          activeGeo.dispose();
          activeGeo = createGeometry(transitionRef.current.targetType);
          crystalMesh.geometry = activeGeo;
          wireframeMesh.geometry = activeGeo;

          // Update colors
          const targetColorObj = new THREE.Color(transitionRef.current.targetColor);
          wireframeMat.color = targetColorObj;
          ringMat.color = targetColorObj;
          nodeMat.color = targetColorObj;
          particleMat.color = targetColorObj;
          accentLight.color = targetColorObj;
        } else {
          // Morph pulse
          const pulse = Math.sin(transitionRef.current.progress * Math.PI);
          const s = 1 - pulse * 0.35;
          crystalMesh.scale.setScalar(s);
          wireframeMesh.scale.setScalar(s * 1.025);
        }
      } else {
        crystalMesh.scale.setScalar(1);
        wireframeMesh.scale.setScalar(1.025);
      }

      // Shaded / Wireframe Switch
      if (isWireframeRef.current) {
        crystalMesh.material = wireframeMat;
        wireframeMesh.visible = false;
      } else {
        crystalMesh.material = crystalMat;
        wireframeMesh.visible = true;
      }

      // Apply drag inertia or auto-rotation
      if (!prefersReducedMotion) {
        if (!isDragging) {
          velocityX *= 0.94;
          velocityY *= 0.94;
          masterGroup.rotation.y += 0.007 + velocityX;
          masterGroup.rotation.x += velocityY;

          // Gentle mouse tilt
          masterGroup.rotation.y += (targetTiltY - (masterGroup.rotation.y % (Math.PI * 2))) * 0.02;
          masterGroup.rotation.x += (targetTiltX - masterGroup.rotation.x) * 0.02;
        }

        // Concentric rings counter-rotation
        primaryRing.rotation.z = time * 0.35;
        primaryRing.rotation.x = Math.PI / 3 + Math.sin(time * 0.6) * 0.2;
        nodeGroup.rotation.z = time * 0.35;
        secondaryRing.rotation.y = -time * 0.25;

        // Subtle levitation
        masterGroup.position.y = Math.sin(time * 1.6) * 0.08;

        particles.rotation.y = time * 0.025;
      } else {
        masterGroup.position.y = 0;
        masterGroup.rotation.y = 0.5;
        masterGroup.rotation.x = 0.2;
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
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      cancelAnimationFrame(animId);

      allGeometries.forEach((g) => g.dispose());
      allMaterials.forEach((m) => m.dispose());
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const toggleRenderMode = () => {
    const next = !localWireframe;
    setLocalWireframe(next);
    isWireframeRef.current = next;
    onToggleWireframe?.(next);
  };

  if (!webglSupported) {
    return (
      <div className="relative w-full aspect-square flex items-center justify-center p-8 bg-black/60 rounded-2xl border border-white/10">
        <div className="text-center font-mono space-y-2">
          <div className="text-cyan-glow text-sm font-bold">[3D HOLOGRAPHIC CHAMBER]</div>
          <div className="text-xs text-zinc-400">{systemCode} // {projectName}</div>
          <div className="text-[10px] text-zinc-600">2D SCHEMATIC MODE ACTIVE</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square max-w-[460px] mx-auto flex flex-col items-center justify-center select-none">
      
      {/* 3D WebGL Canvas */}
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing" 
        title="Click and drag to rotate the 3D crystal structure"
      />

      {/* Floating HUD Telemetry & Render Mode Switch */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto px-4 py-2 rounded-full border border-white/10 bg-black/80 backdrop-blur-md text-[10px] font-mono text-zinc-400 shadow-[0_4px_25px_rgba(0,0,0,0.8)] z-10">
        <div className="flex items-center space-x-2">
          <span 
            className="w-2 h-2 rounded-full animate-pulse" 
            style={{ backgroundColor: accentColor }} 
          />
          <span className="text-zinc-200 uppercase tracking-wider">
            {projectType} // {systemCode}
          </span>
        </div>

        {/* Shaded / Wireframe Interactive Switch */}
        <button
          type="button"
          onClick={toggleRenderMode}
          className="px-3 py-0.5 rounded-full border transition-all font-mono tracking-wider flex items-center space-x-1.5"
          style={{
            borderColor: `${accentColor}80`,
            backgroundColor: `${accentColor}20`,
            color: accentColor
          }}
          aria-label="Toggle between Shaded and Wireframe 3D rendering modes"
        >
          <span>RENDER:</span>
          <span className="font-extrabold">{localWireframe ? 'WIREFRAME' : 'SHADED'}</span>
        </button>
      </div>

      {/* Top HUD Callouts */}
      <div className="absolute top-3 left-3 text-[9px] font-mono text-zinc-500 pointer-events-none space-y-0.5 z-10">
        <div className="font-semibold" style={{ color: accentColor }}>// HOLOGRAPHIC_CHAMBER</div>
        <div>AXIS: DUAL_ORBITAL</div>
        <div>DRAG: ROTATE_STRUCTURE</div>
      </div>

      <div className="absolute top-3 right-3 text-[9px] font-mono text-zinc-500 text-right pointer-events-none space-y-0.5 z-10">
        <div className="font-semibold" style={{ color: accentColor }}>// SPEC_REF: VERIFIED</div>
        <div>SURFACE: FACETED_ALLOY</div>
        <div>STATE: DYNAMIC_MORPH</div>
      </div>

    </div>
  );
}
