import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Cpu, ShieldCheck, Sparkles, Activity, RefreshCw } from 'lucide-react';

/**
 * THE DIGITAL IDENTITY CORE
 *
 * Premium mechanical energy reactor centerpiece for AboutSection.
 * Features:
 * - Glowing cyan central sphere with NK initials on dynamic emissive texture
 * - Concentric titanium reactor rings with solenoid magnetic containment brackets
 * - Counter-rotating energy flow rings and 220 orbital energy particles
 * - Responsive mouse parallax & perspective tilt
 * - Automatic pause via IntersectionObserver when offscreen
 * - Reduced-motion & mobile fallback support
 */
export default function AboutHologramCanvas() {
  const mountRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [reactorState, setReactorState] = useState('SYNCHRONIZED');
  const [coreEnergy, setCoreEnergy] = useState(99.4);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 480;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      setWebglSupported(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.domElement.style.touchAction = 'none';
    container.appendChild(renderer.domElement);

    // Master Group for mouse parallax
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Track resources for clean disposal
    const geometries = [];
    const materials = [];
    const textures = [];

    const regGeo = (g) => { geometries.push(g); return g; };
    const regMat = (m) => { materials.push(m); return m; };

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x0a192f, 1.2);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0x00E5FF, 3.5, 10);
    coreLight.position.set(0, 0, 0);
    masterGroup.add(coreLight);

    const rimLight = new THREE.DirectionalLight(0x38BDF8, 2.0);
    rimLight.position.set(5, 5, 4);
    scene.add(rimLight);

    const backLight = new THREE.DirectionalLight(0x005577, 1.5);
    backLight.position.set(-5, -4, -4);
    scene.add(backLight);

    // 3. Dynamic Texture for Central Core with "NK" Monogram
    const coreCanvas = document.createElement('canvas');
    coreCanvas.width = 512;
    coreCanvas.height = 512;
    const ctx = coreCanvas.getContext('2d');

    // Draw futuristic NK core insignia texture
    ctx.fillStyle = '#020610';
    ctx.fillRect(0, 0, 512, 512);

    // Concentric glowing rings on texture
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.25)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(256, 256, 200, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(256, 256, 140, 0, Math.PI * 2);
    ctx.stroke();

    // Data grid marks
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.35)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(256 + Math.cos(angle) * 160, 256 + Math.sin(angle) * 160);
      ctx.lineTo(256 + Math.cos(angle) * 220, 256 + Math.sin(angle) * 220);
      ctx.stroke();
    }

    // Stylized "NK" Monogram
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = '#00E5FF';
    ctx.shadowBlur = 25;
    ctx.font = '900 130px "JetBrains Mono", "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('NK', 256, 256);

    // Core identification subtext
    ctx.shadowBlur = 8;
    ctx.font = '600 22px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00E5FF';
    ctx.fillText('NIRANJAN.AI // REACTOR', 256, 350);

    const coreTexture = new THREE.CanvasTexture(coreCanvas);
    textures.push(coreTexture);

    // 4. Central Glowing Core Sphere
    const coreGeo = regGeo(new THREE.SphereGeometry(1.05, 36, 36));
    const coreMat = regMat(new THREE.MeshStandardMaterial({
      map: coreTexture,
      color: 0x0c1e2e,
      emissive: 0x00E5FF,
      emissiveIntensity: 0.55,
      metalness: 0.85,
      roughness: 0.18,
    }));
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    masterGroup.add(coreMesh);

    // Inner Glowing Plasma Shell
    const innerPlasmaGeo = regGeo(new THREE.SphereGeometry(0.92, 24, 24));
    const innerPlasmaMat = regMat(new THREE.MeshBasicMaterial({
      color: 0x00E5FF,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    }));
    const innerPlasmaMesh = new THREE.Mesh(innerPlasmaGeo, innerPlasmaMat);
    masterGroup.add(innerPlasmaMesh);

    // Outer Energy Shield Bubble
    const shieldGeo = regGeo(new THREE.SphereGeometry(1.22, 32, 32));
    const shieldMat = regMat(new THREE.MeshPhysicalMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.12,
      roughness: 0.05,
      transmission: 0.9,
      thickness: 0.5,
    }));
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    masterGroup.add(shieldMesh);

    // 5. Concentric Titanium Mechanical Rings
    const ringGroup = new THREE.Group();
    masterGroup.add(ringGroup);

    // Titanium Material
    const titaniumMat = regMat(new THREE.MeshStandardMaterial({
      color: 0x1a2634,
      metalness: 0.94,
      roughness: 0.22,
      emissive: 0x001a2c,
      emissiveIntensity: 0.2,
    }));

    // Ring 1 (Inner Gimbal)
    const ring1Geo = regGeo(new THREE.TorusGeometry(1.6, 0.045, 16, 80));
    const ring1 = new THREE.Mesh(ring1Geo, titaniumMat);
    ring1.rotation.x = Math.PI * 0.25;
    ring1.rotation.y = Math.PI * 0.15;
    ringGroup.add(ring1);

    // Ring 2 (Middle Primary Reactor Casing with Solenoid Blocks)
    const ring2Geo = regGeo(new THREE.TorusGeometry(2.1, 0.065, 16, 90));
    const ring2 = new THREE.Mesh(ring2Geo, titaniumMat);
    ring2.rotation.x = -Math.PI * 0.3;
    ring2.rotation.z = Math.PI * 0.2;
    ringGroup.add(ring2);

    // Add 8 Solenoid Magnetic Brackets onto Ring 2
    const solenoidGeo = regGeo(new THREE.BoxGeometry(0.12, 0.24, 0.16));
    const solenoidMat = regMat(new THREE.MeshStandardMaterial({
      color: 0x0f1c28,
      metalness: 0.96,
      roughness: 0.15,
      emissive: 0x00E5FF,
      emissiveIntensity: 0.3,
    }));

    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const bracket = new THREE.Mesh(solenoidGeo, solenoidMat);
      bracket.position.set(Math.cos(angle) * 2.1, Math.sin(angle) * 2.1, 0);
      bracket.rotation.z = angle;
      ring2.add(bracket);
    }

    // Ring 3 (Outer Precision Stabilizer Ring)
    const ring3Geo = regGeo(new THREE.TorusGeometry(2.65, 0.04, 16, 100));
    const ring3 = new THREE.Mesh(ring3Geo, titaniumMat);
    ring3.rotation.y = Math.PI * 0.4;
    ring3.rotation.z = -Math.PI * 0.15;
    ringGroup.add(ring3);

    // Add 4 Cardinal Telemetry Emitters onto Ring 3
    const noduleGeo = regGeo(new THREE.CylinderGeometry(0.045, 0.045, 0.18, 12));
    const noduleMat = regMat(new THREE.MeshBasicMaterial({ color: 0x00E5FF }));

    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI * 2) / 4;
      const nodule = new THREE.Mesh(noduleGeo, noduleMat);
      nodule.position.set(Math.cos(angle) * 2.65, Math.sin(angle) * 2.65, 0);
      nodule.rotation.z = angle;
      ring3.add(nodule);
    }

    // 6. Cyan Energy Flow Streams
    const flowRingsGroup = new THREE.Group();
    masterGroup.add(flowRingsGroup);

    const energyMat1 = regMat(new THREE.LineDashedMaterial({
      color: 0x00E5FF,
      dashSize: 0.3,
      gapSize: 0.15,
      linewidth: 2,
    }));
    const energyCurveGeo1 = regGeo(new THREE.BufferGeometry());
    const curvePoints1 = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      curvePoints1.push(new THREE.Vector3(Math.cos(a) * 1.85, Math.sin(a) * 1.85, Math.sin(a * 2) * 0.25));
    }
    energyCurveGeo1.setFromPoints(curvePoints1);
    const energyLoop1 = new THREE.Line(energyCurveGeo1, energyMat1);
    energyLoop1.computeLineDistances();
    flowRingsGroup.add(energyLoop1);

    // 7. Ambient Energy Particles Field (220 particles)
    const particleCount = 220;
    const particleGeo = regGeo(new THREE.BufferGeometry());
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particleRadii = new Float32Array(particleCount);
    const particleAngles = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const r = 1.3 + Math.random() * 1.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.8;

      particlePositions[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      particlePositions[i * 3 + 1] = r * Math.sin(theta) * Math.cos(phi);
      particlePositions[i * 3 + 2] = r * Math.sin(phi);

      particleSpeeds[i] = (0.2 + Math.random() * 0.5) * (Math.random() > 0.5 ? 1 : -1);
      particleRadii[i] = r;
      particleAngles[i] = theta;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = regMat(new THREE.PointsMaterial({
      color: 0x00E5FF,
      size: 0.05,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    }));
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    masterGroup.add(particleSystem);

    // 8. Mouse Parallax & Interaction Tracking
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = x * 0.45;
      targetRotX = -y * 0.35;
    };

    const handleMouseLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // 9. IntersectionObserver to Pause Offscreen
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // 10. Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth mouse lerping
      currentRotX += (targetRotX - currentRotX) * 0.06;
      currentRotY += (targetRotY - currentRotY) * 0.06;

      masterGroup.rotation.x = currentRotX;
      masterGroup.rotation.y = currentRotY;

      if (!prefersReducedMotion) {
        // Continuous rotation of rings and core
        coreMesh.rotation.y += delta * 0.35;
        innerPlasmaMesh.rotation.y -= delta * 0.6;
        innerPlasmaMesh.rotation.x += delta * 0.25;

        ring1.rotation.z += delta * 0.45;
        ring1.rotation.y += delta * 0.2;

        ring2.rotation.z -= delta * 0.3;
        ring2.rotation.x += delta * 0.18;

        ring3.rotation.z += delta * 0.2;
        ring3.rotation.y -= delta * 0.25;

        flowRingsGroup.rotation.z += delta * 0.65;
        flowRingsGroup.rotation.x = Math.sin(elapsed * 0.8) * 0.2;

        // Dynamic core energy pulse
        const pulse = Math.sin(elapsed * 2.2) * 0.15 + 0.85;
        coreLight.intensity = 3.0 * pulse;
        coreMat.emissiveIntensity = 0.45 + pulse * 0.25;

        // Particle circulation
        const positions = particleGeo.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          particleAngles[i] += particleSpeeds[i] * delta * 0.6;
          const a = particleAngles[i];
          const r = particleRadii[i];
          positions[i * 3] = r * Math.cos(a);
          positions[i * 3 + 1] = r * Math.sin(a);
        }
        particleGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Periodic telemetry update
    const telemetryInterval = setInterval(() => {
      setCoreEnergy((prev) => +(99.0 + Math.random() * 0.8).toFixed(1));
    }, 2800);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      clearInterval(telemetryInterval);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);

      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div className="relative w-full max-w-[420px] aspect-[4/5] mx-auto flex flex-col items-center justify-center">
      {/* 3D Canvas Mount Container */}
      <div
        ref={mountRef}
        className="w-full h-full relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-black via-zinc-950 to-black shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,229,255,0.08)] cursor-grab active:cursor-grabbing"
        role="region"
        aria-label="The Digital Identity Core - 3D Mechanical Energy Reactor Centerpiece"
      >
        {/* Futuristic Obsidian Ambient Gradients */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(0,229,255,0.06)_0%,transparent_70%)]" />

        {/* Top HUD Telemetry Banner */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none text-[10px] font-mono">
          <div className="flex items-center space-x-2 bg-black/70 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-pulse" />
            <span className="text-cyan-glow tracking-widest font-semibold uppercase">IDENTITY CORE</span>
          </div>
          <div className="bg-black/70 px-2.5 py-1 rounded-full border border-white/10 text-zinc-400 backdrop-blur-md">
            <span>SYNC: {coreEnergy}%</span>
          </div>
        </div>

        {/* Corner Viewfinder Tech Brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-glow/50 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-glow/50 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-glow/50 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-glow/50 pointer-events-none" />

        {/* Bottom Telemetry Identifiers */}
        <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
          <div className="p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-white font-bold tracking-wider">NIRANJAN KUMAR</span>
              <span className="text-cyan-glow text-[10px]">// ACTIVE</span>
            </div>
            <p className="text-[10px] font-mono text-zinc-400 leading-tight">
              Software Engineer · AI & Mathematical Systems
            </p>
            <div className="flex items-center justify-between pt-1 text-[9px] font-mono text-zinc-500 border-t border-white/5">
              <span>REACTOR // 84.09 MHz</span>
              <span>BIT MESRA · 2027</span>
            </div>
          </div>
        </div>

        {/* WebGL Fallback if not supported */}
        {!webglSupported && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-black">
            <div className="w-16 h-16 rounded-full border border-cyan-glow/40 flex items-center justify-center text-cyan-glow font-display font-extrabold text-2xl">
              NK
            </div>
            <h4 className="text-sm font-mono text-white font-bold">DIGITAL IDENTITY CORE</h4>
            <p className="text-xs text-zinc-400">Niranjan Kumar — Software Engineer with AI</p>
          </div>
        )}
      </div>
    </div>
  );
}
