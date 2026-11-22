import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * HeroCenterpieceCanvas — Recognizable Mechanical AI Entity
 * Represents the synergy of Software Engineering and Artificial Intelligence.
 * 
 * Identifiable Mechanical Architecture:
 * 1. Neural Synaptic Core (Glowing inner energy core + faceted optical housing)
 * 2. Segmented Exoskeleton Chassis (4 curved titanium structural ribs + polar caps)
 * 3. Radial Aperture Blades (Interlocking mechanical iris surrounding the core)
 * 4. Dual-Axis Concentric Gyro Gimbals (Machined calibration rings with gear notches)
 * 5. Floating Magnetic Pylons (4 satellite telemetry pods orbiting on quadrant axes)
 * 6. Atmospheric Particle Telemetry & Cinematic Lighting Reveal
 */
export default function HeroCenterpieceCanvas({ 
  isWireframe, 
  onToggleWireframe, 
  entityState = 'idle',
  onOpenAIPanel 
}) {
  const mountRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const isWireframeRef = useRef(isWireframe);
  const entityStateRef = useRef(entityState);

  useEffect(() => {
    isWireframeRef.current = isWireframe;
  }, [isWireframe]);

  useEffect(() => {
    entityStateRef.current = entityState;
  }, [entityState]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Verify WebGL availability
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

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const width = container.clientWidth || 460;
    const height = container.clientHeight || 460;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    const initialCamDist = width < 420 ? 9.4 : 8.2;
    camera.position.set(0, 0, initialCamDist);

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

    // Root group for mouse parallax and levitation
    const masterEntity = new THREE.Group();
    scene.add(masterEntity);

    // Track all meshes for Shaded / Wireframe toggling and disposal
    const shadedMaterials = [];
    const wireframeMaterials = [];
    const allGeometries = [];
    const registeredMeshes = [];

    // Helper to register geometry
    const regGeo = (geo) => {
      allGeometries.push(geo);
      return geo;
    };

    // Shared Palette Materials
    // Chrome / Polished Platinum (High reflection, crisp highlights)
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0x182438,
      metalness: 0.96,
      roughness: 0.12,
      emissive: 0x051020,
      emissiveIntensity: 0.25
    });
    shadedMaterials.push(chromeMat);

    // Dark Titanium Chassis (Matte structural contrast)
    const darkTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0x0a0e17,
      metalness: 0.88,
      roughness: 0.28,
      emissive: 0x000814,
      emissiveIntensity: 0.2
    });
    shadedMaterials.push(darkTitaniumMat);

    // Cyan Emissive Accents
    const cyanEmitterMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00e5ff,
      emissiveIntensity: 1.8,
      roughness: 0.2,
      metalness: 0.5
    });
    shadedMaterials.push(cyanEmitterMat);

    // Wireframe Mode Materials
    const wireframeCyanMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });
    wireframeMaterials.push(wireframeCyanMat);

    const wireframeBlueMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    wireframeMaterials.push(wireframeBlueMat);

    // Helper to register mesh with toggle ability
    const createPart = (geo, shadedMaterial, wireMaterial = wireframeCyanMat) => {
      const mesh = new THREE.Mesh(geo, isWireframeRef.current ? wireMaterial : shadedMaterial);
      mesh.userData = { shaded: shadedMaterial, wire: wireMaterial };
      registeredMeshes.push(mesh);
      return mesh;
    };

    // ==========================================
    // 1. NEURAL CORE ASSEMBLY (The AI Heart)
    // ==========================================
    const coreGroup = new THREE.Group();
    masterEntity.add(coreGroup);

    // Inner Glowing Core Sphere
    const innerCoreGeo = regGeo(new THREE.SphereGeometry(0.72, 32, 32));
    const innerCoreMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.95
    });
    shadedMaterials.push(innerCoreMat);
    const innerCoreMesh = createPart(innerCoreGeo, innerCoreMat, wireframeCyanMat);
    coreGroup.add(innerCoreMesh);

    // Faceted Optical Containment Shell
    const opticalShellGeo = regGeo(new THREE.IcosahedronGeometry(0.96, 1));
    const opticalShellMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      metalness: 0.9,
      roughness: 0.15,
      transparent: true,
      opacity: 0.35,
      wireframe: false
    });
    shadedMaterials.push(opticalShellMat);
    const opticalShell = createPart(opticalShellGeo, opticalShellMat, wireframeCyanMat);
    coreGroup.add(opticalShell);

    // Concentric Equatorial Aperture Iris (8 radial mechanical blades)
    const irisGroup = new THREE.Group();
    coreGroup.add(irisGroup);
    const bladeGeo = regGeo(new THREE.BoxGeometry(0.18, 0.04, 0.45));
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const blade = createPart(bladeGeo, chromeMat, wireframeCyanMat);
      blade.position.set(Math.cos(angle) * 1.05, 0, Math.sin(angle) * 1.05);
      blade.rotation.y = -angle + Math.PI / 4;
      irisGroup.add(blade);
    }

    // ==========================================
    // 2. EXOSKELETON CHASSIS (Software Engineering)
    // ==========================================
    const chassisGroup = new THREE.Group();
    masterEntity.add(chassisGroup);

    // Top and Bottom Polar Caps (Machined titanium hubs)
    const polarCapGeo = regGeo(new THREE.CylinderGeometry(0.55, 0.75, 0.22, 16));
    const topCap = createPart(polarCapGeo, darkTitaniumMat, wireframeBlueMat);
    topCap.position.y = 1.35;
    chassisGroup.add(topCap);

    const bottomCap = createPart(polarCapGeo, darkTitaniumMat, wireframeBlueMat);
    bottomCap.position.y = -1.35;
    bottomCap.rotation.x = Math.PI;
    chassisGroup.add(bottomCap);

    // Polar Emitter Beacons
    const beaconGeo = regGeo(new THREE.CylinderGeometry(0.12, 0.12, 0.2, 16));
    const topBeacon = createPart(beaconGeo, cyanEmitterMat, wireframeCyanMat);
    topBeacon.position.y = 1.5;
    chassisGroup.add(topBeacon);

    const bottomBeacon = createPart(beaconGeo, cyanEmitterMat, wireframeCyanMat);
    bottomBeacon.position.y = -1.5;
    chassisGroup.add(bottomBeacon);

    // 4 Curved Structural Titanium Ribs linking poles
    for (let r = 0; r < 4; r++) {
      const ribAngle = (r / 4) * Math.PI * 2;
      const ribPivot = new THREE.Group();
      ribPivot.rotation.y = ribAngle;
      chassisGroup.add(ribPivot);

      // Arc segment using Torus segment
      const ribArcGeo = regGeo(new THREE.TorusGeometry(1.42, 0.048, 12, 28, Math.PI * 0.72));
      const ribArc = createPart(ribArcGeo, chromeMat, wireframeCyanMat);
      ribArc.rotation.z = Math.PI * 0.14;
      ribArc.position.x = 0;
      ribPivot.add(ribArc);

      // Mid-chassis joint bracket
      const jointGeo = regGeo(new THREE.BoxGeometry(0.12, 0.24, 0.16));
      const joint = createPart(jointGeo, darkTitaniumMat, wireframeBlueMat);
      joint.position.set(1.42, 0, 0);
      ribPivot.add(joint);
    }

    // ==========================================
    // 3. DUAL-AXIS GYRO GIMBALS (Data Pipelines)
    // ==========================================
    const gimbalInnerGroup = new THREE.Group();
    masterEntity.add(gimbalInnerGroup);

    // Inner Gimbal Ring (with notched teeth)
    const innerGimbalGeo = regGeo(new THREE.TorusGeometry(1.85, 0.035, 12, 80));
    const innerGimbal = createPart(innerGimbalGeo, chromeMat, wireframeCyanMat);
    gimbalInnerGroup.add(innerGimbal);

    // Inner ring calibration markers (12 small tick cubes)
    const tickGeo = regGeo(new THREE.BoxGeometry(0.04, 0.08, 0.04));
    for (let t = 0; t < 12; t++) {
      const tAngle = (t / 12) * Math.PI * 2;
      const tick = createPart(tickGeo, cyanEmitterMat, wireframeCyanMat);
      tick.position.set(Math.cos(tAngle) * 1.85, Math.sin(tAngle) * 1.85, 0);
      gimbalInnerGroup.add(tick);
    }

    const gimbalOuterGroup = new THREE.Group();
    masterEntity.add(gimbalOuterGroup);

    // Outer Gimbal Ring (Orthogonal axis)
    const outerGimbalGeo = regGeo(new THREE.TorusGeometry(2.25, 0.03, 12, 90));
    const outerGimbal = createPart(outerGimbalGeo, darkTitaniumMat, wireframeBlueMat);
    gimbalOuterGroup.add(outerGimbal);

    // Outer thin telemetry coordinate ring
    const telemetryRingGeo = regGeo(new THREE.TorusGeometry(2.55, 0.012, 8, 100));
    const teleRingMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.4
    });
    shadedMaterials.push(teleRingMat);
    const telemetryRing = createPart(telemetryRingGeo, teleRingMat, wireframeCyanMat);
    telemetryRing.rotation.x = Math.PI / 3;
    masterEntity.add(telemetryRing);

    // ==========================================
    // 4. FLOATING MAGNETIC PYLONS (Agentic Microservices)
    // ==========================================
    const pylons = [];
    const pylonGeo = regGeo(new THREE.OctahedronGeometry(0.18, 0));
    const pylonTipGeo = regGeo(new THREE.SphereGeometry(0.06, 8, 8));

    for (let p = 0; p < 4; p++) {
      const pylonGroup = new THREE.Group();
      const pylonAngle = (p / 4) * Math.PI * 2;
      const radius = 2.95;

      const pylonBody = createPart(pylonGeo, chromeMat, wireframeCyanMat);
      pylonGroup.add(pylonBody);

      const pylonTip = createPart(pylonTipGeo, cyanEmitterMat, wireframeCyanMat);
      pylonTip.position.y = 0.24;
      pylonGroup.add(pylonTip);

      pylonGroup.position.set(
        Math.cos(pylonAngle) * radius,
        (p % 2 === 0 ? 0.35 : -0.35),
        Math.sin(pylonAngle) * radius
      );

      masterEntity.add(pylonGroup);
      pylons.push({
        group: pylonGroup,
        baseAngle: pylonAngle,
        radius,
        elevation: p % 2 === 0 ? 0.35 : -0.35,
        speed: 0.006 + p * 0.002
      });
    }

    // ==========================================
    // 5. ATMOSPHERIC PARTICLE TELEMETRY
    // ==========================================
    const particleCount = 280;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color(0x00e5ff);
    const blueColor = new THREE.Color(0x38bdf8);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 11;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 11;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 9;

      const mix = cyanColor.clone().lerp(blueColor, Math.random());
      particleColors[i * 3] = mix.r;
      particleColors[i * 3 + 1] = mix.g;
      particleColors[i * 3 + 2] = mix.b;
    }

    const particleGeo = regGeo(new THREE.BufferGeometry());
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ==========================================
    // 6. HIGH-CONTRAST STUDIO LIGHTING SETUP
    // ==========================================
    const targetLightLevels = {
      ambient: 0.55,
      key: 2.2,
      cyan: 5.5,
      blue: 4.2,
      rim: 4.8
    };

    const ambientLight = new THREE.AmbientLight(0xffffff, prefersReducedMotion ? targetLightLevels.ambient : 0);
    scene.add(ambientLight);

    // Intense Key Light (Chrome specular highlight)
    const keyLight = new THREE.DirectionalLight(0xffffff, prefersReducedMotion ? targetLightLevels.key : 0);
    keyLight.position.set(5, 6, 5);
    scene.add(keyLight);

    // Electric Cyan Point Light (Front-Right)
    const cyanLight = new THREE.PointLight(0x00e5ff, prefersReducedMotion ? targetLightLevels.cyan : 0, 16);
    cyanLight.position.set(4, 2, 4);
    scene.add(cyanLight);

    // Deep Sapphire Blue Point Light (Bottom-Left)
    const blueLight = new THREE.PointLight(0x3b82f6, prefersReducedMotion ? targetLightLevels.blue : 0, 16);
    blueLight.position.set(-4, -3, 3);
    scene.add(blueLight);

    // Intense Rim / Back Light (Creates razor-sharp metallic silhouette)
    const rimLight = new THREE.PointLight(0x00e5ff, prefersReducedMotion ? targetLightLevels.rim : 0, 14);
    rimLight.position.set(0, 4, -5);
    scene.add(rimLight);

    // ==========================================
    // 7. SMOOTH INTERACTION & DAMPING
    // ==========================================
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.65;
      targetY = y * 0.55;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });

    // IntersectionObserver to pause rendering when off-screen
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // ==========================================
    // 8. ANIMATION & CINEMATIC REVEAL LOOP
    // ==========================================
    let animId;
    let clock = new THREE.Clock();
    let revealProgress = prefersReducedMotion ? 1 : 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Cinematic Lighting Reveal Sequence
      if (revealProgress < 1) {
        revealProgress += delta * 0.75;
        if (revealProgress > 1) revealProgress = 1;

        const ease = 1 - Math.pow(1 - revealProgress, 3);
        ambientLight.intensity = targetLightLevels.ambient * ease;
        keyLight.intensity = targetLightLevels.key * ease;
        cyanLight.intensity = targetLightLevels.cyan * ease;
        blueLight.intensity = targetLightLevels.blue * ease;
        rimLight.intensity = targetLightLevels.rim * ease;

        const scaleVal = 0.85 + 0.15 * ease;
        masterEntity.scale.set(scaleVal, scaleVal, scaleVal);
      }

      // Smooth mouse lerp damping
      mouseX += (targetX - mouseX) * 0.045;
      mouseY += (targetY - mouseY) * 0.045;

      if (!prefersReducedMotion) {
        // Natural levitation hover (gentle floating sine wave)
        const levitation = Math.sin(time * 1.4) * 0.12;
        masterEntity.position.y = levitation;

        // Entity primary orientation
        masterEntity.rotation.y = time * 0.18 + mouseX;
        masterEntity.rotation.x = time * 0.08 + mouseY;

        // Internal Neural Core & Optical Shell counter-rotations
        coreGroup.rotation.y = -time * 0.35;
        opticalShell.rotation.x = time * 0.45;
        opticalShell.rotation.z = time * 0.25;

        // Aperture Iris subtle expansion and contraction pulse
        const irisPulse = 1 + Math.sin(time * 2.2) * 0.05;
        irisGroup.scale.set(irisPulse, irisPulse, irisPulse);

        // Gyro Gimbals differential rotation
        gimbalInnerGroup.rotation.x = time * 0.35;
        gimbalInnerGroup.rotation.z = time * 0.15;

        gimbalOuterGroup.rotation.y = -time * 0.28;
        gimbalOuterGroup.rotation.x = Math.PI / 4 + Math.sin(time * 0.5) * 0.2;

        telemetryRing.rotation.z = time * 0.2;

        // Orbiting Magnetic Pylons
        pylons.forEach((pylon) => {
          pylon.baseAngle += pylon.speed;
          pylon.group.position.x = Math.cos(pylon.baseAngle) * pylon.radius;
          pylon.group.position.z = Math.sin(pylon.baseAngle) * pylon.radius;
          pylon.group.position.y = pylon.elevation + Math.sin(time * 2 + pylon.baseAngle) * 0.15;
          pylon.group.rotation.y += 0.03;
          pylon.group.rotation.x += 0.02;
        });

        // Atmospheric particles gentle drift
        particles.rotation.y = time * 0.025;
        particles.rotation.x = time * 0.012;
      } else {
        // Reduced-motion: serene, elegant static orientation with gentle pointer response
        masterEntity.position.y = 0;
        masterEntity.rotation.y = 0.45 + mouseX * 0.2;
        masterEntity.rotation.x = 0.12 + mouseY * 0.2;
      }

      // Dynamic Shaded / Wireframe Material Switch
      registeredMeshes.forEach((mesh) => {
        const targetMat = isWireframeRef.current ? mesh.userData.wire : mesh.userData.shaded;
        if (mesh.material !== targetMat) {
          mesh.material = targetMat;
        }
      });

      // Modulate Core & Lights based on entityState (Voice & AI Intelligence)
      const st = entityStateRef.current;
      if (st === 'listening') {
        const pulse = 1 + Math.sin(time * 8.0) * 0.12;
        coreGroup.scale.set(pulse, pulse, pulse);
        cyanLight.color.setHex(0x10b981);
        cyanLight.intensity = targetLightLevels.cyan * 1.5;
        innerCoreMat.opacity = 0.95;
      } else if (st === 'thinking') {
        const flicker = 0.7 + Math.random() * 0.3;
        coreGroup.scale.set(flicker, flicker, flicker);
        cyanLight.color.setHex(0x38bdf8);
        cyanLight.intensity = targetLightLevels.cyan * (0.8 + flicker * 0.6);
        innerCoreMat.opacity = flicker;
      } else if (st === 'speaking') {
        const speechMod = Math.abs(Math.sin(time * 12.0) * Math.cos(time * 6.0));
        const pulse = 1 + speechMod * 0.18;
        coreGroup.scale.set(pulse, pulse, pulse);
        cyanLight.color.setHex(0x00e5ff);
        cyanLight.intensity = targetLightLevels.cyan * (1.2 + speechMod * 0.8);
        innerCoreMat.opacity = 0.75 + speechMod * 0.25;
      } else if (st === 'error') {
        cyanLight.color.setHex(0xf59e0b);
        cyanLight.intensity = targetLightLevels.cyan * 1.2;
      } else {
        coreGroup.scale.set(1, 1, 1);
        cyanLight.color.setHex(0x00e5ff);
        innerCoreMat.opacity = 0.85 + Math.sin(time * 2.5) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler with responsive camera distance
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.position.z = w < 420 ? 9.4 : 8.2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      cancelAnimationFrame(animId);

      // Clean up geometries and materials
      allGeometries.forEach((g) => g.dispose());
      shadedMaterials.forEach((m) => m.dispose());
      wireframeMaterials.forEach((m) => m.dispose());
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (!webglSupported) {
    return (
      <div className="relative w-full aspect-square flex items-center justify-center p-8">
        <div className="relative w-72 h-72 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-dashed border-cyan-glow/40 animate-spin" style={{ animationDuration: '30s' }} />
          <div className="absolute inset-8 rounded-full border border-cyan-glow/60 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
          <div className="absolute inset-16 rounded-xl border border-white/40 rotate-45" />
          <div className="relative text-center font-mono text-xs text-cyan-glow">
            <span className="font-bold tracking-widest">[MECHANICAL AI ENTITY]</span>
            <div className="text-[10px] text-zinc-400 mt-1">2D TELEMETRY FALLBACK</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square max-w-[500px] mx-auto flex flex-col items-center justify-center">
      
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating HUD Telemetry & Render Mode Switch */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto px-4 py-2 rounded-full border border-white/10 bg-black/75 backdrop-blur-md text-[10px] font-mono text-zinc-400 shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
        <button
          onClick={onOpenAIPanel}
          className="flex items-center space-x-2 text-zinc-200 hover:text-cyan-glow transition-colors group cursor-pointer"
          title="Open AI Conversational Intelligence Panel"
        >
          <span className={`w-2 h-2 rounded-full ${
            entityState === 'listening' ? 'bg-emerald-400 animate-ping' :
            entityState === 'thinking' ? 'bg-amber-400 animate-pulse' :
            entityState === 'speaking' ? 'bg-cyan-glow animate-bounce' :
            'bg-cyan-glow animate-pulse'
          }`} />
          <span className="tracking-wider group-hover:underline">TALK TO AI // {entityState.toUpperCase()}</span>
        </button>

        {/* Shaded / Wireframe Interactive Switch */}
        <button
          onClick={onToggleWireframe}
          className="px-3.5 py-1 rounded-full border border-cyan-glow/50 bg-cyan-glow/15 text-cyan-glow hover:bg-cyan-glow/25 transition-all font-mono tracking-wider flex items-center space-x-1.5 shadow-[0_0_12px_rgba(0,229,255,0.3)]"
          aria-label="Toggle between Shaded and Wireframe rendering modes"
        >
          <span>RENDER:</span>
          <span className="font-extrabold">{isWireframe ? 'WIREFRAME' : 'SHADED'}</span>
        </button>
      </div>

      {/* Identifiable Mechanical Schematics HUD Callouts */}
      <div className="absolute top-3 left-3 text-[9px] font-mono text-zinc-500 pointer-events-none space-y-0.5">
        <div className="text-cyan-glow/80 font-semibold">// SYNAPSE_CHASSIS</div>
        <div>SYS_COORD: [0.0, +LEV, 0.0]</div>
        <div>GYRO_AXIS: DUAL_ORTHOGONAL</div>
      </div>

      <div className="absolute top-3 right-3 text-[9px] font-mono text-zinc-500 text-right pointer-events-none space-y-0.5">
        <div className="text-cyan-glow/80 font-semibold">// STATUS: ACTIVE</div>
        <div>SPECULAR: CHROME_PLATINUM</div>
        <div>MAGNETIC_PYLONS: 4/4 LOCKED</div>
      </div>

    </div>
  );
}
