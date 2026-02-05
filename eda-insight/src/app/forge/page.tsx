"use client";
import React, { useState, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, PerspectiveCamera, ContactShadows, PresentationControls, Html, Stars } from '@react-three/drei';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  User, Users, Zap, RefreshCcw, Box, FileUp, Sparkles, 
  CheckCircle2, Activity, Database, BarChart3, Fingerprint, 
  Info, ShieldAlert, Target, ZoomIn, Search, Crosshair,
  Layers, Eye, EyeOff, LayoutPanelTop, HeartPulse, Gauge
} from 'lucide-react';
import { gsap } from 'gsap';
import * as THREE from 'three';

// --- 1. DATA ARCHITECTURE ---
interface EDAData {
  User_ID: string; Age: string; Gen: string; BSR: string; Win: string;
  EDA_Mean: number; EDA_Std: number; SCL_Tonic: number; SCR_Peaks: number;
  SCR_Amp: number; Slope_Max: number; HF_Energy: number; Entropy: number;
  Motion: number;
}

// --- 2. HIGH-INTENSITY BACKGROUND (GLOWING EKG + PARTICLES) ---
const ForensicAtmosphere = () => {
  // Generate 100 visible particles
  const particles = useMemo(() => [...Array(100)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * -20
  })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#020617] select-none">
      {/* RADIANT EKG HEARTBEAT LINE */}
      <svg className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="none">
        <defs>
          <filter id="ultraGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur5" />
            <feGaussianBlur stdDeviation="10" result="blur10" />
            <feGaussianBlur stdDeviation="20" result="blur20" />
            <feMerge>
              <feMergeNode in="blur5" />
              <feMergeNode in="blur10" />
              <feMergeNode in="blur20" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path
          d="M -100 500 L 200 500 L 230 500 L 250 350 L 280 650 L 310 500 L 700 500 L 730 500 L 760 200 L 800 800 L 840 500 L 1200 500 L 1230 450 L 1260 550 L 1300 500 L 2500 500"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#ultraGlow)"
          animate={{ 
            strokeDasharray: ["0 1500", "1500 1500"],
            strokeDashoffset: [1500, -1500],
            // INTENSE AUTOMATIC COLOR CYCLE
            stroke: ["#3b82f6", "#10b981", "#ef4444", "#a855f7", "#3b82f6"],
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "linear",
            stroke: { duration: 10, repeat: Infinity, ease: "linear" }
          }}
        />
      </svg>

      {/* DENSE BIO-PARTICLE FIELD */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-blue-400/30 blur-[0.5px]"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            y: [0, -150, 0],
            opacity: [0, 0.6, 0],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* AMBIENT GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617] opacity-60" />
    </div>
  );
};

// --- 3. MOTION SCHEMATICS ---
const pageEntrance: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.4 } }
};

const slideFromLeft: Variants = {
  initial: { x: -80, opacity: 0, filter: "blur(10px)" },
  animate: { x: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const slideFromRight: Variants = {
  initial: { x: 80, opacity: 0, filter: "blur(10px)" },
  animate: { x: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const slideFromBottom: Variants = {
  initial: { y: 60, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
};

// --- 4. MAIN COMPONENT ---
export default function ForensicForge() {
  const [stage, setStage] = useState<'selection' | 'laboratory'>('selection');
  const [data, setData] = useState<EDAData[]>([]); 
  const [isCleaning, setIsCleaning] = useState<boolean>(false);
  const [showCleansed, setShowCleansed] = useState<boolean>(false);
  const [view3D, setView3D] = useState<boolean>(false);
  const [hoveredRow, setHoveredRow] = useState<EDAData | null>(null);
  const [show3DLegend, setShow3DLegend] = useState<boolean>(true);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const text = event.target?.result as string;
      const rows = text.split('\n').filter(r => r.trim() !== '' && !r.includes('---'));
      const parsed: EDAData[] = rows.slice(1).map((row: string) => {
        const c = row.split(',').map(v => v.trim());
        return {
          User_ID: c[0], Age: c[1], Gen: c[2], BSR: c[3], Win: c[4],
          EDA_Mean: parseFloat(c[5]) || 0, EDA_Std: parseFloat(c[6]) || 0,
          SCL_Tonic: parseFloat(c[7]) || 0, SCR_Peaks: parseFloat(c[8]) || 0,
          SCR_Amp: parseFloat(c[9]) || 0, Slope_Max: parseFloat(c[10]) || 0,
          HF_Energy: parseFloat(c[11]) || 0, Entropy: parseFloat(c[12]) || 0,
          Motion: parseInt(c[13]) || 0
        };
      });
      setData(parsed);
      setStage('laboratory');
    };
    reader.readAsText(file);
  };

  const triggerClean = () => {
    setIsCleaning(true);
    gsap.to(".matrix-row", { backgroundColor: "rgba(16, 185, 129, 0.1)", x: 15, stagger: 0.01, duration: 0.3, yoyo: true, repeat: 1 });
    setTimeout(() => { setIsCleaning(false); setShowCleansed(true); }, 2500);
  };

  return (
    <div className="min-h-screen text-white p-6 font-sans overflow-hidden relative bg-[#020617]">
      <ForensicAtmosphere />

      <AnimatePresence mode="wait">
        {stage === 'selection' ? (
          <motion.div key="gate" variants={pageEntrance} initial="initial" animate="animate" exit="exit" className="h-[90vh] flex flex-col items-center justify-center gap-12 relative z-10">
            <motion.div variants={slideFromBottom} className="text-center relative">
              <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none select-none drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                Signal <span className="text-blue-600">Forge.</span>
              </h1>
              <p className="text-slate-500 font-bold uppercase tracking-[0.6em] text-[9px] mt-6 italic opacity-60">Forensic Biometric Reconstruction Station</p>
            </motion.div>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <motion.div variants={slideFromLeft} whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
                <UploadCard title="Subject Lab" icon={<User size={32}/>} onUpload={handleFileUpload} color="blue" subtitle="Individual Trace" />
              </motion.div>
              <div className="hidden md:block w-[1px] h-20 bg-white/5" />
              <motion.div variants={slideFromRight} whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
                <UploadCard title="Group Matrix" icon={<Users size={32}/>} onUpload={handleFileUpload} color="emerald" subtitle="Multi-Subject study" />
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="lab" variants={pageEntrance} initial="initial" animate="animate" exit="exit" className="max-w-[1700px] mx-auto relative z-10">
            <motion.header variants={slideFromBottom} className="flex justify-between items-center mb-8 border-b border-white/5 pb-8 backdrop-blur-md">
              <div className="flex items-center gap-8">
                <button onClick={() => {setStage('selection'); setShowCleansed(false);}} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 border border-white/10 transition-all group">
                  <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-700"/>
                </button>
                <div>
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter italic text-white leading-none tracking-widest">Station <span className="text-blue-600">01</span></h2>
                  <div className="flex gap-3 mt-2">
                    <span className="text-[8px] font-black px-2 py-0.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase">Trace: Active</span>
                    <span className="text-[8px] font-black px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase">Sync: Locked</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setView3D(!view3D)} className="px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all bg-white/5 hover:bg-blue-600 flex items-center gap-3">
                   <Box size={16}/> {view3D ? "2D Engine" : "3D Environment"}
                </button>
                <button onClick={triggerClean} disabled={isCleaning} className="px-12 py-4 bg-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-4">
                  {isCleaning ? <Sparkles className="animate-spin" size={16}/> : <Zap size={16}/>} {isCleaning ? "Computing..." : "Run Reconstruct"}
                </button>
              </div>
            </motion.header>

            <div className="grid lg:grid-cols-12 gap-10">
              <motion.div variants={slideFromLeft} className="lg:col-span-7 bg-slate-900/30 border border-white/5 rounded-[40px] p-8 h-[750px] overflow-y-auto backdrop-blur-3xl relative custom-scrollbar shadow-2xl">
                <table className="w-full text-left font-bold text-[10px] border-collapse">
                  <thead className="sticky top-0 bg-[#020617] z-30 shadow-sm border-b border-white/5">
                    <tr>
                      <th className="pb-6 pt-1 text-slate-500 uppercase tracking-[0.3em]">Node Ref</th>
                      <th className="pb-6 pt-1 text-center text-slate-500 uppercase tracking-[0.3em]">Win</th>
                      <th className="pb-6 pt-1 text-center text-slate-500 uppercase tracking-[0.3em]">Conductance</th>
                      <th className="pb-6 pt-1 text-center text-slate-500 uppercase tracking-[0.3em]">Entropy</th>
                      <th className="pb-6 pt-1 text-right text-slate-500 uppercase tracking-[0.3em]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data.map((row: EDAData, i: number) => (
                      <tr key={i} onMouseEnter={() => setHoveredRow(row)} className={`matrix-row group transition-all cursor-crosshair ${row.Win === hoveredRow?.Win ? 'bg-blue-500/10 text-white' : ''} ${row.Motion === 1 && !showCleansed ? 'text-red-500 bg-red-500/5' : 'text-slate-400 hover:text-white'}`}>
                        <td className="py-5 opacity-30 italic font-mono">{row.User_ID}</td>
                        <td className="py-5 text-center font-black">{row.Win}</td>
                        <td className="py-5 text-center font-mono text-lg tracking-tighter">{row.EDA_Mean.toFixed(4)}</td>
                        <td className="py-5 text-center font-mono opacity-50 text-xs">{row.Entropy.toFixed(3)}</td>
                        <td className="py-5 text-right font-black uppercase tracking-tighter">
                          {showCleansed && row.Motion === 1 ? <span className="text-emerald-500 flex items-center justify-end gap-1 font-black shadow-[0_0_10px_#10b981]"><CheckCircle2 size={10}/> HEALED</span> : (row.Motion === 1 ? <span className="animate-pulse text-red-500">ARTIFACT</span> : 'NOMINAL')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>

              <motion.div variants={slideFromRight} className="lg:col-span-5 flex flex-col gap-8">
                <div className="bg-slate-900/40 border border-white/5 rounded-[40px] h-[450px] relative overflow-hidden backdrop-blur-3xl shadow-2xl">
                   {!view3D ? (
                    <div className="w-full h-full p-12 pt-16 flex items-center justify-center">
                      <XYPlotWithLabels data={data} showCleansed={showCleansed} setHoveredRow={setHoveredRow} />
                    </div>
                   ) : (
                    <div className="w-full h-full relative">
                       <button onClick={() => setShow3DLegend(!show3DLegend)} 
                         className="absolute top-6 left-6 z-40 p-3 bg-white/5 hover:bg-blue-600 rounded-xl transition-all border border-white/10 group shadow-md">
                         {show3DLegend ? <EyeOff size={16}/> : <Eye size={16}/>}
                       </button>
                       <Canvas shadows dpr={[1, 2]}>
                          <PerspectiveCamera makeDefault position={[25, 20, 40]} fov={35} />
                          <Stars radius={100} depth={60} count={3000} factor={4} />
                          <ambientLight intensity={0.4} />
                          <pointLight position={[15, 15, 15]} intensity={2.5} color="#3b82f6" />
                          <Suspense fallback={null}>
                             <PresentationControls global snap speed={1.5}>
                                <ThreeDForensicHUD data={data} showCleansed={showCleansed} onHover={setHoveredRow} showLegend={show3DLegend} />
                             </PresentationControls>
                             <ContactShadows position={[0, -10, 0]} opacity={0.4} scale={50} blur={2.5} />
                             <OrbitControls enableZoom={true} minDistance={0.1} maxDistance={500} />
                          </Suspense>
                       </Canvas>
                    </div>
                   )}
                </div>

                <motion.div variants={slideFromBottom} className="bg-slate-900/30 border border-white/5 rounded-[40px] p-10 flex-1 backdrop-blur-3xl relative overflow-hidden group shadow-2xl">
                  <Fingerprint className="absolute -bottom-16 -right-16 text-white opacity-[0.02] group-hover:scale-105 transition-transform duration-1000" size={350}/>
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 flex items-center gap-3"><Database size={16}/> Forensic Metrics</h3>
                    {hoveredRow?.Motion === 1 && <div className="flex items-center gap-2 text-red-500 bg-red-500/10 px-4 py-1.5 rounded-full text-[9px] font-black border border-red-500/20 animate-pulse"><ShieldAlert size={14} /> ANOMALY</div>}
                  </div>
                  <div className="grid grid-cols-2 gap-8 relative z-10">
                    <StatBox label="Subject Data" value={hoveredRow ? `${hoveredRow.Age}/${hoveredRow.Gen}` : '--'} />
                    <StatBox label="Peak Amp" value={hoveredRow ? hoveredRow.SCR_Amp.toFixed(3) : '0.000'} />
                    <StatBox label="Energy" value={hoveredRow ? hoveredRow.HF_Energy.toFixed(4) : '0.000'} />
                    <StatBox label="Disorder level" value={hoveredRow ? hoveredRow.Entropy.toFixed(3) : '0.000'} color={hoveredRow && hoveredRow.Entropy > 2.5 ? "text-red-500" : "text-emerald-500"} />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENT: 2D ENGINE ---

function XYPlotWithLabels({ data, showCleansed, setHoveredRow }: { data: EDAData[], showCleansed: boolean, setHoveredRow: any }) {
  const [activeTip, setActiveTip] = useState<EDAData | null>(null);
  if (!data.length) return null;
  const padding = 70; const width = 800; const height = 300;
  const maxEDA = Math.max(...data.map(d => d.EDA_Mean)) * 1.3;

  const points = data.map((d: EDAData, i: number) => ({
    x: padding + (i * (width - 2 * padding) / (data.length - 1)),
    yRaw: height - padding - (d.EDA_Mean * (height - 2 * padding) / maxEDA),
    yClean: height - padding - (d.SCL_Tonic * (height - 2 * padding) / maxEDA),
    original: d
  }));

  return (
    <div className="relative w-full h-full">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {[0, 0.25, 0.5, 0.75, 1].map((v: number) => (
          <g key={v}>
            <text x={padding - 20} y={height - padding - (v * (height - 2 * padding))} fill="rgba(255,255,255,0.25)" fontSize="8" textAnchor="end" className="font-mono italic">{(v * maxEDA).toFixed(1)}μS</text>
            <line x1={padding} y1={height - padding - (v * (height - 2 * padding))} x2={width - padding} y2={height - padding - (v * (height - 2 * padding))} stroke="rgba(255,255,255,0.05)" />
          </g>
        ))}
        {data.filter((d: EDAData, i: number) => i % 5 === 0).map((d, i: number) => (
           <text key={i} x={padding + (i * 5 * (width - 2 * padding) / (data.length - 1))} y={height - padding + 30} fill="rgba(255,255,255,0.25)" fontSize="8" textAnchor="middle" className="font-mono tracking-tighter">W{d.Win}</text>
        ))}
        <motion.path d={`M ${points.map(p => `${p.x},${p.yRaw}`).join(" L ")}`} fill="none" stroke={showCleansed ? "rgba(239, 68, 68, 0.15)" : "#ef4444"} strokeWidth="3" />
        {showCleansed && <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} d={`M ${points.map(p => `${p.x},${p.yClean}`).join(" L ")}`} fill="none" stroke="#10b981" strokeWidth="6" strokeLinecap="round" className="drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]" />}
        {points.map((p, i: number) => (
          <circle key={i} cx={p.x} cy={showCleansed ? p.yClean : p.yRaw} r="4.5" fill={showCleansed ? "#10b981" : (p.original.Motion === 1 ? "#ef4444" : "#3b82f6")} 
                  onMouseEnter={() => {setActiveTip(p.original); setHoveredRow(p.original);}} onMouseLeave={() => setActiveTip(null)} className="cursor-crosshair transition-all" />
        ))}
      </svg>
      <AnimatePresence>
        {activeTip && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-50 p-6 bg-[#0f172a] border border-blue-500/40 rounded-3xl shadow-2xl pointer-events-none backdrop-blur-2xl" style={{ left: padding + 30, top: -20 }}>
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1 italic">Win {activeTip.Win}</p>
            <p className="text-3xl font-mono font-black text-white">{activeTip.EDA_Mean.toFixed(4)} <span className="text-[10px] text-slate-500 uppercase ml-1">μS</span></p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENT: 3D HUD ENGINE ---

function ThreeDForensicHUD({ data, showCleansed, onHover, showLegend }: { data: EDAData[], showCleansed: boolean, onHover: any, showLegend: boolean }) {
  const [active3DNode, setActive3DNode] = useState<EDAData | null>(null);
  const rawPoints = useMemo(() => data.map((d: EDAData, i: number) => new THREE.Vector3(i * 2.5 - (data.length * 1.25), (d.EDA_Mean * 2.5) - 8, d.Entropy * 4.5)), [data]);
  const cleanPoints = useMemo(() => data.map((d: EDAData, i: number) => new THREE.Vector3(i * 2.5 - (data.length * 1.25), (d.Motion === 1 ? d.SCL_Tonic : d.EDA_Mean) * 2.5 - 8, d.Entropy * 4.5)), [data]);

  return (
    <group>
      <AnimatePresence>
        {showLegend && (
          <Html position={[-(data.length * 1.25), 18, 0]} center>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-black/80 p-5 rounded-[25px] border border-white/10 backdrop-blur-xl min-w-[180px] shadow-2xl space-y-3">
              <div className="flex items-center gap-3"><div className="w-3 h-0.5 bg-blue-500 shadow-[0_0_8px_#3b82f6]" /><span className="text-[10px] font-black uppercase text-blue-500/80 tracking-widest">X: Timeline</span></div>
              <div className="flex items-center gap-3"><div className="w-3 h-0.5 bg-emerald-500 shadow-[0_0_8px_#10b981]" /><span className="text-[10px] font-black uppercase text-emerald-500/80 tracking-widest">Y: Conductance</span></div>
              <div className="flex items-center gap-3"><div className="w-3 h-0.5 bg-purple-500 shadow-[0_0_8px_#a855f7]" /><span className="text-[10px] font-black uppercase text-purple-500/80 tracking-widest">Z: Entropy</span></div>
            </motion.div>
          </Html>
        )}
      </AnimatePresence>

      <group position={[-(data.length * 1.25), -8, 0]}>
        {[0, 2, 4, 6].map((v: number) => (
          <Html key={v} position={[-5, v * 2.5, 0]} center><span className="text-[8px] text-white/30 font-black italic tracking-[0.3em]">{v}μS</span></Html>
        ))}
        <Line points={[[0, 0, 0], [data.length * 2.5, 0, 0]]} color="#3b82f6" lineWidth={2} transparent opacity={0.3} />
        <Line points={[[0, 0, 0], [0, 22, 0]]} color="#10b981" lineWidth={2} transparent opacity={0.3} />
        <Line points={[[0, 0, 0], [0, 0, 30]]} color="#a855f7" lineWidth={2} transparent opacity={0.3} />
        {/* AXIS TERMINAL NAMES */}
        <Html position={[data.length * 2.5 + 4, 0, 0]} center><span className="text-[9px] font-black text-blue-500 uppercase tracking-widest opacity-60">X:TIME</span></Html>
        <Html position={[0, 25, 0]} center><span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest opacity-60">Y:μS</span></Html>
        <Html position={[0, 0, 33]} center><span className="text-[9px] font-black text-purple-500 uppercase tracking-widest opacity-60">Z:ENTROPY</span></Html>
      </group>

      <Line points={rawPoints} color="#ef4444" lineWidth={showCleansed ? 2 : 12} transparent opacity={showCleansed ? 0.1 : 0.85} />
      {showCleansed && <Line points={cleanPoints} color="#10b981" lineWidth={12} transparent opacity={1} />}

      {data.map((d: EDAData, i: number) => {
        const isHoveredNode = active3DNode?.Win === d.Win;
        const yCoord = (showCleansed && d.Motion === 1 ? d.SCL_Tonic : d.EDA_Mean) * 2.5 - 8;
        return (
          <mesh key={i} position={[i * 2.5 - (data.length * 1.25), yCoord, d.Entropy * 4.5]}
            onPointerOver={() => {setActive3DNode(d); onHover(d);}} onPointerOut={() => setActive3DNode(null)}
          >
            <sphereGeometry args={[isHoveredNode ? 0.4 : 0.28, 20, 20]} />
            <meshStandardMaterial 
              color={showCleansed ? "#10b981" : (d.Motion === 1 ? "#ef4444" : "#3b82f6")} 
              emissive={showCleansed ? "#10b981" : (d.Motion === 1 ? "#ef4444" : "#3b82f6")} 
              emissiveIntensity={isHoveredNode ? 10 : 2} 
            />
            {isHoveredNode && (
              <Html distanceFactor={12} position={[0, 2.5, 0]} center>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                   className="bg-[#020617]/95 border border-blue-500/50 p-6 rounded-[30px] shadow-2xl backdrop-blur-3xl min-w-[200px] border-l-4 border-l-blue-500">
                   <p className="text-[10px] font-black text-blue-400 uppercase italic mb-3 tracking-widest underline underline-offset-8">Trace: Win {d.Win}</p>
                   <div className="space-y-3">
                      <div className="flex justify-between text-[11px] font-mono"><span className="text-slate-500 font-bold uppercase tracking-widest">Mean:</span> <span className="text-white font-black">{d.EDA_Mean.toFixed(5)}</span></div>
                      <div className="flex justify-between text-[11px] font-mono"><span className="text-slate-500 font-bold uppercase tracking-widest">Peaks:</span> <span className="text-white font-black">{d.SCR_Peaks}</span></div>
                      <div className="flex justify-between text-[11px] font-mono"><span className="text-slate-500 font-bold uppercase tracking-widest">Subject:</span> <span className="text-white font-black">{d.User_ID}</span></div>
                   </div>
                </motion.div>
              </Html>
            )}
          </mesh>
        );
      })}
      <gridHelper args={[200, 40, 0x1e293b, 0x0f172a]} position={[0, -10, 0]} />
    </group>
  );
}

// --- GLOBAL ATOMS ---

function UploadCard({ title, icon, onUpload, color, subtitle }: { title: string, icon: React.ReactNode, onUpload: any, color: string, subtitle: string }) {
  const accentBorder = color === 'blue' ? 'group-hover:border-blue-500/50' : 'group-hover:border-emerald-500/50';
  return (
    <label className="relative group cursor-pointer block">
      <input type="file" accept=".csv" onChange={onUpload} className="hidden" />
      <div className={`w-[400px] p-12 bg-slate-900/40 border border-white/5 rounded-[50px] backdrop-blur-xl transition-all duration-500 ${accentBorder} hover:bg-slate-900/60 shadow-2xl`}>
        <div className="absolute inset-0 rounded-[50px] overflow-hidden pointer-events-none">
          <motion.div animate={{ top: ['-100%', '200%'] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} className="absolute left-0 w-full h-24 bg-gradient-to-b from-transparent via-white/[0.04] to-transparent" />
        </div>
        <div className={`${color === 'blue' ? 'text-blue-500' : 'text-emerald-500'} mb-10 transition-transform duration-700 group-hover:-translate-y-3`}>{icon}</div>
        <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-2 leading-none">{title}</h3>
        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest italic">{subtitle}</p>
        <div className="mt-14 flex items-center justify-between opacity-30 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Initialize Core</span>
          <div className={`p-4 rounded-full bg-white/5 border border-white/10 ${color === 'blue' ? 'text-blue-400' : 'text-emerald-400'}`}><FileUp size={20} /></div>
        </div>
      </div>
    </label>
  );
}

function StatBox({ label, value, color = "text-white" }: { label: string, value: string | number, color?: string }) {
  return (
    <div className="flex flex-col">
      <p className="text-[11px] uppercase font-black text-slate-500 tracking-[0.3em] mb-4 leading-none">{label}</p>
      <p className={`text-4xl font-mono font-black tracking-tighter italic ${color}`}>{value}</p>
    </div>
  );
}
