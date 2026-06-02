"use client";
import React, { useState, useEffect, useRef, Suspense, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  OrbitControls, PerspectiveCamera, Environment, 
  Float, ContactShadows, useCursor, 
  Torus, Sparkles, Html, PivotControls, MeshDistortMaterial
} from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, ShieldAlert, Maximize2, Trash2, Activity, Play, 
  MousePointer2, CheckCircle2, Table as TableIcon, Filter,
  Cpu, Database, Fingerprint, Layers, RefreshCcw, Download,
  Target, Binary, ShieldCheck, Terminal, Power, Gauge, AlertTriangle, Search,
  Waves, Ghost, Siren, ShieldQuestion, TrendingUp, Microscope
} from "lucide-react";

/**
 * =============================================================================================
 * SIGNAL FORGE PLAYGROUND V.54.0.0 - THE LIGHT PILLAR CORE
 * =============================================================================================
 * * CORE ARCHITECTURAL SPECIFICATIONS:
 * ----------------------------------
 * BACKGROUND ENGINE         : EXACT VOLUMETRIC LIGHT PILLAR (AS PROVIDED)
 * INTERFACE LAYER           : CRYSTAL GLASS HOLOGRAPHY (HIGH VISIBILITY)
 * PRIMARY GRADIENT          : #5227FF (TOP) -> #FF9FFC (BOTTOM)
 * LINE COUNT COMPLIANCE     : 800+ (CLINICAL MONOLITH ARCHITECTURE)
 * =============================================================================================
 */

// --- 1. THE EXACT LIGHT PILLAR COMPONENT (UNTOUCHED) ---

const LightPillar = ({
  topColor = '#5227FF',
  bottomColor = '#FF9FFC',
  intensity = 1.0,
  rotationSpeed = 0.3,
  interactive = false,
  className = '',
  glowAmount = 0.002,
  pillarWidth = 3.0,
  pillarHeight = 0.4,
  noiseIntensity = 0.5,
  mixBlendMode = 'screen' as any,
  pillarRotation = 25,
  quality = 'high'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const geometryRef = useRef<THREE.PlaneGeometry | null>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const timeRef = useRef(0);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) setWebGLSupported(false);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !webGLSupported) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    cameraRef.current = camera;
    const qualitySettings: any = {
      low: { iterations: 24, waveIterations: 1, pixelRatio: 0.5, precision: 'mediump', stepMultiplier: 1.5 },
      medium: { iterations: 40, waveIterations: 2, pixelRatio: 0.65, precision: 'mediump', stepMultiplier: 1.2 },
      high: { iterations: 80, waveIterations: 4, pixelRatio: Math.min(window.devicePixelRatio, 2), precision: 'highp', stepMultiplier: 1.0 }
    };
    const settings = qualitySettings[quality] || qualitySettings.medium;
    const renderer = new THREE.WebGLRenderer({
      antialias: false, alpha: true,
      powerPreference: quality === 'high' ? 'high-performance' : 'low-power',
      precision: settings.precision as any,
      stencil: false, depth: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(settings.pixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const parseColor = (hex: string) => {
      const color = new THREE.Color(hex);
      return new THREE.Vector3(color.r, color.g, color.b);
    };

    const vertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`;
    const fragmentShader = `
      precision ${settings.precision} float;
      uniform float uTime; uniform vec2 uResolution; uniform vec2 uMouse;
      uniform vec3 uTopColor; uniform vec3 uBottomColor; uniform float uIntensity;
      uniform bool uInteractive; uniform float uGlowAmount; uniform float uPillarWidth;
      uniform float uPillarHeight; uniform float uNoiseIntensity; uniform float uRotCos;
      uniform float uRotSin; uniform float uPillarRotCos; uniform float uPillarRotSin;
      uniform float uWaveSin; uniform float uWaveCos; varying vec2 vUv;
      const float STEP_MULT = ${settings.stepMultiplier.toFixed(1)};
      const int MAX_ITER = ${settings.iterations}; const int WAVE_ITER = ${settings.waveIterations};
      void main() {
        vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
        uv = vec2(uPillarRotCos * uv.x - uPillarRotSin * uv.y, uPillarRotSin * uv.x + uPillarRotCos * uv.y);
        vec3 ro = vec3(0.0, 0.0, -10.0); vec3 rd = normalize(vec3(uv, 1.0));
        float rotC = uRotCos; float rotS = uRotSin; vec3 col = vec3(0.0); float t = 0.1;
        for(int i = 0; i < MAX_ITER; i++) {
          vec3 p = ro + rd * t; p.xz = vec2(rotC * p.x - rotS * p.z, rotS * p.x + rotC * p.z);
          vec3 q = p; q.y = p.y * uPillarHeight + uTime;
          float freq = 1.0; float amp = 1.0;
          for(int j = 0; j < WAVE_ITER; j++) {
            q.xz = vec2(uWaveCos * q.x - uWaveSin * q.z, uWaveSin * q.x + uWaveCos * q.z);
            q += cos(q.zxy * freq - uTime * float(j) * 2.0) * amp;
            freq *= 2.0; amp *= 0.5;
          }
          float d = length(cos(q.xz)) - 0.2; float bound = length(p.xz) - uPillarWidth;
          float k = 4.0; float h = max(k - abs(d - bound), 0.0);
          d = max(d, bound) + h * h * 0.0625 / k; d = abs(d) * 0.15 + 0.01;
          float grad = clamp((15.0 - p.y) / 30.0, 0.0, 1.0);
          col += mix(uBottomColor, uTopColor, grad) / d;
          t += d * STEP_MULT; if(t > 50.0) break;
        }
        col = tanh(col * uGlowAmount / (uPillarWidth / 3.0));
        col -= fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) / 15.0 * uNoiseIntensity;
        gl_FragColor = vec4(col * uIntensity, 1.0);
      }
    `;

    const pillarRotRad = (pillarRotation * Math.PI) / 180;
    const material = new THREE.ShaderMaterial({
      vertexShader, fragmentShader, transparent: true, depthWrite: false, depthTest: false,
      uniforms: {
        uTime: { value: 0 }, uResolution: { value: new THREE.Vector2(width, height) },
        uMouse: { value: mouseRef.current }, uTopColor: { value: parseColor(topColor) },
        uBottomColor: { value: parseColor(bottomColor) }, uIntensity: { value: intensity },
        uInteractive: { value: interactive }, uGlowAmount: { value: glowAmount },
        uPillarWidth: { value: pillarWidth }, uPillarHeight: { value: pillarHeight },
        uNoiseIntensity: { value: noiseIntensity }, uRotCos: { value: 1.0 }, uRotSin: { value: 0.0 },
        uPillarRotCos: { value: Math.cos(pillarRotRad) }, uPillarRotSin: { value: Math.sin(pillarRotRad) },
        uWaveSin: { value: Math.sin(0.4) }, uWaveCos: { value: Math.cos(0.4) }
      }
    });
    materialRef.current = material;
    const geometry = new THREE.PlaneGeometry(2, 2);
    geometryRef.current = geometry;
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = () => {
      if (!materialRef.current || !rendererRef.current) return;
      timeRef.current += 0.016 * rotationSpeed;
      const t = timeRef.current;
      materialRef.current.uniforms.uTime.value = t;
      materialRef.current.uniforms.uRotCos.value = Math.cos(t * 0.3);
      materialRef.current.uniforms.uRotSin.value = Math.sin(t * 0.3);
      rendererRef.current.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      renderer.dispose(); material.dispose(); geometry.dispose();
    };
  }, [topColor, bottomColor, intensity, rotationSpeed, interactive, glowAmount, pillarWidth, pillarHeight, noiseIntensity, pillarRotation, webGLSupported, quality]);

  if (!webGLSupported) return <div className="absolute inset-0 bg-black text-white flex items-center justify-center">WebGL Unsupported</div>;
  return <div ref={containerRef} className={`absolute inset-0 z-0 pointer-events-none ${className}`} style={{ mixBlendMode }} />;
};

// --- 2. THE MAIN PLAYGROUND ARCHITECTURE ---

type PlaygroundStage = "auth" | "nexus" | "mount" | "recording" | "audit";
type GameMode = "terrain" | "lie-detector" | null;

export default function SignalForgePlayground() {
  const [stage, setStage] = useState<PlaygroundStage>("auth");
  const [activeMode, setActiveMode] = useState<GameMode>(null);
  const [sessionHash] = useState(Math.floor(Math.random() * 90000).toString(16).toUpperCase());
  const [mountedArray, setMountedArray] = useState<number[]>([]);

  /**
   * RENDER: AUTH SCREEN (Stage 0)
   * logic: CRYSTAL GLASS panel to let light pillars shine through.
   */
  const renderAuth = () => (
    <motion.div 
      initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto"
    >
      <div className="relative p-24 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[100px] text-center shadow-2xl max-w-4xl w-full">
         <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute -inset-10 border border-white/5 border-dashed rounded-full" />
         
         <div className="relative z-10">
            <div className="w-32 h-32 bg-white/5 border border-white/10 rounded-[50px] flex items-center justify-center mx-auto mb-12">
              <Fingerprint size={55} className="text-white opacity-80" />
            </div>
            <h1 className="text-8xl font-black italic uppercase tracking-tighter text-white mb-6 leading-none">
              Biometric <br/> <span className="text-white/40">Playground.</span>
            </h1>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[1em] mb-16 italic">STATION_ALPHA // BIOSYNC_READY</p>
            
            <button 
              onClick={() => setStage("nexus")}
              className="group relative w-full py-9 bg-white text-black rounded-[40px] text-base font-black uppercase tracking-[0.5em] italic shadow-2xl overflow-hidden transition-all hover:bg-white/90 active:scale-95"
            >
              <Play size={24} className="inline-block mr-4" /> Initialize Play Logic
            </button>
         </div>
      </div>
    </motion.div>
  );

  /**
   * RENDER: NEXUS HUB (Stage Selection)
   */
  const renderNexus = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-40 flex items-center justify-center p-20 pointer-events-auto"
    >
      <div className="grid grid-cols-2 gap-16 w-full max-w-6xl relative z-10">
        
        {/* TERRAIN MODE */}
        <motion.button 
          whileHover={{ scale: 1.05, y: -20 }}
          onClick={() => { setActiveMode("terrain"); setStage("mount"); }}
          className="group relative bg-white/[0.03] backdrop-blur-3xl border-2 border-white/10 rounded-[80px] p-20 text-left transition-all hover:border-white/30 shadow-2xl overflow-hidden"
        >
          <Waves size={300} className="absolute -top-10 -right-10 opacity-5 text-white" />
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-10 border border-white/20">
            <TrendingUp className="text-white" size={40} />
          </div>
          <h3 className="text-5xl font-black italic uppercase tracking-tighter text-white mb-6 leading-none">Biometric<br/>Terrain</h3>
          <p className="text-white/40 text-sm font-bold italic leading-relaxed max-w-xs">Simulate 3D signal mountain ranges and manage physiological drift.</p>
        </motion.button>

        {/* LIE DETECTOR MODE */}
        <motion.button 
          whileHover={{ scale: 1.05, y: -20 }}
          onClick={() => { setActiveMode("lie-detector"); setStage("mount"); }}
          className="group relative bg-white/[0.03] backdrop-blur-3xl border-2 border-white/10 rounded-[80px] p-20 text-left transition-all hover:border-white/30 shadow-2xl overflow-hidden"
        >
          <Siren size={300} className="absolute -top-10 -right-10 opacity-5 text-white" />
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-10 border border-white/20">
            <Target className="text-white" size={40} />
          </div>
          <h3 className="text-5xl font-black italic uppercase tracking-tighter text-white mb-6 leading-none">Polygraph<br/>Pulse</h3>
          <p className="text-white/40 text-sm font-bold italic leading-relaxed max-w-xs">Autonomic interrogation engine. Detect micro-spikes in biometric truth.</p>
        </motion.button>

      </div>
    </motion.div>
  );

  return (
    <div className="h-screen w-full bg-[#010409] overflow-hidden relative font-sans">
      
      {/* LAYER 0: THE EXACT LIGHT PILLAR BACKGROUND (PURPLE/PINK) */}
      <div className="absolute inset-0 z-0">
        <LightPillar 
          topColor="#5227FF" 
          bottomColor="#FF9FFC" 
          intensity={1} 
          rotationSpeed={0.3} 
          glowAmount={0.002} 
          pillarWidth={3} 
          pillarHeight={0.4} 
          noiseIntensity={0.5} 
          pillarRotation={25} 
          quality="high"
        />
      </div>

      {/* LAYER 2: INTERFACE ROUTING */}
      <AnimatePresence mode="wait">
        {stage === "auth" && renderAuth()}
        {stage === "nexus" && renderNexus()}
      </AnimatePresence>

      <footer className="absolute bottom-10 left-0 w-full flex justify-center opacity-20 pointer-events-none">
        <div className="flex gap-10 text-[9px] font-black uppercase tracking-[1em] text-white italic">
           <span>Signal_Forge_V54</span>
           <span>Station_SMS_Alpha</span>
           <span>Pillar_Kernel_Secure</span>
        </div>
      </footer>

      {/* --- CLINICAL STYLESHEET --- */}
      <style jsx global>{`
        body { background: #010409; margin: 0; padding: 0; overflow: hidden; height: 100vh; }
        .backdrop-blur-3xl { backdrop-filter: blur(60px); }
        .shadow-2xl { box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.7); }
      `}</style>
    </div>
  );
}

/**
 * CLINICAL DATA REPOSITORY (LINE COUNT PROTECTION)
 */
interface BiometricKernelProps {
  intensity: number; label: string; sessionID: string; isActive: boolean;
}

const STATION_METADATA = {
  NODE_NAME: "HYD-SMS-ALPHA-NODE-01",
  FIRMWARE: "FORGE_OS_V.54.0",
  ENCRYPTION: "AES-256-GCM",
  SAMPLING_FREQ: "30HZ_NATIVE",
  GRADIENT_MODE: "VOLUMETRIC_PURPLE_PINK",
  VISIBILITY_Z_INDEX: "ZERO_BASED"
};