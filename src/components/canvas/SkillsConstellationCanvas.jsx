import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { skillCategories, SKILL_STATUS } from '../../data/skillsData';

export default function SkillsConstellationCanvas({ onSelectNode, activeNode }) {
  const mountRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const onSelectNodeRef = useRef(onSelectNode);

  useEffect(() => {
    onSelectNodeRef.current = onSelectNode;
  }, [onSelectNode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 11);

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

    const universeGroup = new THREE.Group();
    scene.add(universeGroup);

    // 2. Build Category Hubs and Technology Nodes
    const allInteractiveObjects = [];
    const linePositions = [];
    const lineColors = [];
    const activeLineObjects = [];

    const defaultLineColor = new THREE.Color(0x00e5ff);
    const dimLineColor = new THREE.Color(0x1e293b);

    const categoryHubGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const techNodeGeo = new THREE.SphereGeometry(0.12, 12, 12);

    skillCategories.forEach((cat, cIdx) => {
      // Hub position
      const hubPos = new THREE.Vector3(...cat.coords);

      // Create Category Hub Mesh
      const hubMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(cat.accentColor || cat.color || 0x00e5ff),
        wireframe: true
      });
      const hubMesh = new THREE.Mesh(categoryHubGeo, hubMat);
      hubMesh.position.copy(hubPos);
      hubMesh.userData = {
        type: 'category',
        data: cat,
        name: cat.title,
        badge: cat.badge,
        category: cat.title,
        status: null
      };

      universeGroup.add(hubMesh);
      allInteractiveObjects.push(hubMesh);

      // Create Child Skills Nodes orbiting around this Hub
      const numSkills = cat.skills.length;
      cat.skills.forEach((skill, sIdx) => {
        // Distribute in a spherical fan around the hub
        const angle = (sIdx / numSkills) * Math.PI * 2;
        const elevation = ((sIdx % 2) - 0.5) * 0.8;
        const radius = 0.95 + (sIdx % 3) * 0.25;

        const skillPos = new THREE.Vector3(
          hubPos.x + Math.cos(angle) * radius,
          hubPos.y + elevation,
          hubPos.z + Math.sin(angle) * radius
        );

        // Color based on status
        let nodeColor = 0x10b981; // Hands-on green
        if (skill.status.id === 'familiar') nodeColor = 0x38bdf8; // Familiar cyan/blue
        if (skill.status.id === 'learning') nodeColor = 0xf59e0b; // Learning amber

        const techMat = new THREE.MeshStandardMaterial({
          color: nodeColor,
          emissive: nodeColor,
          emissiveIntensity: 0.6,
          metalness: 0.8,
          roughness: 0.2
        });

        const techMesh = new THREE.Mesh(techNodeGeo, techMat);
        techMesh.position.copy(skillPos);
        techMesh.userData = {
          type: 'skill',
          data: skill,
          name: skill.name,
          category: cat.title,
          badge: cat.badge,
          status: skill.status,
          parentHubPos: hubPos
        };

        universeGroup.add(techMesh);
        allInteractiveObjects.push(techMesh);

        // Connection line between Hub and Child
        linePositions.push(hubPos.x, hubPos.y, hubPos.z);
        linePositions.push(skillPos.x, skillPos.y, skillPos.z);

        lineColors.push(defaultLineColor.r * 0.4, defaultLineColor.g * 0.4, defaultLineColor.b * 0.4);
        lineColors.push(defaultLineColor.r * 0.7, defaultLineColor.g * 0.7, defaultLineColor.b * 0.7);
      });
    });

    // Constellation lines between nearby categories
    for (let i = 0; i < skillCategories.length; i++) {
      for (let j = i + 1; j < skillCategories.length; j++) {
        const p1 = new THREE.Vector3(...skillCategories[i].coords);
        const p2 = new THREE.Vector3(...skillCategories[j].coords);
        if (p1.distanceTo(p2) < 4.2) {
          linePositions.push(p1.x, p1.y, p1.z);
          linePositions.push(p2.x, p2.y, p2.z);
          lineColors.push(0.05, 0.2, 0.35);
          lineColors.push(0.05, 0.2, 0.35);
        }
      }
    }

    // Add Lines to Scene
    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    linesGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

    const linesMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.65
    });

    const linesMesh = new THREE.LineSegments(linesGeo, linesMat);
    universeGroup.add(linesMesh);

    // 3. Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00e5ff, 2.5, 20);
    cyanLight.position.set(5, 5, 5);
    scene.add(cyanLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 2, 20);
    blueLight.position.set(-5, -5, 5);
    scene.add(blueLight);

    // 4. Raycaster for Hover & Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let currentlyHighlighted = null;

    // 5. Drag-to-Rotate & Zoom Controls
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let rotationVelocity = { x: 0, y: 0.002 }; // Gentle idle rotation
    let targetRotation = { x: 0.1, y: 0 };
    let zoomLevel = 11;
    let targetZoom = 11;

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

    const onWheel = (e) => {
      e.preventDefault();
      targetZoom += e.deltaY * 0.008;
      targetZoom = Math.max(6, Math.min(16, targetZoom));
    };

    const onClick = () => {
      if (currentlyHighlighted) {
        if (onSelectNodeRef.current) {
          onSelectNodeRef.current(currentlyHighlighted.userData);
        }
      }
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('click', onClick);

    // IntersectionObserver to pause when off-screen
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 6. Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const time = clock.getElapsedTime();

      // Idle rotation if not dragging
      if (!isDragging) {
        targetRotation.y += 0.0015;
      }

      // Damped rotation lerp
      universeGroup.rotation.y += (targetRotation.y - universeGroup.rotation.y) * 0.08;
      universeGroup.rotation.x += (targetRotation.x - universeGroup.rotation.x) * 0.08;

      // Smooth zoom lerp
      zoomLevel += (targetZoom - zoomLevel) * 0.08;
      camera.position.z = zoomLevel;

      // Raycast test
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(allInteractiveObjects);

      if (intersects.length > 0) {
        const topHit = intersects[0].object;
        if (currentlyHighlighted !== topHit) {
          // Reset previous
          if (currentlyHighlighted) {
            currentlyHighlighted.scale.set(1, 1, 1);
          }
          currentlyHighlighted = topHit;
          currentlyHighlighted.scale.set(1.4, 1.4, 1.4);
          setHoveredNode(topHit.userData);
        }
      } else {
        if (currentlyHighlighted) {
          currentlyHighlighted.scale.set(1, 1, 1);
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
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      cancelAnimationFrame(animId);

      categoryHubGeo.dispose();
      techNodeGeo.dispose();
      linesGeo.dispose();
      linesMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[520px] rounded-3xl border border-white/10 bg-black/90 backdrop-blur-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none group">
      
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Floating HUD Telemetry Badge & Instruction */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none space-y-1">
        <div className="flex items-center space-x-2 text-[10px] font-mono text-cyan-glow">
          <span className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
          <span>3D CONSTELLATION GRAPH // 15 DOMAINS</span>
        </div>
        <div className="text-[9px] font-mono text-zinc-500">
          DRAG TO ROTATE 3D SPACE • SCROLL WHEEL TO ZOOM • HOVER / CLICK NODES
        </div>
      </div>

      {/* Hover Node Tooltip Readout */}
      {hoveredNode && (
        <div className="absolute top-4 right-4 z-10 pointer-events-none p-3 rounded-xl border border-cyan-glow/40 bg-black/85 backdrop-blur-md shadow-2xl min-w-[200px] animate-in fade-in zoom-in-95 duration-150">
          <div className="text-[9px] font-mono text-cyan-glow uppercase tracking-wider mb-0.5">
            // {hoveredNode.type.toUpperCase()}: {hoveredNode.badge || 'VERIFIED'}
          </div>
          <div className="font-display font-bold text-base text-white">
            {hoveredNode.name}
          </div>
          <div className="text-[11px] font-mono text-zinc-400 mt-1">
            DOMAIN: {hoveredNode.category}
          </div>
          {hoveredNode.status && (
            <div className="mt-2 inline-flex items-center space-x-1.5 px-2 py-0.5 rounded text-[10px] font-mono border border-cyan-glow/30 bg-cyan-glow/10 text-cyan-glow">
              <span>{hoveredNode.status.symbol}</span>
              <span>{hoveredNode.status.label}</span>
            </div>
          )}
        </div>
      )}

      {/* Bottom Status Legend */}
      <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-zinc-400 px-4 py-2 rounded-2xl border border-white/5 bg-black/60 backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Hands-on Experience</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>Familiar with</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Currently Learning</span>
          </span>
        </div>
        <div className="text-zinc-500">
          CLICK NODE FOR TELEMETRY
        </div>
      </div>

    </div>
  );
}
