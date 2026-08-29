import { useEffect, useState } from 'react'
import { CheckCircle2, FlaskConical, XCircle } from 'lucide-react'
import { fetchEvaluation, fetchScenario, prioritizeThreats } from '../api'
import type { EvaluationResult } from '../types'
import { Panel } from '../components/Panel'

export default function Evaluation() {
  const [results, setResults] = useState<EvaluationResult[]>([])
  const [summary, setSummary] = useState({ passed: 0, total: 0 })
  const [error, setError] = useState('')
  const [priority, setPriority] = useState<{ primary_threat: { threat_type: string; score: number; severity: string }; secondary_threats: { threat_type: string; score: number; severity: string }[]; reason: string } | null>(null)

  useEffect(() => {
    fetchEvaluation()
      .then((data) => {
        setResults(data.results)
        setSummary({ passed: data.passed, total: data.total })
      })
      .catch(() => setError('Start the FastAPI backend to run the repeatable evaluation.'))
  }, [])

  const runPriorityDemo = async () => {
    const loaded = await Promise.all(['spoofing', 'jamming', 'suspicious_command'].map(fetchScenario))
    setPriority(await prioritizeThreats(loaded.map((item) => item.scenario)))
  }

  return (
    <div>
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <FlaskConical className="w-7 h-7 text-cyan-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Prototype Evaluation</h1>
            <p className="text-sm text-gray-500">Eight proposal-aligned scenarios · Detect-and-alert baseline vs proposed engine</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10">
          <p className="text-xs text-cyan-300">SCENARIOS PASSED</p>
          <p className="text-3xl font-bold text-white mt-1">{summary.passed}/{summary.total || 8}</p>
        </div>
        <div className="p-4 rounded-xl border border-gray-700 bg-gray-900/50">
          <p className="text-xs text-gray-500">BASELINE</p>
          <p className="text-sm text-gray-200 mt-2">Detect → Alert operator</p>
        </div>
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
          <p className="text-xs text-emerald-300">PROPOSED PIPELINE</p>
          <p className="text-sm text-gray-200 mt-2">Correlate → Forecast → Decide → Evaluate</p>
        </div>
      </div>

      <Panel title="REPEATABLE SCENARIO MATRIX">
        {error ? <p className="text-amber-300 text-sm py-6 text-center">{error}</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-gray-500 border-b border-gray-800">
                <tr><th className="p-3">Scenario</th><th className="p-3">Detect-and-alert baseline</th><th className="p-3">Proposed engine output</th><th className="p-3">Result</th></tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.scenario} className="border-b border-gray-800/70">
                    <td className="p-3 text-white font-medium">{result.scenario}</td>
                    <td className="p-3 text-gray-500">{result.baseline}</td>
                    <td className="p-3 text-cyan-300">{result.proposed}</td>
                    <td className="p-3">
                      <span className={result.passed ? 'text-emerald-400' : 'text-red-400'}>
                        {result.passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-[11px] text-gray-600 mt-4">Results are generated from controlled synthetic scenarios. They are not real-world detection accuracy claims.</p>
      </Panel>

      <Panel title="MULTIPLE SIMULTANEOUS THREATS" className="mt-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-gray-400">Rank spoofing, jamming and a suspicious command using the same correlation engine.</p>
          <button onClick={runPriorityDemo} className="px-4 py-2 rounded-lg bg-cyan-500 text-black text-xs font-semibold hover:bg-cyan-400">Run priority demo</button>
        </div>
        {priority && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-red-500/40 bg-red-500/10"><p className="text-[10px] text-red-300">PRIMARY THREAT</p><p className="font-semibold text-white mt-1">{priority.primary_threat.threat_type}</p><p className="text-sm text-red-300">{priority.primary_threat.score}/100 · {priority.primary_threat.severity}</p></div>
            {priority.secondary_threats.map((threat) => <div key={threat.threat_type} className="p-3 rounded-lg border border-gray-700 bg-gray-900/50"><p className="text-[10px] text-gray-500">SECONDARY THREAT</p><p className="font-semibold text-white mt-1">{threat.threat_type}</p><p className="text-sm text-gray-400">{threat.score}/100 · {threat.severity}</p></div>)}
            <p className="md:col-span-3 text-xs text-gray-500">{priority.reason}</p>
          </div>
        )}
      </Panel>
    </div>
  )
}
