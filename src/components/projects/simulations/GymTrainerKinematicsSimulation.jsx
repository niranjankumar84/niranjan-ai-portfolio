import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Activity, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function GymTrainerKinematicsSimulation() {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [exerciseMode, setExerciseMode] = useState('SQUAT'); // 'SQUAT' | 'CURL'
  const [repCount, setRepCount] = useState(0);
  const [currentAngle, setCurrentAngle] = useState(90);
  const [formStatus, setFormStatus] = useState('FORM_ALIGNED');

  const animFrameRef = useRef(null);
  const stateRef = useRef({
    time: 0,
    isPlaying: true,
    repCount: 0,
    wasDown: false,
    exerciseMode: 'SQUAT'
  });

  useEffect(() => {
    stateRef.current.isPlaying = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    stateRef.current.exerciseMode = exerciseMode;
    stateRef.current.repCount = 0;
    setRepCount(0);
  }, [exerciseMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.clientWidth || 500);
    let height = (canvas.height = 340);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 340;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);
      if (stateRef.current.isPlaying) {
        stateRef.current.time += 0.025;
      }

      const t = stateRef.current.time;
      const mode = stateRef.current.exerciseMode;

      ctx.clearRect(0, 0, width, height);

      // Background grid
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Origin center for skeleton
      const cx = width / 2;
      const cy = height / 2 - 10;

      // Skeletal kinematics model calculations
      let headY, hipY, kneeY, ankleY, kneeX, elbowX, elbowY, handX, handY;
      let angleVal = 90;
      let isFormGood = true;

      if (mode === 'SQUAT') {
        // Squat motion: cycle between standing and squat depth
        const squatPhase = (Math.sin(t) + 1) / 2; // 0 (standing) to 1 (full squat)
        const dip = squatPhase * 48;

        headY = cy - 80 + dip;
        hipY = cy + dip * 0.7;
        kneeY = cy + 50 + dip * 0.2;
        kneeX = cx + 25 + squatPhase * 15;
        ankleY = cy + 110;

        // Angle between Hip -> Knee -> Ankle
        angleVal = Math.round(170 - squatPhase * 85);
        setCurrentAngle(angleVal);

        if (angleVal <= 92 && !stateRef.current.wasDown) {
          stateRef.current.wasDown = true;
        } else if (angleVal >= 160 && stateRef.current.wasDown) {
          stateRef.current.wasDown = false;
          stateRef.current.repCount += 1;
          setRepCount(stateRef.current.repCount);
        }

        isFormGood = angleVal >= 80;
        setFormStatus(isFormGood ? 'FORM_ALIGNED' : 'DEPTH_WARNING');

        // Draw Skeletal Figure
        ctx.strokeStyle = isFormGood ? '#00E5FF' : '#F59E0B';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Head
        ctx.beginPath();
        ctx.arc(cx, headY, 14, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 229, 255, 0.15)';
        ctx.fill();
        ctx.stroke();

        // Spine (Head to Hip)
        ctx.beginPath();
        ctx.moveTo(cx, headY + 14);
        ctx.lineTo(cx, hipY);
        ctx.stroke();

        // Left Leg (Spine -> Hip -> Knee -> Ankle)
        ctx.beginPath();
        ctx.moveTo(cx, hipY);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(cx + 20, ankleY);
        ctx.stroke();

        // Right Leg (mirror slightly behind)
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
        ctx.beginPath();
        ctx.moveTo(cx, hipY);
        ctx.lineTo(kneeX - 35, kneeY);
        ctx.lineTo(cx - 20, ankleY);
        ctx.stroke();

        // Arms (forward counter-balance)
        ctx.strokeStyle = '#00E5FF';
        ctx.beginPath();
        ctx.moveTo(cx, headY + 30);
        ctx.lineTo(cx + 40, cy - 20 + dip);
        ctx.lineTo(cx + 65, cy - 25 + dip);
        ctx.stroke();

        // Kinematic Angle Arc at Knee
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(kneeX, kneeY, 20, Math.PI * 0.4, Math.PI * 0.4 + (angleVal * Math.PI) / 180);
        ctx.stroke();

        // Text annotation beside knee
        ctx.fillStyle = '#00E5FF';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText(`KNEE: ${angleVal}°`, kneeX + 26, kneeY - 5);

      } else {
        // Bicep Curl motion
        const curlPhase = (Math.sin(t * 1.4) + 1) / 2;
        headY = cy - 80;
        hipY = cy + 20;
        ankleY = cy + 120;

        const shoulderX = cx + 10;
        const shoulderY = cy - 50;
        elbowX = cx + 18;
        elbowY = cy;
        handX = elbowX + Math.cos(-Math.PI / 2 + curlPhase * Math.PI * 0.7) * 45;
        handY = elbowY + Math.sin(-Math.PI / 2 + curlPhase * Math.PI * 0.7) * 45;

        angleVal = Math.round(160 - curlPhase * 115);
        setCurrentAngle(angleVal);

        if (angleVal <= 55 && !stateRef.current.wasDown) {
          stateRef.current.wasDown = true;
        } else if (angleVal >= 150 && stateRef.current.wasDown) {
          stateRef.current.wasDown = false;
          stateRef.current.repCount += 1;
          setRepCount(stateRef.current.repCount);
        }

        setFormStatus('FORM_ALIGNED');

        ctx.strokeStyle = '#00E5FF';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        // Head & Spine
        ctx.beginPath();
        ctx.arc(cx, headY, 14, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 229, 255, 0.15)';
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx, headY + 14);
        ctx.lineTo(cx, hipY);
        ctx.lineTo(cx, ankleY);
        ctx.stroke();

        // Arm performing curl
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        // Dumbbell at hand
        ctx.fillStyle = '#38BDF8';
        ctx.fillRect(handX - 8, handY - 4, 16, 8);

        // Elbow angle arc
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(elbowX, elbowY, 18, 0, (angleVal * Math.PI) / 180);
        ctx.stroke();

        ctx.fillStyle = '#00E5FF';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText(`ELBOW: ${angleVal}°`, elbowX + 22, elbowY);
      }

      // Draw Keypoint Joint Nodes (Glowing circular markers)
      const joints = [
        { x: cx, y: headY },
        { x: cx, y: cy - 50 },
        { x: cx, y: hipY }
      ];
      if (mode === 'SQUAT') {
        joints.push({ x: kneeX, y: kneeY }, { x: cx + 20, y: ankleY });
      } else {
        joints.push({ x: elbowX, y: elbowY }, { x: handX, y: handY });
      }

      joints.forEach((j) => {
        ctx.fillStyle = '#00E5FF';
        ctx.beginPath();
        ctx.arc(j.x, j.y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(j.x, j.y, 7, 0, Math.PI * 2);
        ctx.stroke();
      });
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className="rounded-2xl border border-cyan-glow/30 bg-black/80 backdrop-blur-xl overflow-hidden p-4 sm:p-5 space-y-4">
      {/* Top Simulation HUD Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-glow animate-pulse" />
          <span className="text-white font-bold">KINEMATICS POSE TELEMETRY</span>
          <span className="text-zinc-600">//</span>
          <span className="text-cyan-glow font-mono">SIM_ENGINE v1.0</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Exercise Mode Selector */}
          <button
            onClick={() => setExerciseMode('SQUAT')}
            className={`px-3 py-1 rounded-md text-[11px] font-mono transition-colors ${
              exerciseMode === 'SQUAT'
                ? 'bg-cyan-glow/20 border border-cyan-glow text-cyan-glow font-bold'
                : 'text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            SQUAT MODEL
          </button>
          <button
            onClick={() => setExerciseMode('CURL')}
            className={`px-3 py-1 rounded-md text-[11px] font-mono transition-colors ${
              exerciseMode === 'CURL'
                ? 'bg-cyan-glow/20 border border-cyan-glow text-cyan-glow font-bold'
                : 'text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            BICEP CURL MODEL
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full h-[340px] bg-black/90 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Live Telemetry Overlay Badges */}
        <div className="absolute top-3 left-3 space-y-1.5 pointer-events-none text-[10px] font-mono">
          <div className="px-2.5 py-1 rounded bg-black/80 border border-white/10 text-zinc-300">
            LANDMARKS: <span className="text-cyan-glow font-bold">33 NODES LOCKED</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-black/80 border border-white/10 text-zinc-300">
            CURRENT ANGLE: <span className="text-cyan-glow font-bold">{currentAngle}°</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-black/80 border border-white/10 text-zinc-300">
            INFERENCE RATE: <span className="text-cyan-glow font-bold">30 FPS (REALTIME)</span>
          </div>
        </div>

        <div className="absolute top-3 right-3 space-y-1.5 pointer-events-none text-[10px] font-mono text-right">
          <div className="px-3 py-1 rounded bg-black/80 border border-cyan-glow/40 text-cyan-glow flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-glow animate-ping" />
            <span className="font-bold text-sm">REPS: {repCount}</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-black/80 border border-white/10 text-zinc-300 flex items-center justify-end space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-bold">{formStatus}</span>
          </div>
        </div>

        {/* Bottom Play/Pause Controls */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono pointer-events-auto">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3.5 py-1.5 rounded-lg border border-cyan-glow/40 bg-cyan-glow/15 text-cyan-glow hover:bg-cyan-glow/25 transition-colors flex items-center space-x-1.5 text-xs font-mono shadow-[0_0_12px_rgba(0,229,255,0.2)]"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>

            <button
              onClick={() => {
                stateRef.current.repCount = 0;
                setRepCount(0);
              }}
              className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-white transition-colors flex items-center space-x-1 text-xs"
              title="Reset Repetition Counter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET REPS</span>
            </button>
          </div>

          <div className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
            // MATHEMATICAL KINEMATIC VECTOR PROJECTION
          </div>
        </div>
      </div>

      <div className="text-[11px] font-mono text-zinc-400 leading-relaxed bg-white/[0.02] p-3 rounded-lg border border-white/5">
        <span className="text-cyan-glow font-bold">SIMULATION EXPLANATION:</span> This interactive canvas models the core geometric trigonometry used by the AI-Powered Gym Trainer pipeline. By analyzing real-time vector coordinates extracted via deep learning pose estimation, the system evaluates biomechanical angle thresholds to reliably count repetitions and detect improper form.
      </div>
    </div>
  );
}
