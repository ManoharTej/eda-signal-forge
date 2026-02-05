"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Zap, ShieldAlert, BrainCircuit, Microscope, 
  Download, ChevronRight, ChevronLeft,
  Info, Activity, Database, Wind, Layers, X, Target,
  Cpu, ShieldCheck, Fingerprint, MousePointer2,
  Activity as SignalIcon, Waves, CheckCircle2, Maximize2 
} from "lucide-react";

// --- 1. DATA TYPES (Updated for Deep Dive) ---
interface FAQNode { 
  q: string; 
  a: string; 
  type: string; 
  deepDiveImage: string; 
}
interface TopicModule { 
  id: string; 
  title: string; 
  icon: React.ReactNode; 
  color: string; 
  questions: FAQNode[]; 
}

// --- 2. PHYSICS NODE (PLUCKABLE + DOUBLE CLICK SUPPORT) ---
const PluckableNode = ({ color, label, onDoubleClick }: { color: string, label: string, onDoubleClick?: () => void }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 400, damping: 12 });
  const springY = useSpring(y, { stiffness: 400, damping: 12 });

  return (
    <div className="relative flex items-center justify-center h-64 w-full select-none group/node">
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.9}
        onDragEnd={() => { x.set(0); y.set(0); }}
        onDoubleClick={onDoubleClick}
        style={{ x: springX, y: springY }}
        className={`w-36 h-36 rounded-[40px] bg-${color}-500/20 border-2 border-${color}-500/50 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing shadow-[0_0_50px_rgba(0,0,0,0.6)] z-20 backdrop-blur-md relative`}
      >
        <Activity className={`text-${color}-400 mb-2`} size={32}/>
        <div className={`text-${color}-400 uppercase font-black text-[11px] tracking-widest text-center px-4`}>
          {label}
        </div>
        {/* Double click indicator hint */}
        <div className="absolute -top-10 opacity-0 group-hover/node:opacity-100 transition-opacity whitespace-nowrap">
            <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest bg-black/60 px-2 py-1 rounded border border-blue-500/20">Double-Click to Expand</span>
        </div>
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
         <div className={`w-64 h-64 rounded-full border-2 border-dashed border-${color}-500 animate-[spin_20s_linear_infinite]`} />
      </div>
    </div>
  );
};

// --- 3. BRIGHT KINETIC BACKGROUND ---
const NeuralDust = () => {
  const dots = useMemo(() => [...Array(80)].map((_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 4 + 2, duration: Math.random() * 8 + 4
  })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#020617]">
      {dots.map((d) => (
        <motion.div
          key={d.id} className="absolute rounded-full bg-blue-500 opacity-60 shadow-[0_0_15px_#3b82f6]"
          style={{ width: d.size, height: d.size, left: `${d.x}%`, top: `${d.y}%` }}
          animate={{ y: [0, -120], opacity: [0, 1, 0], scale: [1, 1.8, 1] }}
          transition={{ duration: d.duration, repeat: Infinity, ease: "linear" }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/50 to-[#020617]" />
    </div>
  );
};

// --- 4. MAIN PAGE ---
export default function SignalScience() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [activeDeepDive, setActiveDeepDive] = useState<string | null>(null);

  const modules: TopicModule[] = [
    {
      id: "eda", title: "EDA Fundamentals", icon: <Zap />, color: "emerald",
      questions: [
        { q: "How does skin conduct electricity?", a: "Skin conductance is driven by sweat glands. When you experience stress, the Sympathetic Nervous System triggers moisture production. This salt-filled moisture acts as an electrical bridge, reducing the skin's resistance, effectively allowing micro-currents to pass through.", type: "Conductance", deepDiveImage: "/deep-dive/eda_conductance.png" },
        { q: "Why are palms used for measurement?", a: "The palms and soles have the highest density of Eccrine sweat glands. These are specifically responsive to psychological stimuli rather than thermal changes, making them the perfect site for autonomic monitoring.", type: "Sensor Site", deepDiveImage: "/deep-dive/palm_anatomy.png" },
        { q: "What is a microSiemen (μS)?", a: "A microSiemen is the standard unit used to quantify electrical conductance. In EDA research, we look for changes in μS to determine arousal. A higher μS value indicates more moisture in the sweat ducts.", type: "Unit Scale", deepDiveImage: "/deep-dive/micro_siemens.png" },
        { q: "Is EDA a reliable stress indicator?", a: "Yes, because the sweat glands used in EDA are controlled exclusively by the Sympathetic Nervous System. It is a 'pure' measure of autonomic arousal that cannot be consciously faked.", type: "SNS Axis", deepDiveImage: "/deep-dive/stress_logic.png" },
        { q: "How does the sensor work?", a: "We use dual-lead Ag/AgCl electrodes. One electrode passes a tiny voltage across the skin, while the other measures the flow. The resulting data reflects the 'Ohmic' interaction of resistance and moisture.", type: "Hardware", deepDiveImage: "/deep-dive/sensor_leads.png" },
        { q: "What is the Latency of a response?", a: "An SCR peak typically occurs 1 to 3 seconds after stimulus. This 'Biologic Lag' is the time required for neural signals to travel and for sweat to physically rise in the ducts.", type: "Signal Lag", deepDiveImage: "/deep-dive/lag_timing.png" },
        { q: "Can EDA detect lies?", a: "While used in polygraphs, EDA measures 'arousal,' not 'deception.' A person might show a spike because they are nervous about being questioned, regardless of whether they are telling the truth.", type: "Arousal", deepDiveImage: "/deep-dive/polygraph_truth.png" },
        { q: "What happens during relaxation?", a: "When a subject relaxes, sympathetic drive decreases and sweat is reabsorbed. This causes the 'Tonic' level to drift downwards and 'Phasic' spikes to disappear, creating a smooth baseline.", type: "Recovery", deepDiveImage: "/deep-dive/relaxation_curve.png" },
        { q: "Does age affect EDA levels?", a: "Yes, EDA responsiveness decreases with age as skin elasticity and gland function change. Researchers normalize data to account for the subject's unique baseline for precise analysis.", type: "Aging Map", deepDiveImage: "/deep-dive/age_dependency.png" },
        { q: "What is the 'Dermit-Response'?", a: "This is the technical term for the momentary increase in electrical conductivity. It represents the bridge between internal neural activity and measurable external physics.", type: "Interaction", deepDiveImage: "/deep-dive/dermit_response.png" }
      ]
    },
    {
        id: "artifacts", title: "Artifact Analysis", icon: <ShieldAlert />, color: "red",
        questions: [
          { q: "What defines a Motion Artifact?", a: "A motion artifact is non-biological noise caused by movement. Shifts in electrode pressure create massive electrical surges that look like stress peaks but are mechanical interference.", type: "Noise Spike", deepDiveImage: "/deep-dive/motion_artifact.png" },
          { q: "How does Entropy reveal noise?", a: "Biological signals have a specific mathematical smoothness. Motion artifacts are jagged and random. High Entropy (disorder) flags the signal as being corrupted by mechanical movement.", type: "Entropy", deepDiveImage: "/deep-dive/entropy_forensics.png" },
          { q: "What is an 'Electrode Pop'?", a: "This is a sudden vertical cliff in the data. It happens when the sensor momentarily loses contact with the skin, creating a signal mathematically impossible for a human body.", type: "Contact Loss", deepDiveImage: "/deep-dive/electrode_pop.png" },
          { q: "Why is artifact removal critical?", a: "If artifacts are not removed, they contaminate the statistical mean. A researcher might think a subject is stressed when they are actually just moving, leading to false findings.", type: "Integrity", deepDiveImage: "/deep-dive/data_integrity.png" },
          { q: "How does breathing create noise?", a: "Deep gasps can stretch the skin near electrodes. This changes the local resistance, creating a small bump mimicking a Phasic response. High-pass filters help isolate these cycles.", type: "Respiratory", deepDiveImage: "/deep-dive/respiratory_noise.png" },
          { q: "What is High-Frequency Energy?", a: "Biological sweat responses are slow. Mechanical noise is very fast. By measuring HFE, we can isolate the 'Buzz' of physical movement and strip it away, leaving the clean wave.", type: "Frequency", deepDiveImage: "/deep-dive/frequency_domain.png" },
          { q: "Can sensor placement prevent noise?", a: "Placing sensors on the non-dominant hand or using medical-grade adhesive tape reduces artifacts significantly. However, some noise is inevitable, requiring ML reconstruction.", type: "Placement", deepDiveImage: "/deep-dive/sensor_placement.png" },
          { q: "What is a 'Baseline Drift'?", a: "Signal drift happens as posture changes slowly over time, causing a shift in the Tonic level unrelated to sweat. This is managed using sophisticated high-pass filters.", type: "Drift Control", deepDiveImage: "/deep-dive/drift_logic.png" },
          { q: "How does the AI flag artifacts?", a: "The AI looks at the 'Fingerprint' of each wave. If the slope is too steep or recovery too short, it flags it as 'Non-Biological' for forensic interpolation.", type: "AI Detection", deepDiveImage: "/deep-dive/ai_flagging.png" },
          { q: "What is 'Signal Integrity'?", a: "Integrity is the ratio of clean biological data to noise. Our workstation calculates a 'Confidence Score' for every window of data to ensure scientific validity.", type: "Metrics", deepDiveImage: "/deep-dive/signal_quality.png" }
        ]
      },
      {
        id: "ml", title: "Forensic ML", icon: <BrainCircuit />, color: "purple",
        questions: [
          { q: "What is Contrastive Learning (CUL)?", a: "Contrastive Unsupervised Learning works by comparing 'Real' signal segments against 'Noisy' ones. The AI identifies features that distinguish biological signatures from motion noise.", type: "CUL Logic", deepDiveImage: "/deep-dive/cul_architecture.png" },
          { q: "How does a GMM cluster data?", a: "A Gaussian Mixture Model treats data as parts of different 'Clouds.' It calculates the probability that a point belongs to 'Bio' or 'Noise' for nuanced separation.", type: "Probability", deepDiveImage: "/deep-dive/gmm_clusters.png" },
          { q: "What is Neural Interpolation?", a: "When an artifact is removed, interpolation uses surrounding Tonic data and mathematical curves to guess the biological signal that was hidden, creating a healed trace.", type: "Healing", deepDiveImage: "/deep-dive/interpolation_logic.png" },
          { q: "Why use Unsupervised models?", a: "Supervised models require human labeling. Unsupervised models are better for EDA because every person's skin is unique; the AI discovers the 'Normal' pattern on the fly.", type: "Unsupervised", deepDiveImage: "/deep-dive/unsupervised_benefits.png" },
          { q: "What is a 'Feature Vector'?", a: "A feature vector is a math list sent to the AI, including Mean EDA, Standard Deviation, and Shannon Entropy. These numbers together form a signal 'Fingerprint'.", type: "Vectors", deepDiveImage: "/deep-dive/feature_vectors.png" },
          { q: "How fast is the ML engine?", a: "Our engine analyzes and heals a 1-second window in approximately 1.2ms, allowing for real-time 'Live-Heal' visualization during biometric recordings.", type: "Speed", deepDiveImage: "/deep-dive/inference_speed.png" },
          { q: "What is 'Confidence Thresholding'?", a: "The AI provides a score from 0 to 1. If it's below 0.8, the system flags the data as unreliable, ensuring only high-integrity data is used for analysis.", type: "Threshold", deepDiveImage: "/deep-dive/confidence_gate.png" },
          { q: "Can the AI distinguish SCR from Noise?", a: "Yes. Real SCR peaks have specific Rise and Recovery times. Mechanical noise doesn't follow biological rules. The AI uses these constraints to distinguish them.", type: "Temporal", deepDiveImage: "/deep-dive/scr_discrimination.png" },
          { q: "What is 'Latent Space Mapping'?", a: "This is where the AI imagines the signal in multi-dimensional space. Biological data and artifacts are far apart, making it easy to draw a boundary.", type: "Latent Space", deepDiveImage: "/deep-dive/latent_space.png" },
          { q: "What is CUL-Version 4?", a: "CUL-V4 utilizes 'Contrastive Anchoring,' using the stable Tonic level as an anchor to verify that Phasic spikes are mathematically tied to the actual baseline.", type: "Algorithm", deepDiveImage: "/deep-dive/cul_version_4.png" }
        ]
      },
      {
        id: "signal", title: "Signal Analysis", icon: <Layers />, color: "blue",
        questions: [
          { q: "What is the Tonic / Phasic split?", a: "Raw EDA is like a river with splashes. Tonic is the slow river (baseline), and Phasic refers to sudden splashes (event peaks). Separating them allows us to measure specific stress.", type: "Wave Split", deepDiveImage: "/deep-dive/tonic_phasic_split.png" },
          { q: "How does CVXEDA decomposition work?", a: "CVXEDA is a convex optimization algorithm that finds the best way to separate the slow baseline from sparse peaks without distorting response timing.", type: "Convex", deepDiveImage: "/deep-dive/cvxeda_math.png" },
          { q: "What is 'Peak Amplitude'?", a: "Amplitude is the height of a Phasic spike. It tells us the 'Intensity' of reaction. A larger amplitude usually correlates with a stronger emotional response.", type: "Intensity", deepDiveImage: "/deep-dive/peak_amplitude.png" },
          { q: "How do we measure 'Rise Time'?", a: "Rise time is the duration from peak start to its maximum. In humans, this is 1-3 seconds. Anything significantly faster is flagged as a mechanical artifact.", type: "Rise Time", deepDiveImage: "/deep-dive/rise_time_calc.png" },
          { q: "What is the 'Area Under Curve' (AUC)?", a: "AUC measures total 'Emotional Energy.' By calculating the area of Phasic peaks, researchers determine the total sympathetic arousal experienced over time.", type: "Energy Sum", deepDiveImage: "/deep-dive/auc_calculation.png" },
          { q: "Why use High-Pass Filtering?", a: "High-pass filters allow fast Phasic spikes to pass while blocking slow Tonic changes. This is used when researchers only care about reactions to specific stimuli.", type: "Filtering", deepDiveImage: "/deep-dive/high_pass_filter.png" },
          { q: "What is SCL Recovery?", a: "After an emotional event, SCL returns to normal. The speed of recovery measures 'Autonomic Resilience'—how fast the nervous system calms down after stress.", type: "Recovery", deepDiveImage: "/deep-dive/scl_recovery.png" },
          { q: "How does sampling rate affect waves?", a: "Low sampling rates might miss sharp peaks. We use higher rates (32Hz+) to ensure we capture the precise moment the sweat gland activates.", type: "Resolution", deepDiveImage: "/deep-dive/sampling_rate.png" },
          { q: "What is 'Nonspecific SCRs' (NS-SCRs)?", a: "These are random peaks without a specific stimulus. They measure 'Trait Anxiety.' Stressed individuals show more frequent NS-SCRs in quiet environments.", type: "Trait", deepDiveImage: "/deep-dive/ns_scr_peaks.png" },
          { q: "What is Signal-to-Noise Ratio (SNR)?", a: "SNR compares biological signal strength to noise. A high SNR means the data is 'Clean,' while a low SNR suggests compromised findings.", type: "Signal Health", deepDiveImage: "/deep-dive/snr_ratio.png" }
        ]
      }
  ];

  const currentMod = modules.find(m => m.id === activeModule);

  return (
    <div className="h-screen w-full bg-[#020617] text-white font-sans selection:bg-blue-500/30 overflow-hidden relative p-6 flex flex-col">
      <NeuralDust />

      <div className="max-w-[1600px] mx-auto w-full h-full flex flex-col relative z-10">
        
        <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none select-none mb-2">
          Signal <span className="text-blue-600">Science.</span>
        </h1>

        <div className="flex items-center justify-between mb-6 gap-6 bg-white/5 p-4 rounded-[25px] border border-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-6">
            <motion.a 
              href="/docs/research.pdf" download
              whileHover={{ scale: 1.05, backgroundColor: "#3b82f6" }}
              className="flex items-center gap-3 px-4 py-2 bg-blue-600/20 border border-blue-500/40 rounded-xl text-blue-400 hover:text-white transition-all group"
            >
              <Download size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Research PDF</span>
            </motion.a>

            <div className="h-8 w-[1px] bg-white/10" />

            <div className="flex items-center gap-3">
              <Info size={14} className="text-slate-500"/>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic max-w-sm">
                Forensic signal processing and double-click deep-dive visualization active.
              </p>
            </div>
          </div>

          <div className="hidden md:flex gap-4">
            <div className="text-right font-mono leading-tight">
                <span className="block text-[7px] text-slate-500 uppercase font-black">Accuracy</span>
                <span className="text-blue-500 text-[10px] font-bold tracking-widest">99.8%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 mb-6 overflow-hidden max-h-[200px]">
           <div className="col-span-8 bg-slate-900/30 border border-white/5 rounded-[40px] p-6 backdrop-blur-md flex flex-col justify-center relative overflow-hidden shadow-inner">
              <Fingerprint className="absolute -bottom-10 -left-10 text-white opacity-[0.03]" size={250}/>
              <h4 className="text-blue-500 text-[9px] font-black uppercase tracking-[0.4em] mb-2"><Target size={12} className="inline mr-2"/>Station Objective</h4>
              <p className="text-2xl font-black italic uppercase tracking-tighter text-slate-300 leading-tight">
                Mapping biological arousal via <span className="text-white border-b-2 border-blue-600">Skin Conductance</span>, utilizing unsupervised logic to reconstruct signal integrity.
              </p>
           </div>
           <div className="col-span-4 bg-slate-900/40 border border-white/5 rounded-[40px] p-6 backdrop-blur-md flex flex-col justify-center gap-4 shadow-2xl">
              <div>
                 <div className="flex justify-between items-center mb-2"><span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Accuracy</span><ShieldCheck size={14} className="text-emerald-500"/></div>
                 <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                    <motion.div initial={{ width: 0 }} animate={{ width: "99.8%" }} transition={{ duration: 2 }} className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"/>
                 </div>
              </div>
              <div>
                 <div className="flex justify-between items-center mb-2"><span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Neural Link</span><Cpu size={14} className="text-blue-500"/></div>
                 <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                    <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 2.5 }} className="h-full bg-blue-600 shadow-[0_0_10px_#3b82f6]"/>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 h-36">
          {modules.map((mod) => (
            <motion.button
              key={mod.id}
              onClick={() => {setActiveModule(mod.id); setCurrentIdx(0);}}
              whileHover={{ y: -5, backgroundColor: "rgba(15, 23, 42, 0.9)" }}
              className={`h-full p-6 bg-slate-900/40 border border-white/10 rounded-[40px] text-left group transition-all relative overflow-hidden flex flex-col justify-between backdrop-blur-md shadow-lg`}
            >
              <div className={`p-2 bg-${mod.color}-500/10 rounded-xl text-${mod.color}-500 w-fit group-hover:scale-110 transition-transform`}>
                {mod.icon}
              </div>
              <div>
                <h3 className="text-xl font-black italic uppercase tracking-tight">{mod.title}</h3>
                <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">Initiate Extraction</p>
              </div>
              <div className={`absolute bottom-0 left-0 w-full h-1 bg-${mod.color}-500 opacity-0 group-hover:opacity-100 transition-opacity`} />
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {activeModule && currentMod && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 100 }}
              className="absolute inset-0 z-50 bg-[#020617]/95 backdrop-blur-3xl border border-white/10 rounded-[50px] flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/20">
                <div className="flex items-center gap-6">
                  <div className={`p-3 bg-${currentMod.color}-500/20 text-${currentMod.color}-500 rounded-2xl`}>
                    {currentMod.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">{currentMod.title}</h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1 italic">Knowledge Extraction // SF_0{currentIdx + 1}</p>
                  </div>
                </div>
                <button onClick={() => setActiveModule(null)} className="p-3 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-full transition-all">
                  <X size={28} />
                </button>
              </div>

              <div className="flex-1 grid lg:grid-cols-2 overflow-hidden">
                <div className="p-10 border-r border-white/5 flex flex-col items-center justify-center relative bg-slate-900/10">
                   {/* NODE WITH DOUBLE CLICK PROP */}
                   <PluckableNode 
                      color={currentMod.color} 
                      label={currentMod.questions[currentIdx].type} 
                      onDoubleClick={() => setActiveDeepDive(currentMod.questions[currentIdx].deepDiveImage)}
                   />
                   <div className="mt-8 text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-2 underline underline-offset-4">Specimen Node</p>
                      <p className="text-slate-500 text-[10px] italic font-bold max-w-sm">Physics-enabled model. Double-click diagram for forensic Deep-Dive image.</p>
                   </div>
                </div>

                <div className="p-10 flex flex-col h-full bg-slate-900/5 relative">
                  <div className="absolute top-6 right-10 flex gap-4">
                     <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(v => v - 1)} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 disabled:opacity-10 transition-all border border-white/5"><ChevronLeft size={24}/></button>
                     <button disabled={currentIdx === currentMod.questions.length - 1} onClick={() => setCurrentIdx(v => v + 1)} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 disabled:opacity-10 transition-all border border-white/5"><ChevronRight size={24}/></button>
                  </div>

                  <div className="mt-8 flex-1 flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={currentIdx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                        className="h-full flex flex-col justify-center"
                      >
                        <h4 className="text-3xl font-black italic uppercase tracking-tighter mb-6 leading-tight text-white border-l-4 border-blue-600 pl-4">
                          {currentMod.questions[currentIdx].q}
                        </h4>
                        <div className={`p-6 bg-${currentMod.color}-500/5 border border-${currentMod.color}-500/20 rounded-2xl shadow-inner backdrop-blur-md`}>
                           <p className="text-base text-slate-300 leading-relaxed font-medium italic tracking-tight">
                             {currentMod.questions[currentIdx].a}
                           </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 font-black uppercase text-[8px] tracking-widest mt-6">
                    <CheckCircle2 size={12} className="text-emerald-500"/>
                    Validation bio-node protocol 0.4.1
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- 5. DEEP DIVE OVERLAY MODAL (RECOMONDATION) --- */}
        <AnimatePresence>
          {activeDeepDive && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-10 cursor-zoom-out"
              onClick={() => setActiveDeepDive(null)}
            >
               <motion.div 
                 initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }}
                 className="relative max-w-5xl w-full bg-slate-900 p-2 rounded-[30px] border border-white/20 shadow-[0_0_80px_rgba(59,130,246,0.3)] overflow-hidden"
                 onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
               >
                  {/* INSTRUCTION: Place your forensic images in public/deep-dive/ folder */}
                  <img 
                    src={activeDeepDive} 
                    alt="Forensic Deep Dive" 
                    className="w-full h-auto rounded-[20px] shadow-2xl object-contain max-h-[75vh]" 
                  />
                  <div className="absolute top-6 right-6">
                      <button onClick={() => setActiveDeepDive(null)} className="bg-black/60 p-3 rounded-full text-white hover:bg-red-500 transition-all border border-white/10">
                          <X size={24} />
                      </button>
                  </div>
                  <div className="p-6 bg-slate-900 border-t border-white/5 flex justify-between items-center">
                      <div className="flex flex-col">
                          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 mb-1">Dossier Deep-Dive // Forensic Specimen</p>
                          <p className="text-slate-400 text-[11px] italic">Technical Capture SF-00{currentIdx + 1} // Biometric Source Verification</p>
                      </div>
                      <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <Maximize2 size={12} /> High-Resolution Link
                      </div>
                  </div>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
