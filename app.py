import streamlit as st
import pandas as pd
import json
import time

# --- STYLING & PAGE SETUP ---
st.set_page_config(
    page_title="System of Predictive Intelligence",
    page_icon="⚠️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Dark Industrial CSS
st.markdown("""
<style>
    /* Dark Slate industrial styling */
    .reportview-container {
        background: #0f172a;
    }
    .metric-card {
        background-color: #1e293b;
        border-radius: 8px;
        padding: 15px;
        border: 1px solid #334155;
    }
    .status-normal {
        color: #10b981;
        font-weight: bold;
    }
    .status-warning {
        color: #f59e0b;
        font-weight: bold;
    }
    .status-alert {
        color: #ef4444;
        font-weight: bold;
        animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
    }
    .zone-box {
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        font-weight: bold;
        font-size: 1.1rem;
        border: 1px solid #334155;
        margin-bottom: 10px;
    }
    .agent-log {
        font-family: 'Courier New', Courier, monospace;
        background-color: #0c111d;
        color: #38bdf8;
        padding: 10px;
        border-radius: 5px;
        border-left: 3px solid #0284c7;
        margin-bottom: 8px;
        font-size: 0.85rem;
    }
    .agent-title {
        font-weight: bold;
        color: #f8fafc;
    }
</style>
""", unsafe_with_html=True)

# --- DATABASE / LOCAL SIMULATION STATES ---
# 1. Timeline Data Streams representing steps toward an incident
TIMELINE_STEPS = {
    0: {
        "name": "Stage 1: Normal Operations",
        "description": "Standard background baselines. All systems operating with nominal logs.",
        "scada": {
            "pressure": 1.2,          # kg/cm2 (Normal < 1.5)
            "temperature": 45.0,      # °C
            "hydrocarbon_ppm": 2.0,   # ppm (Normal < 10)
            "vent_status": "CLOSED",
            "zone_states": {"Zone A": "NORMAL", "Zone B": "NORMAL", "Zone C": "NORMAL", "Zone D": "NORMAL"}
        },
        "permits": [],
        "shifts": {
            "headcount": 12,
            "status": "STANDARD"
        },
        "agent_outputs": [
            {"agent": "Telemetry Agent", "status": "OK", "message": "SCADA readings stable. Pressure at 1.2 kg/cm2. Hydrocarbons negligible (2.0 ppm)."},
            {"agent": "Permit Agent", "status": "OK", "message": "No maintenance permits active in thermal zones. Routine patrols running."},
            {"agent": "Context Orchestrator", "status": "OK", "message": "Silo correlation matrices clean. Zero risk overlap detected."}
        ]
    },
    1: {
        "name": "Stage 2: Siloed Anomalies",
        "description": "Two disconnected events happen in Zone B. Individually, they do not trigger alarms.",
        "scada": {
            "pressure": 1.45,         # Minor increase, below critical alarm threshold of 1.5
            "temperature": 52.0,
            "hydrocarbon_ppm": 8.5,   # Minor sniffing, below standard LEL alarm of 10.0
            "vent_status": "CLOSED",
            "zone_states": {"Zone A": "NORMAL", "Zone B": "WARNING", "Zone C": "NORMAL", "Zone D": "NORMAL"}
        },
        "permits": [
            {
                "permit_id": "PERMIT-7049",
                "zone": "Zone B",
                "activity": "Structural Welding (Hot Work)",
                "approved_by": "Operations Deputy Manager",
                "safety_isolation": "Local manual barricade only"
            }
        ],
        "shifts": {
            "headcount": 6,           # Slashed manpower due to immediate gate logouts / shift gap
            "status": "REDUCED"
        },
        "agent_outputs": [
            {"agent": "Telemetry Agent", "status": "WARNING", "message": "Minor SCADA deviation in Zone B. Pressure rising (1.45 kg/cm2) and HC sniffing detected. Below standard hazard tripwires."},
            {"agent": "Permit Agent", "status": "WARNING", "message": "E-Permit active in Zone B (PERMIT-7049): Structural welding in gas pipeline vicinity approved. No automatic isolation interlocks active."},
            {"agent": "Context Orchestrator", "status": "EVALUATING", "message": "Warning matrix spawned: Zone B welding permit overlaps spatial vicinity of pressure anomaly. Evaluating gas expansion rate against venting controls."}
        ]
    },
    2: {
        "name": "Stage 3: Compound Risk Intercepted",
        "description": "CRITICAL RISK. Pressure pushes right to the line, hot work sparks fly, and employee headcounts are cut. Alone, each is minor; combined, they constitute an industrial disaster vector.",
        "scada": {
            "pressure": 1.52,         # Tripped standard pressure gate
            "temperature": 58.5,
            "hydrocarbon_ppm": 12.0,  # HC sniffing crosses ignition probability ratio
            "vent_status": "BLOCKED", # SCADA auxiliary vent valve stuck due to high strain
            "zone_states": {"Zone A": "NORMAL", "Zone B": "CRITICAL", "Zone C": "NORMAL", "Zone D": "NORMAL"}
        },
        "permits": [
            {
                "permit_id": "PERMIT-7049",
                "zone": "Zone B",
                "activity": "Structural Welding (Hot Work)",
                "approved_by": "Operations Deputy Manager",
                "safety_isolation": "Local manual barricade only"
            }
        ],
        "shifts": {
            "headcount": 4,           # 4 operators remaining due to delayed crew changeover
            "status": "CRITICAL SHORTAGE"
        },
        "agent_outputs": [
            {"agent": "Telemetry Agent", "status": "ALERT", "message": "CRITICAL: Zone B pressure exceeded 1.5 bar (1.52). Hydrocarbon vapors at 12 ppm. Auxiliary relief valve REFUSES to open!"},
            {"agent": "Permit Agent", "status": "ALERT", "message": "CRITICAL: Structural welding actively firing in Zone B (Coke Oven Battery). Open heat source and metal sparks deployed nearby."},
            {"agent": "Context Orchestrator", "status": "CRITICAL INTERCEPT", "message": "COMPOUND DISASTER PATHWAY IDENTIFIED! [Hydrocarbon Sniffing + Welding Permit + Relieving Malfunction + Reduced Operator Headcount] in Zone B. Risk score: 98/100. Dispatched automated predictive intercept."}
        ]
    }
}

# 2. Regulatory RAG Database mapping compliance codes to incidents
REGULATORY_LAWS = {
    "OISD-STD-105": {
        "title": "OISD Standard 105: Work Permit System",
        "statute": "Section 4.2 - Hot Work Precautions",
        "requirement": "Daily gas testing is mandatory prior to hot work. No hot work permit shall be executed within a 15-meter radius of any hydrocarbon source or pipeline, except with positive isolation (blind flanged).",
        "violation_identified": "Welding executed within active pipeline vicinity without verified gas-free clearance loops and without positive line-isolation verification."
    },
    "OISD-STD-137": {
        "title": "OISD Standard 137: Flare, Venting and Relief Systems",
        "statute": "Section 6.1 - Interlocking Safety Vent Valves",
        "requirement": "Interlocking safety relief valves must be verified in open-locked or ready position. Any mechanical block during adjacent maintenance constitutes class-A non-compliance.",
        "violation_identified": "SCADA relief auxiliary line recorded in CLOSED/BLOCKED status while a thermal ignition source is active."
    },
    "Factories_Act_1948": {
        "title": "The Factories Act, 1948",
        "statute": "Section 36 - Precautions in Case of Dangerous Fumes",
        "requirement": "In any factory where dangerous gas or smoke is likely to be present, no person shall enter or remain unless adequate safety equipment or localized supervisor presence (minimum 6 crew team) is fully operational.",
        "violation_identified": "Extreme risk zone manned by sub-optimal crew size (4 operators compared to standard safety headcount of 6 for critical hot-work changeovers)."
    }
}

# --- MULTI-AGENT ENGINE ---
def run_telemetry_agent(scada_data):
    """Monitors telemetry values for early markers."""
    pressure = scada_data["pressure"]
    hc = scada_data["hydrocarbon_ppm"]
    status = "NORMAL"
    details = f"Pressure: {pressure} kg/cm², Hydrocarbon: {hc} ppm"
    
    if pressure >= 1.5 or hc >= 10.0:
        status = "CRITICAL_ANOMALY"
        triggered_by = "Over-pressure & flammable hydrocarbon vapor combination"
    elif pressure > 1.3 or hc > 5.0:
        status = "MINOR_ANORMALY"
        triggered_by = "Moderate pressure buildup in utility lines"
    else:
        status = "STABLE"
        triggered_by = "None"
        
    return {"status": status, "details": details, "anomaly_vector": triggered_by}

def run_permit_agent(permits):
    """Analyzes permits for active risky maintenance actions."""
    if not permits:
        return {"has_hot_work": False, "permit_info": "No active maintenance permits."}
    
    for p in permits:
        if "Welding" in p["activity"] or "Hot" in p["activity"]:
            return {
                "has_hot_work": True,
                "permit_id": p["permit_id"],
                "zone": p["zone"],
                "activity": p["activity"],
                "permit_info": f"ACTIVE: {p['activity']} in {p['zone']}. ID: {p['permit_id']}"
            }
    return {"has_hot_work": False, "permit_info": "Active cold-work permits only."}

def run_context_orchestrator(telemetry_res, permit_res, shifts):
    """Executes silo risk cross-correlation to detect compound hazards."""
    is_compound_risk = False
    compound_score = 10
    indicators = []
    
    if telemetry_res["status"] == "CRITICAL_ANOMALY":
        compound_score += 40
        indicators.append("SCADA Critical Tripped")
    elif telemetry_res["status"] == "MINOR_ANORMALY":
        compound_score += 20
        indicators.append("SCADA Minor Anomaly")
        
    if permit_res["has_hot_work"]:
        compound_score += 30
        indicators.append("Active Welding Permit Detected")
        
    if shifts["status"] != "STANDARD":
        compound_score += 18
        indicators.append("Operator Headcount Deficiency")
        
    # Spatial alignment logic: telemetry issue is in Zone B, hot work permit is in Zone B
    if permit_res["has_hot_work"] and (telemetry_res["status"] in ["MINOR_ANORMALY", "CRITICAL_ANOMALY"]):
        # Joint ignition risks are spatial.
        if permit_res["zone"] == "Zone B":
            is_compound_risk = True
            compound_score = max(compound_score, 98) # Push to maximum danger rating
            indicators.append("Spatial Overlap in Hazard Zone")
            
    return {
        "is_compound_risk": is_compound_risk,
        "score": compound_score,
        "active_vectors": indicators
    }

def run_regulatory_rag(orchestrator_res, scada_data, permit_res):
    """Performs knowledge retrieval of regulatory statutes based on active risk vectors."""
    breaches_found = []
    
    # Check for hot work restrictions
    if permit_res["has_hot_work"] and scada_data["hydrocarbon_ppm"] > 5.0:
        breaches_found.append(REGULATORY_LAWS["OISD-STD-105"])
        
    # Check for blocked venting systems
    if scada_data.get("vent_status") == "BLOCKED":
        breaches_found.append(REGULATORY_LAWS["OISD-STD-137"])
        
    # Check for team safety deficits under hazardous conditions
    if scada_data["hydrocarbon_ppm"] > 5.0 and len(breaches_found) > 0:
        breaches_found.append(REGULATORY_LAWS["Factories_Act_1948"])
        
    return breaches_found

# --- SIDEBAR CONTROL PANEL ---
st.sidebar.title("🛠️ Operations Control")
st.sidebar.markdown("---")
st.sidebar.markdown("### Simulation Timeline")
st.sidebar.info("Step through the operational timeline to simulate siloed telemetry events progressing into a compound risk incident.")

# Interactive playback dropdown
current_step_idx = st.sidebar.selectbox(
    "Select Plant State Threshold",
    options=[0, 1, 2],
    format_func=lambda idx: TIMELINE_STEPS[idx]["name"]
)

state_data = TIMELINE_STEPS[current_step_idx]

st.sidebar.markdown("### Current Step Info")
st.sidebar.caption(state_data["description"])
st.sidebar.markdown("---")

scada_raw = state_data["scada"]
permits_raw = state_data["permits"]
shifts_raw = state_data["shifts"]

# Run agents on selected state
telemetry_res = run_telemetry_agent(scada_raw)
permit_res = run_permit_agent(permits_raw)
orchestrator_res = run_context_orchestrator(telemetry_res, permit_res, shifts_raw)
compliance_breaches = run_regulatory_rag(orchestrator_res, scada_raw, permit_res)

# --- PANEL 1: SYSTEM HEADER ---
st.markdown("<h1 style='text-align: center; margin-bottom: 2px;'>🚨 System of Predictive Intelligence</h1>", unsafe_with_html=True)
st.markdown("<p style='text-align: center; color: #94a3b8; font-size: 1.1rem;'>Preventing Industrial Accidents via Multi-Agent Compound Risk Interception</p>", unsafe_with_html=True)
st.markdown("<hr style='border: 1px solid #1e293b; margin-top: 10px; margin-bottom: 25px;'>", unsafe_with_html=True)

# Overview KPI row
col_kpi1, col_kpi2, col_kpi3, col_kpi4 = st.columns(4)

with col_kpi1:
    v_status = state_data["name"].split(": ")[1]
    text_color = "status-normal"
    if current_step_idx == 1:
        text_color = "status-warning"
    elif current_step_idx == 2:
        text_color = "status-alert"
    st.markdown(f"""
    <div class="metric-card">
        <span style="color: #64748b; font-size: 0.85rem; font-weight: bold;">SYSTEM STATUS</span><br>
        <span class="{text_color}" style="font-size: 1.5rem;">{v_status}</span>
    </div>
    """, unsafe_with_html=True)

with col_kpi2:
    scada_status_txt = "NORMAL"
    if scada_raw['hydrocarbon_ppm'] > 10.0 or scada_raw['pressure'] > 1.5:
        scada_status_txt = "CRITICAL OUT-OF-BOUNDS"
    elif scada_raw['hydrocarbon_ppm'] > 5.0 or scada_raw['pressure'] > 1.3:
        scada_status_txt = "ELEVATED DEVIATIONS"
    
    st.markdown(f"""
    <div class="metric-card">
        <span style="color: #64748b; font-size: 0.85rem; font-weight: bold;">SCADA TELEMETRY STATUS</span><br>
        <span style="color: #e2e8f0; font-size: 1.25rem;">{scada_status_txt}</span>
    </div>
    """, unsafe_with_html=True)

with col_kpi3:
    permit_active_st = "ACTIVE WELDING" if permit_res["has_hot_work"] else "NO HOT WORK PERMITS"
    st.markdown(f"""
    <div class="metric-card">
        <span style="color: #64748b; font-size: 0.85rem; font-weight: bold;">E-PERMIT REGISTRY</span><br>
        <span style="color: #38bdf8; font-size: 1.25rem;">{permit_active_st}</span>
    </div>
    """, unsafe_with_html=True)

with col_kpi4:
    shift_col = "#e2e8f0"
    if shifts_raw["status"] != "STANDARD":
        shift_col = "#ef4444"
    st.markdown(f"""
    <div class="metric-card">
        <span style="color: #64748b; font-size: 0.85rem; font-weight: bold;">MAIN OPERATOR TEAM SIZE</span><br>
        <span style="color: {shift_col}; font-size: 1.25rem;">{shifts_raw['headcount']} Operators ({shifts_raw['status']})</span>
    </div>
    """, unsafe_with_html=True)

st.markdown("<br>", unsafe_with_html=True)

# --- PANEL 2: GEOSPATIAL SAFETY HEATMAP & STREAM MONITOR ---
col_map, col_stream = st.columns([1.2, 1])

with col_map:
    st.markdown("<h3 style='margin-bottom:15px;'>📍 Spatial Safety Live Heatmap</h3>", unsafe_with_html=True)
    
    # Grid of the 4 safety zones
    zone_grid_col1, zone_grid_col2 = st.columns(2)
    
    zones = scada_raw["zone_states"]
    
    with zone_grid_col1:
        # Zone A
        bg_color = "#064e3b" if zones["Zone A"] == "NORMAL" else "#78350f"
        border_color = "#10b981" if zones["Zone A"] == "NORMAL" else "#f59e0b"
        st.markdown(f"""
        <div class="zone-box" style="background-color: {bg_color}; border: 2px solid {border_color}; color: #f8fafc;">
            🟩 ZONE A: Storage Tanks
            <div style="font-size:0.8rem; font-weight:normal; margin-top:5px; color:#cbd5e1;">
                Gas Sensors: Stable (0.8 ppm)<br>Pressure: 1.05 bar<br>Worker Presence: 3 Members
            </div>
        </div>
        """, unsafe_with_html=True)
        
        # Zone C
        bg_color = "#064e3b" if zones["Zone C"] == "NORMAL" else "#78350f"
        border_color = "#10b981" if zones["Zone C"] == "NORMAL" else "#f59e0b"
        st.markdown(f"""
        <div class="zone-box" style="background-color: {bg_color}; border: 2px solid {border_color}; color: #f8fafc;">
            🟩 ZONE C: Logistics & Loading Yard
            <div style="font-size:0.8rem; font-weight:normal; margin-top:5px; color:#cbd5e1;">
                Gas Sensors: Nominal (1.1 ppm)<br>Permit: Loading Clearance Active<br>Worker Presence: 4 Members
            </div>
        </div>
        """, unsafe_with_html=True)

    with zone_grid_col2:
        # Zone B (The incident vector)
        state_b = zones["Zone B"]
        if state_b == "NORMAL":
            bg_b = "#064e3b"
            border_b = "#10b981"
            txt_b = "🟩 ZONE B: Coke Oven Battery"
        elif state_b == "WARNING":
            bg_b = "#451a03"
            border_b = "#f59e0b"
            txt_b = "🟨 ZONE B: Coke Oven Battery"
        else:
            bg_b = "#991b1b"
            border_b = "#ef4444"
            txt_b = "🚨 ZONE B: Coke Oven Battery"
            
        st.markdown(f"""
        <div class="zone-box" style="background-color: {bg_b}; border: 2px solid {border_b}; color: #f8fafc;">
            {txt_b}
            <div style="font-size:0.8rem; font-weight:normal; margin-top:5px; color:#f8fafc;">
                <b>Pressure:</b> {scada_raw['pressure']} kg/cm² {"⚠️" if scada_raw['pressure']>1.3 else ""}<br>
                <b>gas density:</b> {scada_raw['hydrocarbon_ppm']} ppm {"⚠️" if scada_raw['hydrocarbon_ppm']>5.0 else ""}<br>
                <b>Permits:</b> {"Structural Welding (ID-7049)" if permit_res['has_hot_work'] else "No active hot permit"}
            </div>
        </div>
        """, unsafe_with_html=True)
        
        # Zone D
        bg_color = "#064e3b" if zones["Zone D"] == "NORMAL" else "#78350f"
        border_color = "#10b981" if zones["Zone D"] == "NORMAL" else "#f59e0b"
        st.markdown(f"""
        <div class="zone-box" style="background-color: {bg_color}; border: 2px solid {border_color}; color: #f8fafc;">
            🟩 ZONE D: Utility Steam & Boilers
            <div style="font-size:0.8rem; font-weight:normal; margin-top:5px; color:#cbd5e1;">
                Aux Steam Loops: Active<br>Sensor Integrity: Verified 100%<br>Worker Presence: 1 Member
            </div>
        </div>
        """, unsafe_with_html=True)

with col_stream:
    st.markdown("<h3 style='margin-bottom:15px;'>🛡️ Intelligent Multi-Agent Logic Logs</h3>", unsafe_with_html=True)
    
    # Render interactive agents outputs
    for agent_o in state_data["agent_outputs"]:
        agent_name = agent_o["agent"]
        st_color = "#10b981" if agent_o["status"] in ["OK"] else ("#f59e0b" if agent_o["status"] in ["WARNING", "EVALUATING"] else "#ef4444")
        
        st.markdown(f"""
        <div class="agent-log" style="border-left: 4px solid {st_color};">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span class="agent-title">🤖 {agent_name}</span>
                <span style="color:{st_color}; font-weight:bold; font-size:0.75rem;">[{agent_o['status']}]</span>
            </div>
            <span style="color:#d1d5db;">{agent_o['message']}</span>
        </div>
        """, unsafe_with_html=True)

st.markdown("<br><hr style='border: 1px solid #1e293b;'>", unsafe_with_html=True)

# --- PANEL 3: COMPOUND WARNING INTERCEPTED & EXTINGUISHING PANEL ---
if orchestrator_res["is_compound_risk"] or current_step_idx == 2:
    st.markdown("""
        <div style="background-color: #7f1d1d; border-radius: 8px; padding: 25px; border: 2px solid #ef4444; margin-bottom: 25px;">
            <div style="display:flex; align-items:center;">
                <span style="font-size: 2.2rem; margin-right:15px;">🚨</span>
                <div>
                    <h3 style="color:#fecdd3; margin:0 0 5px 0;">COMPOUND RISKS BLOC DECODED IN ZONE B</h3>
                    <p style="color:#fda4af; margin:0; font-size:0.95rem;">
                        <strong>Siloed events identified:</strong> Un-isolated Structural Hot Work Pipeline Welding + Elevated Sniffing (12 ppm) + Jammed Auxiliary Vent Relief Valve + Extreme Under-Staffing. Combined potential outcome limit: Vapor Cloud Explosion (VCE).
                    </p>
                </div>
            </div>
        </div>
    """, unsafe_with_html=True)
    
    st.markdown("## ⚡ Autonomous Emergency Response Orchestrator")
    
    response_col1, response_col2 = st.columns(2)
    
    with response_col1:
        st.markdown("### 📱 Instant Emergency Dispatch Broadcast")
        st.caption("Auto-generated emergency alert formatted and queued for plant supervisors via WhatsApp loop and localized sirens.")
        
        sms_body = f"""⚠️ PLANT CRITICAL SAFETY DEPLOYMENT ALERT
[System of Predictive Intelligence] - Zone B (Coke Oven Battery)
- SEVERITY: LEVEL-1 IMMEDIATE ABORT
- RISKS CORRELATED: Structural Pipeline Welding sparks flying + combustible HC concentration ({scada_raw['hydrocarbon_ppm']} ppm) + Vent Blockage.
- DECREE: Cease all welding acts immediately. Terminate Permit No {permit_res['permit_id'] if permit_res['has_hot_work'] else "PERMIT-7049"}. Evacuate non-essential personnel. Activate local nitrogen isolation loops.
- REQUIRED RESPONDERS: Crew Shift lead to relocate immediately with gas testing meters."""
        
        st.text_area("Emergency SMS Draft (Queued & Autopicked)", value=sms_body, height=210)
        
        st.button("🟢 Broadcast Emergency Abort Decree Immediately", use_container_width=True)
        
    with response_col2:
        st.markdown("### 📋 Auto-generated Pre-filled Regulatory Report")
        st.caption("AI-assembled legal accident prevention record linking current physical telemetry trends to specific legal guidelines retrieved by RAG.")
        
        # Display our Regulatory statutes retrieved in preformatted layout
        report_text = f"""=====================================================================
PREVENTATIVE INCIDENT REPORT FOR COMPLIANCE VERIFICATION
=====================================================================
GENERATED BY: Autonomous Regulatory RAG Engine
INCIDENT CATEGORY: Compound Ignite Preventive Safety Override
PLANT LOCATION: Zone B - Coke Oven Battery Facility

CURRENT TELEMETRY PROFILE:
- Pressure: {scada_raw['pressure']} kg/cm² (Over safety line)
- Ignitable Vapor Level: {scada_raw['hydrocarbon_ppm']} ppm
- Vent Status: {scada_raw['vent_status']}
- Active Permit: {permit_res['permit_info']}

"""
        
        for idx, breach in enumerate(compliance_breaches, 1):
            report_text += f"""--- LEGAL BREACH ATTEMPTED #[{idx}] ---
- Law/Statute: {breach['title']} ({breach['statute']})
- Statutory Directive: {breach['requirement']}
- Detected Infraction: {breach['violation_identified']}

"""
        report_text += "====================================================================="
        st.text_area("Calculated Regulatory Action Report", value=report_text, height=210)
        
        st.success("📝 Regulatory compliance draft saved to local safety audits directory.")

else:
    # Safe system default operations layout
    st.markdown("### 🟢 System Baseline Assessment")
    st.info("The system is monitoring the correlation dashboard. To trigger a predictive incident intercept, choose **Stage 3: Compound Risk Intercepted** in the dropdown.")
    
    # Just display the OISD Standards available in the Local RAG Database
    with st.expander("📝 View Embedded Safety Standards Knowledge Base (Used for Regulatory RAG)"):
        st.markdown("""
        The multi-agent system uses a **Regulatory Retrieval-Augmented Generation (RAG)** pipeline to index state safety guidelines. If any risk combinations are encountered, the controller automatically references:
        """)
        for code, standard in REGULATORY_LAWS.items():
            st.markdown(f"**{standard['title']}** ({code})")
            st.markdown(f"- *Statute*: {standard['statute']}")
            st.markdown(f"- *Safety Guideline requirement*: `{standard['requirement']}`")
            st.markdown("---")
