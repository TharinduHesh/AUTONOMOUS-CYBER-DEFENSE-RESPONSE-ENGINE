export interface ThreatInput {
  uav_id: string
  frequency_mhz: number
  signal_strength_dbm: number
  noise_level_dbm: number
  snr_db: number
  bandwidth_mhz: number
  packet_loss_pct: number
  latency_ms: number
  authentication_status: string
  controller_trust_status: string
  communication_status: string
  threat_type: string
  threat_confidence: number
  previous_threat_score: number
  force_evidence_conflict?: boolean
  simulated_response_outcome?: string
}

export interface ScoreFactor {
  label: string
  points: number
}

export interface ThreatAnalysis {
  threat_type: string
  threat_score: number
  severity: string
  confidence: number
  affected_communication: string
  risk_factors: ScoreFactor[]
  score_breakdown_total: number
  source_contributions: { source: string; raw_score: number; weight: number; weighted_points: number }[]
  normalized_evidence: Record<string, string | number>
  evidence_conflict: boolean
  conflict_details: string[]
  decision_confidence: string
}

export interface ForecastPoint {
  label: string
  minutes_ahead: number
  score: number
}

export interface Forecast {
  historical: { time: string; score: number; type: string }[]
  current_score: number
  forecast_points: ForecastPoint[]
  trend: string
  trend_slope: number
  method: string
  confidence: string
}

export interface Decision {
  reactive_response: string
  reactive_actions: string[]
  forecast_aware_response: string
  forecast_aware_actions: string[]
  primary_response: string
  primary_actions: string[]
  decision_mode: string
  reasons: string[]
  forecast_influenced: boolean
}

export interface UAVStatus {
  uav_id: string
  mission_status: string
  communication: string
  primary_channel: string
  backup_channel: string
  gps_status: string
  telemetry_status: string
  current_mode: string
  security_status: string
  current_threat: string
  threat_severity: string
  threat_score: number
  forecast: string
  recommended_response: string
}

export interface FullAnalysis {
  input: ThreatInput
  analysis: ThreatAnalysis
  forecast: Forecast
  decision: Decision
  uav_status: UAVStatus
}

export interface Incident {
  incident_id: string
  timestamp: string
  uav_id: string
  threat: string
  severity: string
  score: number
  forecast: string
  decision: string
  response: string
  status: string
  effectiveness: string
  before_evidence: Record<string, number | string>
  after_evidence: Record<string, number | string>
  audit_trail: { timestamp: string; stage: string }[]
}

export interface SimulateResult {
  steps: string[]
  uav_status: UAVStatus
  incident: Incident
  disclaimer: string
  effectiveness: {
    classification: string
    before: Record<string, number | string>
    after: Record<string, number | string>
    explanation: string
  }
}

export interface EvaluationResult {
  scenario: string
  baseline: string
  proposed: string
  expected: string
  passed: boolean
  explanation_available: boolean
}
