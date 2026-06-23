// --- DATA STRUCTURES & STATIC CONTEXTS ---

// Operational Stages Definition
export interface Stage {
  id: number;
  name: string;
  badge: string;
  severity: 'nominal' | 'elevated' | 'critical';
  description: string;
  scada: {
    pressure: number;
    temperature: number;
    hydrocarbon: number;
    ventStatus: 'OPEN' | 'CLOSED' | 'BLOCKED';
    integrity: number;
  };
  permits: Array<{
    id: string;
    zone: string;
    type: string;
    authority: string;
    safeguards: string;
  }>;
  staff: {
    count: number;
    headcountStatus: 'STANDARD' | 'DEPLETED' | 'CRITICAL_SHORTAGE';
    activeSupervisors: number;
  };
  agentLogs: Array<{
    sender: 'Telemetry Agent' | 'Permit Agent' | 'Context Orchestrator';
    status: 'OPTIMAL' | 'WARNING' | 'EVALUATING' | 'ALERT' | 'INTERCEPT_TRIGGERED';
    text: string;
    timestamp: string;
  }>;
}

export const RUNTIME_STAGES: Stage[] = [
  {
    id: 0,
    name: "Stage 1: Normal Operations",
    badge: "Routine Baseline",
    severity: "nominal",
    description: "Standard industrial background parameters. Continuous baseline sweeps indicate nominal hazard parameters.",
    scada: {
      pressure: 1.18, // kg/cm2 (Normal threshold < 1.5)
      temperature: 42.5, // °C
      hydrocarbon: 1.8, // ppm (Ignition threshold < 10)
      ventStatus: 'OPEN',
      integrity: 99.8
    },
    permits: [],
    staff: {
      count: 12,
      headcountStatus: 'STANDARD',
      activeSupervisors: 3
    },
    agentLogs: [
      {
        sender: "Telemetry Agent",
        status: "OPTIMAL",
        text: "SCADA telemetry arrays active. Pressure baseline: 1.18 kg/cm². Flammable vapor concentration: 1.8 ppm. Auxiliary vent valves 100% operational.",
        timestamp: "02:08:12"
      },
      {
        sender: "Permit Agent",
        status: "OPTIMAL",
        text: "Scanning active plant registers. Zero high-intensity thermal execution (Hot Work) permits requested in active hydrocarbon zones.",
        timestamp: "02:08:35"
      },
      {
        sender: "Context Orchestrator",
        status: "OPTIMAL",
        text: "Safety correlation matrices calculated. Hazard alignment indices: Nominal. Multi-silo threat convergence coefficient: 0.02 (Risk level: Negligible).",
        timestamp: "02:08:44"
      }
    ]
  },
  {
    id: 1,
    name: "Stage 2: Siloed Anomalies",
    badge: "Disconnected Signals",
    severity: "elevated",
    description: "Two isolated deviations are logged. Standalone safety gates remain green. Traditional alarm loops are not triggered.",
    scada: {
      pressure: 1.44, // Near alarm boundary of 1.5 bar
      temperature: 51.2,
      hydrocarbon: 8.5, // Sniffing registered, but below the standard 10.0 LEL alarm gate
      ventStatus: 'CLOSED',
      integrity: 88.4
    },
    permits: [
      {
        id: "PERMIT-7049",
        zone: "Zone B (Coke Oven Battery)",
        type: "Structural Pipe Welding (Hot Work)",
        authority: "Ops Deputy Manager",
        safeguards: "Local non-conductive canvas barrier, localized extinguisher on standby"
      }
    ],
    staff: {
      count: 6, // Reduced due to temporary crew changeover gap
      headcountStatus: 'DEPLETED',
      activeSupervisors: 1
    },
    agentLogs: [
      {
        sender: "Telemetry Agent",
        status: "WARNING",
        text: "Slight SCADA pressure deviation recorded at Zone B node 4. Vent line values show elevated throttling. Hydrocarbons up to 8.5 ppm (Warning boundary: 10.0 ppm). No alarm tripped.",
        timestamp: "02:11:02"
      },
      {
        sender: "Permit Agent",
        status: "WARNING",
        text: "E-Permit active in Zone B (PERMIT-7049). Hot Work / Structural welding authorized in gas lines vicinity. Direct automated pressure interlocks verified bypassed.",
        timestamp: "02:11:15"
      },
      {
        sender: "Context Orchestrator",
        status: "EVALUATING",
        text: "Silo overlap identified: Zone B Welding Permit is operating adjacent to non-alarm pressure build-ups. Initiating compound dispersion simulation.",
        timestamp: "02:11:19"
      }
    ]
  },
  {
    id: 2,
    name: "Stage 3: Compound Risk Intercepted",
    badge: "Predictive Intercept Active",
    severity: "critical",
    description: "CRITICAL SYNERGY: Minor pressure leak, blocked safety vent valve, open flame welding sparks, and a depleted crew. Fatal when aligned, predicted and stopped by AI.",
    scada: {
      pressure: 1.54, // Alarm triggered (>1.5)
      temperature: 59.8,
      hydrocarbon: 12.3, // Ignitable vapor LEL breached
      ventStatus: 'BLOCKED', // Primary auxiliary line mechanical relief latch stuck
      integrity: 56.2
    },
    permits: [
      {
        id: "PERMIT-7049",
        zone: "Zone B (Coke Oven Battery)",
        type: "Structural Pipe Welding (Hot Work)",
        authority: "Ops Deputy Manager",
        safeguards: "Local non-conductive canvas barrier, localized extinguisher on standby"
      }
    ],
    staff: {
      count: 4, // Fatal deficiency of staff to perform quick physical safety override
      headcountStatus: 'CRITICAL_SHORTAGE',
      activeSupervisors: 0
    },
    agentLogs: [
      {
        sender: "Telemetry Agent",
        status: "ALERT",
        text: "CRITICAL: Zone B gas sensors breach lower explosive limit (12.3 ppm). Emergency Vent loop mechanical fail-safe status reading: BLOCKED.",
        timestamp: "02:14:01"
      },
      {
        sender: "Permit Agent",
        status: "ALERT",
        text: "CRITICAL: Open sparks and terminal arcs actively discharging. High localized temperatures conflict with volatile environment. Physical isolation unverified.",
        timestamp: "02:14:05"
      },
      {
        sender: "Context Orchestrator",
        status: "INTERCEPT_TRIGGERED",
        text: "💥 MULTI-SILO FLAMMABLE ALIGNMENT DECODED in Zone B. [Ignition Spark + Fuel Vapor Loop + Vent Blockage + Supervision Deficit] will breach critical ignition flashpoint within 180 seconds. Instigating emergency dispatch override.",
        timestamp: "02:14:09"
      }
    ]
  }
];

// OISD & Factory Acts RAG Database
export interface ComplianceLaw {
  code: string;
  title: string;
  statute: string;
  requirement: string;
  infraction: string;
  corrective: string;
}

export const REGULATORY_RAG_DB: ComplianceLaw[] = [
  {
    code: "OISD-STD-105",
    title: "OISD Standard 105: Work Permit Safety System",
    statute: "Section 4.2 - Dangerous Hot Work Precautions",
    requirement: "No hot work permit shall be issued within 15 meters of operational hydrocarbon pipelines unless positive physical isolation (blind flange) is verified and validated by continuous explosive gas testing.",
    infraction: "Hot work (welding permit PERMIT-7049) is running adjacent to elevated gas sniffing loops (12.3 ppm HC) without active blind flanging or continuous digital gas telemetry feedback.",
    corrective: "Immediate physical shutdown of ignition tools. Retract Permit No. 7049. Perform structural positive blanking of pipeline before resuming."
  },
  {
    code: "OISD-STD-137",
    title: "OISD Standard 137: Flare, Relief, & Safety Relief Systems",
    statute: "Section 6.1 (a) - Lock-Open Valves & Interlock Integrity",
    requirement: "Venting and over-pressure relief system manifolds must stay locked in open readiness. Auxiliary pressure mitigation paths must run digital fail-safe telemetry.",
    infraction: "SCADA register signals a physical block/jam state in the primary auxiliary relieving vent lines concurrent with local extreme pressure builds.",
    corrective: "Enable manual backup nitrogen purge systems. Redirect redundant overhead gaseous dumps to secure cold flare line manifolds."
  },
  {
    code: "Factories_Act_1948",
    title: "The Factories Act, 1948 (Safety Amendments)",
    statute: "Section 36 - Staffing & Personnel Hazards Oversight",
    requirement: "Work in critical toxic or explosive zones must maintain a mandatory standby rescue team of minimum 6 certified hazardous crew operators plus a designated Safety Marshall on-stage.",
    infraction: "Zone B contains complex hot work risk under flammable concentration, yet total shift manpower is depleted down to 4 staff operators with zero designated safety supervisors.",
    corrective: "Automated siren system broadcast. Emergency deployment of plant rapid action dispatchers from Zone A & Zone C to shore up containment crew count."
  }
];

export const HISTORICAL_TREND_DATA = [
  { time: '08:00', pressure: 0.98, hydrocarbon: 0.0, risk: 10 },
  { time: '09:00', pressure: 1.01, hydrocarbon: 0.1, risk: 15 },
  { time: '10:00', pressure: 0.99, hydrocarbon: 0.0, risk: 12 },
  { time: '11:00', pressure: 1.05, hydrocarbon: 0.5, risk: 35 },
  { time: '12:00', pressure: 1.10, hydrocarbon: 0.2, risk: 20 },
  { time: '13:00', pressure: 1.95, hydrocarbon: 0.8, risk: 65 },
  { time: '14:00', pressure: 2.15, hydrocarbon: 1.4, risk: 95 },
];

export const ZONE_TRENDS_DATA = [
  { time: 'T-6h', zoneA: 1.02, zoneB: 0.95, zoneC: 0.94, zoneD: 1.08 },
  { time: 'T-5h', zoneA: 1.01, zoneB: 0.96, zoneC: 0.95, zoneD: 1.09 },
  { time: 'T-4h', zoneA: 1.03, zoneB: 1.10, zoneC: 0.93, zoneD: 1.11 },
  { time: 'T-3h', zoneA: 1.02, zoneB: 1.45, zoneC: 0.95, zoneD: 1.10 },
  { time: 'T-2h', zoneA: 1.02, zoneB: 1.85, zoneC: 0.94, zoneD: 1.09 },
  { time: 'T-1h', zoneA: 1.01, zoneB: 2.50, zoneC: 0.96, zoneD: 1.10 },
  { time: 'NOW', zoneA: 1.02, zoneB: 3.10, zoneC: 0.95, zoneD: 1.10 },
];

export const HISTORICAL_INCIDENTS = [
  { date: "Oct 12, 2025", event: "Minor Vent Flare", zone: "Zone A", severity: "WARN" },
  { date: "Jan 03, 2026", event: "Sensor Sync Issue", zone: "Zone C", severity: "INFO" },
  { date: "Mar 15, 2026", event: "Pressure Spiked", zone: "Zone B", severity: "WARN" },
  { date: "Apr 28, 2026", event: "Compound Risk - Resolved", zone: "Zone D", severity: "CRIT" },
  { date: "Jun 08, 2026", event: "Visakhapatnam Steel Plant Explosion", zone: "Vizag", severity: "CRIT" },
];

export const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

export const zoneCardVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 120,
      damping: 14
    }
  }
};
