import type { EvaluationResult, FullAnalysis, Incident, SimulateResult, ThreatInput, UAVStatus } from './types'
import * as demo from './demoEngine'
const BASE='/api'
async function remote<T>(path:string,init?:RequestInit):Promise<T>{const r=await fetch(`${BASE}${path}`,init);if(!r.ok)throw new Error();return r.json()}
export const fetchScenarios=()=>remote('/scenarios')
export async function fetchScenario(id:string):Promise<{scenario:ThreatInput}>{try{return await remote(`/scenarios/${id}`)}catch{return demo.scenario(id)}}
export async function analyzeThreat(data:ThreatInput):Promise<FullAnalysis>{try{return await remote('/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})}catch{return demo.analyze(data)}}
type ResponsePayload={uav_id:string;threat_type:string;threat_score:number;severity:string;forecast_trend:string;primary_response:string;primary_actions:string[];before_evidence:Record<string,number|string>;simulated_response_outcome?:string}
export async function simulateResponse(p:ResponsePayload):Promise<SimulateResult>{try{return await remote('/simulate-response',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(p)})}catch{return demo.simulate(p)}}
export async function fetchUAVStatus():Promise<{status:UAVStatus}>{try{return await remote('/uav-status')}catch{return demo.status()}}
export async function fetchIncidents():Promise<{incidents:Incident[]}>{try{return await remote('/incidents')}catch{return demo.logs()}}
export async function resetSimulation(){try{return await remote('/reset',{method:'POST'})}catch{return demo.reset()}}
export async function fetchEvaluation():Promise<{results:EvaluationResult[];passed:number;total:number}>{try{return await remote('/evaluation')}catch{return demo.evaluation()}}
type PriorityResult={primary_threat:{uav_id:string;threat_type:string;score:number;severity:string};secondary_threats:{uav_id:string;threat_type:string;score:number;severity:string}[];reason:string}
export async function prioritizeThreats(threats:ThreatInput[]):Promise<PriorityResult>{try{return await remote<PriorityResult>('/prioritize-threats',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({threats})})}catch{return demo.prioritize(threats)}}
