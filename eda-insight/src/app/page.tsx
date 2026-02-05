"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { 
  FileUp, Activity, Binary, BrainCircuit, 
  ArrowUpRight, Sparkles, Database, Info 
} from "lucide-react";
import { gsap } from "gsap";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const heroRef = useRef(null);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/auth");
  }, [user, loading, router]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial Fly-In Entrance
      gsap.from(".hero-element", {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: "power4.out"
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const handleStartLab = (path: string) => {
    setIsExiting(true);
    
    // FLY-OUT ORCHESTRATION: Different elements fly in different directions
    gsap.to(".hero-text", { y: -200, opacity: 0, duration: 0.8, ease: "power4.in" });
    gsap.to(".card-left", { x: -300, opacity: 0, duration: 0.8, ease: "power4.in" });
    gsap.to(".card-right", { x: 300, opacity: 0, duration: 0.8, ease: "power4.in" });
    gsap.to(".stat-element", { y: 200, opacity: 0, stagger: 0.1, duration: 0.6, ease: "power4.in" });

    setTimeout(() => {
      router.push(path);
    }, 800);
  };

  if (loading || !user) return null;

  return (
    <div ref={heroRef} className="max-w-7xl mx-auto px-6 pt-24 pb-32 overflow-hidden">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center text-center mb-24 hero-text hero-element">
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8"
        >
          <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
        </motion.div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-[0.9]">
          EDA SIGNAL <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 uppercase italic">
            Intelligence.
          </span>
        </h1>
        <p className="text-slate-400 max-w-2xl text-lg md:text-xl font-medium leading-relaxed">
          The next generation of Electrodermal Activity (EDA) processing. 
          Deploy unsupervised ML models to clean artifacts in real-time.
        </p>
      </section>

      {/* PRIMARY ACTION GRID */}
      <div className="grid lg:grid-cols-2 gap-8 mb-20">
        <div className="hero-element card-left">
          <ActionCard 
            title="Laboratory Mode" 
            subtitle="CSV ANALYSIS & ML CLEANING"
            desc="Upload high-frequency EDA signals. Our engine detects motion artifacts and reconstructs data using neural interpolation."
            icon={<FileUp className="w-10 h-10" />}
            onClick={() => handleStartLab("/forge")}
            accent="blue"
          />
        </div>
        <div className="hero-element card-right">
          <ActionCard 
            title="Telemetry Live" 
            subtitle="REAL-TIME SENSOR STREAMING"
            desc="Connect mobile GSR electrodes via encrypted WebSockets. Monitor artifact spikes and SCL/SCR patterns live."
            icon={<Activity className="w-10 h-10" />}
            onClick={() => handleStartLab("/monitor")}
            accent="emerald"
          />
        </div>
      </div>

      {/* SUB-FEATURE STATS */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="hero-element stat-element">
          <StatItem 
            icon={<Binary />} 
            label="Processing Rate" 
            val="500 Hz" 
            info="Capture 500 data points per second for high-fidelity micro-spikes."
          />
        </div>
        <div className="hero-element stat-element">
          <StatItem 
            icon={<BrainCircuit />} 
            label="Cleaning Confidence" 
            val="98.2%" 
            info="AI index for successful artifact filtering without biological distortion."
          />
        </div>
        <div className="hero-element stat-element">
          <StatItem 
            icon={<Database />} 
            label="Cloud Encryption" 
            val="AES-256" 
            info="Secure physiological data tunnels to HYD-04 research nodes."
          />
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function ActionCard({ title, subtitle, desc, icon, accent, onClick }: any) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const onMouseMove = (e: React.MouseEvent) => {
    if(!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    gsap.to(cardRef.current, { rotateY: x * 10, rotateX: -y * 10, transformPerspective: 1000, duration: 0.4 });
  };
  
  const onMouseLeave = () => {
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
  };

  const colorMap: any = {
    blue: "from-blue-600/20 to-blue-900/10 border-blue-500/20 text-blue-400 hover:border-blue-500/50",
    emerald: "from-emerald-600/20 to-emerald-900/10 border-emerald-500/20 text-emerald-400 hover:border-emerald-500/50"
  };

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} ref={cardRef}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative group cursor-pointer h-[400px] rounded-[40px] border backdrop-blur-3xl p-12 flex flex-col justify-between overflow-hidden bg-gradient-to-br transition-all duration-500 ${colorMap[accent]}`}
    >
      <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-20 transition-opacity">{icon}</div>
      <div>
        <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-60 mb-4 block">{subtitle}</span>
        <h2 className="text-4xl font-black tracking-tight text-white mb-6 group-hover:translate-x-2 transition-transform italic uppercase">{title}</h2>
        <p className="text-slate-400 leading-relaxed font-medium max-w-xs">{desc}</p>
      </div>
      <div className="flex items-center justify-between">
        <div className={`p-4 rounded-2xl bg-black/40 border border-white/5`}>{icon}</div>
        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-black shadow-xl group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all"><ArrowUpRight /></div>
      </div>
    </motion.div>
  );
}

function StatItem({ icon, label, val, info }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative group">
      <motion.div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -5 }}
        className="bg-slate-900/40 border border-white/5 p-8 rounded-3xl flex flex-col items-center text-center cursor-help transition-colors hover:border-blue-500/30 w-full"
      >
        <div className="text-blue-500 mb-4 opacity-50">{icon}</div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</span>
        <span className="text-2xl font-black text-white italic">{val}</span>
      </motion.div>

      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="absolute z-50 bottom-full left-0 mb-4 w-72 bg-slate-900/90 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl pointer-events-none"
          >
            <div className="flex items-center gap-2 mb-2 text-blue-400">
              <Info size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Researcher Brief</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300 font-medium">{info}</p>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r border-b border-white/10 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}