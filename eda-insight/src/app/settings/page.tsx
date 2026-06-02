"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings2, Palette, Cpu, Zap, Volume2, 
  ShieldCheck, Info, HelpCircle, Sun, Moon, 
  Eye, Monitor, Database, Activity, RefreshCw,
  Terminal, HardDrive, Binary, Microscope,
  ChevronRight, Lock, Bell, Gauge, Layers,
  CloudCog, Radio, Sliders, Layout, Workflow,
  Ear, EyeOff, Wind, Flame, Droplets, Sparkles,
  CheckCircle2, AlertTriangle, Power
} from "lucide-react";

// --- 1. THE FLOATING ASSISTANT (NON-TECH TRANSLATOR) ---
/**
 * Explains technical jargon in simple human terms.
 * Appears when a user hovers over a setting.
 */
const AssistantWindow = ({ title, simpleDesc, techDetail, icon: Icon, color }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9, x: 20 }} 
    animate={{ opacity: 1, scale: 1, x: 0 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="absolute left-[105%] top-0 w-80 bg-slate-900/95 backdrop-blur-2xl border border-white/10 p-8 rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[100] pointer-events-none"
  >
    <div className="flex items-center gap-4 mb-4" style={{ color }}>
      <Icon size={22} />
      <span className="text-xs font-black uppercase tracking-[0.2em]">{title}</span>
    </div>
    <div className="space-y-4">
      <p className="text-sm text-white font-bold leading-relaxed italic">"{simpleDesc}"</p>
      <div className="h-[1px] w-full bg-white/5" />
      <div className="flex gap-3">
        <Terminal size={12} className="text-slate-500 mt-1" />
        <p className="text-[10px] text-slate-500 font-mono leading-relaxed uppercase">{techDetail}</p>
      </div>
    </div>
    <div className="absolute top-10 -left-2 w-4 h-4 bg-slate-900 rotate-45 border-l border-b border-white/10" />
  </motion.div>
);

// --- 2. GLOBAL PARTICLE FIELD ---
const GlobalParticles = ({ color }: { color: string }) => {
  const particles = useMemo(() => [...Array(40)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 15 + 10
  })), []);

  return (
    <div className="absolute inset-0 z-0 opacity-30 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ 
            backgroundColor: color, 
            width: p.size, height: p.size, 
            left: `${p.x}%`, top: `${p.y}%` 
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
};

// --- 3. THE MASTER NEXUS COMPONENT ---
export default function NexusControl() {
  // CORE GLOBAL STATES
  const [theme, setTheme] = useState("#2563eb"); // Main Accent
  const [neuralSmoothing, setNeuralSmoothing] = useState(85); // AI Strength
  const [securityLevel, setSecurityLevel] = useState("Standard"); // UI Mood
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isHologramActive, setIsHologramActive] = useState(true);
  
  // UI INTERACTION STATES
  const [hoveredSetting, setHoveredSetting] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [systemUptime, setSystemUptime] = useState(0);

  // Apply Global Theme to CSS Variables
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-accent', theme);
    document.documentElement.style.setProperty('--primary-glow', `${theme}44`);
    
    // Save to LocalStorage so Dashboard/Vault can read it
    localStorage.setItem("ws_theme", theme);
    localStorage.setItem("ws_neural", neuralSmoothing.toString());
    localStorage.setItem("ws_security", securityLevel);
  }, [theme, neuralSmoothing, securityLevel]);

  // System Clock
  useEffect(() => {
    const timer = setInterval(() => setSystemUptime(p => p + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const syncWorkstation = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className="h-screen w-full bg-[#010409] text-white overflow-hidden relative flex flex-col p-8 font-sans">
      <GlobalParticles color={theme} />

      <div className="max-w-[1800px] mx-auto w-full h-full flex flex-col relative z-10">
        
        {/* --- DYNAMIC HEADER --- */}
        <div className="flex justify-between items-end mb-12 shrink-0">
          <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <div className="flex items-center gap-4 mb-3" style={{ color: theme }}>
                <Settings2 size={20} className={isSyncing ? "animate-spin" : ""} />
                <span className="text-[11px] font-black uppercase tracking-[0.8em] italic">Workstation Central Nexus</span>
            </div>
            <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none">
              Global <span style={{ color: theme }}>Control.</span>
            </h1>
          </motion.div>

          <div className="flex gap-6">
             <div className="bg-slate-900/60 border border-white/5 px-8 py-4 rounded-3xl flex items-center gap-8 backdrop-blur-3xl shadow-inner">
                <div className="text-left">
                    <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Central Uptime</span>
                    <span className="text-xl font-mono font-bold text-white tracking-tighter">{formatUptime(systemUptime)}</span>
                </div>
                <div className="h-10 w-[1px] bg-white/10" />
                <div className="text-left">
                    <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Node Status</span>
                    <span className="text-xl font-mono font-bold text-emerald-500 tracking-tighter">OPTIMIZED</span>
                </div>
             </div>
             
             <button 
                onClick={syncWorkstation}
                className="px-12 py-4 bg-white text-black rounded-[25px] font-black uppercase tracking-[0.4em] italic flex items-center gap-6 shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all"
             >
                {isSyncing ? <RefreshCw size={20} className="animate-spin"/> : <Workflow size={20}/>}
                {isSyncing ? "Broadcasting..." : "Apply Global Sync"}
             </button>
          </div>
        </div>

        {/* --- MAIN GRID (75/25) --- */}
        <div className="flex-1 grid grid-cols-12 gap-10 overflow-hidden min-h-0">
            
            {/* LEFT: MASTER SETTINGS (75%) */}
            <div className="col-span-8 flex flex-col gap-8 overflow-y-auto pr-6 custom-scrollbar h-full pb-20">
                
                {/* SECTION 1: SPECTRAL THEME CORE */}
                <div 
                  className="bg-slate-900/40 border border-white/5 rounded-[60px] p-12 backdrop-blur-xl relative group transition-all hover:border-white/10"
                  onMouseEnter={() => setHoveredSetting('theme')} onMouseLeave={() => setHoveredSetting(null)}
                >
                    <div className="flex items-center gap-6 mb-12">
                        <div className="p-4 bg-blue-600/10 rounded-3xl" style={{ color: theme }}>
                          <Palette size={32}/>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black italic uppercase tracking-widest">Interface Energy Core</h2>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.5em] mt-2">Adjusting the Spectral Frequency of the workstation</p>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        {[
                            { hex: "#2563eb", name: "Deep Blue", desc: "Scientific Standard Mode" },
                            { hex: "#10b981", name: "Bio Green", desc: "Stable Biological State" },
                            { hex: "#ef4444", name: "Alert Red", desc: "Critical Stress Detection" },
                            { hex: "#8b5cf6", name: "Neural Violet", desc: "Experimental AI Analysis" },
                            { hex: "#f59e0b", name: "Amber Alert", desc: "Manual Hardware Override" }
                        ].map(c => (
                            <button 
                                key={c.hex} onClick={() => setTheme(c.hex)}
                                className="flex-1 group/btn relative p-8 rounded-[40px] border-2 transition-all hover:scale-105"
                                style={{ 
                                  backgroundColor: theme === c.hex ? `${c.hex}1a` : 'rgba(255,255,255,0.02)',
                                  borderColor: theme === c.hex ? c.hex : 'transparent'
                                }}
                            >
                                <div className="w-12 h-12 rounded-full mb-4 shadow-2xl mx-auto" style={{ backgroundColor: c.hex }} />
                                <span className="block text-[10px] font-black uppercase text-center tracking-widest">{c.name}</span>
                                {theme === c.hex && <motion.div layoutId="color-check" className="absolute top-4 right-4"><CheckCircle2 size={16} style={{ color: theme }}/></motion.div>}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence>
                      {hoveredSetting === 'theme' && (
                        <AssistantWindow 
                          title="Website Color Core"
                          simpleDesc="This button changes the 'Energy' of the site. Use Blue for everyday lab work, and Red if you want to feel like a hacker in alert mode."
                          techDetail="Broadcasting CSS HEX Variable to root :target --primary-accent."
                          icon={Palette}
                          color={theme}
                        />
                      )}
                    </AnimatePresence>
                </div>

                {/* SECTION 2: AI BRAIN SETTINGS */}
                <div 
                  className="bg-slate-900/40 border border-white/5 rounded-[60px] p-12 backdrop-blur-xl relative group transition-all"
                  onMouseEnter={() => setHoveredSetting('ai')} onMouseLeave={() => setHoveredSetting(null)}
                >
                    <div className="flex items-center gap-6 mb-12">
                        <div className="p-4 bg-emerald-600/10 rounded-3xl text-emerald-500">
                          <Cpu size={32}/>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black italic uppercase tracking-widest">Neural Logic Engine</h2>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.5em] mt-2">Calibrating Contrastive Unsupervised Learning Sensitivity</p>
                        </div>
                    </div>

                    <div className="space-y-12">
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Cleanup Aggression</span>
                                <span className="text-4xl font-black italic tracking-tighter" style={{ color: theme }}>{neuralSmoothing}%</span>
                            </div>
                            <input 
                                type="range" min="10" max="100" value={neuralSmoothing}
                                onChange={(e) => setNeuralSmoothing(parseInt(e.target.value))}
                                className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-white"
                                style={{ accentColor: theme }}
                            />
                            <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest">
                                <span>Raw Noise</span>
                                <span>Mathematical Perfection</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            {[
                                { id: 'audio', title: "Signal Audio", icon: <Volume2 />, desc: "Turn biometrics into sound." },
                                { id: 'holo', title: "Holograms", icon: <Layers />, desc: "Enable 3D visual effects." },
                                { id: 'auto', title: "Auto-Save", icon: <Database />, desc: "Log data to Vault instantly." }
                            ].map((item) => (
                                <button 
                                  key={item.id}
                                  className="p-8 bg-black/20 border border-white/5 rounded-[40px] text-left hover:bg-white/5 transition-all group/opt"
                                >
                                    <div className="mb-6 group-hover/opt:scale-110 transition-transform" style={{ color: theme }}>{item.icon}</div>
                                    <h3 className="text-sm font-black uppercase italic tracking-widest mb-2">{item.title}</h3>
                                    <p className="text-[9px] text-slate-500 font-bold uppercase leading-relaxed">{item.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence>
                      {hoveredSetting === 'ai' && (
                        <AssistantWindow 
                          title="AI Logic Brain"
                          simpleDesc="The higher this slider goes, the more the AI 'cleans' the lines in your graphs. 100% means perfectly smooth data."
                          techDetail="Adjusting Alpha Coefficient for the CUL-v4 Reconstruction Filter."
                          icon={Cpu}
                          color={theme}
                        />
                      )}
                    </AnimatePresence>
                </div>

                {/* SECTION 3: WORKSTATION SECURITY */}
                <div 
                  className="bg-slate-900/40 border border-white/5 rounded-[60px] p-12 backdrop-blur-xl relative group transition-all"
                  onMouseEnter={() => setHoveredSetting('secure')} onMouseLeave={() => setHoveredSetting(null)}
                >
                    <div className="flex items-center gap-6 mb-12">
                        <div className="p-4 bg-orange-600/10 rounded-3xl text-orange-500">
                          <ShieldCheck size={32}/>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black italic uppercase tracking-widest">Security Protocol</h2>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.5em] mt-2">Managing Data Privacy and Node Access Levels</p>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        {["Guest Mode", "Standard", "Classified", "Wipe-on-Exit"].map((level) => (
                            <button 
                                key={level}
                                onClick={() => setSecurityLevel(level)}
                                className={`flex-1 py-8 rounded-[40px] border-2 transition-all flex flex-col items-center gap-4 ${securityLevel === level ? 'bg-orange-600/10 border-orange-500 text-white' : 'bg-white/5 border-transparent text-slate-600'}`}
                            >
                                <Lock size={20} className={securityLevel === level ? "text-orange-500" : "text-slate-800"} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{level}</span>
                            </button>
                        ))}
                    </div>

                    <AnimatePresence>
                      {hoveredSetting === 'secure' && (
                        <AssistantWindow 
                          title="Privacy Shield"
                          simpleDesc="Decide who can see your data. 'Classified' locks the vault, and 'Wipe-on-Exit' deletes everything when you close the browser."
                          techDetail="Toggling LocalStorage persistence and AES-256 visualization flags."
                          icon={ShieldCheck}
                          color="#f97316"
                        />
                      )}
                    </AnimatePresence>
                </div>
            </div>

            {/* RIGHT: SYSTEM LEDGER (25%) */}
            <div className="col-span-4 bg-slate-950/80 border border-white/10 rounded-[60px] flex flex-col shadow-3xl overflow-hidden backdrop-blur-3xl h-full p-10 relative">
                <div className="flex items-center justify-between mb-10 shrink-0">
                    <div className="flex items-center gap-4 text-blue-500">
                        <Terminal size={24} />
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Event Log.</h2>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-4">
                    {[
                      { id: "LOG-A1", type: "SYNC", msg: "Global Theme broadcast successful", time: "JUST NOW" },
                      { id: "LOG-A2", type: "CALIB", msg: "Neural Precision tuned to " + neuralSmoothing + "%", time: "1 MIN AGO" },
                      { id: "LOG-A3", type: "BOOT", msg: "Workstation Core initialized in " + securityLevel, time: "5 MIN AGO" },
                      { id: "LOG-A4", type: "MEM", msg: "Vault Cache Synchronized (342MB)", time: "12 MIN AGO" }
                    ].map((log, i) => (
                        <div key={i} className="bg-white/[0.03] border border-white/5 p-6 rounded-[35px] group hover:bg-white/[0.06] transition-all">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 rounded text-slate-500">{log.type}</span>
                                <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">{log.time}</span>
                            </div>
                            <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest italic">{log.msg}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 shrink-0">
                   <div className="p-8 bg-blue-600/10 border border-blue-500/20 rounded-[40px] flex flex-col items-center text-center">
                      <Gauge className="text-blue-500 mb-4" size={32}/>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Machine Reliability Index</span>
                      <span className="text-5xl font-black italic text-white tracking-tighter">0.9942</span>
                   </div>
                </div>
            </div>
        </div>

        {/* --- DYNAMIC FOOTER LOG --- */}
        <div className="h-14 bg-black/90 border border-white/10 rounded-[30px] flex items-center px-12 gap-10 shrink-0 mt-6 backdrop-blur-3xl shadow-3xl relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-2 shadow-[0_0_20px_var(--primary-glow)]" style={{ backgroundColor: theme }} />
            <div className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_15px_var(--primary-glow)]" style={{ backgroundColor: theme }}/>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">Nexus Node V4.8 Stable // {securityLevel} Active</span>
            </div>
            <div className="h-6 w-[1px] bg-white/10" />
            <div className="flex items-center gap-5">
                <Workflow size={18} className="text-blue-500" />
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">Global Broadcasting Enabled</span>
            </div>
            <div className="ml-auto opacity-40 hover:opacity-100 transition-opacity">
                <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest font-mono italic">root@signal_forge:~/nexus_sync$</span>
            </div>
        </div>

      </div>

      <style jsx global>{`
        body { overflow: hidden; height: 100vh; background: #010409; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.01); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.3); border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59,130,246,0.5); }
      `}</style>
    </div>
  );
}
