import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
  Flame, ShieldAlert, Activity, HardHat, Radio, AlertOctagon,
  Terminal, ShieldCheck, History, BrainCircuit, ActivitySquare as SquareActivity,
  Download, TrendingUp, MapPin, Cpu, Database, Network, PowerOff, BellRing,
  CheckCircle2, AlertTriangle, Info, Moon, Sun, FileText, Wrench, BarChart2, Camera, Map
} from 'lucide-react';
import { 
  RUNTIME_STAGES, REGULATORY_RAG_DB, HISTORICAL_TREND_DATA, 
  ZONE_TRENDS_DATA, HISTORICAL_INCIDENTS, gridContainerVariants, zoneCardVariants 
} from './data';

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeZoneDetail, setActiveZoneDetail] = useState('Zone B');
  const [isAlertAcknowledged, setIsAlertAcknowledged] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<string | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isHeatmapActive, setIsHeatmapActive] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const currentData = RUNTIME_STAGES[currentStep];

  useEffect(() => {
    if (isCameraActive && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch(err => console.error("Error accessing camera:", err));
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
         const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
         tracks.forEach(track => track.stop());
         videoRef.current.srcObject = null;
      }
    }
  }, [isCameraActive]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (currentStep === 2 && !isAlertAcknowledged) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(1100, audioCtx.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
      } catch (e) {
        console.error("Audio playback error", e);
      }
    }
  }, [currentStep, isAlertAcknowledged]);

  const handleGenerateAI = () => {
    setIsGeneratingAI(true);
    setAiInsight(null);
    setTimeout(() => {
      setAiInsight("AI DIAGNOSTIC: The detected thermal event in Zone B correlates with historical Visakhapatnam Plant incident. Recommended action: Immediately execute emergency cooling protocol and halt nearby welding operations.");
      setIsGeneratingAI(false);
    }, 1500);
  };

  const generateSafetyReport = () => {
    const reportContent = `VISAKHAPATNAM STEEL PLANT - SAFETY AUDIT REPORT\nDate: ${new Date().toLocaleString()}\nCurrent Shift: Nominal Operations\n\n--- COMPLIANCE STATUS ---\nZone A: Storage - Nomimal Pressure\nZone B: Coke Oven - Critical Thermal Risk Pending\nZone C: Logistics - Active Loading\nZone D: Utilities - Steady\n\n--- AGENT ORCHESTRATION ---\nActive AI Monitoring: ON\nSimulated Incidents logged: 12\n`;
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `safety_report_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
  };

  const handleExportSimulation = () => {
    const csvContent = [
      'Time,Pressure,Hydrocarbon,Risk',
      ...HISTORICAL_TREND_DATA.map(d => `${d.time},${d.pressure},${d.hydrocarbon},${d.risk}`)
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `safety_simulation_export.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-rose-500 selection:text-white pb-12">
      {/* GLOWING ACCENT */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 transition-colors duration-1000 ${
        currentStep === 0 ? 'bg-emerald-500' : currentStep === 1 ? 'bg-amber-500' : 'bg-rose-600 animate-pulse'
      }`} />

      {/* HEADER / NAVIGATION */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl border transition-all duration-500 ${
              currentStep === 0 ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 
              currentStep === 1 ? 'bg-amber-950/40 border-amber-500/30 text-amber-400' : 
              'bg-rose-950/80 border-rose-500/50 text-rose-400 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.3)]'
            }`}>
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-mono tracking-widest text-slate-400 font-bold block">Safety Intelligence Platform</span>
              <h1 className="text-2xl font-bold tracking-tight text-slate-50 uppercase italic font-serif flex items-center gap-3">
                Visakhapatnam Steel Plant
                <span className="text-xs px-2.5 py-1 border border-slate-700 rounded-full bg-slate-800 text-slate-300 font-sans font-medium not-italic normal-case tracking-normal">
                  v2.8 Live
                </span>
              </h1>
            </div>
          </div>

          {/* Incident Simulation Modes */}
          <div className="flex items-center gap-3 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800 shadow-inner">
            <span className="text-xs font-mono text-slate-400 px-2 hidden sm:flex items-center gap-1.5 font-bold uppercase">
              <PowerOff className="w-3.5 h-3.5" /> Simulation
            </span>
            <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700/50">
              {RUNTIME_STAGES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentStep(s.id)}
                  className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase rounded-md transition-all ${
                    currentStep === s.id 
                      ? s.id === 0 ? 'bg-emerald-500/20 text-emerald-300' : s.id === 1 ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {s.id === 0 ? "Nominal" : s.id === 1 ? "Silo Watch" : "Compound"}
                </button>
              ))}
            </div>
            <div className="w-px h-6 bg-slate-700 mx-1"></div>
            <button
              onClick={generateSafetyReport}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase"
              title="Generate Safety Report"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Report</span>
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6">
        
        {currentStep === 2 && !isAlertAcknowledged && (
          <div className="bg-rose-950/80 border-2 border-rose-500 rounded-xl p-5 text-slate-100 flex flex-col md:flex-row shadow-2xl shadow-rose-950/50">
            <div className="flex gap-4 items-start w-full">
              <AlertOctagon className="w-10 h-10 text-rose-500 animate-pulse shrink-0" />
              <div className="flex-1">
                <h2 className="text-xl font-black text-white tracking-wide uppercase">Critical Compound Risk in Zone B</h2>
                <p className="text-sm text-rose-200 mt-1 max-w-4xl leading-relaxed">
                  Hot Pipe Welding Arc + High Toxic Gas Accumulation + Fail-Safe Vent Blockage detected nearby! 
                  Disaster probability: 98% (Gas Cloud Flashover).
                </p>
              </div>
              <button onClick={() => setIsAlertAcknowledged(true)} className="px-4 py-2 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-lg uppercase text-xs transition-colors whitespace-nowrap">
                Mark as Resolved
              </button>
            </div>
          </div>
        )}

        {/* ROW 1: KPIs & System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          
          {/* System Health Checks */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex justify-between items-center mb-3">
              System Health
              <Activity className="w-4 h-4 text-emerald-500" />
            </h3>
            <div className="space-y-3 mt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono flex items-center gap-2"><Cpu className="w-3.5 h-3.5"/> Core CPU</span>
                <div className="w-1/2 bg-slate-800 rounded-full h-1.5"><div className="bg-emerald-500 h-1.5 rounded-full w-3/4"></div></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono flex items-center gap-2"><Database className="w-3.5 h-3.5"/> Database</span>
                <span className="text-xs font-mono text-emerald-400">99.9% Uptime</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono flex items-center gap-2"><Network className="w-3.5 h-3.5"/> Scada Latency</span>
                <span className="text-xs font-mono text-emerald-400">12ms</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-mono font-bold uppercase tracking-widest flex justify-between">SCADA Sensors <Radio className="w-4 h-4" /></span>
            <div className="mt-2 text-2xl font-black">{currentData.scada.pressure} <span className="text-xs text-slate-500 font-mono">kg/cm²</span></div>
            <div className="text-xs text-slate-400 font-mono mt-1">Gas density: {currentData.scada.hydrocarbon} ppm</div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-mono font-bold uppercase tracking-widest flex justify-between">Active Permits <Flame className="w-4 h-4" /></span>
            <div className="mt-2 text-2xl font-black">{currentData.permits.length > 0 ? "01 Hot Permit" : "00 Permits"}</div>
            <div className="text-xs text-slate-400 mt-1 truncate">{currentData.permits.length > 0 ? "Permit-7049: Structural Pipeline Arc Welding" : "Routine Ops"}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-mono font-bold uppercase tracking-widest flex justify-between">Crew Operator Status <HardHat className="w-4 h-4" /></span>
            <div className={`mt-2 text-2xl font-black ${currentData.staff.headcountStatus !== 'STANDARD' ? 'text-rose-500' : 'text-slate-100'}`}>
              {currentData.staff.count} Ops <span className="text-xs font-normal opacity-70">({currentData.staff.headcountStatus})</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">{currentData.staff.activeSupervisors} Supervisors Active</div>
          </div>

          {/* Maintenance Predictor */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-mono font-bold uppercase tracking-widest flex justify-between">Maintenance <Wrench className="w-4 h-4 text-blue-400" /></span>
            <div className={`mt-2 text-2xl font-black ${currentStep === 2 ? 'text-amber-500' : 'text-emerald-400'}`}>
              {currentStep === 2 ? 'Imminent' : 'Scheduled'}
            </div>
            <div className="text-xs text-slate-400 mt-1">{currentStep === 2 ? 'Zone B Vent Inspect' : 'Next Check in 14d'}</div>
          </div>
        </div>

        {/* ROW 2: Zone Map & Plant Alarms */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Zone Map Visualization & Camera Feed */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
                {isCameraActive ? <Camera className="w-4 h-4 text-emerald-400"/> : <MapPin className="w-4 h-4 text-blue-400"/>} 
                {isCameraActive ? "Live Camera Feed" : "Zone Map Visualization"}
              </h3>
              
              <div className="flex gap-2">
                {/* Heatmap Toggle */}
                {!isCameraActive && (
                  <button 
                    onClick={() => setIsHeatmapActive(!isHeatmapActive)}
                    className={`text-[10px] sm:text-xs font-mono font-bold px-3 py-1.5 rounded-lg border transition-all ${isHeatmapActive ? 'bg-indigo-900/40 border-indigo-500/50 text-indigo-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                  >
                    Heatmap
                  </button>
                )}
                
                {/* Camera Toggle */}
                <button 
                  onClick={() => setIsCameraActive(!isCameraActive)}
                  className={`text-[10px] sm:text-xs font-mono font-bold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${isCameraActive ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  Feed
                </button>
              </div>
            </div>

            {/* Risk Heatmap Legends */}
            {!isCameraActive && (
               <div className="flex gap-3 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800/60 mb-2 w-max">
                 <span className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"/> Safe</span>
                 <span className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"/> Risk</span>
                 <span className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-600"/> Critical</span>
               </div>
            )}

            <div className="flex-1 bg-slate-950/50 rounded-xl border border-slate-800/50 relative overflow-hidden flex items-center justify-center min-h-[300px]">
              
              {isCameraActive ? (
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                  <video 
                    ref={videoRef} 
                    className="w-full h-full object-cover opacity-90"
                    playsInline 
                    muted
                  />
                  <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-mono font-bold px-2 py-1 rounded animate-pulse">
                    REC
                  </div>
                  {isHeatmapActive && (
                    <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-60">
                       <div className={`w-full h-full bg-gradient-to-br ${currentStep === 2 ? 'from-rose-500/40 via-transparent to-transparent' : currentStep === 1 ? 'from-amber-500/40 via-transparent to-transparent' : 'from-emerald-500/20 via-transparent to-transparent'} transition-all duration-1000`} />
                    </div>
                  )}
                  {currentStep === 2 && (
                    <div className="absolute left-1/4 top-1/4 border-2 border-rose-500 w-32 h-32 rounded animate-ping pointer-events-none" />
                  )}
                </div>
              ) : (
                <>
                  <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700 p-3 rounded-lg shadow-xl shrink-0 z-20 pointer-events-none text-left max-w-[200px]">
                     <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">{activeZoneDetail} INSPECTION</span>
                     <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                       {activeZoneDetail === 'Zone B' ? "Coke Oven Battery." + (currentStep === 2 ? " CRITICAL THERMAL EVENT DETECTED." : " Thermal monitoring active.") :
                        activeZoneDetail === 'Zone A' ? "Bulk Material Storage. Gas & pressure bounds nominal." :
                        activeZoneDetail === 'Zone C' ? "Logistics Hub. Routine transport pathways active." :
                        "Utilities & Steam Loop. Steady pressure flow."}
                     </p>
                  </div>
                  <svg viewBox="0 0 500 280" className="w-full h-full max-w-lg p-4 drop-shadow-xl z-10 transition-all duration-500">
                    <rect x="30" y="30" width="180" height="90" rx="6" fill={isHeatmapActive && activeZoneDetail === 'Zone A' ? '#042f2e' : '#0f172a'} stroke={activeZoneDetail === 'Zone A' ? '#34d399' : '#1e293b'} strokeWidth={activeZoneDetail === 'Zone A' ? "3" : "2"} className="hover:opacity-80 transition cursor-pointer" onClick={() => setActiveZoneDetail('Zone A')}>
                      <title>ZONE A: Storage. Current status: Safe.</title>
                    </rect>
                    <text x="120" y="80" textAnchor="middle" fill="#cbd5e1" fontSize="14" className="font-mono font-bold">ZONE A: Storage</text>

                    <rect x="290" y="30" width="180" height="90" rx="6" fill={isHeatmapActive && activeZoneDetail === 'Zone C' ? '#042f2e' : '#0f172a'} stroke={activeZoneDetail === 'Zone C' ? '#34d399' : '#1e293b'} strokeWidth={activeZoneDetail === 'Zone C' ? "3" : "2"} className="hover:opacity-80 transition cursor-pointer" onClick={() => setActiveZoneDetail('Zone C')}>
                      <title>ZONE C: Logistics. Routine transport active.</title>
                    </rect>
                    <text x="380" y="80" textAnchor="middle" fill="#cbd5e1" fontSize="14" className="font-mono font-bold">ZONE C: Logistics</text>

                    <rect x="30" y="160" width="180" height="90" rx="6" fill={isHeatmapActive ? (currentStep === 2 ? '#4c0519' : currentStep === 1 ? '#451a03' : '#0f172a') : '#0f172a'} stroke={currentStep === 2 ? '#e11d48' : currentStep === 1 ? '#d97706' : activeZoneDetail === 'Zone B' ? '#34d399' : '#1e293b'} strokeWidth={activeZoneDetail === 'Zone B' ? "3" : "2"} className={`hover:opacity-80 transition cursor-pointer ${currentStep === 2 ? 'animate-pulse' : ''}`} onClick={() => setActiveZoneDetail('Zone B')}>
                      <title>ZONE B: Coke Oven. {currentStep === 2 ? 'CRITICAL THERMAL EVENT.' : 'Thermal monitoring.'}</title>
                    </rect>
                    <text x="120" y="210" textAnchor="middle" fill={currentStep > 0 ? "#fca5a5" : "#cbd5e1"} fontSize="14" className="font-mono font-bold">ZONE B: Coke Oven</text>
                    
                    {currentStep === 2 && <circle cx="120" cy="210" r="40" fill="none" stroke="#f43f5e" strokeWidth="2" className="animate-ping" />}

                    <rect x="290" y="160" width="180" height="90" rx="6" fill={isHeatmapActive && activeZoneDetail === 'Zone D' ? '#042f2e' : '#0f172a'} stroke={activeZoneDetail === 'Zone D' ? '#34d399' : '#1e293b'} strokeWidth={activeZoneDetail === 'Zone D' ? "3" : "2"} className="hover:opacity-80 transition cursor-pointer" onClick={() => setActiveZoneDetail('Zone D')}>
                      <title>ZONE D: Utilities. Steady pressure flow.</title>
                    </rect>
                    <text x="380" y="210" textAnchor="middle" fill="#cbd5e1" fontSize="14" className="font-mono font-bold">ZONE D: Utilities</text>

                    <path d="M 210 75 L 290 75" stroke="#334155" strokeWidth="2" strokeDasharray="4 4"/>
                    <path d="M 210 205 L 290 205" stroke="#334155" strokeWidth="2" strokeDasharray="4 4"/>
                    <path d="M 120 120 L 120 160" stroke="#334155" strokeWidth="2" strokeDasharray="4 4"/>
                    <path d="M 380 120 L 380 160" stroke="#334155" strokeWidth="2" strokeDasharray="4 4"/>
                  </svg>
                </>
              )}
            </div>
          </div>

          {/* Plant Alarm Dashboard */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col max-h-[400px]">
             <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
               <span className="flex items-center gap-2"><BellRing className="w-4 h-4 text-rose-400"/> Plant Alarm Dashboard</span>
               <div className="flex gap-2">
                 <select 
                   value={severityFilter || ''} 
                   onChange={(e) => setSeverityFilter(e.target.value || null)}
                   className="bg-slate-950 border border-slate-700 text-slate-300 text-[10px] rounded px-2 py-0.5 font-mono"
                 >
                   <option value="">All</option>
                   <option value="CRIT">Critical</option>
                   <option value="WARN">Warning</option>
                 </select>
                 <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono">Live</span>
               </div>
             </h3>
             <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-2 custom-scrollbar">
               {currentStep === 2 && (!severityFilter || severityFilter === 'CRIT') && (
                 <div className="p-3 bg-rose-950/40 border-l-4 border-rose-500 rounded-r border-y border-r border-y-rose-900/40 border-r-rose-900/40 group relative" title="CRITICAL: Ignition Sequence detected in Zone B. Ensure immediate evacuation.">
                   <div className="flex justify-between items-start mb-1">
                     <span className="text-xs font-bold text-rose-400 uppercase">COMPOUND IGNITION</span>
                     <span className="text-[10px] font-mono text-slate-500">Just now</span>
                   </div>
                   <p className="text-xs text-rose-200/80">Zone B Coke Oven Battery: Multiple sensors threshold breach causing critical ignition sequence.</p>
                 </div>
               )}
               {currentStep >= 1 && (!severityFilter || severityFilter === 'WARN') && (
                 <div className="p-3 bg-amber-950/40 border-l-4 border-amber-500 rounded-r border-y border-r border-y-amber-900/40 border-r-amber-900/40 group relative" title="WARNING: Simultaneous active hot work and risk thresholds elevated.">
                   <div className="flex justify-between items-start mb-1">
                     <span className="text-xs font-bold text-amber-400 uppercase">LATENCY / PERMITS</span>
                     <span className="text-[10px] font-mono text-slate-500">2m ago</span>
                   </div>
                   <p className="text-xs text-amber-200/80">Zone B: Welding permit overlaps with increased hydrocarbon levels. Latency observed.</p>
                 </div>
               )}
               {(!severityFilter) && (
                 <div className="p-3 bg-slate-950/40 border-l-4 border-blue-500 rounded-r border-y border-r border-y-slate-800 border-r-slate-800 group relative" title="INFO: Routine sensor verification.">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-blue-400 uppercase">AUXILIARY PURGE TEST</span>
                      <span className="text-[10px] font-mono text-slate-500">14m ago</span>
                    </div>
                    <p className="text-xs text-slate-400">Zone A: Weekly standard automated purge verification completed. All nominal.</p>
                 </div>
               )}
               {HISTORICAL_INCIDENTS.filter(inc => !severityFilter || inc.severity === severityFilter).map((inc, i) => (
                 <div key={i} className="p-3 bg-slate-950/40 border border-slate-800 rounded group relative" title={`Incident: ${inc.event} in ${inc.zone}`}>
                   <div className="flex justify-between items-start mb-1">
                     <span className={`text-xs font-bold uppercase ${inc.severity === 'CRIT' ? 'text-rose-400' : inc.severity === 'WARN' ? 'text-amber-400' : 'text-slate-400'}`}>
                       {inc.event}
                     </span>
                     <span className="text-[10px] font-mono text-slate-500">{inc.date}</span>
                   </div>
                   <p className="text-xs text-slate-400">Historical match spotted in {inc.zone}.</p>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* ROW 3: Log Visualization & Risk Trend Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Enhanced Log Visualization */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col h-[350px]">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2"><Terminal className="w-4 h-4 text-fuchsia-400"/> AI Agent Log Visualization</span>
              <span className="bg-fuchsia-900/30 text-fuchsia-400 px-2 py-0.5 border border-fuchsia-800/50 rounded text-[10px] font-mono uppercase">Live Feed</span>
            </h3>
             <div className="flex-1 bg-black/60 rounded-lg p-3 font-mono text-xs overflow-y-auto space-y-2 border border-slate-800/50 shadow-inner flex flex-col">
              <div className="mb-3 flex justify-end">
                <button 
                  onClick={handleGenerateAI}
                  disabled={isGeneratingAI}
                  className="bg-fuchsia-950 hover:bg-fuchsia-900 text-fuchsia-300 border border-fuchsia-800/50 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <BrainCircuit className="w-3.5 h-3.5" />
                  {isGeneratingAI ? 'Analyzing...' : 'Generate AI Root Cause'}
                </button>
              </div>
              
              {aiInsight && (
                <div className="bg-fuchsia-950/30 border-l-2 border-fuchsia-500 p-3 mb-4 rounded-r animate-in fade-in slide-in-from-top-2">
                  <p className="text-fuchsia-200 leading-relaxed font-sans text-sm">{aiInsight}</p>
                </div>
              )}

              {currentData.agentLogs.map((log, idx) => (
                <div key={idx} className="flex gap-3 leading-relaxed border-b border-white/5 pb-2 last:border-0 last:pb-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                       <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider ${
                         log.sender === 'Context Orchestrator' ? 'bg-fuchsia-950 text-fuchsia-400' :
                         log.sender === 'Telemetry Agent' ? 'bg-blue-950 text-blue-400' :
                         'bg-orange-950 text-orange-400'
                       }`}>
                         {log.sender}
                       </span>
                       <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
                         log.status === 'ALERT' || log.status === 'INTERCEPT_TRIGGERED' ? 'bg-rose-950 text-rose-400' :
                         log.status === 'WARNING' || log.status === 'EVALUATING' ? 'bg-amber-950 text-amber-400' :
                         'bg-emerald-950 text-emerald-400'
                       }`}>
                         {log.status}
                       </span>
                    </div>
                    <p className={`mt-1 ${
                      log.status === 'ALERT' || log.status === 'INTERCEPT_TRIGGERED' ? 'text-rose-200/90' :
                      log.status === 'WARNING' || log.status === 'EVALUATING' ? 'text-amber-200/80' :
                      'text-slate-300'
                    }`}>
                      {log.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Trend Analysis */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col h-[350px]">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-400"/> Risk Trend Analysis</span>
              <button onClick={handleExportSimulation} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded text-[10px] font-mono flex items-center gap-1 transition">
                <Download className="w-3 h-3"/> Export Simulation
              </button>
            </h3>
            <div className="flex-1 w-full h-full min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <LineChart data={ZONE_TRENDS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#475569" fontSize={10} tickMargin={10} />
                  <YAxis stroke="#475569" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '11px', color: '#cbd5e1', borderRadius: '8px' }}
                    itemStyle={{ color: '#cbd5e1' }}
                  />
                  <Line type="monotone" dataKey="zoneA" stroke="#34d399" strokeWidth={2} name="Zone A" dot={false} />
                  <Line type="monotone" dataKey="zoneB" stroke="#f43f5e" strokeWidth={2} name="Zone B" dot={{ r: 4, strokeWidth: 2, fill: '#0f172a' }} />
                  <Line type="monotone" dataKey="zoneC" stroke="#38bdf8" strokeWidth={2} name="Zone C" dot={false} />
                  <Line type="monotone" dataKey="zoneD" stroke="#fbbf24" strokeWidth={2} name="Zone D" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cross-Zone Correlation */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col h-[350px]">
             <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
               <span className="flex items-center gap-2"><BarChart2 className="w-4 h-4 text-emerald-400"/> Cross-Zone Correlation</span>
             </h3>
             <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar text-xs pr-2">
               <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg">
                 <div className="flex justify-between items-center text-slate-300 font-mono mb-2">
                   <span>Zone A ↔ Zone C</span>
                   <span className="text-emerald-400 font-bold">92%</span>
                 </div>
                 <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                   <div className="bg-emerald-500 h-full w-[92%] transition-all duration-500"></div>
                 </div>
                 <p className="text-slate-500 mt-2.5 text-[10px] leading-relaxed">Stable correlation. Material input and output pacing perfectly.</p>
               </div>
               <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg">
                 <div className="flex justify-between items-center text-slate-300 font-mono mb-2">
                   <span>Zone B ↔ Zone D</span>
                   <span className={`font-bold ${currentStep === 2 ? 'text-rose-400' : 'text-amber-400'}`}>{currentStep === 2 ? '68%' : '84%'}</span>
                 </div>
                 <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                   <div className={`h-full transition-all duration-500 ${currentStep === 2 ? 'bg-rose-500 w-[68%]' : 'bg-amber-500 w-[84%]'}`}></div>
                 </div>
                 <p className="text-slate-500 mt-2.5 text-[10px] leading-relaxed">Thermal output vs Utility strain. Watch for cascading lags.</p>
               </div>
             </div>
          </div>
        </div>

      </main>
    </div>
  );
}