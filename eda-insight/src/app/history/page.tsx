"use client";
import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Database, Search, Download, Trash2, ChevronRight, FileSpreadsheet,
  Activity, ShieldCheck, Clock, User, HardDrive, Terminal, 
  Zap, Radio, Microscope, RefreshCw, Layers, Cpu, CheckCircle2,
  Lock, MapPin, Table as TableIcon, Target, Gauge, ArrowDownToLine,
  ChevronLeft, LayoutDashboard, BarChart3, Binary
} from "lucide-react";

// --- 1. RESEARCH DATA DEFINITIONS ---
interface SignalFrame {
  timestamp: string;
  rawVal: number;
  purifiedVal: number;
  diagnosis: string | null;
}

interface BiometricSession {
  id: string;
  source: "Laboratory" | "Playground" | "Telemetry";
  subjectName: string;
  nodeLocation: string;
  startTime: string;
  integrityIndex: number;
  status: "Verified" | "Corrupt";
  dataset: SignalFrame[];
}

const RESEARCH_ARCHIVE: BiometricSession[] = [
  {
    id: "SF-NODE-0422",
    source: "Laboratory",
    subjectName: "Subject_A_Group1",
    nodeLocation: "Dorsal Phalanges",
    startTime: "2026-01-17 14:02",
    integrityIndex: 98.4,
    status: "Verified",
    dataset: Array.from({ length: 30 }, (_, i) => ({
      timestamp: `00:${i < 10 ? '0'+i : i}.4`,
      rawVal: 2.2 + Math.random() * (i === 12 ? 4 : 0.3),
      purifiedVal: 2.35,
      diagnosis: i === 12 ? "Electrode Pop" : null
    }))
  },
  {
    id: "SF-NODE-8812",
    source: "Playground",
    subjectName: "Sim_Node_X",
    nodeLocation: "Palmar Surface",
    startTime: "2026-01-17 09:15",
    integrityIndex: 22.1,
    status: "Corrupt",
    dataset: Array.from({ length: 30 }, (_, i) => ({
      timestamp: `00:${i < 10 ? '0'+i : i}.1`,
      rawVal: 3.0 + Math.random() * (i > 20 ? 5 : 0.6),
      purifiedVal: 3.1,
      diagnosis: i > 20 ? "Kinetic Jolt" : null
    }))
  }
];

// --- 2. PARTICLE SYSTEM ---
const NeuralDust = () => {
  const particles = useMemo(() => [...Array(45)].map((_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 1.5, duration: Math.random() * 20 + 10
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#010409]">
      {particles.map(p => (
        <motion.div
          key={p.id} className="absolute rounded-full bg-blue-500/10 shadow-[0_0_8px_rgba(59,130,246,0.1)]"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [0, -120], opacity: [0, 0.4, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#010409]" />
    </div>
  );
};

export default function SessionVault() {
  const [db, setDb] = useState<BiometricSession[]>(RESEARCH_ARCHIVE);
  const [activeId, setActiveId] = useState<string | null>(RESEARCH_ARCHIVE[0].id);
  const [activeView, setActiveView] = useState<"graphs" | "tables">("graphs");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const activeRecord = useMemo(() => db.find(r => r.id === activeId), [activeId, db]);
  const filtered = useMemo(() => db.filter(r => 
    (filter === "All" || r.source === filter) && 
    (r.subjectName.toLowerCase().includes(query.toLowerCase()) || r.id.includes(query))
  ), [db, query, filter]);

  return (
    <div className="h-screen w-full bg-[#010409] text-white overflow-hidden relative flex flex-col p-4 font-sans selection:bg-blue-500/30">
      <NeuralDust />

      <div className="max-w-[1800px] mx-auto w-full h-full flex flex-col relative z-10">
        
        {/* HEADER shrink-0 */}
        <div className="flex justify-between items-center mb-4 shrink-0 px-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-none flex items-center gap-3">
              <Database className="text-emerald-500" size={24}/>
              Forensic <span className="text-emerald-500">Vault.</span>
            </h1>
          </motion.div>

          <div className="flex gap-3 items-center">
             <div className="bg-slate-900/60 border border-white/5 px-4 py-2 rounded-xl flex items-center gap-4 backdrop-blur-xl">
                <HardDrive size={16} className="text-emerald-500"/>
                <span className="text-[10px] font-mono font-bold text-blue-400">{db.length} ARCHIVES</span>
             </div>
             <button onClick={() => setDb([])} className="p-2.5 bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all border border-red-500/20"><Trash2 size={16}/></button>
          </div>
        </div>

        {/* SEARCH BAR shrink-0 */}
        <div className="flex gap-4 mb-4 shrink-0">
            <div className="flex-1 bg-slate-900/40 border border-white/10 rounded-2xl px-6 py-3.5 flex items-center gap-4 focus-within:border-emerald-500/50 transition-all backdrop-blur-3xl shadow-inner">
                <Search size={18} className="text-slate-600"/>
                <input 
                    placeholder="Identify Subject or Node..." 
                    className="bg-transparent border-none outline-none w-full text-sm font-medium italic tracking-tight placeholder:text-slate-800 text-slate-200"
                    value={query} onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            <div className="flex gap-3 bg-slate-900/80 border border-white/5 p-1 rounded-2xl">
                {["All", "Laboratory", "Playground", "Telemetry"].map(t => (
                    <button key={t} onClick={() => setFilter(t)} className={`px-5 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-blue-600 text-white shadow-lg scale-105' : 'text-slate-500 hover:text-slate-300'}`}>{t}</button>
                ))}
            </div>
        </div>

        {/* MAIN WORKSTATION GRID */}
        <div className="flex-1 grid grid-cols-12 gap-4 overflow-hidden min-h-0 pb-2">
            
            {/* LEFT SIDE: SUBJECT NODES (25%) */}
            <div className="col-span-3 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar h-full">
                <AnimatePresence mode="popLayout">
                    {filter === "Telemetry" ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-20 text-center py-20 border border-white/5 rounded-3xl"><Radio size={40} className="mb-4 animate-pulse text-blue-500" /><p className="text-[8px] font-black uppercase tracking-widest">No Remote Link</p></div>
                    ) : (
                        filtered.map(r => (
                            <motion.div 
                                layout key={r.id} onClick={() => setActiveId(r.id)}
                                className={`group relative p-5 rounded-[30px] border transition-all cursor-pointer flex items-center justify-between overflow-hidden backdrop-blur-sm ${activeId === r.id ? 'bg-emerald-600/10 border-emerald-500/50 shadow-2xl scale-[1.02]' : 'bg-slate-900/40 border-white/5 hover:border-white/10'}`}
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${activeId === r.id ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-white/5 text-slate-700'}`}>
                                        {r.source === "Laboratory" ? <Microscope size={18}/> : <Zap size={18}/>}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black italic uppercase tracking-tighter leading-none mb-1">{r.subjectName}</h3>
                                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">{r.id}</span>
                                    </div>
                                </div>
                                <div className="text-right z-10"><span className={`text-sm font-black italic ${r.integrityIndex > 80 ? 'text-emerald-500' : 'text-red-500'}`}>{r.integrityIndex}%</span></div>
                                {activeId === r.id && <motion.div layoutId="nodeGlow" className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* RIGHT SIDE: DIAGNOSTIC SUITE (75%) */}
            <div className="col-span-9 bg-slate-950/80 border border-white/10 rounded-[45px] flex flex-col shadow-3xl overflow-hidden backdrop-blur-3xl h-full relative">
                
                <AnimatePresence mode="wait">
                    {activeRecord ? (
                        <motion.div key={activeRecord.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col p-8 relative">
                            
                            {/* SUITE HEADER */}
                            <div className="flex justify-between items-start mb-6 shrink-0 z-10">
                                <div>
                                    <div className="flex items-center gap-2 mb-1 text-blue-500">
                                        <ShieldCheck size={14}/><span className="text-[8px] font-black uppercase tracking-[0.4em]">Biometric Record Authenticated</span>
                                    </div>
                                    <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Diagnostic Suite.</h2>
                                    <p className="text-[8px] font-black text-slate-500 uppercase mt-2 italic tracking-widest flex items-center gap-3"><MapPin size={10} className="text-blue-500"/> {activeRecord.nodeLocation} // {activeRecord.startTime}</p>
                                </div>
                                <button className="px-6 py-3 bg-emerald-600 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-3xl"><Download size={16}/> Export Laboratory Bundle</button>
                            </div>

                            {/* NAVIGATION ARROWS FOR SLIDING PORTAL */}
                            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4 pointer-events-none z-20">
                                <button 
                                    onClick={() => setActiveView("graphs")}
                                    className={`pointer-events-auto p-3 rounded-full border border-white/10 backdrop-blur-md transition-all ${activeView === 'graphs' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-black/40 text-slate-600 hover:text-white'}`}
                                >
                                    <ChevronLeft size={20}/>
                                </button>
                                <button 
                                    onClick={() => setActiveView("tables")}
                                    className={`pointer-events-auto p-3 rounded-full border border-white/10 backdrop-blur-md transition-all ${activeView === 'tables' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-black/40 text-slate-600 hover:text-white'}`}
                                >
                                    <ChevronRight size={20}/>
                                </button>
                            </div>

                            {/* THE SLIDING CONTENT AREA */}
                            <div className="flex-1 overflow-hidden relative">
                                <AnimatePresence mode="wait">
                                    {activeView === "graphs" ? (
                                        <motion.div 
                                            key="graphs"
                                            initial={{ x: -100, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: 100, opacity: 0 }}
                                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                            className="h-full flex flex-col gap-6"
                                        >
                                            {/* RAW GRAPH */}
                                            <div className="flex-1 bg-black/90 rounded-[35px] p-6 border border-white/5 relative overflow-hidden group shadow-inner">
                                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                                                <div className="relative z-10 flex items-center justify-between mb-4 opacity-40 group-hover:opacity-100 transition-all">
                                                    <div className="flex items-center gap-3 text-red-500"><Activity size={14}/><span className="text-[9px] font-black uppercase tracking-widest italic text-slate-400">Forensic Input: Raw Corrupted Signal</span></div>
                                                    <span className="text-[8px] font-mono text-slate-600">Scale: 0-10 μS</span>
                                                </div>
                                                <svg viewBox="0 0 400 100" className="w-full h-full relative z-10 overflow-visible" preserveAspectRatio="none">
                                                    <defs>
                                                        <linearGradient id="rawGrad" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                                                            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                                                        </linearGradient>
                                                    </defs>
                                                    {[25, 50, 75].map(y => <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="white" strokeWidth="0.1" opacity="0.1" />)}
                                                    <path d={`M 0,100 L ${activeRecord.dataset.map((d, i) => `${i * 14},${90 - (d.rawVal * 12)}`).join(" L ")} L 400,100 Z`} fill="url(#rawGrad)" />
                                                    <path d={`M 0,100 L ${activeRecord.dataset.map((d, i) => `${i * 14},${90 - (d.rawVal * 12)}`).join(" L ")}`} fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 2" />
                                                </svg>
                                            </div>

                                            {/* PURIFIED GRAPH */}
                                            <div className="flex-1 bg-black/90 rounded-[35px] p-6 border border-white/5 relative overflow-hidden group shadow-inner">
                                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                                                <div className="relative z-10 flex items-center justify-between mb-4 opacity-40 group-hover:opacity-100 transition-all">
                                                    <div className="flex items-center gap-3 text-emerald-500"><Target size={14}/><span className="text-[9px] font-black uppercase tracking-widest italic text-slate-400">Purified Bio-Potential (Neural Cleaned)</span></div>
                                                    <span className="text-[8px] font-mono text-emerald-500 font-black">Confidence: 99.82%</span>
                                                </div>
                                                <svg viewBox="0 0 400 100" className="w-full h-full relative z-10 overflow-visible" preserveAspectRatio="none">
                                                    <defs>
                                                        <linearGradient id="pureGrad" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                                                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                                        </linearGradient>
                                                    </defs>
                                                    {[25, 50, 75].map(y => <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="white" strokeWidth="0.1" opacity="0.1" />)}
                                                    <path d={`M 0,100 L ${activeRecord.dataset.map((d, i) => `${i * 14},${90 - (d.purifiedVal * 12)}`).join(" L ")} L 400,100 Z`} fill="url(#pureGrad)" />
                                                    <path d={`M 0,100 L ${activeRecord.dataset.map((d, i) => `${i * 14},${90 - (d.purifiedVal * 12)}`).join(" L ")}`} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            key="tables"
                                            initial={{ x: 100, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: -100, opacity: 0 }}
                                            className="h-full bg-white/[0.02] border border-white/5 rounded-[40px] p-8 flex flex-col overflow-hidden shadow-2xl"
                                        >
                                            <div className="flex items-center gap-4 mb-6 shrink-0">
                                                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 border border-emerald-500/20"><TableIcon size={20}/></div>
                                                <div>
                                                    <h4 className="text-xl font-black italic uppercase tracking-tighter text-white leading-none">Biometric Ledger</h4>
                                                    <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mt-1 italic">Laboratory grade frame comparison</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 pb-4">
                                                <table className="w-full text-left border-collapse">
                                                    <thead className="sticky top-0 bg-[#0a0a0a] z-30 shadow-lg">
                                                        <tr className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 border-b border-white/10">
                                                            <th className="pb-6">Sync Time</th>
                                                            <th className="pb-6">Raw (μS)</th>
                                                            <th className="pb-6">Neural (μS)</th>
                                                            <th className="pb-6 text-right">Dossier Diagnosis</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="text-[12px] font-mono italic text-slate-300">
                                                        {activeRecord.dataset.map((frame, i) => (
                                                            <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                                                                <td className="py-5 text-slate-500 font-bold group-hover:text-blue-400 transition-colors uppercase tracking-widest">{frame.timestamp}</td>
                                                                <td className={`py-5 font-black ${frame.rawVal !== frame.purifiedVal ? 'text-red-400' : 'text-slate-500'}`}>{frame.rawVal.toFixed(4)}</td>
                                                                <td className="py-5 text-emerald-400 font-black tracking-tighter">{frame.purifiedVal.toFixed(4)}</td>
                                                                <td className="py-5 text-right">
                                                                    {frame.diagnosis ? (
                                                                        <span className="px-4 py-1.5 bg-red-600/10 text-red-500 border border-red-500/20 rounded-xl text-[8px] font-black uppercase tracking-tighter shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                                                            {frame.diagnosis}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-slate-700 text-[8px] font-black uppercase tracking-widest opacity-40">Bio_Stable</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                            <Layers size={64} className="mb-8 text-emerald-500/20 animate-pulse" />
                            <h3 className="text-3xl font-black uppercase italic tracking-[0.5em] text-white">Authorization Pending</h3>
                            <p className="text-slate-600 text-[9px] font-bold uppercase mt-6 max-w-[300px] leading-relaxed tracking-widest">Select record node to decrypt telemetry.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>

        {/* FOOTER shrink-0 */}
        <div className="h-14 bg-black/90 border border-white/10 rounded-[25px] flex items-center px-10 gap-10 shrink-0 mt-2 backdrop-blur-3xl shadow-3xl relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-600 shadow-[0_0_20px_#10b981]" />
            <div className="flex items-center gap-5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]"/>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Biometric Database Node SF_NODE_V16.0 Encrypted</span>
            </div>
            <div className="h-6 w-[1px] bg-white/10" />
            <div className="flex items-center gap-5">
                <Gauge size={18} className="text-blue-500" /><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">100% Cache Persistence Reliable</span>
            </div>
            <div className="flex items-center gap-5 ml-auto opacity-50 group hover:opacity-100 transition-opacity cursor-crosshair">
                <Terminal size={16} className="text-slate-600 group-hover:text-emerald-500 transition-colors"/>
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono italic group-hover:text-slate-300">vault_root@forensic_archive:~/data$</span>
            </div>
        </div>

      </div>

      <style jsx global>{`
        body { overflow: hidden; height: 100vh; background: #010409; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.01); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.2); border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.4); }
      `}</style>
    </div>
  );
}
