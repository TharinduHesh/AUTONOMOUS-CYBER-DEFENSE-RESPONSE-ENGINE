# Autonomous Cyber Defense & Response Engine

**Research Prototype** for the final-year university project:

*AI-Driven SDR-Based Anti-Jamming and Wireless Threat Detection Framework for UAV Cyber Defense*

> ⚠️ This is **NOT** the final system. It is a **conceptual proof-of-concept** using simulated data, explainable rule-based logic, and simulated responses for lecturer evaluation.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (Vite)                     │
│  Dashboard · Threat Simulation · Architecture · Research    │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API (/api → proxy → :8000)
┌──────────────────────────▼──────────────────────────────────┐
│                   FASTAPI BACKEND (Python)                   │
│  ┌─────────────┐ ┌──────────────┐ ┌─────────────────────┐ │
│  │ Threat      │ │ Forecasting  │ │ Decision Engine     │ │
│  │ Scoring     │ │ (Linear Reg) │ │ (Reactive/Predict.) │ │
│  └─────────────┘ └──────────────┘ └─────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Response Simulator · Incident Log · UAV State (in-mem) ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Pages / Screens

| Page | Purpose |
|------|---------|
| **Dashboard** | UAV status, threat overview, incident log, demo quick-start |
| **Threat Simulation** | Input scenarios, analyze, forecast, decide, simulate response |
| **System Workflow** | Architecture diagram, component integration, sample data fields |
| **My Contribution** | Research contribution, reactive vs predictive defense |
| **Evaluation** | Eight proposal-aligned scenarios, baseline comparison, and multi-threat prioritization |

## Enhanced Lecturer Prototype

This prototype now demonstrates the proposal's decision-engine contribution using clearly labelled synthetic evidence:

- Three independent mock evidence sources: SDR/RF, AI threat intelligence, and secure communication
- A normalized internal evidence record and configurable weighted source correlation
- Explicit conflicting-evidence detection with reduced decision confidence
- Multiple simultaneous-threat ranking with primary and secondary threats
- Forecast-aware decisions with a qualitative confidence label
- Simulated before/after response evidence and effectiveness classification
- A timestamped, stage-by-stage incident audit trail
- Eight controlled evaluation scenarios compared with a detect-and-alert baseline

Correlation weights and research thresholds are stored in `backend/config/engine_config.json` so they can be adjusted without changing the engine code.

## Data Flow

1. **Threat Input** — Manual fields or predefined scenario buttons
2. **Threat Analysis** — Rule-based scoring (0–100) with explainable factors
3. **Risk Assessment** — Severity: LOW / MEDIUM / HIGH / CRITICAL
4. **Forecasting** — Linear regression on simulated historical scores
5. **Decision Engine** — Reactive vs forecast-aware response selection
6. **Response Simulation** — Workflow steps, UAV state update, incident log

## Threat Scoring Logic

- Base score by threat type (e.g., Jamming = +35)
- Additional factors: SNR, noise, packet loss, latency, auth failure, trust status, repeated anomaly, confidence
- Severity mapping: 0–24 LOW, 25–49 MEDIUM, 50–74 HIGH, 75–100 CRITICAL

## Forecasting Logic

- Generates 6-point simulated historical trend
- Applies linear regression for +5, +10, +15 minute projections
- Trend label: ESCALATING (>2/min slope), STABLE, DE-ESCALATING

## Decision Engine Logic

- **Reactive**: Response based on current severity only
- **Forecast-aware**: Upgrades response when trend is ESCALATING (e.g., MEDIUM → Prepare Backup Communication)
- Full explainability with factor breakdown and decision reasons

## Technology Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React + TypeScript + Vite | Fast local dev, interactive UI |
| Styling | Tailwind CSS v4 | Modern cybersecurity dashboard look |
| Charts | Recharts | Threat forecast visualization |
| Backend | FastAPI + Pydantic | Clean API, easy Python logic |
| Data | In-memory state | Sufficient for prototype demo |

## Quick Start

### Prerequisites

- **Node.js** 18+ (you have v22)
- **Python** 3.10+ via `py` launcher on Windows

### 1. Start Backend

```powershell
cd backend
py -m uvicorn main:app --reload --port 8000
```

### 2. Start Frontend (new terminal)

```powershell
cd frontend
npm run dev
```

### 3. Open Browser

Navigate to **http://localhost:5173**

Or use the startup script:

```powershell
.\start-prototype.ps1
```

## Demo Flow (1–2 minutes)

1. Open **Dashboard** — show normal UAV state
2. Go to **Threat Simulation**
3. Click **Simulate Jamming**
4. Click **Analyze Threat** — show score ~82, CRITICAL
5. Review **Forecast** chart — ESCALATING trend
6. Review **Autonomous Defense Decision** — Switch to Backup Channel
7. Read **Why did the engine make this decision?**
8. Click **SIMULATE RESPONSE**
9. Show backup channel activated, threat contained
10. Return to **Dashboard** — incident in log

## Folder Structure

```
uav-cyber-defense-prototype/
├── backend/
│   ├── main.py                 # FastAPI routes
│   ├── engine/
│   │   ├── threat_scoring.py   # Explainable scoring
│   │   ├── forecasting.py      # Linear regression forecast
│   │   ├── decision_engine.py  # Reactive vs predictive decisions
│   │   └── response_simulator.py
│   ├── models/schemas.py
│   ├── data/scenarios.py       # Predefined demo scenarios
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── pages/              # Dashboard, ThreatSimulation, etc.
│       ├── components/         # Layout, charts, badges
│       └── api.ts
├── start-prototype.ps1
└── README.md
```

## Labels Used Throughout

- **RESEARCH PROTOTYPE**
- **SIMULATED DATA**
- **SIMULATED RESPONSE — NO REAL UAV CONTROL**
- **CONCEPTUAL FORECAST**
- **FUTURE HARDWARE INTEGRATION**

## Future Development (6 months)

- Real SDR (HackRF) integration
- Pixhawk / UAV telemetry
- ML-based threat classification
- Validated forecasting models
- Production deployment
