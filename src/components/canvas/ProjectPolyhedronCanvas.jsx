import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ProjectPolyhedronCanvas({ projectType = 'icosahedron', accentColor = '#00E5FF' }) {
  const mountRef = useRef(null);
  const currentTypeRef = useRef(projectType);
  const sceneRef = useRef(null);
  const meshGroupRef = useRef(null);
  const transitionRef = useRef({ progress: 1, targetType: projectType });

  useEffect(() => {
    if (projectType !== currentTypeRef.current) {
      transitionRef.current = { progress: 0, targetType: projectType };
      currentTypeRef.current = projectType;
    }
  }, [projectType]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    let renderer;
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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    meshGroupRef.current = mainGroup;

    // Helper to create crystal geometries
    const createGeometry = (type) => {
      switch (type) {
        case 'octahedron':
          return new THREE.OctahedronGeometry(1.65, 0);
        case 'dodecahedron':
          return new THREE.DodecahedronGeometry(1.5, 0);
        case 'icosahedron':
        default:
          return new THREE.IcosahedronGeometry(1.6, 0);
      }
    };

    // Faceted Crystal Material (Flat Shading produces crisp facet highlights)
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x091424,
      roughness: 0.1,
      metalness: 0.92,
      flatShading: true,
      emissive: 0x00243b,
      emissiveIntensity: 0.4
    });

    // Outer Wireframe Cage Material
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentColor),
      wireframe: true,
      transparent: true,
      opacity: 0.55
    });

    let activeGeo = createGeometry(projectType);
    let crystalMesh = new THREE.Mesh(activeGeo, crystalMat);
    let wireframeMesh = new THREE.Mesh(activeGeo, wireframeMat);
    wireframeMesh.scale.setScalar(1.02);

    mainGroup.add(crystalMesh);
    mainGroup.add(wireframeMesh);

    // Orbiting Cyber Rings
    const ringGeo = new THREE.TorusGeometry(2.35, 0.015, 16, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentColor),
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    mainGroup.add(ringMesh);

    // Surrounding ambient crystal dust particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 8;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color(accentColor),
      size: 0.04,
      transparent: true,
      opacity: 0.65
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00e5ff, 4.5, 14);
    cyanLight.position.set(4, 4, 4);
    scene.add(cyanLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 3.5, 14);
    blueLight.position.set(-4, -3, 3);
    scene.add(blueLight);

    // Pointer Interactivity
    let targetRotX = 0;
    let targetRotY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = x * 0.6;
      targetRotX = y * 0.5;
    };

    window.addEventListener('pointermove', onPointerMove);

    // IntersectionObserver to pause rendering when off-screen
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

      // Check for geometry transition
      if (transitionRef.current.progress < 1) {
        transitionRef.current.progress += delta * 3.5;
        if (transitionRef.current.progress >= 1) {
          transitionRef.current.progress = 1;
          // Swap geometry
          activeGeo.dispose();
          activeGeo = createGeometry(transitionRef.current.targetType);
          crystalMesh.geometry = activeGeo;
          wireframeMesh.geometry = activeGeo;
        } else {
          // Morph pulse scale
          const pulse = Math.sin(transitionRef.current.progress * Math.PI);
          crystalMesh.scale.setScalar(1 - pulse * 0.35);
          wireframeMesh.scale.setScalar(1.02 - pulse * 0.35);
        }
      } else {
        crystalMesh.scale.setScalar(1);
        wireframeMesh.scale.setScalar(1.02);
      }

      // Smooth mouse tilt lerp
      mouseX += (targetRotX - mouseX) * 0.05;
      mouseY += (targetRotY - mouseY) * 0.05;

      mainGroup.rotation.y = time * 0.45 + mouseY;
      mainGroup.rotation.x = time * 0.2 + mouseX;

      ringMesh.rotation.z = time * 0.3;
      ringMesh.rotation.x = Math.PI / 3 + Math.sin(time * 0.5) * 0.2;

      particles.rotation.y = time * 0.03;

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
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      cancelAnimationFrame(animId);

      activeGeo.dispose();
      crystalMat.dispose();
      wireframeMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[420px] mx-auto flex items-center justify-center">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Crystal Telemetry Indicator */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-zinc-400 px-3.5 py-1.5 rounded-full border border-white/10 bg-black/60 backdrop-blur-md pointer-events-none">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-pulse" />
          <span className="text-zinc-200 uppercase">3D FACETED CRYSTAL // {projectType}</span>
        </div>
        <span className="text-cyan-glow/80">SYNCHRONIZED</span>
      </div>
    </div>
  );
}
