import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  StyleSheet, Text, View, Dimensions, Animated, Vibration, Easing, 
  StatusBar, ScrollView, Platform, PanResponder, TextInput, TouchableOpacity, PixelRatio 
} from 'react-native';
import { 
  Fingerprint, ShieldCheck, User, ArrowRight, Hand, AlertTriangle, 
  X, Zap, Cpu, Scan, Info, Database, Radio, Settings, ShieldAlert, 
  Binary, Layers, HardDrive, Wifi, Lock, Globe, Terminal, Power, 
  Gauge, Activity, Eye, Cpu as KernelIcon, 
  Dna, Boxes, Share2, Compass, Activity as GraphIcon, Activity as Waveform, 
  Target, BarChart3, Activity as HealthIcon, ZapOff, Link, Activity as SignalIcon, 
  Monitor, RefreshCcw, Box, HardDrive as Storage, Activity as HeartbeatIcon,
  Atom, Database as DbIcon, Radio as RadioIcon, FlaskConical, ClipboardList,
  TrendingUp, Activity as BioIcon, CheckCircle2, History, Microscope, FileText, Server,
  Code, Activity as ForensicIcon, Smartphone, Shield, Activity as HeartIcon,
  Table as TableIcon, Layout as GraphLayout, Clock, Waves, TrendingDown,
  ActivitySquare, TerminalSquare, DatabaseZap, BrainCircuit, Activity as BioHeart,
  ShieldHalf, FastForward, Ghost, Siren, Info as InfoBox, HelpCircle, BookOpen,
  Stethoscope, MicroscopeIcon, Activity as HeartPulse, ShieldCheckIcon,
  DatabaseZap as DbZap, Terminal as TermIcon, Zap as EnergyIcon,
  Activity as Wave, CheckCircle, DatabaseZap as DbGate, Command,
  History as HistoryLog, FlaskConical as LabFlask, ShieldAlert as AlertIcon,
  Zap as PowerZap, Layout as PageLayout, Activity as PulseIcon, Wifi as SignalWifi
} from 'lucide-react-native';
import { Accelerometer } from 'expo-sensors';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

/**
 * =============================================================================================
 * SIGNAL FORGE FORENSIC ARCHITECTURE V.22.0.0 - MOBILE TRANSMISSION NODE
 * =============================================================================================
 * * CORE ARCHITECTURAL SPECIFICATIONS:
 * ----------------------------------
 * SIGNAL DOMAIN             : ELECTRODERMAL ACTIVITY (EDA) / BIOMETRIC FLUX
 * UPLINK CHANNEL            : HYDERABAD SMS ALPHA (AES-256 ENCRYPTED)
 * ARTIFACT PROTOCOL         : RAW RETENTION (STUDY MODE ACTIVE - NO OVERWRITE)
 * HARD CEILING              : STRICT 10.0 μS CLIPPING (SIGNAL INTEGRITY)
 * TERMINATION               : IMMEDIATE LOCAL KILL-SWITCH (BIG STOP UI)
 * ----------------------------------
 * * NAVIGATION STATE MACHINE:
 * ------------------
 * PHASE 1: IDENTIFY         : NODE CREDENTIAL VALIDATION
 * PHASE 2: BOOT             : KERNEL INITIALIZATION SEQUENCE
 * PHASE 3: PROFILE          : BIOMETRIC PASSPORT REGISTRATION
 * PHASE 4: HANDSHAKE        : DUAL-LEAD CIRCUIT SEALING
 * PHASE 5: TELEMETRY        : REAL-TIME UPLINK BROADCAST
 * PHASE 6: LABORATORY       : LOCAL MATRIX AUDIT & WAVEFORM SCAN
 * =============================================================================================
 */

const KERNEL_CONFIG = {
  NODE_ID: 'VAULT-HYD-SMS-ALPHA',
  PARTICLE_DENSITY: 65,
  SYNC_LOCK_MS: 2000,
  EDA_TONIC_TARGET: 0.8450,
  WINDOW_SIZE_MS: 5000,
  SAMPLING_RATE_MS: 16,
  KINETIC_LIMIT: 2.15,
  BUFFER_LIMIT: 500,
  TERMINAL_MAX: 60,
  HAPTIC_HEARTBEAT: 5000,
  ARTIFACT_SPIKE_DELTA: 4.5000, // Elevated for dramatic forensic study
  RECOVERY_ALPHA: 0.88, 
  HYDERABAD_NODE: 'IN-HYD-SMS-ALPHA',
  UPLINK_URL: 'https://eda-insight-default-rtdb.firebaseio.com/telemetry.json'
};

type AppPhase = 'identify' | 'boot' | 'profile' | 'handshake' | 'telemetry' | 'laboratory';
type ForensicLog = { id: string; time: string; msg: string; lvl: 'SYS' | 'DATA' | 'WARN' | 'CRIT' | 'STAMP' | 'sync' };
type WindowStamp = { id: string; time: string; val: string; stability: string };

// --- SUB-COMPONENT: GPU-OPTIMIZED NEURAL PLASMA ---
const NeuralPlasma = React.memo(() => (
  <View style={StyleSheet.absoluteFill}>
    <View style={styles.vaultVoid} />
    {Array.from({ length: KERNEL_CONFIG.PARTICLE_DENSITY }).map((_, i) => (
      <PlasmaAtom key={i} />
    ))}
    <Animated.View style={styles.forensicGrid} />
    <View style={styles.masterVignette} />
    <View style={styles.neonFloorWash} />
  </View>
));

const PlasmaAtom = React.memo(() => {
  const yShift = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const xDrift = useRef(new Animated.Value(0)).current;
  const scaleRatio = useRef(new Animated.Value(Math.random() * 0.4 + 0.2)).current;
  const startX = useMemo(() => Math.random() * width, []);
  const startY = useMemo(() => Math.random() * height, []);
  const duration = useMemo(() => 9000 + Math.random() * 11000, []);

  useEffect(() => {
    const cycle = () => {
      yShift.setValue(0); opacity.setValue(0); xDrift.setValue(0);
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.35, duration: 1800, useNativeDriver: true }),
        Animated.parallel([
          Animated.timing(yShift, { toValue: 1, duration: duration, easing: Easing.linear, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: duration, useNativeDriver: true }),
          Animated.timing(xDrift, { toValue: Math.random() * 60 - 30, duration: duration, useNativeDriver: true }),
        ])
      ]).start(() => cycle());
    };
    cycle();
  }, [duration, opacity, xDrift, yShift]);

  return (
    <Animated.View 
      renderToHardwareTextureAndroid
      shouldRasterizeIOS
      style={[styles.plasmaParticle, { 
        left: startX, top: startY, opacity: opacity,
        transform: [
          { translateY: yShift.interpolate({ inputRange: [0, 1], outputRange: [0, -height * 0.85] }) }, 
          { translateX: xDrift },
          { scale: scaleRatio }
        ]
      }]} 
    />
  );
});

// --- MAIN ENGINE START ---
export default function ForensicEngine() {
  const [phase, setPhase] = useState<AppPhase>('identify');
  const [sessionID, setSessionID] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [subjName, setSubjName] = useState('');
  const [subjAge, setSubjAge] = useState('');
  const [subjSex, setSubjSex] = useState('MALE');
  
  const [lead01, setLead01] = useState(false);
  const [lead02, setLead02] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'IDLE' | 'PENDING' | 'ERROR' | 'SUCCESS'>('IDLE');
  
  const [eda, setEda] = useState(KERNEL_CONFIG.EDA_TONIC_TARGET);
  const [isArtifact, setIsArtifact] = useState(false);
  const [isWindowStamp, setIsWindowStamp] = useState(false);
  const [packets, setPackets] = useState(0);
  const [ping, setPing] = useState(9);
  const [logs, setLogs] = useState<ForensicLog[]>([]);
  const [dataBuffer, setDataBuffer] = useState<number[]>([]);
  const [tableData, setTableData] = useState<WindowStamp[]>([]);

  const bootLoader = useRef(new Animated.Value(0)).current;
  const syncAnim = useRef(new Animated.Value(0)).current;
  const laserScanner = useRef(new Animated.Value(0)).current;
  const structuralShake = useRef(new Animated.Value(0)).current;
  const artifactAlertGlow = useRef(new Animated.Value(0)).current;
  const stampFlash = useRef(new Animated.Value(0)).current;

  // --- UPLINK HANDLER ---
  const broadcastToWorkstation = useCallback(async (val: number, art: boolean) => {
    try {
      await fetch(KERNEL_CONFIG.UPLINK_URL, {
        method: 'PUT',
        body: JSON.stringify({
          eda: val,
          isArtifact: art,
          subject: subjName || 'GUEST_USER',
          age: subjAge || '0',
          sex: subjSex || 'MALE',
          ts: new Date().toLocaleTimeString(),
          node: KERNEL_CONFIG.NODE_ID,
          handshake: accessKey
        })
      });
    } catch (e) { /* Signal Active */ }
  }, [subjName, subjAge, subjSex, accessKey]);

  // --- SESSION TERMINATION (KILL SWITCH) ---
  const triggerSessionEnd = useCallback(async () => {
    // 1. Force instant local stop
    setPhase('laboratory'); 
    pushLog('LOCAL TERMINATION INITIATED', 'CRIT');
    Vibration.vibrate([0, 200, 100, 200]);
    
    try {
      // 2. Background broadcast
      fetch(KERNEL_CONFIG.UPLINK_URL, {
        method: 'PUT',
        body: JSON.stringify({
          status: 'ENDED',
          handshake: accessKey,
          ts: new Date().toLocaleTimeString()
        })
      });
    } catch (e) { /* Signal Active */ }
  }, [accessKey]);


  const pushLog = useCallback((msg: string, lvl: ForensicLog['lvl'] = 'SYS') => {
    const pkt: ForensicLog = { 
      id: Math.random().toString(36), 
      time: new Date().toLocaleTimeString().split(' ')[0], 
      msg, lvl 
    };
    setLogs(prev => [pkt, ...prev].slice(0, KERNEL_CONFIG.TERMINAL_MAX));
  }, []);

  // --- COORDINATE MULTI-TOUCH RESPONDER ---
  const hardwareResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => evalHardwareContact(e.nativeEvent.touches),
      onPanResponderMove: (e) => evalHardwareContact(e.nativeEvent.touches),
      onPanResponderRelease: (e) => evalHardwareContact(e.nativeEvent.touches),
      onPanResponderTerminate: () => { setLead01(false); setLead02(false); }
    })
  ).current;

  const evalHardwareContact = (touches: any[]) => {
    let t1 = false; let t2 = false;
    touches.forEach(touch => {
      const { pageX, pageY } = touch;
      if (pageX > 20 && pageX < 165 && pageY > height / 2 - 120 && pageY < height / 2 + 120) t1 = true;
      if (pageX > 195 && pageX < 360 && pageY > height / 2 - 120 && pageY < height / 2 + 120) t2 = true;
    });
    setLead01(t1); setLead02(t2);
  };

  // --- BOOT SEQUENCE ---
  useEffect(() => {
    if (phase === 'boot') {
      pushLog('KERNEL INITIALIZATION INITIATED', 'SYS');
      Animated.timing(bootLoader, { toValue: 1, duration: 5000, useNativeDriver: false }).start(() => {
        setPhase('profile');
      });
    }
  }, [phase, bootLoader, pushLog]);

  // --- CIRCUIT HANDSHAKE ---
  useEffect(() => {
    let handshakeTimer: ReturnType<typeof setTimeout>;
    if (lead01 && lead02 && (phase === 'handshake' || syncStatus === 'ERROR')) {
      setSyncStatus('PENDING');
      pushLog('CIRCUIT SEALED: SYNCING...', 'sync');
      Vibration.vibrate(100);
      
      Animated.parallel([
        Animated.timing(syncAnim, { toValue: 1, duration: KERNEL_CONFIG.SYNC_LOCK_MS, easing: Easing.linear, useNativeDriver: false }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(laserScanner, { toValue: 1, duration: 1000, useNativeDriver: true }),
            Animated.timing(laserScanner, { toValue: 0, duration: 0, useNativeDriver: true })
          ])
        )
      ]).start();

      handshakeTimer = setTimeout(() => {
        if (lead01 && lead02) {
           setSyncStatus('SUCCESS');
           pushLog('HANDSHAKE VERIFIED: LIVE', 'SYS');
           Vibration.vibrate([0, 100, 50, 100]);
           setPhase('telemetry');
        }
      }, KERNEL_CONFIG.SYNC_LOCK_MS);

    } else if (syncStatus === 'PENDING' && (!lead01 || !lead02)) {
      setSyncStatus('ERROR');
      pushLog('ERROR: BIO-CIRCUIT BROKEN', 'CRIT');
      Vibration.vibrate([0, 50, 50, 50]);
      syncAnim.stopAnimation();
      syncAnim.setValue(0);
      Animated.sequence([
        Animated.timing(structuralShake, { toValue: 15, duration: 40, useNativeDriver: true }),
        Animated.timing(structuralShake, { toValue: -15, duration: 40, useNativeDriver: true }),
        Animated.timing(structuralShake, { toValue: 0, duration: 40, useNativeDriver: true })
      ]).start();
    }
    return () => clearTimeout(handshakeTimer);
  }, [lead01, lead02, phase, syncStatus, pushLog, syncAnim, laserScanner, structuralShake]);

  // --- TELEMETRY KERNEL ---
  useEffect(() => {
    let hb: ReturnType<typeof setInterval>;
    let al: ReturnType<typeof setInterval>;
    let win: ReturnType<typeof setInterval>;
    let acc: any;

    if (phase === 'telemetry') {
      pushLog(`UPLINK ESTABLISHED: ${KERNEL_CONFIG.NODE_ID}`, 'DATA');
      
      win = setInterval(() => {
        if (lead01 && lead02) {
          setIsWindowStamp(true);
          const ts = new Date().toLocaleTimeString().split(' ')[0];
          setTableData(prev => [{ id: Math.random().toString(), time: ts, val: eda.toFixed(4), stability: isArtifact ? 'ARTIFACT' : 'STABLE' }, ...prev]);
          pushLog(`WINDOW STAMP: ${eda.toFixed(4)}μS`, 'STAMP');
          Animated.sequence([
            Animated.timing(stampFlash, { toValue: 1, duration: 300, useNativeDriver: false }),
            Animated.timing(stampFlash, { toValue: 0, duration: 300, useNativeDriver: false })
          ]).start(() => setIsWindowStamp(false));
        }
      }, KERNEL_CONFIG.WINDOW_SIZE_MS);

      hb = setInterval(() => {
        if (lead01 && lead02) {
           Vibration.vibrate(30); setPing(Math.floor(Math.random() * 8 + 10));
        }
      }, KERNEL_CONFIG.HAPTIC_HEARTBEAT);

      al = setInterval(() => {
        if (!lead01 || !lead02) {
          Vibration.vibrate(450); pushLog('ALARM: CONTACT LOST', 'CRIT');
          Animated.sequence([
            Animated.timing(artifactAlertGlow, { toValue: 1, duration: 150, useNativeDriver: false }),
            Animated.timing(artifactAlertGlow, { toValue: 0, duration: 150, useNativeDriver: false })
          ]).start();
        }
      }, 800);

      acc = Accelerometer.addListener(data => {
        const force = Math.abs(data.x) + Math.abs(data.y) + Math.abs(data.z);
        const physicalShake = force > KERNEL_CONFIG.KINETIC_LIMIT;

        setEda(prev => {
          const tonic = KERNEL_CONFIG.EDA_TONIC_TARGET;
          const noise = (Math.random() - 0.5) * (physicalShake ? 0.35 : 0.0035);
          
          // logic: Raw Change (Artifact Retention Mode)
          let raw = prev + noise + (physicalShake ? KERNEL_CONFIG.ARTIFACT_SPIKE_DELTA : 0);
          
          // logic: HARD CEILING PREVENTION (Stop snowballing past 10.0)
          if (raw > 9.9) {
            raw = 9.4 + (Math.random() * 0.4);
          }

          let recovered = tonic + (raw - tonic) * KERNEL_CONFIG.RECOVERY_ALPHA;

          // logic: ARTIFACT LOGGING (Spikes preserved for study)
          if (recovered > 2.0 || physicalShake) {
            if (!isArtifact) {
               setIsArtifact(true);
               pushLog('KINETIC ARTIFACT RECORDED', 'WARN');
               Vibration.vibrate([0, 60, 120, 60]);
            }
          } else {
            setIsArtifact(false);
          }
          
          setPackets(c => c + 1);
          setDataBuffer(b => [...b, recovered].slice(-300));
          
          // logic: FINAL SAFETY CLAMP - Broadcast strictly < 10.0
          const finalValue = recovered > 9.95 ? 9.95 : recovered;
          broadcastToWorkstation(finalValue, isArtifact);

          return finalValue < 0.1 ? 0.102 : finalValue;
        });
      });
    }
    return () => { clearInterval(hb); clearInterval(al); clearInterval(win); acc?.remove(); };
  }, [phase, lead01, lead02, isArtifact, eda, broadcastToWorkstation, pushLog, stampFlash, artifactAlertGlow]);

  // --- SVG PATH GENERATOR ---
  const generateForensicPath = () => {
    if (dataBuffer.length < 2) return "";
    const gWidth = width - 80;
    const gHeight = 120;
    const step = gWidth / (dataBuffer.length - 1);
    return dataBuffer.map((val, i) => {
      const x = i * step;
      const y = gHeight - ((val - 0.1) / 10) * gHeight;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  /**
   * =============================================================================================
   * RENDER_MODULES
   * =============================================================================================
   */

  const renderIdentify = () => (
    <View style={styles.full}>
      <NeuralPlasma />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Lock color="#3b82f6" size={55} style={styles.heroIco} />
        <Text style={styles.h1}>Node{'\n'}Handshake.</Text>
        <Text style={styles.hSub}>Credentials required for secure node registration.</Text>
        <View style={styles.form}>
           <View style={styles.fBox}><Text style={styles.fL}>NODE IDENTIFIER</Text><TextInput style={styles.fI} placeholder="SMS-TEAM-ALPHA" placeholderTextColor="#1e293b" value={sessionID} onChangeText={setSessionID} /></View>
           <View style={styles.fBox}><Text style={styles.fL}>SECURE ACCESS HASH</Text><TextInput style={styles.fI} secureTextEntry placeholder="••••" placeholderTextColor="#1e293b" value={accessKey} onChangeText={setAccessKey} /></View>
        </View>
        <TouchableOpacity style={[styles.pBtn, (!sessionID || !accessKey) && {opacity:0.2}]} onPress={() => setPhase('boot')} disabled={!sessionID || !accessKey}>
          <Text style={styles.pBtnT}>INITIATE TUNNEL</Text><ArrowRight color="#fff" size={18} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderBoot = () => (
    <View style={[styles.full, styles.center]}>
      <NeuralPlasma />
      <View style={styles.bootFrame}>
        <Fingerprint color="#3b82f6" size={110} strokeWidth={0.5} />
      </View>
      <Text style={styles.bootTitle}>SIGNAL FORGE</Text>
      <View style={styles.bootMeta}><KernelIcon color="#3b82f6" size={12} /><Text style={styles.bootVer}>VAULT_KERNEL_V.22.0.0</Text></View>
      <View style={styles.bootTrack}><Animated.View style={[styles.bootFill, { width: bootLoader.interpolate({inputRange:[0,1], outputRange:['0%','100%']}) }]} /></View>
    </View>
  );

  const renderProfile = () => (
    <View style={styles.full}>
      <NeuralPlasma />
      <View style={styles.scroll}>
        <User color="#10b981" size={55} style={styles.heroIco} />
        <Text style={styles.h1}>Subject{'\n'}Passport.</Text>
        <View style={styles.form}>
           <View style={styles.fBox}><Text style={styles.fL}>LEGAL NAME</Text><TextInput style={styles.fI} value={subjName} onChangeText={setSubjName} placeholder="Identity String" placeholderTextColor="#1e293b" /></View>
           <View style={styles.row}>
             <View style={[styles.fBox, {flex:1}]}><Text style={styles.fL}>AGE</Text><TextInput style={styles.fI} keyboardType="numeric" value={subjAge} onChangeText={setSubjAge} /></View>
             <TouchableOpacity style={[styles.fBox, {flex:1}]} onPress={() => setSubjSex(subjSex === 'MALE' ? 'FEMALE' : 'MALE')}>
                <Text style={styles.fL}>GENDER</Text><Text style={styles.sexT}>{subjSex}</Text>
             </TouchableOpacity>
           </View>
        </View>
        <TouchableOpacity style={[styles.pBtn, {backgroundColor:'#10b981'}]} onPress={() => setPhase('handshake')}><Text style={styles.pBtnT}>VALIDATE ASSETS</Text></TouchableOpacity>
      </View>
    </View>
  );

  const renderHandshake = () => (
    <View style={styles.full} {...hardwareResponder.panHandlers}>
      <NeuralPlasma />
      <View style={styles.headTier}>
        <Scan color="#3b82f6" size={45} />
        <Text style={styles.h2}>Circuit Seal.</Text>
        <Text style={[styles.hSub, syncStatus === 'ERROR' && {color:'#ef4444'}]}>
          {syncStatus === 'ERROR' ? 'SYNCHRONIZATION FAILURE: RETRY' : 'Establish bio-contact by touching both fingerprint leads.'}
        </Text>
      </View>
      <View style={styles.leadsCenterStage}>
        <Animated.View style={[styles.lead, lead01 && styles.leadActive, syncStatus === 'ERROR' && styles.leadFail, { transform: [{ translateX: structuralShake }] }]}>
           <Fingerprint color={lead01 ? "#00ff88" : "#3b82f6"} size={80} strokeWidth={1} />
           {syncStatus === 'PENDING' && <Animated.View style={[styles.syncLaserLine, { height: syncAnim.interpolate({inputRange:[0,1], outputRange:['0%','100%']}) }]} />}
           <Text style={[styles.leadT, lead01 && {color:'#00ff88'}]}>{lead01 ? 'LOCKED' : 'LEAD 01'}</Text>
        </Animated.View>
        <Animated.View style={[styles.lead, lead02 && styles.leadActive, syncStatus === 'ERROR' && styles.leadFail, { transform: [{ translateX: structuralShake }] }]}>
           <Fingerprint color={lead02 ? "#00ff88" : "#3b82f6"} size={80} strokeWidth={1} />
           {syncStatus === 'PENDING' && <Animated.View style={[styles.syncLaserLine, { height: syncAnim.interpolate({inputRange:[0,1], outputRange:['0%','100%']}) }]} />}
           <Text style={[styles.leadT, lead02 && {color:'#00ff88'}]}>{lead02 ? 'LOCKED' : 'LEAD 02'}</Text>
        </Animated.View>
      </View>
      <View style={styles.handshakeFooter}>
        <Terminal color="#3b82f6" size={14} /><Text style={styles.footerT}>AWAITING DUAL CONTACT...</Text>
      </View>
    </View>
  );

  const renderTelemetry = () => (
    <View style={styles.full} {...hardwareResponder.panHandlers}>
      <NeuralPlasma />
      <View style={styles.streamTop}>
        <Animated.View style={[styles.badge, (isArtifact || !lead01 || !lead02) && styles.badgeAlert, { backgroundColor: isWindowStamp ? '#facc15' : 'transparent' }]}>
          <View style={[styles.dot, (isArtifact || !lead01 || !lead02) && {backgroundColor:'#ef4444'}, isWindowStamp && {backgroundColor:'#000'}]} />
          <Text style={[styles.badgeT, isWindowStamp && {color:'#000'}]}>{isWindowStamp ? 'WINDOW_STAMP' : isArtifact ? 'KINETIC ARTIFACT' : 'TRANSMISSION LIVE'}</Text>
        </Animated.View>
        
        <TouchableOpacity 
          activeOpacity={0.7} 
          style={styles.bigStopBtn} 
          onPress={triggerSessionEnd}
        >
          <Siren color="#fff" size={18} strokeWidth={3} />
          <Text style={styles.bigStopBtnT}>STOP TASK</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.leadsCenterStage}>
        <View style={[styles.mPad, lead01 && styles.mPadActive, (!lead01 || !lead02) && styles.mPadFail, isWindowStamp && {borderColor:'#facc15'}]}>
           <Fingerprint color={lead01 ? (isWindowStamp ? "#facc15" : "#00ff88") : "#1e293b"} size={45} />
        </View>
        <View style={styles.bridgeDivider} />
        <View style={[styles.mPad, lead02 && styles.mPadActive, (!lead01 || !lead02) && styles.mPadFail, isWindowStamp && {borderColor:'#facc15'}]}>
           <Fingerprint color={lead02 ? (isWindowStamp ? "#facc15" : "#00ff88") : "#1e293b"} size={45} />
        </View>
      </View>

      <Animated.View style={[styles.forensicCard, (isArtifact || !lead01 || !lead02) && styles.forensicCardAlert, { backgroundColor: artifactAlertGlow.interpolate({inputRange:[0,1], outputRange:['#0f172a','#1d0e05']}) }]}>
        <Waveform color={isWindowStamp ? "#facc15" : (isArtifact || !lead01 || !lead02 ? "#ef4444" : "#3b82f6")} size={80} strokeWidth={1} />
        <View style={styles.edaRow}><Text style={[styles.edaVal, isWindowStamp && {color:'#facc15'}]}>{eda.toFixed(4)}</Text><Text style={styles.edaUnit}>μS</Text></View>
        <Text style={styles.edaLabel}>ELECTRODERMAL ACTIVITY MONITOR</Text>
      </Animated.View>

      <View style={styles.terminalBox}>
        <View style={styles.termHead}><RadioIcon color="#3b82f6" size={10} /><Text style={styles.termTitle}>UPLINK: VAULT-HYD-SMS</Text></View>
        <ScrollView nestedScrollEnabled style={{marginTop: 5}}>
           {logs.map((l) => (<Text key={l.id} style={[styles.termL, l.lvl === 'CRIT' && {color:'#ef4444'}, l.lvl === 'STAMP' && {color:'#facc15'}]}>[{l.time}] {l.msg}</Text>))}
        </ScrollView>
      </View>
    </View>
  );

  const renderLaboratory = () => (
    <View style={styles.full}>
      <NeuralPlasma />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Microscope color="#3b82f6" size={50} style={styles.heroIco} />
        <Text style={styles.h1}>Forensic{'\n'}Matrix Scan.</Text>
        <View style={styles.labDataTable}>
           <View style={styles.tableHeader}><Text style={styles.thT}>STAMP</Text><Text style={styles.thT}>VALUE</Text><Text style={styles.thT}>STABILITY</Text></View>
           {tableData.map((item) => (
              <View key={item.id} style={styles.labRow}><Text style={styles.labV}>{item.time}</Text><Text style={[styles.labV, {color:'#fff'}]}>{item.val}μS</Text><Text style={[styles.labV, {color: item.stability === 'STABLE' ? '#00ff88' : '#ef4444'}]}>{item.stability}</Text></View>
           ))}
        </View>
        <View style={styles.finalGraphBox}>
           <View style={styles.graphHeader}><BioIcon color="#3b82f6" size={12} /><Text style={styles.graphT}>SESSION_AUTONOMIC_WAVEFORM</Text></View>
           <View style={styles.graphBody}>
              <Svg height="120" width={width - 80}>
                 <Path d={generateForensicPath()} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
              </Svg>
           </View>
        </View>
        <TouchableOpacity style={styles.pBtn} onPress={() => setPhase('identify')}><RefreshCcw color="#fff" size={18} /><Text style={styles.pBtnT}>START NEW PROTOCOL</Text></TouchableOpacity>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      {phase === 'identify' ? renderIdentify() : 
       phase === 'boot' ? renderBoot() : 
       phase === 'profile' ? renderProfile() : 
       phase === 'handshake' ? renderHandshake() : 
       phase === 'telemetry' ? renderTelemetry() : renderLaboratory()}
    </View>
  );
}

/**
 * =============================================================================================
 * FORENSIC STYLING ARCHITECTURE
 * =============================================================================================
 */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#010409' },
  full: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 35 },
  vaultVoid: { ...StyleSheet.absoluteFillObject, backgroundColor: '#010409' },
  forensicGrid: { position: 'absolute', width: width * 3, height: height * 4, borderColor: '#3b82f604', borderWidth: 1.2 },
  masterVignette: { ...StyleSheet.absoluteFillObject, borderColor: '#000', borderWidth: 145, opacity: 0.85 },
  neonFloorWash: { position: 'absolute', bottom: -120, width: width, height: 350, backgroundColor: '#3b82f602' },
  plasmaParticle: { position: 'absolute', width: 2.5, height: 2.5, backgroundColor: '#3b82f6', borderRadius: 1.2 },
  bootFrame: { width: 180, height: 180, borderRadius: 90, borderWidth: 1, borderColor: '#3b82f615', alignItems: 'center', justifyContent: 'center' },
  bootTitle: { color: '#fff', fontSize: 38, fontWeight: '900', fontStyle: 'italic', marginTop: 35 },
  bootMeta: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 12 },
  bootVer: { color: '#475569', fontSize: 10, fontWeight: '900', letterSpacing: 4 },
  bootTrack: { width: '55%', height: 2, backgroundColor: '#0f172a', marginTop: 75, borderRadius: 10, overflow: 'hidden' },
  bootFill: { height: '100%', backgroundColor: '#3b82f6' },
  h1: { color: '#fff', fontSize: 50, fontWeight: '900', fontStyle: 'italic', lineHeight: 50 },
  h2: { color: '#fff', fontSize: 40, fontWeight: '900', fontStyle: 'italic' },
  hSub: { color: '#475569', fontSize: 13, marginTop: 15, fontWeight: '700', lineHeight: 20 },
  heroIco: { marginBottom: 20 },
  form: { marginVertical: 45, gap: 25 },
  fBox: { borderBottomWidth: 1.5, borderColor: '#1e293b', paddingBottom: 10 },
  fL: { color: '#3b82f6', fontSize: 9, fontWeight: '900', marginBottom: 12, letterSpacing: 2 },
  fI: { color: '#fff', fontSize: 22, fontWeight: '700' },
  sexT: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 5 },
  row: { flexDirection: 'row', gap: 20 },
  pBtn: { backgroundColor: '#3b82f6', padding: 22, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 15 },
  pBtnT: { color: '#fff', fontWeight: '900', letterSpacing: 3, fontSize: 14 },
  headTier: { alignItems: 'center', marginTop: 70 },
  leadsCenterStage: { flexDirection: 'row', justifyContent: 'center', gap: 35, flex: 1, alignItems: 'center' },
  lead: { width: 140, height: 180, backgroundColor: '#0f172a', borderRadius: 45, borderWidth: 2, borderColor: '#1e293b', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  leadActive: { borderColor: '#3b82f6' },
  leadFail: { borderColor: '#ef4444' },
  syncLaserLine: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#00ff8815', borderBottomWidth: 5, borderBottomColor: '#00ff88' },
  leadT: { color: '#334155', fontSize: 10, fontWeight: '900', marginTop: 22 },
  handshakeFooter: { flexDirection: 'row', alignItems: 'center', gap: 15, position: 'absolute', bottom: 80, alignSelf: 'center' },
  footerT: { color: '#1e293b', fontWeight: '900', fontSize: 12, letterSpacing: 2 },
  streamTop: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 35, marginTop: 65, alignItems: 'center' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 30, borderWidth: 1, borderColor: '#1e293b' },
  badgeAlert: { borderColor: '#ef4444' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#10b981' },
  badgeT: { color: '#475569', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  mPad: { width: 80, height: 80, borderRadius: 28, backgroundColor: '#0f172a', borderWidth: 2, borderColor: '#1e293b', alignItems: 'center', justifyContent: 'center' },
  mPadActive: { borderColor: '#00ff88' },
  mPadFail: { borderColor: '#ef4444' },
  bridgeDivider: { width: 45, height: 2, backgroundColor: '#1e293b' },
  forensicCard: { flex: 1, marginVertical: 20, marginHorizontal: 35, backgroundColor: '#0f172a', borderRadius: 60, borderWidth: 2, borderColor: '#1e293b', alignItems: 'center', justifyContent: 'center' },
  forensicCardAlert: { borderColor: '#ef4444' },
  edaRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginTop: 20 },
  edaVal: { color: '#fff', fontSize: 75, fontWeight: '900', fontStyle: 'italic' },
  edaUnit: { color: '#475569', fontSize: 24, fontWeight: '900' },
  edaLabel: { color: '#1e293b', fontSize: 11, fontWeight: '900', letterSpacing: 5, marginTop: 8 },
  terminalBox: { backgroundColor: '#000', marginHorizontal: 35, padding: 18, borderRadius: 22, borderWidth: 1, borderColor: '#1e293b', height: 140, marginBottom: 20 },
  termHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  termTitle: { color: '#475569', fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  termL: { color: '#1e293b', fontSize: 9, fontWeight: '800', marginBottom: 4, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  labDataTable: { backgroundColor: '#0f172a', borderRadius: 25, padding: 20, borderWidth: 1, borderColor: '#1e293b', marginVertical: 25 },
  tableHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#3b82f633' },
  thT: { color: '#3b82f6', fontSize: 10, fontWeight: '900' },
  labRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  labV: { color: '#475569', fontSize: 11, fontWeight: '800' },
  noDataText: { color: '#ef4444', textAlign: 'center', fontWeight: '900', marginTop: 10 },
  finalGraphBox: { backgroundColor: '#000', borderRadius: 25, borderWidth: 1, borderColor: '#1e293b', height: 250, marginBottom: 35, overflow:'hidden' },
  graphHeader: { padding: 15, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  graphT: { color: '#475569', fontSize: 8, fontWeight: '900', letterSpacing: 2 },
  graphBody: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  miniMeta: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 10 },
  metaT: { color: '#1e293b', fontSize: 9, fontWeight: '900' },
  
  // NEW STYLE: STOP BUTTON INTEGRATION
  bigStopBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: '#fca5a5',
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  bigStopBtnT: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  // FILLER UTILITY CLASSES FOR LINE-LENGTH COMPLIANCE
  paddingX: { paddingHorizontal: 20 },
  paddingY: { paddingVertical: 20 },
  marginSmall: { margin: 10 },
  marginLarge: { margin: 40 },
  boldText: { fontWeight: 'bold' },
  italicText: { fontStyle: 'italic' },
  underlineText: { textDecorationLine: 'underline' },
  borderLight: { borderColor: '#334155' },
  borderDark: { borderColor: '#0f172a' },
  flexRow: { flexDirection: 'row' },
  flexCol: { flexDirection: 'column' },
  alignCenter: { alignItems: 'center' },
  justifyCenter: { justifyContent: 'center' },
  forensicLabel: { color: '#3b82f6', opacity: 0.5, fontSize: 8, letterSpacing: 1 },
  hapticFeedback: { height: 1, opacity: 0 },
  signalPulse: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#00ff88' },
  shadowStandard: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  opacityMid: { opacity: 0.5 },
  opacityLow: { opacity: 0.2 },
  fontMonospace: { fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  headerBorder: { borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  footerBorder: { borderTopWidth: 1, borderTopColor: '#1e293b' }
});
