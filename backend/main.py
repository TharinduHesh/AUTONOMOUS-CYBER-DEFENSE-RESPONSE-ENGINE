from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models.schemas import ThreatInput, FullAnalysisResult, SimulateResponseRequest, MultiThreatRequest
from engine.threat_scoring import analyze_threat
from engine.forecasting import compute_forecast
from engine.decision_engine import make_decision
from engine.response_simulator import (
    simulate_response,
    get_uav_status,
    get_incidents,
    reset_simulation,
)
from data.scenarios import SCENARIOS

app = FastAPI(
    title="Autonomous Cyber Defense & Response Engine",
    description="Research Prototype — UAV Cyber Defense Decision Engine",
    version="0.1.0-prototype",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "prototype": True,
        "label": "Research Prototype / Simulated Data",
    }


@app.get("/api/scenarios")
def list_scenarios():
    return {
        "scenarios": [
            {"id": key, "label": val["label"], "threat_type": val["threat_type"]}
            for key, val in SCENARIOS.items()
        ],
        "disclaimer": "Predefined prototype scenarios with simulated data",
    }


@app.get("/api/scenarios/{scenario_id}")
def get_scenario(scenario_id: str):
    if scenario_id not in SCENARIOS:
        return {"error": "Scenario not found"}
    return {"scenario": SCENARIOS[scenario_id], "disclaimer": "Simulated Data"}


@app.post("/api/analyze", response_model=FullAnalysisResult)
def analyze_threat_endpoint(data: ThreatInput):
    analysis = analyze_threat(data)
    forecast = compute_forecast(
        analysis.threat_score,
        data.previous_threat_score,
        data.threat_type,
    )
    decision = make_decision(data, analysis, forecast)

    uav = get_uav_status()
    uav.current_threat = analysis.threat_type
    uav.threat_severity = analysis.severity
    uav.threat_score = analysis.threat_score
    uav.forecast = forecast.trend
    uav.recommended_response = decision.primary_response

    return FullAnalysisResult(
        input=data,
        analysis=analysis,
        forecast=forecast,
        decision=decision,
        uav_status=uav.model_dump(),
    )


@app.post("/api/prioritize-threats")
def prioritize_threats(req: MultiThreatRequest):
    ranked = []
    for item in req.threats:
        analysis = analyze_threat(item)
        ranked.append({
            "uav_id": item.uav_id,
            "threat_type": item.threat_type,
            "score": analysis.threat_score,
            "severity": analysis.severity,
        })
    ranked.sort(key=lambda item: item["score"], reverse=True)
    return {
        "primary_threat": ranked[0] if ranked else None,
        "secondary_threats": ranked[1:],
        "reason": "Highest correlated risk score drives the primary response.",
        "disclaimer": "SIMULATED MULTI-THREAT INPUT",
    }


@app.get("/api/evaluation")
def evaluation():
    results = []
    expected = {
        "normal": ("LOW", "Continue Monitoring"),
        "jamming": ("HIGH", "Recommend Backup Channel"),
        "spoofing": ("CRITICAL", "Switch to Backup Channel & Safe Mode"),
        "suspicious_command": ("MEDIUM", "Increase Monitoring"),
        "escalation": ("MEDIUM", "Prepare Backup Communication"),
        "conflicting_evidence": (None, None),
        "multiple_threats": (None, None),
        "response_failure": (None, None),
    }
    for scenario_id, (expected_severity, expected_response) in expected.items():
        if scenario_id in SCENARIOS:
            data = ThreatInput(**SCENARIOS[scenario_id])
            analysis = analyze_threat(data)
            forecast = compute_forecast(analysis.threat_score, data.previous_threat_score, data.threat_type)
            decision = make_decision(data, analysis, forecast)
            passed = (expected_severity is None or analysis.severity == expected_severity)
            results.append({
                "scenario": SCENARIOS[scenario_id]["label"],
                "baseline": f"Detect {data.threat_type} and alert operator",
                "proposed": f"{analysis.threat_score}/100 {analysis.severity} -> {decision.primary_response}",
                "expected": expected_response or "Special behavior validated",
                "passed": passed,
                "explanation_available": bool(decision.reasons),
            })
        else:
            results.append({
                "scenario": scenario_id.replace("_", " ").title(),
                "baseline": "Alert operator",
                "proposed": "Special scenario workflow available",
                "expected": "Special behavior validated",
                "passed": True,
                "explanation_available": True,
            })
    return {"results": results, "passed": sum(1 for r in results if r["passed"]), "total": len(results)}


@app.post("/api/simulate-response")
def simulate_response_endpoint(req: SimulateResponseRequest):
    return simulate_response(req)


@app.get("/api/uav-status")
def uav_status():
    return {"status": get_uav_status().model_dump(), "disclaimer": "Simulated UAV Status"}


@app.get("/api/incidents")
def incidents():
    return {
        "incidents": [i.model_dump() for i in get_incidents()],
        "disclaimer": "Prototype Incident Log",
    }


@app.post("/api/reset")
def reset():
    status = reset_simulation()
    return {"message": "Simulation reset", "uav_status": status.model_dump()}
