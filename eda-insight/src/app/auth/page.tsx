"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { 
  LogIn, UserPlus, ShieldCheck, Mail, Lock, 
  ArrowRight, Fingerprint, Chrome, Sparkles, AlertCircle 
} from "lucide-react";
import { gsap } from "gsap";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // --- GSAP 3D PHYSICS ENGINE ---
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;

    gsap.to(cardRef.current, {
      rotateY: x * 20, 
      rotateX: -y * 20,
      transformPerspective: 1200,
      ease: "power3.out",
      duration: 0.6,
    });
  };

  const resetTilt = () => {
    gsap.to(cardRef.current, { 
      rotateX: 0, 
      rotateY: 0, 
      ease: "elastic.out(1, 0.3)", 
      duration: 1.5 
    });
  };

  // --- FIREBASE HANDLERS ---
  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err: any) {
      setError("Biometric Bypass Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message.replace("Firebase:", "").trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Visual Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: "circOut" }}
        className="relative group w-full max-w-[480px]"
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
      >
        {/* Holographic Border Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 rounded-[45px] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000" />

        <div 
          ref={cardRef}
          className="relative w-full bg-slate-950/40 backdrop-blur-[100px] border border-white/10 p-12 rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.4)] overflow-hidden"
        >
          {/* Internal Scanner Light */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50" />

          {/* Header Section */}
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-20 h-20 bg-blue-500/10 rounded-3xl border border-blue-500/20 flex items-center justify-center mb-6 relative group">
              <Fingerprint className="text-blue-400 w-10 h-10 group-hover:scale-110 transition-transform" />
              <motion.div 
                animate={{ y: [-15, 45, -15] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute w-12 h-[1px] bg-blue-400 shadow-[0_0_10px_#3b82f6]"
              />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic leading-none">
              {isLogin ? "Neural Access" : "Create Node"}
            </h1>
            <p className="text-[9px] font-bold tracking-[0.5em] text-blue-500/70 uppercase mt-3">
              Biometric Research Interface
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2 group/input">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-2">Researcher ID</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/input:text-blue-400 transition-colors" />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all placeholder:text-slate-800"
                  placeholder="name@institute.edu" required
                />
              </div>
            </div>

            <div className="space-y-2 group/input">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-2">Secure Protocol</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/input:text-blue-400 transition-colors" />
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all placeholder:text-slate-800"
                  placeholder="••••••••••••" required
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: "auto", opacity: 1 }} 
                  className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-400"
                >
                  <AlertCircle size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              disabled={loading}
              type="submit"
              className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 group transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? <Sparkles className="animate-spin w-5 h-5" /> : (isLogin ? "INITIALIZE SESSION" : "REGISTER SUBJECT")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* SSO Options */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.4em]"><span className="bg-[#020617] px-4 text-slate-600">Encrypted Gateway</span></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleAuth}
            className="w-full h-14 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl flex items-center justify-center gap-4 transition-all active:scale-[0.98] group"
          >
            <Chrome size={18} className="text-white group-hover:text-blue-400 transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sign in with Google</span>
          </button>

          <div className="mt-10 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-slate-500 hover:text-blue-400 text-[10px] font-black tracking-widest uppercase transition-colors"
            >
              {isLogin ? "Need new research credentials? Signup" : "Already registered? Return to Login"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
