import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ContactTesseractCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.5);

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
    container.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 16 4D Vertices of a Tesseract: (±1, ±1, ±1, ±1)
    const vertices4D = [];
    for (let x of [-1, 1]) {
      for (let y of [-1, 1]) {
        for (let z of [-1, 1]) {
          for (let w of [-1, 1]) {
            vertices4D.push([x, y, z, w]);
          }
        }
      }
    }

    // 32 Edges: Any pair of 4D vertices differing in exactly one coordinate
    const edges = [];
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        let diff = 0;
        for (let k = 0; k < 4; k++) {
          if (vertices4D[i][k] !== vertices4D[j][k]) diff++;
        }
        if (diff === 1) {
          edges.push([i, j]);
        }
      }
    }

    // 3D Projected Line Segments
    const linePositions = new Float32Array(edges.length * 2 * 3);
    const lineColors = new Float32Array(edges.length * 2 * 3);

    const cyanColor = new THREE.Color(0x00e5ff);
    const blueColor = new THREE.Color(0x38bdf8);

    for (let i = 0; i < edges.length * 2; i++) {
      lineColors[i * 3] = cyanColor.r;
      lineColors[i * 3 + 1] = cyanColor.g;
      lineColors[i * 3 + 2] = cyanColor.b;
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
    mainGroup.add(linesMesh);

    // Vertex Glow Particles (16 points)
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(16 * 3);
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x00e5ff,
      size: 0.12,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // Ambient dust particles around tesseract
    const dustCount = 150;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 8;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.035,
      transparent: true,
      opacity: 0.6
    });
    const dustMesh = new THREE.Points(dustGeo, dustMat);
    scene.add(dustMesh);

    // Mouse interactivity
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.5;
      targetY = y * 0.5;
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
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const time = clock.getElapsedTime();

      // 4D Rotation Angles (X-W and Y-Z plane rotations)
      const thetaXW = time * 0.65;
      const thetaYZ = time * 0.45;

      const cosXW = Math.cos(thetaXW);
      const sinXW = Math.sin(thetaXW);
      const cosYZ = Math.cos(thetaYZ);
      const sinYZ = Math.sin(thetaYZ);

      // Project 4D vertices into 3D
      const distance4D = 2.4;
      const projected3D = [];

      for (let i = 0; i < 16; i++) {
        let [x, y, z, w] = vertices4D[i];

        // Rotate in X-W plane
        let x1 = x * cosXW - w * sinXW;
        let w1 = x * sinXW + w * cosXW;

        // Rotate in Y-Z plane
        let y1 = y * cosYZ - z * sinYZ;
        let z1 = y * sinYZ + z * cosYZ;

        // Perspective 4D to 3D projection
        const wFactor = 1 / (distance4D - w1 * 0.55);
        const pX = x1 * wFactor * 1.8;
        const pY = y1 * wFactor * 1.8;
        const pZ = z1 * wFactor * 1.8;

        projected3D.push([pX, pY, pZ]);

        // Update vertex particle
        particlePositions[i * 3] = pX;
        particlePositions[i * 3 + 1] = pY;
        particlePositions[i * 3 + 2] = pZ;
      }

      particleGeo.attributes.position.needsUpdate = true;

      // Update lines positions
      let ptr = 0;
      for (let i = 0; i < edges.length; i++) {
        const [idx1, idx2] = edges[i];
        const p1 = projected3D[idx1];
        const p2 = projected3D[idx2];

        linePositions[ptr++] = p1[0];
        linePositions[ptr++] = p1[1];
        linePositions[ptr++] = p1[2];

        linePositions[ptr++] = p2[0];
        linePositions[ptr++] = p2[1];
        linePositions[ptr++] = p2[2];
      }

      lineGeo.attributes.position.needsUpdate = true;

      // Mouse Lerp
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      mainGroup.rotation.y = mouseX;
      mainGroup.rotation.x = mouseY;

      dustMesh.rotation.y = time * 0.04;

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

      lineGeo.dispose();
      lineMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[340px] mx-auto flex items-center justify-center">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
        <span className="text-[9px] font-mono text-cyan-glow/80 tracking-widest uppercase">
          // 4D HYPERCUBE TESSERACT PROJECTION
        </span>
      </div>
    </div>
  );
}
