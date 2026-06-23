Predictive Industrial Safety System

 Overview
This application is a real-time, multi-agent predictive safety orchestrator designed for industrial environments (e.g., steel and manufacturing plants). It monitors hazard cascades, compound risks, and cross-zone correlations to provide immediate diagnostic insights and predictive maintenance alerts.

 Key Features:
 1. Live Plant Dashboard
KPI Monitoring: Real-time metrics on structural integrity, active compound risks, and supervisor assignments.
Maintenance Predictor: Intelligent tracking of maintenance trajectories based on live sensor data, transitioning from "Scheduled" to "Imminent" as risk thresholds are met.
Dark/Light Mode: Full environmental view toggles for accessible visibility across varying control room lighting conditions.

 2. Interactive Zone Visualization
Zone Map: A vector-based, interactive map of the industrial plant (Storage, Coke Oven, Logistics, Utilities) indicating structural statuses.
Live Camera Feed: Real-time WebRTC camera integration to monitor physical environments from the dashboard.
Risk Heatmap Overlay: Visual severity indicators scaling from nominal (emerald) to critical risk (rose), overlaying the geographical layout or live camera feed.

 3. Threat Detection & Simulation
Incident Orchestration: Simulates Nominal, Warning, and Critical threshold breaches for administrative training and system validation.
Audio/Visual Alarms: Automated critical hazard alerts featuring synthesized oscillator audio alarms and pulse animations.
Plant Alarm Dashboard: A segmented log filtering by Critical, Warning, and Information-level anomalies.

 4. AI Diagnostics & Reporting
AI Root Cause Generation: Dynamically assesses active thermal and pressure anomalies to formulate mitigation intelligence.
Exportable Safety Reports: Allows supervisors to export instant timestamped safety audits (`.txt`) and historical simulation logs (`.csv`) with a single click.
AI Agent Log Visualization: A terminal-style real-time data stream of automated sub-agent decisions and system tests.

 5. Advanced Analytics
Cross-Zone Correlation: Monitors dependencies across varying zones (e.g., thermal output vs utility strain), tracking friction points to prevent cascading downstream failures.
Risk Trend Analysis: Historical charting mapping structural versus thermal risks over operational uptime using Recharts.

 Technical Architecture:
Core Engine: React 18 & TypeScript
Build System: Vite (ESM)
Styling: Tailwind CSS with custom Webkit scrollbars and CSS-based hue adjustments for theme toggling.
Data Visualization: Recharts
Icons: Lucide React
Hardware Integration: HTML5 `navigator.mediaDevices.getUserMedia`


-----------------------------------------------------
# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/0b087615-927b-4586-aaa0-b5ff2600a72a

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
