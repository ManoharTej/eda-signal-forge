"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Radio, Activity, Signal, Globe, Zap, 
  Database, ShieldCheck, Cpu, Terminal, 
  Settings, Power, Wifi, WifiOff, Link,
  ArrowUpRight, Download, Server, AlertCircle,
  Clock, Info, X, HelpCircle, BookOpen, MousePointer2
} from "lucide-react";

// --- 1. FLOATING ASSISTANT COMPONENT (ELI10) ---
const HelpPopup = ({ title, desc, isVisible }: { title: string, desc: string, isVisible: boolean }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        className="absolute bottom-full left-0 mb-4 w-72 bg-blue-600 border border-white/20 p-5 rounded-[25px] shadow-[0_0_50px_rgba(37,99,235,0.4)] z-[100] pointer-events-none"
      >
        <div className="flex items-center gap-2 mb-2 text-white">
          <HelpCircle size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
        </div>
        <p className="text-[11px] text-blue-50 font-bold leading-relaxed italic">"{desc}"</p>
        <div className="absolute -bottom-2 left-8 w-4 h-4 bg-blue-600 rotate-45 border-r border-b border-white/20" />
      </motion.div>
    )}
  </AnimatePresence>
);

// --- 2. LIVE SIGNAL GENERATOR ---
const DATA_POINTS = 100;

export default function TelemetryLive() {
  const [isConnected, setIsConnected] = useState(false);
  const [streamData, setStreamData] = useState<number[]>(new Array(DATA_POINTS).fill(2.5));
  const [packets, setPackets] = useState<{id: number, content: string}[]>([]);
  const [latency, setLatency] = useState(42);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  
  // Hover Tracking for Tooltips
  const [hovered, setHovered] = useState<string | null>(null);

  // Simulation Logic
  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(() => {
      setStreamData(prev => {
        const last = prev[prev.length - 1];
        const noise = (Math.random() - 0.5) * 0.15;
        const next = Math.max(0.5, Math.min(8, last + noise));
        return [...prev.slice(1), next];
      });
      const newPacket = {
        id: Date.now(),
        content: `0x${Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0')}`
      };
      setPackets(prev => [newPacket, ...prev].slice(0, 15));
      setLatency(38 + Math.floor(Math.random() * 10));
    }, 100);
    return () => clearInterval(interval);
  }, [isConnected]);

  return (
    <div className="h-screen w-full bg-[#010409] text-white overflow-hidden relative flex flex-col p-6 font-sans">
      
      {/* --- LAYER 0: NEURAL GRID --- */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="max-w-[1750px] mx-auto w-full h-full flex flex-col relative z-10">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex justify-between items-end mb-8 shrink-0">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2 text-blue-500">
                  <Radio size={16} className={isConnected ? "animate-pulse" : ""} />
                  <span className="text-[10px] font-black uppercase tracking-[0.6em] italic">Live Remote Telemetry</span>
              </div>
              <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">
                Stream <span className="text-blue-600">Link.</span>
              </h1>
            </div>
            
            {/* ABOUT BUTTON (NEW) */}
            <div className="relative mb-2">
              <button 
                onClick={() => setIsAboutOpen(true)}
                className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-xl group"
              >
                <Info size={24} className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </motion.div>

          <div className="flex gap-4">
             <div 
                className="bg-slate-900/60 border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-6 backdrop-blur-xl relative cursor-help"
                onMouseEnter={() => setHovered('net-status')} onMouseLeave={() => setHovered(null)}
             >
                <HelpPopup title="Internet Speed" desc="This tells you how fast our lab is talking to the patient's sensors. Faster means we see the data sooner!" isVisible={hovered === 'net-status'} />
                <div className="text-right">
                    <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Latency</span>
                    <span className="text-xl font-mono font-bold text-emerald-500 leading-none">{isConnected ? `${latency}ms` : '--'}</span>
                </div>
                <div className="h-8 w-[1px] bg-white/10" />
                <div className="text-right">
                    <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Signal</span>
                    <span className="text-xl font-mono font-bold text-blue-400 leading-none">{isConnected ? '98%' : '0%'}</span>
                </div>
             </div>
             
             <div className="relative">
                <HelpPopup title="Connection Toggle" desc="Click this to start or stop the 'Neural Handshake'—it's like making a phone call to someone's feelings!" isVisible={hovered === 'init-btn'} />
                <button 
                    onMouseEnter={() => setHovered('init-btn')} onMouseLeave={() => setHovered(null)}
                    onClick={() => setIsConnected(!isConnected)}
                    className={`px-10 py-3 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center gap-4 shadow-3xl border ${isConnected ? 'bg-red-600/10 border-red-500/30 text-red-500 hover:bg-red-600 hover:text-white' : 'bg-blue-600 border-blue-400 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)]'}`}
                >
                    {isConnected ? <WifiOff size={18}/> : <Wifi size={18}/>}
                    {isConnected ? "Terminate Link" : "Initialize Link"}
                </button>
             </div>
          </div>
        </div>

        {/* --- MAIN GRID --- */}
        <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden min-h-0">
            
            {/* LEFT: MONITORING (75%) */}
            <div className="col-span-9 flex flex-col gap-6 h-full">
                <div 
                  className="flex-[2] bg-slate-950/80 border border-white/10 rounded-[60px] relative overflow-hidden shadow-3xl group cursor-help"
                  onMouseEnter={() => setHovered('main-graph')} onMouseLeave={() => setHovered(null)}
                >
                    <HelpPopup title="The Feeling Line" desc="This wavy line shows us a picture of the subject's skin electricity. When it goes up, they might be excited!" isVisible={hovered === 'main-graph'} />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
                    
                    <div className="absolute top-10 left-12 z-10">
                        <div className="flex items-center gap-4 mb-2">
                            <Activity className={`text-emerald-500 ${isConnected ? "animate-pulse" : ""}`} size={24}/>
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Biopotential Real-time</h2>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] italic">Source: Remote_Node_Alpha // Sub: S-044</p>
                    </div>

                    <div className="w-full h-full flex items-center justify-center p-20">
                        {!isConnected ? (
                            <div className="text-center opacity-20"><Radio size={100} className="mx-auto mb-6" /><h3 className="text-4xl font-black uppercase italic tracking-widest">No Stream Active</h3></div>
                        ) : (
                            <svg viewBox={`0 0 ${DATA_POINTS} 100`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="liveGlow" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" /><stop offset="100%" stopColor="#2563eb" stopOpacity="0" /></linearGradient>
                                </defs>
                                <path d={`M 0,100 L ${streamData.map((v, i) => `${i},${90 - (v * 10)}`).join(" L ")} L ${DATA_POINTS},100 Z`} fill="url(#liveGlow)" />
                                <motion.path d={`M ${streamData.map((v, i) => `${i},${90 - (v * 10)}`).join(" L ")}`} fill="none" stroke="#3b82f6" strokeWidth="1.5" className="drop-shadow-[0_0_12px_#3b82f6]" />
                            </svg>
                        )}
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-3 gap-6">
                    {[
                        { id: 'uptime', label: "Node Uptime", val: isConnected ? "14:22:04" : "00:00:00", icon: <Clock size={20}/>, color: "text-blue-400", desc: "This tracks how long our science computer has been awake and listening today." },
                        { id: 'integrity', label: "Packet Integrity", val: isConnected ? "99.98%" : "0.00%", icon: <ShieldCheck size={20}/>, color: "text-emerald-400", desc: "This checks if the data messages are perfect or if they have broken glitches." },
                        { id: 'engine', label: "Inference Engine", val: "CUL_v4_Active", icon: <Cpu size={20}/>, color: "text-purple-400", desc: "This is the AI 'Brain' that cleans the messy signal to make it look smooth." }
                    ].map((item, i) => (
                        <div 
                          key={i} 
                          onMouseEnter={() => setHovered(item.id)} onMouseLeave={() => setHovered(null)}
                          className="bg-slate-900/40 border border-white/5 rounded-[40px] p-8 flex items-center gap-8 backdrop-blur-xl relative cursor-help group"
                        >
                            <HelpPopup title={item.label} desc={item.desc} isVisible={hovered === item.id} />
                            <div className={`p-4 bg-white/5 rounded-2xl ${item.color} group-hover:scale-110 transition-transform`}>{item.icon}</div>
                            <div>
                                <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{item.label}</span>
                                <span className="text-2xl font-black italic uppercase text-white">{item.val}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT: TICKER (25%) */}
            <div className="col-span-3 flex flex-col gap-6 h-full">
                <div 
                  className="flex-1 bg-slate-900/60 border border-white/10 rounded-[45px] p-8 flex flex-col overflow-hidden relative cursor-help"
                  onMouseEnter={() => setHovered('packets')} onMouseLeave={() => setHovered(null)}
                >
                    <HelpPopup title="The Secret Codes" desc="These are the actual raw messages sending numbers from the subject to us!" isVisible={hovered === 'packets'} />
                    <div className="flex items-center justify-between mb-6 shrink-0">
                        <div className="flex items-center gap-3"><Terminal size={16} className="text-blue-500" /><h3 className="text-sm font-black uppercase italic tracking-widest">Packet Stream</h3></div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[10px] text-slate-500 space-y-2">
                        {isConnected ? packets.map(p => (
                            <div key={p.id} className="flex justify-between border-b border-white/5 pb-2"><span>[RECV]</span><span className="text-slate-300 font-bold">{p.content}</span><span className="text-slate-600">OK</span></div>
                        )) : <div className="h-full flex items-center justify-center italic text-slate-700">Awaiting Handshake...</div>}
                    </div>
                </div>

                <div 
                  className="h-[280px] bg-blue-600/10 border border-blue-500/20 rounded-[45px] p-8 relative overflow-hidden cursor-help"
                  onMouseEnter={() => setHovered('map')} onMouseLeave={() => setHovered(null)}
                >
                    <HelpPopup title="The Data Map" desc="This map shows your data traveling from a subject in a different city across the world!" isVisible={hovered === 'map'} />
                    <Globe size={150} className="absolute -bottom-10 -right-10 text-blue-500/10 rotate-12" />
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-blue-400 mb-6">Global Topology</h3>
                    <div className="space-y-6 relative z-10">
                        <div className="flex items-center justify-between font-bold italic">
                            <div className="flex flex-col"><span className="text-[8px] text-slate-500 uppercase">Station</span><span>HYD_HUB</span></div>
                            <Link size={14} className="text-emerald-500" />
                            <div className="flex flex-col text-right"><span className="text-[8px] text-slate-500 uppercase">Remote</span><span>NODE_X</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- ABOUT MODAL --- */}
        <AnimatePresence>
            {isAboutOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-12">
                    <div className="max-w-4xl w-full bg-slate-900 border border-white/10 rounded-[60px] p-16 relative shadow-[0_0_80px_rgba(37,99,235,0.2)]">
                        <button onClick={() => setIsAboutOpen(false)} className="absolute top-10 right-10 p-4 hover:bg-white/10 rounded-full transition-all"><X /></button>
                        <div className="flex items-center gap-5 mb-10 text-blue-500">
                            <BookOpen size={48}/>
                            <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white">Signal Forge Mission.</h2>
                        </div>
                        <p className="text-lg text-slate-300 font-bold leading-relaxed uppercase tracking-widest italic mb-10">
                            Signal Forge is a state-of-the-art forensic workstation designed to decode human emotion through Electrodermal Activity (EDA). By analyzing micro-fluctuations in skin conductance, our workstation captures biological stress responses in real-time. We use advanced Contrastive Unsupervised Learning (CUL) algorithms to clean raw biometric noise, ensuring that every session recorded in our Vault is scientifically pure. Whether you are conducting local experiments in the Playground or monitoring remote subjects via our encrypted Telemetry Link, Signal Forge provides the highest fidelity data persistence for biometric researchers worldwide.
                        </p>
                        <button onClick={() => setIsAboutOpen(false)} className="px-12 py-4 bg-blue-600 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">Understood</button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- STATUS FOOTER --- */}
        <div className="h-12 mt-6 bg-black/40 border border-white/5 rounded-full flex items-center px-10 gap-10 shrink-0">
             <div className="flex items-center gap-3"><div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} /><span className="text-[9px] font-black uppercase text-slate-500">Status: {isConnected ? 'Streaming' : 'Standby'}</span></div>
             <div className="ml-auto opacity-30"><Terminal size={14} className="text-slate-700"/><span className="text-[9px] ml-3 font-mono">ROOT@SIGNAL_FORGE_V16</span></div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59,130,246,0.5); }
      `}</style>
    </div>
  );
}
