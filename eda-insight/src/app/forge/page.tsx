"use client";
import React, { useState, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, PerspectiveCamera, ContactShadows, PresentationControls, Html, Stars } from '@react-three/drei';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  User, Users, Zap, RefreshCcw, Box, FileUp, Sparkles,
  CheckCircle2, Activity, Database, BarChart3, Fingerprint,
  Info, ShieldAlert, Target, ZoomIn, Search, Crosshair,
  Layers, Eye, EyeOff, LayoutPanelTop, HeartPulse, Gauge,
  BrainCircuit, MessageSquare, X, ChevronDown, ChevronRight, Settings2,
  Award, Timer, DatabaseZap, RefreshCw, BarChartHorizontal
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

// --- 2. HIGH-INTENSITY BACKGROUND ---
const ForensicAtmosphere = () => {
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
      <svg className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="none">
        <defs>
          <filter id="ultraGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur5" />
            <feGaussianBlur stdDeviation="15" result="blur15" />
            <feMerge>
              <feMergeNode in="blur5" />
              <feMergeNode in="blur15" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path
          d="M -100 500 L 2500 500"
          fill="none"
          strokeWidth="2"
          stroke="#3b82f6"
          strokeDasharray="10 20"
          animate={{ strokeDashoffset: [0, -100] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </svg>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-blue-400/20 blur-[1px]"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [0, -100, 0], opacity: [0, 0.4, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

// --- 3. MOTION SCHEMATICS ---
const pageEntrance: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
  exit: { opacity: 0, scale: 0.98 }
};

const slideFromLeft: Variants = {
  initial: { x: -40, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

const slideFromRight: Variants = {
  initial: { x: 40, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

const slideFromBottom: Variants = {
  initial: { y: 30, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

// --- 4. MAIN COMPONENT ---
export default function ForensicForge() {
  const [data, setData] = useState<EDAData[]>([]);
  const [rawData, setRawData] = useState<EDAData[]>([]);
  const [view3D, setView3D] = useState(false);
  const [stage, setStage] = useState<'selection' | 'laboratory'>('selection');
  const [hoveredRow, setHoveredRow] = useState<EDAData | null>(null);
  const [isCleaning, setIsCleaning] = useState(false);
  const [showCleansed, setShowCleansed] = useState(false);
  const [show3DLegend, setShow3DLegend] = useState(true);

  const [mlMode, setMlMode] = useState<'solo' | 'hybrid'>('solo');
  const [selectedTechs, setSelectedTechs] = useState<string[]>(['cul']);

  // Header State
  const [isSoloMenuOpen, setIsSoloMenuOpen] = useState(false);
  const [isHybridMenuOpen, setIsHybridMenuOpen] = useState(false);
  const [isLabConfigOpen, setIsLabConfigOpen] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
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
      setRawData(parsed);
      setStage('laboratory');
    };
    reader.readAsText(file);
  };

  const [auditReports, setAuditReports] = useState<any[]>([]);
  const [isAuditorOpen, setIsAuditorOpen] = useState(false);

  const bestTrialId = useMemo(() => {
    if (auditReports.length === 0) return null;
    const validReports = auditReports.filter(r => !r.error);
    if (validReports.length === 0) return null;
    return validReports.reduce((prev, curr) =>
      (curr.metrics.stability_index + curr.metrics.smoothness_score) > (prev.metrics.stability_index + prev.metrics.smoothness_score) ? curr : prev
    ).id;
  }, [auditReports]);

  const algorithms = [
    { id: 'cul', name: 'CUL-v4 (Contrastive)', desc: 'Difference detection vs baseline' },
    { id: 'gmm', name: 'GMM (Probabilistic)', desc: 'Gaussian cluster separation' },
    { id: 'kmeans', name: 'K-Means (Centroid)', desc: 'Distance-based clustering' },
    { id: 'dbscan', name: 'DBSCAN (Density)', desc: 'Density-based noise isolation' },
    { id: 'iso_forest', name: 'Iso Forest (Tree)', desc: 'Isolation-based outliers' },
    { id: 'lof', name: 'LOF (Neighbor)', desc: 'Local density outlier detection' },
    { id: 'pca', name: 'PCA (Variance)', desc: 'Signal energy transformation' },
  ];

  const triggerClean = async () => {
    setIsCleaning(true);
    gsap.to(".matrix-row", { backgroundColor: "rgba(16, 185, 129, 0.1)", x: 10, stagger: 0.005, duration: 0.2, yoyo: true, repeat: 1 });

    try {
      const eadMeans = data.map(d => d.EDA_Mean);
      const response = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raw_data: eadMeans,
          mode: mlMode,
          techniques: selectedTechs
        })
      });

      if (!response.ok) throw new Error("Backend Node Unreachable");
      const result = await response.json();

      const updatedData = data.map((d, i) => ({
        ...d,
        SCL_Tonic: result.refined_data[i],
        // SYNC WITH BACKEND SENSITIVITY: Lowered to 0.01
        Motion: Math.abs(result.refined_data[i] - d.EDA_Mean) > 0.01 ? 1 : 0
      }));

      setData(updatedData);

      const newTrial = {
        id: auditReports.length + 1,
        mode: mlMode,
        techs: [...selectedTechs],
        metrics: result.metrics,
        timestamp: new Date().toLocaleTimeString()
      };
      setAuditReports(prev => [newTrial, ...prev]);

      setTimeout(() => { setIsCleaning(false); setShowCleansed(true); }, 1500);
    } catch (err) {
      console.error("ML Error:", err);
      // Record a failed trial so the Auditor can provide feedback
      const failedTrial = {
        id: auditReports.length + 1,
        mode: mlMode,
        techs: [...selectedTechs],
        metrics: { smoothness_score: 0, noise_suppression: 0, stability_index: 0 },
        timestamp: new Date().toLocaleTimeString(),
        error: true
      };
      setAuditReports(prev => [failedTrial, ...prev]);
      setTimeout(() => { setIsCleaning(false); setShowCleansed(true); }, 2500);
    }
  };

  const [isBenchmarking, setIsBenchmarking] = useState(false);

  const runBruteForceInquiry = async () => {
    if (!rawData.length) return;
    setIsBenchmarking(true);
    setIsAuditorOpen(true);
    try {
      const eadMeans = rawData.map(d => d.EDA_Mean);
      const res = await fetch('http://127.0.0.1:8000/benchmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_data: eadMeans })
      });
      if (!res.ok) throw new Error("Benchmark failed");
      const benchmarkResults = await res.json();

      const benchmarkTrials = (benchmarkResults.results || []).map((r: any, idx: number) => ({
        id: `B-${idx + 1}`,
        mode: r.mode,
        techs: r.techs,
        metrics: r.metrics,
        timestamp: 'BENCHMARK',
        total_score: r.total_score
      }));

      setAuditReports(benchmarkTrials);
      setIsLabConfigOpen(false);
    } catch (err) {
      console.error("Benchmark Error:", err);
    } finally {
      setIsBenchmarking(false);
    }
  };

  const resetSelection = () => {
    setShowCleansed(false);
    setData(rawData);
  };

  const selectSoloAlgo = (id: string) => {
    setMlMode('solo');
    setSelectedTechs([id]);
    resetSelection();
    setIsSoloMenuOpen(false);
  };

  return (
    <div className="h-screen w-screen text-white p-6 font-sans overflow-hidden relative bg-[#020617] flex flex-col">
      <ForensicAtmosphere />

      <AnimatePresence mode="wait">
        {stage === 'selection' ? (
          <motion.div key="gate" variants={pageEntrance} initial="initial" animate="animate" exit="exit" className="flex-1 flex flex-col items-center justify-center gap-12 relative z-10">
            <motion.div variants={slideFromBottom} className="text-center relative">
              <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none select-none drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                Signal <span className="text-blue-600">Forge.</span>
              </h1>
              <p className="text-slate-500 font-bold uppercase tracking-[0.6em] text-[9px] mt-6 italic opacity-60">Forensic Biometric Reconstruction Station</p>
            </motion.div>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <motion.div variants={slideFromLeft} whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
                <UploadCard title="Subject Lab" icon={<User size={32} />} onUpload={handleFileUpload} color="blue" subtitle="Individual Trace" />
              </motion.div>
              <div className="hidden md:block w-[1px] h-20 bg-white/5" />
              <motion.div variants={slideFromRight} whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
                <UploadCard title="Group Matrix" icon={<Users size={32} />} onUpload={handleFileUpload} color="emerald" subtitle="Multi-Subject study" />
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="lab" variants={pageEntrance} initial="initial" animate="animate" exit="exit" className="h-full flex flex-col relative z-20">
            <motion.header variants={slideFromBottom} className="flex justify-between items-center mb-6 border-b border-white/5 pb-4 backdrop-blur-md shrink-0 relative z-[200]">
              <div className="flex items-center gap-6">
                <button onClick={() => { setStage('selection'); setShowCleansed(false); }} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 border border-white/10 transition-all group">
                  <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-700" />
                </button>
                <div className="flex items-center gap-6">
                  <div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white leading-none">Station <span className="text-blue-600">01</span></h2>
                  </div>

                  <div className="h-8 w-[1px] bg-white/10 mx-2" />

                  {/* SOLO MODE DROPDOWN */}
                  <div className="relative">
                    <button
                      onClick={() => { setIsSoloMenuOpen(!isSoloMenuOpen); setIsHybridMenuOpen(false); }}
                      className={`flex items-center gap-3 px-6 py-2.5 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${mlMode === 'solo' ? 'bg-blue-600 text-white border-blue-400' : 'bg-white/5 border-white/10 text-slate-400'}`}
                    >
                      {mlMode === 'solo' ? algorithms.find(a => a.id === selectedTechs[0])?.name || 'Solo Mode' : 'Solo Mode'}
                      <ChevronDown size={14} className={`transition-transform ${isSoloMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isSoloMenuOpen && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 mt-3 w-64 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[150] backdrop-blur-3xl">
                          {algorithms.map(algo => (
                            <button key={algo.id} onClick={() => selectSoloAlgo(algo.id)} className="w-full px-5 py-3 text-left hover:bg-blue-600/20 transition-all border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-400 flex items-center justify-between">
                              {algo.name} {selectedTechs[0] === algo.id && mlMode === 'solo' && <CheckCircle2 size={12} className="text-blue-500" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* HYBRID MODE DROPDOWN / WINDOW TRIGGER */}
                  <div className="relative">
                    <button
                      onClick={() => { setIsHybridMenuOpen(!isHybridMenuOpen); setIsSoloMenuOpen(false); }}
                      className={`flex items-center gap-3 px-6 py-2.5 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${mlMode === 'hybrid' ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-white/5 border-white/10 text-slate-400'}`}
                    >
                      Hybrid Mode
                      <ChevronDown size={14} className={`transition-transform ${isHybridMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isHybridMenuOpen && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 mt-3 w-72 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl p-5 z-[150] backdrop-blur-3xl">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-4 border-b border-white/5 pb-2">Ensemble Reconstruction</h4>
                          <p className="text-[8px] text-slate-500 mb-6 leading-relaxed">Combine multiple neural architectures for high-precision signal healing. Click below to open the Laboratory Configuration.</p>
                          <button
                            onClick={() => { setMlMode('hybrid'); setIsLabConfigOpen(true); setIsHybridMenuOpen(false); resetSelection(); }}
                            className="w-full py-3 bg-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg flex items-center justify-center gap-2"
                          >
                            <Settings2 size={14} /> Configure Lab
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setView3D(!view3D)} className="px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 transition-all bg-white/5 hover:bg-blue-600 flex items-center gap-3">
                  {view3D ? <LayoutPanelTop size={14} /> : <Box size={14} />} {view3D ? "2D View" : "3D View"}
                </button>
                <button onClick={triggerClean} disabled={isCleaning} className="px-7 py-2.5 bg-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105 transition-all flex items-center gap-3">
                  {isCleaning ? <Sparkles className="animate-spin" size={14} /> : <Zap size={14} />} {isCleaning ? "Computing..." : "Run Reconstruct"}
                </button>
              </div>
            </motion.header>

            <div className="flex-1 grid lg:grid-cols-10 gap-6 min-h-0 pb-4">
              {/* LEFT: MASTER DATA TABLE (60%) */}
              <motion.div variants={slideFromLeft} className="lg:col-span-6 flex flex-col min-h-0">
                <div className="bg-slate-900/40 border border-white/5 rounded-[40px] flex-1 overflow-hidden backdrop-blur-3xl shadow-2xl flex flex-col">
                  <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                      <Activity className="text-blue-500" size={20} />
                      <h3 className="text-xl font-black italic uppercase tracking-tighter">Master <span className="text-blue-500">Matrix</span></h3>
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">Biometric Trace Buffer</div>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                    <table className="w-full text-left font-bold text-[10px] border-collapse min-w-[800px]">
                      <thead className="sticky top-0 bg-[#070b15] z-30 border-b border-white/10 shadow-xl">
                        <tr>
                          <th className="p-6 text-slate-500 uppercase tracking-widest">Node ID</th>
                          <th className="p-6 text-center text-slate-500 uppercase tracking-widest">Win</th>
                          <th className="p-6 text-center text-slate-500 uppercase tracking-widest">Conductance</th>
                          <th className="p-6 text-center text-slate-500 uppercase tracking-widest">Peaks</th>
                          <th className="p-6 text-center text-slate-500 uppercase tracking-widest">Entropy</th>
                          <th className="p-6 text-center text-slate-500 uppercase tracking-widest">Energy</th>
                          <th className="p-6 text-right text-slate-500 uppercase tracking-widest">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {data.map((row) => (
                          <tr key={row.Win} onMouseEnter={() => setHoveredRow(row)} className={`matrix-row group transition-all cursor-crosshair hover:bg-white/[0.03] ${row.Win === hoveredRow?.Win ? 'bg-blue-600/10' : ''}`}>
                            <td className="p-5 font-mono opacity-40 italic">{row.User_ID}</td>
                            <td className="p-5 text-center font-black">{row.Win}</td>
                            <td className="p-5 text-center font-mono transition-all">
                              {showCleansed ? (
                                <span className={row.EDA_Mean !== row.SCL_Tonic ? "text-emerald-400 font-black" : "text-blue-400"}>
                                  {row.SCL_Tonic.toFixed(4)}
                                </span>
                              ) : (
                                <span className="text-blue-400">{row.EDA_Mean.toFixed(4)}</span>
                              )}
                            </td>
                            <td className="p-5 text-center font-mono opacity-70">{row.SCR_Peaks}</td>
                            <td className="p-5 text-center font-mono text-purple-400">{row.Entropy.toFixed(3)}</td>
                            <td className="p-5 text-center font-mono opacity-50">{row.HF_Energy.toFixed(4)}</td>
                            <td className="p-5 text-right">
                              {showCleansed && row.Motion === 1 ? (
                                <span className="text-emerald-500 font-black flex items-center justify-end gap-2 text-[9px] animate-pulse">
                                  <CheckCircle2 size={12} /> HEALED
                                </span>
                              ) : row.Motion === 1 ? (
                                <span className="text-red-500 font-black text-[9px] tracking-widest animate-pulse">ARTIFACT</span>
                              ) : (
                                <span className="text-slate-600 opacity-30 text-[9px] font-black uppercase">Nominal</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>

              {/* RIGHT: MAP & METRICS (40%) */}
              <motion.div variants={slideFromRight} className="lg:col-span-4 flex flex-col gap-6 min-h-0">
                {/* BIG MAP / GRAPH */}
                <div className="bg-slate-900/40 border border-white/5 rounded-[40px] flex-[3.2] relative overflow-hidden backdrop-blur-3xl shadow-2xl flex flex-col min-h-0">
                  <div className="absolute top-6 left-6 z-40 flex gap-2">
                    <button onClick={() => setShow3DLegend(!show3DLegend)} className="p-2.5 bg-black/40 hover:bg-blue-600 rounded-xl transition-all border border-white/10 shadow-xl backdrop-blur-md">
                      {show3DLegend ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {!view3D ? (
                    <div className="flex-1 p-6 flex items-center justify-center">
                      <XYPlotWithLabels data={data} showCleansed={showCleansed} setHoveredRow={setHoveredRow} />
                    </div>
                  ) : (
                    <div className="flex-1 relative">
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

                {/* SMALL METRICS */}
                <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl flex-[1.5] shrink-0 min-h-[200px]">
                  <Fingerprint className="absolute -bottom-16 -right-16 text-white opacity-[0.02] rotate-12" size={250} />
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-blue-500 flex items-center gap-3">
                      <Database size={16} /> Forensic Metrics
                    </h3>
                    {hoveredRow?.Motion === 1 && <div className="text-red-500 bg-red-500/10 px-3 py-1 rounded-full text-[9px] font-black border border-red-500/20 animate-pulse shadow-lg shadow-red-500/20">ANOMALY DETECTED</div>}
                  </div>
                  <div className="grid grid-cols-2 gap-8 relative z-10">
                    <StatBox label="Subject" value={hoveredRow ? `${hoveredRow.Age}/${hoveredRow.Gen}` : '--'} />
                    <StatBox label="Mean Cond" value={hoveredRow ? hoveredRow.EDA_Mean.toFixed(3) : '0.000'} />
                    <StatBox label="Peak Amplitude" value={hoveredRow ? hoveredRow.SCR_Amp.toFixed(3) : '0.000'} />
                    <StatBox label="Stability" value={hoveredRow ? hoveredRow.Entropy.toFixed(2) : '0.00'} color={hoveredRow && hoveredRow.Entropy > 2.5 ? "text-red-500" : "text-emerald-500"} />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HYBRID LAYOUT CONFIGURATION FLOATING WINDOW */}
      <AnimatePresence>
        {isLabConfigOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none p-10"
          >
            <div className="absolute inset-0 bg-black/60 pointer-events-auto" onClick={() => setIsLabConfigOpen(false)} />
            <div className="w-[600px] bg-[#020617] border border-emerald-500/30 rounded-[50px] shadow-[0_40px_100px_rgba(0,0,0,0.9)] pointer-events-auto overflow-hidden flex flex-col max-h-[85vh] relative z-20">
              <div className="p-10 border-b border-white/5 flex justify-between items-center bg-emerald-600/10">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-600 p-3 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <Layers size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">Laboratory <span className="text-emerald-500">Configuration</span></h3>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Ensemble Model Orchestrator</p>
                  </div>
                </div>
                <button onClick={() => setIsLabConfigOpen(false)} className="p-3 hover:bg-white/10 rounded-full transition-all text-slate-500 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="p-10 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid grid-cols-2 gap-4">
                  {algorithms.map(algo => (
                    <button
                      key={algo.id}
                      onClick={() => {
                        setSelectedTechs(prev => prev.includes(algo.id) ? (prev.length > 1 ? prev.filter(t => t !== algo.id) : prev) : [...prev, algo.id]);
                        resetSelection();
                      }}
                      className={`p-6 rounded-[32px] border transition-all text-left relative group ${selectedTechs.includes(algo.id) ? 'bg-emerald-600/10 border-emerald-500/50' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                    >
                      <div className={`w-3 h-3 rounded-full absolute top-6 right-6 ${selectedTechs.includes(algo.id) ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-slate-700'}`} />
                      <h4 className={`text-[11px] font-black uppercase tracking-widest mb-2 ${selectedTechs.includes(algo.id) ? 'text-white' : 'text-slate-500'}`}>{algo.name}</h4>
                      <p className="text-[8px] text-slate-500 font-bold leading-relaxed opacity-60 group-hover:opacity-100">{algo.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-[#0f172a] border-t border-white/5 text-center px-10">
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsLabConfigOpen(false)}
                    className="flex-1 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-4"
                  >
                    <CheckCircle2 size={18} /> Confirm {selectedTechs.length} Models
                  </button>
                  <button
                    onClick={runBruteForceInquiry}
                    disabled={isBenchmarking}
                    className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] transition-all shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center justify-center gap-4"
                  >
                    {isBenchmarking ? <RefreshCw className="animate-spin" size={18} /> : <BarChartHorizontal size={18} />}
                    {isBenchmarking ? "Calibrating 127 Nodes..." : "Benchmark All"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING AUDITOR INTELLIGENCE */}
      <AnimatePresence>
        {isAuditorOpen && stage === 'laboratory' && (
          <motion.div initial={{ opacity: 0, y: 100, scale: 0.9, x: 50 }} animate={{ opacity: 1, y: 0, scale: 1, x: 0 }} exit={{ opacity: 0, y: 100, scale: 0.9, x: 50 }}
            className="fixed bottom-28 right-8 w-[440px] h-[78vh] bg-[#020617]/95 border border-blue-500/30 rounded-[50px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl z-[100] flex flex-col overflow-hidden border-b-2 border-b-blue-600/50"
          >
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-blue-600/5">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-2 rounded-xl"><BrainCircuit size={18} className="text-white" /></div>
                <div><h3 className="text-sm font-black uppercase tracking-tighter">Forensic <span className="text-blue-500">Auditor</span></h3><p className="text-[7px] text-slate-500 font-black uppercase tracking-widest">Decision Integrity Engine</p></div>
              </div>
              <button onClick={() => setIsAuditorOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-all text-slate-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8 pb-4">
              {auditReports.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                  <Search size={48} className="mb-4" />
                  <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed">Awaiting neural telemetry...</p>
                </div>
              ) : (
                <>
                  {/* GLOBAL RANKING LEADERBOARD TABLE */}
                  <div className="bg-[#1e293b]/40 border border-emerald-500/20 rounded-[40px] relative overflow-hidden backdrop-blur-xl shrink-0">
                    <div className="absolute -top-3 left-8 px-4 py-1.5 bg-emerald-600 rounded-full text-[8px] font-black uppercase tracking-widest text-white shadow-xl flex items-center gap-2">
                      <Award size={10} /> Neural Champion Leaderboard
                    </div>
                    <div className="p-8 pt-12">
                      <table className="w-full text-[9px] uppercase font-black tracking-widest">
                        <thead>
                          <tr className="text-slate-500 border-b border-white/5 text-[8px]">
                            <th className="pb-4 text-left">Rank</th>
                            <th className="pb-4 text-left">Config</th>
                            <th className="pb-4 text-center">Stab</th>
                            <th className="pb-4 text-center">Smooth</th>
                            <th className="pb-4 text-center">Clean</th>
                            <th className="pb-4 text-right relative group cursor-help">
                              Score
                              <div className="absolute top-6 right-0 w-36 bg-[#7c3aed] border border-white/20 p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-2xl z-50 text-[7px] text-white font-mono normal-case tracking-tight leading-relaxed">
                                Neural Logic Weighting:<br />
                                <span className="text-[10px] text-purple-200 mt-1 block">(Stab × 10) + Smooth</span>
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono text-[8px]">
                          {auditReports
                            .filter(r => !r.error)
                            .sort((a, b) => {
                              const scoreA = a.total_score || (a.metrics.stability_index * 10 + a.metrics.smoothness_score);
                              const scoreB = b.total_score || (b.metrics.stability_index * 10 + b.metrics.smoothness_score);
                              return scoreB - scoreA;
                            })
                            .map((r, idx) => (
                              <tr key={r.id} className={`${idx === 0 ? 'bg-emerald-400/10 border-l-2 border-emerald-500' : ''} hover:bg-white/[0.05] transition-all group`}>
                                <td className={`py-3 pl-3 ${idx === 0 ? 'text-emerald-400 font-black' : 'text-slate-500'}`}>
                                  {idx === 0 ? <Award size={10} className="inline mr-1" /> : `#${idx + 1}`}
                                </td>
                                <td className="py-3">
                                  <div className="flex flex-col gap-0.5">
                                    <span className={`text-[7px] font-black uppercase tracking-tighter ${r.mode === 'hybrid' ? 'text-emerald-500' : 'text-blue-500'}`}>{r.mode} (T-{r.id})</span>
                                    <div className="flex gap-1 flex-wrap text-white/40">
                                      {r.techs.slice(0, 2).map((t: any) => <span key={t}>[{t.toUpperCase()}]</span>)}
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 text-center text-purple-400/80">{(r.metrics.stability_index ?? 0).toFixed(1)}</td>
                                <td className="py-3 text-center text-amber-400/80">{r.metrics.smoothness_score?.toFixed(0)}%</td>
                                <td className="py-3 text-center text-blue-400/80">{(r.metrics.noise_suppression / 10).toFixed(1)}k</td>
                                <td className="py-3 text-right text-white pr-3 font-black text-[10px] group-hover:text-emerald-400 transition-colors">
                                  {(r.total_score || (r.metrics.stability_index * 10 + r.metrics.smoothness_score)).toFixed(1)}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                      {auditReports.length > 30 && (
                        <div className="mt-4 text-center text-[7px] text-slate-600 font-black uppercase tracking-widest animate-pulse">
                          + {auditReports.length - 30} Additional Neural Nodes Indexed
                        </div>
                      )}
                    </div>
                  </div>

                  {/* TRIAL CHRONOLOGY STREAM */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] pl-4">Session Chronology</h4>
                    {auditReports.slice(0, 50).map((report) => (
                      <div key={report.id} className={`bg-white/5 border p-6 rounded-[30px] hover:border-blue-500/30 transition-all relative overflow-hidden ${report.error ? 'border-red-500/30 opacity-60' : (report.id === bestTrialId ? 'border-emerald-500/50 bg-emerald-500/[0.03] shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'border-white/5')}`}>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            Trial #{report.id} {report.error && <ShieldAlert size={10} className="text-red-500" />}
                          </span>
                          <span className="text-[8px] font-black text-blue-500 italic">{report.timestamp}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                          <span className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest border ${report.mode === 'hybrid' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                            {report.mode}
                          </span>
                          {report.techs.map((t: string) => (
                            <span key={t} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[7px] font-black uppercase tracking-widest text-slate-400">
                              {t}
                            </span>
                          ))}
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <PerformanceMetric label="Smooth" value={report.metrics.smoothness_score} unit="%" color={report.error ? "text-slate-600" : (report.metrics.smoothness_score > 70 ? "text-emerald-500" : "text-amber-500")} />
                          <PerformanceMetric label="Cleaned" value={(report.metrics.noise_suppression / 10).toFixed(1)} unit="k" color={report.error ? "text-slate-600" : "text-blue-500"} />
                          <PerformanceMetric label="Stab" value={report.metrics.stability_index?.toFixed(1)} unit="" color={report.error ? "text-slate-600" : (report.metrics.stability_index > 2 ? "text-purple-500" : "text-slate-400")} />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* FIXED VERDICT FOOTER "OUT OF THE BOX" AESTHETIC */}
            <div className="p-8 bg-[#020617] border-t-2 border-blue-600/30 backdrop-blur-3xl shrink-0 mt-auto shadow-[0_-20px_60px_rgba(0,0,0,0.95)] relative z-50">
              <div className="absolute -top-3.5 left-10 px-5 py-2 bg-blue-600 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Neural Verdict
              </div>
              <div className="pt-4">
                <p className="text-[13px] text-blue-100 font-bold italic leading-relaxed">
                  {auditReports.some(r => r.error)
                    ? "Scientist, a neural synchronization error occurred. Re-initiate the bridge."
                    : bestTrialId
                      ? `Verification complete. Trial #${bestTrialId} identified as the **${auditReports.find(r => r.id === bestTrialId)?.mode.toUpperCase()}** champion. Signal stability is verified.`
                      : "Awaiting telemetry input... Benchmark all combinations for cognitive dominance."
                  }
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {stage === 'laboratory' && (
        <motion.button initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }} onClick={() => setIsAuditorOpen(!isAuditorOpen)}
          className={`fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.4)] z-[101] flex items-center justify-center transition-all ${isAuditorOpen ? 'bg-red-600 rotate-90 shadow-red-500/40' : 'bg-blue-600 hover:bg-blue-500'}`}
        >
          {isAuditorOpen ? <X size={28} className="text-white" /> : <BrainCircuit size={28} className="text-white" />}
          {!isAuditorOpen && auditReports.length > 0 && (<div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-4 border-[#020617] text-[10px] font-black flex items-center justify-center animate-bounce shadow-lg">{auditReports.length}</div>)}
        </motion.button>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---
function XYPlotWithLabels({ data, showCleansed, setHoveredRow }: { data: EDAData[], showCleansed: boolean, setHoveredRow: any }) {
  const [activeTip, setActiveTip] = useState<EDAData | null>(null);
  if (!data.length) return null;
  const padding = 70; const width = 800; const height = 300;
  const maxEDA = Math.max(...data.map(d => d.EDA_Mean)) * 1.3;

  const points = data.map((d) => ({
    x: padding + (parseInt(d.Win) * (width - 2 * padding) / (data.length - 1)),
    yRaw: height - padding - (d.EDA_Mean * (height - 2 * padding) / maxEDA),
    yClean: height - padding - (d.SCL_Tonic * (height - 2 * padding) / maxEDA),
    original: d
  }));

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;

    // Find nearest point based on X coordinate
    let nearest = points[0];
    let minDist = Math.abs(points[0].x - mouseX);

    points.forEach(p => {
      const d = Math.abs(p.x - mouseX);
      if (d < minDist) {
        minDist = d;
        nearest = p;
      }
    });

    if (minDist < 50) { // Snap range
      setActiveTip(nearest.original);
      setHoveredRow(nearest.original);
    } else {
      setActiveTip(null);
    }
  };

  return (
    <div className="relative w-full h-full min-h-0">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setActiveTip(null)}
      >
        <rect width={width} height={height} fill="transparent" />
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <g key={v}>
            <text x={padding - 30} y={height - padding - (v * (height - 2 * padding))} fill="rgba(255,255,255,0.2)" fontSize="8" textAnchor="end" className="font-mono">{(v * maxEDA).toFixed(1)}</text>
            <line x1={padding} y1={height - padding - (v * (height - 2 * padding))} x2={width - padding} y2={height - padding - (v * (height - 2 * padding))} stroke="rgba(255,255,255,0.05)" />
          </g>
        ))}
        <motion.path d={`M ${points.map(p => `${p.x},${p.yRaw}`).join(" L ")}`} fill="none" stroke={showCleansed ? "rgba(239, 68, 68, 0.15)" : "#ef4444"} strokeWidth="2.5" />
        {showCleansed && <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} d={`M ${points.map(p => `${p.x},${p.yClean}`).join(" L ")}`} fill="none" stroke="#10b981" strokeWidth="5" strokeLinecap="round" className="drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]" />}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={showCleansed ? p.yClean : p.yRaw}
            r={activeTip?.Win === p.original.Win ? 8 : 4}
            fill={showCleansed ? "#10b981" : (p.original.Motion === 1 ? "#ef4444" : "#3b82f6")}
            className="transition-all duration-200 pointer-events-none"
          />
        ))}
      </svg>
      <AnimatePresence>
        {activeTip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300, mass: 0.5 }}
            className="absolute z-50 p-6 bg-[#0f172a]/90 border border-blue-500/40 rounded-3xl shadow-2xl pointer-events-none backdrop-blur-2xl"
            style={{ left: padding + 30, top: 40 }}
          >
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1 italic">Win {activeTip.Win}</p>
            <p className="text-3xl font-mono font-black text-white">{activeTip.EDA_Mean.toFixed(4)} <span className="text-[10px] text-slate-500 uppercase ml-1">μS</span></p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ThreeDForensicHUD({ data, showCleansed, onHover, showLegend }: { data: EDAData[], showCleansed: boolean, onHover: any, showLegend: boolean }) {
  const [active3DNode, setActive3DNode] = useState<EDAData | null>(null);
  const rawPoints = useMemo(() => data.map((d, i) => new THREE.Vector3(i * 2.5 - (data.length * 1.25), (d.EDA_Mean * 2.5) - 8, d.Entropy * 4.5)), [data]);
  const cleanPoints = useMemo(() => data.map((d, i) => new THREE.Vector3(i * 2.5 - (data.length * 1.25), (d.Motion === 1 ? d.SCL_Tonic : d.EDA_Mean) * 2.5 - 8, d.Entropy * 4.5)), [data]);

  return (
    <group>
      <AnimatePresence>
        {showLegend && (
          <Html position={[-(data.length * 1.25), 18, 0]} center>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-black/80 p-5 rounded-[25px] border border-white/10 backdrop-blur-xl min-w-[180px] shadow-2xl space-y-3">
              <div className="flex items-center gap-3"><div className="w-3 h-0.5 bg-blue-500" /><span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">X: Timeline</span></div>
              <div className="flex items-center gap-3"><div className="w-3 h-0.5 bg-emerald-500" /><span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Y: Conductance</span></div>
              <div className="flex items-center gap-3"><div className="w-3 h-0.5 bg-purple-500" /><span className="text-[10px] font-black uppercase text-purple-400 tracking-widest">Z: Entropy</span></div>
            </motion.div>
          </Html>
        )}
      </AnimatePresence>
      <group position={[-(data.length * 1.25), -8, 0]}>
        {[0, 2, 4, 6].map((v) => (
          <Html key={v} position={[-5, v * 2.5, 0]} center><span className="text-[8px] text-white/30 font-black italic tracking-[0.3em]">{v}μS</span></Html>
        ))}
        <Line points={[[0, 0, 0], [data.length * 2.5, 0, 0]]} color="#3b82f6" lineWidth={2} transparent opacity={0.3} />
        <Line points={[[0, 0, 0], [0, 22, 0]]} color="#10b981" lineWidth={2} transparent opacity={0.3} />
        <Line points={[[0, 0, 0], [0, 0, 30]]} color="#a855f7" lineWidth={2} transparent opacity={0.3} />
      </group>
      <Line points={rawPoints} color="#ef4444" lineWidth={showCleansed ? 2 : 10} transparent opacity={showCleansed ? 0.1 : 0.85} />
      {showCleansed && <Line points={cleanPoints} color="#10b981" lineWidth={10} transparent opacity={1} />}
      {data.map((d, i) => {
        const isHoveredNode = active3DNode?.Win === d.Win;
        const yCoord = (showCleansed && d.Motion === 1 ? d.SCL_Tonic : d.EDA_Mean) * 2.5 - 8;
        return (
          <mesh key={i} position={[i * 2.5 - (data.length * 1.25), yCoord, d.Entropy * 4.5]}
            onPointerOver={() => { setActive3DNode(d); onHover(d); }} onPointerOut={() => setActive3DNode(null)}
          >
            <sphereGeometry args={[isHoveredNode ? 0.4 : 0.2, 20, 20]} />
            <meshStandardMaterial color={showCleansed ? "#10b981" : (d.Motion === 1 ? "#ef4444" : "#3b82f6")} emissive={showCleansed ? "#10b981" : (d.Motion === 1 ? "#ef4444" : "#3b82f6")} emissiveIntensity={isHoveredNode ? 8 : 2} />
            {isHoveredNode && (
              <Html distanceFactor={12} position={[0, 2.5, 0]} center>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#020617]/95 border border-blue-500/50 p-6 rounded-[30px] shadow-2xl backdrop-blur-3xl min-w-[200px]">
                  <p className="text-[10px] font-black text-blue-400 uppercase italic mb-3 tracking-widest">Trace: Win {d.Win}</p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[11px] font-mono"><span className="text-slate-500 font-bold uppercase tracking-widest">Mean:</span> <span className="text-white font-black">{d.EDA_Mean.toFixed(5)}</span></div>
                    <div className="flex justify-between text-[11px] font-mono"><span className="text-slate-500 font-bold uppercase tracking-widest">Peaks:</span> <span className="text-white font-black">{d.SCR_Peaks}</span></div>
                  </div>
                </motion.div>
              </Html>
            )}
          </mesh>
        );
      })}
    </group>
  );
}

function UploadCard({ title, icon, onUpload, color, subtitle }: { title: string, icon: React.ReactNode, onUpload: any, color: string, subtitle: string }) {
  const accentBorder = color === 'blue' ? 'group-hover:border-blue-500/40' : 'group-hover:border-emerald-500/40';
  return (
    <label className="relative group cursor-pointer block">
      <input type="file" accept=".csv" onChange={onUpload} className="hidden" />
      <div className={`w-[400px] p-12 bg-slate-900/40 border border-white/5 rounded-[60px] backdrop-blur-3xl transition-all duration-500 ${accentBorder} hover:bg-slate-900/60 shadow-2xl`}>
        <div className="absolute inset-0 rounded-[60px] overflow-hidden pointer-events-none">
          <motion.div animate={{ top: ['-100%', '200%'] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} className="absolute left-0 w-full h-24 bg-gradient-to-b from-transparent via-white/[0.04] to-transparent" />
        </div>
        <div className={`${color === 'blue' ? 'text-blue-500' : 'text-emerald-500'} mb-10 transition-transform duration-700 group-hover:-translate-y-3`}>{icon}</div>
        <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-2 leading-none">{title}</h3>
        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest italic">{subtitle}</p>
        <div className="mt-14 flex items-center justify-between opacity-30 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Initialize Trace</span>
          <div className={`p-4 rounded-full bg-white/5 border border-white/10 ${color === 'blue' ? 'text-blue-400' : 'text-emerald-400'}`}><FileUp size={20} /></div>
        </div>
      </div>
    </label>
  );
}

function StatBox({ label, value, color = "text-white" }: { label: string, value: string | number, color?: string }) {
  return (
    <div className="flex flex-col">
      <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.25em] mb-2 leading-none">{label}</p>
      <p className={`text-2xl font-mono font-black tracking-tighter italic ${color}`}>{value}</p>
    </div>
  );
}

function PerformanceMetric({ label, value, unit, color }: { label: string, value: any, unit: string, color: string }) {
  return (
    <div className="text-center bg-black/40 p-3 rounded-2xl border border-white/5">
      <p className="text-[6px] text-slate-600 uppercase font-black mb-1">{label}</p>
      <p className={`text-[10px] font-mono font-black ${color}`}>
        {value}{unit}
      </p>
    </div>
  );
}
