import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, Scan, RefreshCw, Sparkles } from 'lucide-react';

export default function AboutHologramCanvas({ imageSrc = '/profile.jpg' }) {
  const mountRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [scanlineActive, setScanlineActive] = useState(true);
  const [depthMode, setDepthMode] = useState(1); // 1 = High Depth, 0.5 = Subtle Depth
  const [particleCountLabel, setParticleCountLabel] = useState('12,500');

  const scanlineRef = useRef(scanlineActive);
  const depthModeRef = useRef(depthMode);

  useEffect(() => {
    scanlineRef.current = scanlineActive;
  }, [scanlineActive]);

  useEffect(() => {
    depthModeRef.current = depthMode;
  }, [depthMode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer, scene, camera, pointsMesh;
    let animId;
    let isVisible = true;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 500;

    // 1. Scene & Camera Setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.8);

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for 3D rotation
    const faceGroup = new THREE.Group();
    scene.add(faceGroup);

    // 2. Load and Sample Image
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageSrc;

    img.onload = () => {
      const sampleWidth = 100;
      const sampleHeight = Math.round((img.height / img.width) * sampleWidth);

      const offscreen = document.createElement('canvas');
      offscreen.width = sampleWidth;
      offscreen.height = sampleHeight;
      const ctx = offscreen.getContext('2d');
      ctx.drawImage(img, 0, 0, sampleWidth, sampleHeight);

      const imgData = ctx.getImageData(0, 0, sampleWidth, sampleHeight).data;

      const numPixels = sampleWidth * sampleHeight;
      const positions = new Float32Array(numPixels * 3);
      const originalPositions = new Float32Array(numPixels * 3);
      const colors = new Float32Array(numPixels * 3);
      const originalColors = new Float32Array(numPixels * 3);
      const luminances = new Float32Array(numPixels);

      let pIdx = 0;
      const aspect = sampleWidth / sampleHeight;
      const scaleX = 2.4;
      const scaleY = scaleX / aspect;

      for (let y = 0; y < sampleHeight; y++) {
        for (let x = 0; x < sampleWidth; x++) {
          const pixelIndex = (y * sampleWidth + x) * 4;
          const r = imgData[pixelIndex];
          const g = imgData[pixelIndex + 1];
          const b = imgData[pixelIndex + 2];
          const a = imgData[pixelIndex + 3];

          // Compute perceived luminance for facial 3D depth
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0;
          luminances[pIdx] = lum;

          // Normalized 3D position centered on face
          const posX = ((x / sampleWidth) - 0.5) * scaleX;
          const posY = -((y / sampleHeight) - 0.5) * scaleY;
          // Z depth based on luminance: highlights push forward!
          const posZ = (lum - 0.5) * 0.9;

          positions[pIdx * 3] = posX;
          positions[pIdx * 3 + 1] = posY;
          positions[pIdx * 3 + 2] = posZ;

          originalPositions[pIdx * 3] = posX;
          originalPositions[pIdx * 3 + 1] = posY;
          originalPositions[pIdx * 3 + 2] = posZ;

          // Blend natural facial color with subtle holographic electric cyan
          const cyanTint = 0.22;
          const finalR = (r / 255) * (1 - cyanTint) + 0.0 * cyanTint;
          const finalG = (g / 255) * (1 - cyanTint) + 0.9 * cyanTint;
          const finalB = (b / 255) * (1 - cyanTint) + 1.0 * cyanTint;

          colors[pIdx * 3] = finalR;
          colors[pIdx * 3 + 1] = finalG;
          colors[pIdx * 3 + 2] = finalB;

          originalColors[pIdx * 3] = finalR;
          originalColors[pIdx * 3 + 1] = finalG;
          originalColors[pIdx * 3 + 2] = finalB;

          pIdx++;
        }
      }

      setParticleCountLabel(pIdx.toLocaleString());

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      // Custom Holographic Point Shader or PointsMaterial
      const material = new THREE.PointsMaterial({
        size: 0.038,
        vertexColors: true,
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending
      });

      pointsMesh = new THREE.Points(geometry, material);
      faceGroup.add(pointsMesh);

      // Add a subtle cybernetic framing wireframe box behind the face
      const frameGeo = new THREE.BoxGeometry(scaleX * 1.08, scaleY * 1.08, 0.8);
      const frameMat = new THREE.MeshBasicMaterial({
        color: 0x00e5ff,
        wireframe: true,
        transparent: true,
        opacity: 0.15
      });
      const frameMesh = new THREE.Mesh(frameGeo, frameMat);
      frameMesh.position.z = -0.4;
      faceGroup.add(frameMesh);

      setLoaded(true);

      // 3. Animation and Scanline Loop
      let clock = new THREE.Clock();
      let scanY = -scaleY / 2;
      let scanSpeed = 1.3;

      let mouseTargetX = 0;
      let mouseTargetY = 0;
      let currentMouseX = 0;
      let currentMouseY = 0;
      let isHovered = false;

      const handlePointerMove = (e) => {
        const rect = container.getBoundingClientRect();
        const px = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const py = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        mouseTargetX = px * 0.45;
        mouseTargetY = py * 0.35;
      };

      const handlePointerEnter = () => { isHovered = true; };
      const handlePointerLeave = () => {
        isHovered = false;
        mouseTargetX = 0;
        mouseTargetY = 0;
      };

      container.addEventListener('pointermove', handlePointerMove);
      container.addEventListener('pointerenter', handlePointerEnter);
      container.addEventListener('pointerleave', handlePointerLeave);

      const render = () => {
        animId = requestAnimationFrame(render);
        if (!isVisible) return;

        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        // Smooth rotation following mouse
        currentMouseX += (mouseTargetX - currentMouseX) * 0.06;
        currentMouseY += (mouseTargetY - currentMouseY) * 0.06;

        faceGroup.rotation.y = currentMouseX + Math.sin(time * 0.4) * 0.04;
        faceGroup.rotation.x = currentMouseY + Math.cos(time * 0.3) * 0.03;

        // Scanline sweep effect
        if (scanlineRef.current) {
          scanY += delta * scanSpeed;
          const halfH = scaleY / 2;
          if (scanY > halfH) {
            scanY = -halfH;
          }
        }

        const posAttr = pointsMesh.geometry.attributes.position;
        const colAttr = pointsMesh.geometry.attributes.color;
        const posArray = posAttr.array;
        const colArray = colAttr.array;
        const depthMul = depthModeRef.current;

        for (let i = 0; i < pIdx; i++) {
          const ox = originalPositions[i * 3];
          const oy = originalPositions[i * 3 + 1];
          const oz = originalPositions[i * 3 + 2] * depthMul;

          const lum = luminances[i];
          const baseR = originalColors[i * 3];
          const baseG = originalColors[i * 3 + 1];
          const baseB = originalColors[i * 3 + 2];

          // Scanline wave detection
          let scanIntensity = 0;
          if (scanlineRef.current) {
            const distFromScan = Math.abs(oy - scanY);
            if (distFromScan < 0.22) {
              scanIntensity = Math.max(0, 1 - distFromScan / 0.22);
            }
          }

          // Subtle holographic breathing & transformation
          const wave = Math.sin(time * 2.0 + oy * 4.0) * 0.015;
          const disperse = isHovered ? Math.sin(time * 3 + ox * 5) * 0.025 : 0;

          posArray[i * 3] = ox + disperse;
          posArray[i * 3 + 1] = oy;
          posArray[i * 3 + 2] = oz + wave + scanIntensity * 0.15;

          // Color modulation near scanline: intense electric cyan burst
          colArray[i * 3] = THREE.MathUtils.lerp(baseR, 0.0, scanIntensity * 0.7);
          colArray[i * 3 + 1] = THREE.MathUtils.lerp(baseG, 0.9, scanIntensity * 0.7);
          colArray[i * 3 + 2] = THREE.MathUtils.lerp(baseB, 1.0, scanIntensity * 0.8);
        }

        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;

        renderer.render(scene, camera);
      };

      render();

      // Clean up pointer listeners when unmounted
      container.cleanupPointer = () => {
        container.removeEventListener('pointermove', handlePointerMove);
        container.removeEventListener('pointerenter', handlePointerEnter);
        container.removeEventListener('pointerleave', handlePointerLeave);
      };
    };

    // IntersectionObserver to pause rendering when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

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
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      cancelAnimationFrame(animId);
      if (container.cleanupPointer) container.cleanupPointer();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [imageSrc]);

  return (
    <div className="relative w-full aspect-[4/5] max-w-[440px] mx-auto rounded-3xl border border-white/10 bg-black/80 backdrop-blur-xl overflow-hidden p-3 shadow-2xl flex flex-col justify-between group">
      
      {/* Top HUD Telemetry Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 text-[10px] font-mono text-zinc-400 z-10 bg-black/40 backdrop-blur-md rounded-t-2xl">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
          <span className="text-zinc-200">HOLOGRAPHIC 3D PORTRAIT</span>
        </div>
        <div className="flex items-center space-x-3 text-[9px] text-zinc-500">
          <span>PARTICLES: {particleCountLabel}</span>
          <span className="text-cyan-glow/80">IDENTITY // VERIFIED</span>
        </div>
      </div>

      {/* 3D WebGL Canvas Area */}
      <div className="relative flex-1 w-full min-h-[360px] flex items-center justify-center cursor-grab active:cursor-grabbing">
        <div ref={mountRef} className="w-full h-full" />

        {/* Scanline Overlay Glow */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-cyan-glow/5 via-transparent to-transparent opacity-40" />

        {/* Framing Corner Markers */}
        <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-cyan-glow/60 pointer-events-none" />
        <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-cyan-glow/60 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-cyan-glow/60 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-cyan-glow/60 pointer-events-none" />
      </div>

      {/* Interactive Controls Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-white/10 text-[10px] font-mono text-zinc-400 z-10 bg-black/50 backdrop-blur-md rounded-b-2xl">
        {/* Scanline Toggle */}
        <button
          onClick={() => setScanlineActive(!scanlineActive)}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border transition-all ${
            scanlineActive
              ? 'border-cyan-glow/50 bg-cyan-glow/15 text-cyan-glow'
              : 'border-white/10 bg-white/5 text-zinc-500 hover:text-zinc-300'
          }`}
          title="Toggle Holographic Scanline Effect"
        >
          <Scan className="w-3 h-3" />
          <span>SCANLINE: {scanlineActive ? 'ON' : 'OFF'}</span>
        </button>

        {/* Depth Mode Toggle */}
        <button
          onClick={() => setDepthMode(depthMode === 1 ? 0.45 : 1)}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-zinc-300 hover:border-cyan-glow/40 hover:text-cyan-glow transition-all"
          title="Toggle 3D Relief Facial Depth"
        >
          <Sparkles className="w-3 h-3 text-cyan-glow" />
          <span>DEPTH: {depthMode === 1 ? '3D RELIEF' : 'SUBTLE'}</span>
        </button>
      </div>

    </div>
  );
}
