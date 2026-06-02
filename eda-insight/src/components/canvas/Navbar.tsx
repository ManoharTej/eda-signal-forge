"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { 
  Activity, BookOpen, Joystick, History, 
  Settings, Info, LogOut, User, 
  Palette, ShieldCheck, Zap, Globe, LayoutDashboard
} from "lucide-react";
import { gsap } from "gsap";

/**
 * EDA INSIGHT: QUANTUM COMMAND CENTER v2.0
 * MISSION: SIGNAL INTELLIGENCE & NEURAL TELEMETRY
 * LINE_COUNT_TARGET: 204
 */

export default function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [accent, setAccent] = useState({ name: "cyan", hex: "#06b6d4" });
  const [showProfile, setShowProfile] = useState(false);
  const navRef = useRef(null);

  // --- RESEARCH LOG: MAGNETIC PHYSICS INTERACTION ---
  const handleMagnetic = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn = e.currentTarget;
    const { left, top, width, height } = btn.getBoundingClientRect();
    const x = e.clientX - (left + width / 2);
    const y = e.clientY - (top + height / 2);
    gsap.to(btn, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.6,
      ease: "power3.out"
    });
  };

  const resetMagnetic = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- RESEARCH LOG: KNOWLEDGE-CENTRIC ARCHITECTURE ---
  const links = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={14} /> },
    { name: "Signal Science", path: "/science", icon: <BookOpen size={14} /> },
    { name: "Playground", path: "/playground", icon: <Joystick size={14} /> },
    { name: "Session Vault", path: "/history", icon: <History size={14} /> },
    { name: "Config", path: "/settings", icon: <Settings size={14} /> },
    { name: "Intel Deck", path: "/about", icon: <Info size={14} /> },
  ];

  return (
    <nav 
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 px-8 py-5 ${
        isScrolled ? "bg-slate-950/40 backdrop-blur-2xl border-b border-white/10 py-3 shadow-2xl" : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-[1800px] mx-auto flex items-center justify-between relative z-10">
        
        {/* --- SECTION: BRANDING NEXUS --- */}
        <div className="flex items-center gap-10">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-[18px] flex items-center justify-center transition-all duration-500 rotate-[-10deg] group-hover:rotate-0 overflow-hidden">
              <div className="absolute inset-0 opacity-20 animate-pulse bg-current" style={{ color: accent.hex }} />
              <Activity className="text-white w-6 h-6 relative z-10" />
              <motion.div 
                className="absolute inset-0 border-2 rounded-[18px]" 
                style={{ borderColor: accent.hex }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black italic tracking-tighter text-white leading-none">
                EDA<span style={{ color: accent.hex }}>INSIGHT</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-[1px] w-4 bg-slate-700" />
                <span className="text-[7px] font-black uppercase tracking-[0.5em] text-slate-500">Signal Intelligence</span>
              </div>
            </div>
          </Link>
        </div>

        {/* --- SECTION: NEURAL NAVIGATION GRID --- */}
        <div className="hidden lg:flex items-center gap-2 bg-black/40 border border-white/5 p-1.5 rounded-[24px] backdrop-blur-md">
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onMouseMove={handleMagnetic}
              onMouseLeave={resetMagnetic}
              className={`relative px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-all group ${
                pathname === link.path ? "text-white" : "text-slate-500 hover:text-white"
              }`}
            >
              <span 
                className={`transition-transform duration-300 group-hover:scale-125 ${pathname === link.path ? "" : "opacity-50 group-hover:opacity-100"}`} 
                style={{ color: pathname === link.path ? accent.hex : '' }}
              >
                {link.icon}
              </span>
              {link.name}
              {pathname === link.path && (
                <motion.div 
                  layoutId="nav_active"
                  className="absolute inset-0 bg-white/5 border border-white/10 rounded-[18px] -z-10 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                />
              )}
            </Link>
          ))}
        </div>

        {/* --- SECTION: SYSTEM INTERFACE --- */}
        <div className="flex items-center gap-6">
          <div className="hidden xl:flex items-center gap-4 bg-white/5 border border-white/5 px-4 py-2 rounded-full">
            <div className="flex items-center gap-2">
              <Zap size={12} className="text-yellow-500 animate-bounce" />
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Neural: 1.2ms</span>
            </div>
            <div className="w-[1px] h-3 bg-white/10" />
            <div className="flex items-center gap-2">
              <Globe size={12} className="text-blue-500 animate-spin-slow" />
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Node: HYD-04</span>
            </div>
          </div>

          {/* COLOR RECONSTRUCTION ENGINE */}
          <div className="flex gap-2 p-1 bg-black/20 rounded-full border border-white/5">
            {[
              { name: "cyan", hex: "#06b6d4" },
              { name: "emerald", hex: "#10b981" },
              { name: "rose", hex: "#f43f5e" }
            ].map((c) => (
              <button
                key={c.name}
                onClick={() => setAccent(c)}
                className={`w-4 h-4 rounded-full transition-all duration-500 ${accent.name === c.name ? 'scale-125 shadow-[0_0_10px_currentcolor]' : 'scale-75 opacity-30 hover:opacity-100'}`}
                style={{ backgroundColor: c.hex, color: c.hex }}
              />
            ))}
          </div>

          {/* PROFILE ARCHITECTURE */}
          <div className="relative">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 group bg-white/5 hover:bg-white/10 p-1 pr-4 rounded-full border border-white/10 transition-all"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 transition-all duration-500 group-hover:border-white" style={{ borderColor: accent.hex }}>
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500"><User size={16}/></div>
                )}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[9px] font-black text-white uppercase tracking-tighter truncate w-20 text-left">
                  {user?.displayName || "Research Lead"}
                </span>
                <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest leading-none">Verified Node</span>
              </div>
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute top-full right-0 mt-4 w-60 bg-slate-900/95 backdrop-blur-3xl border border-white/10 p-6 rounded-[30px] shadow-2xl"
                >
                  <div className="flex flex-col gap-4">
                    <button className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-400 hover:text-white transition-colors group">
                      <ShieldCheck size={16} style={{ color: accent.hex }} className="group-hover:scale-110 transition-transform" /> 
                      Clearance: Alpha
                    </button>
                    <button className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-400 hover:text-white transition-colors group">
                      <Palette size={16} style={{ color: accent.hex }} className="group-hover:scale-110 transition-transform" /> 
                      Neural Theme
                    </button>
                    <div className="h-[1px] bg-white/5 my-2" />
                    <button 
                      onClick={() => signOut(auth)}
                      className="flex items-center gap-3 text-[10px] font-black uppercase text-red-500 hover:text-red-400 transition-colors group"
                    >
                      <LogOut size={16} className="group-hover:translate-x-1 transition-transform" /> 
                      Terminate Link
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}

// END OF QUANTUM COMMAND CENTER MODULE
// VERSION: 2.0.4 | HYDERABAD RESEARCH NODE 
// STACK: NEXTJS, GSAP, FRAMER MOTION, TAILWIND
