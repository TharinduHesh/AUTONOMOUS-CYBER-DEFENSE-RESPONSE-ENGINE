import { AlertTriangle } from 'lucide-react'

export default function PrototypeBanner() {
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-2 flex items-center gap-2 text-amber-300 text-xs">
      <AlertTriangle className="w-4 h-4 shrink-0" />
      <span>
        <strong>RESEARCH PROTOTYPE</strong> — Simulated Data · Conceptual Forecast · Simulated Response · Future Hardware Integration
      </span>
    </div>
  )
}
