import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts'
import type { Forecast } from '../types'

export default function ForecastChart({ forecast }: { forecast: Forecast }) {
  const chartData: Array<{
    time: string
    historical?: number
    current?: number
    forecast?: number
  }> = [
    ...forecast.historical.map((p) => ({
      time: p.time,
      historical: p.type === 'historical' ? p.score : undefined,
      current: p.type === 'current' ? p.score : undefined,
    })),
    ...forecast.forecast_points.map((p) => ({
      time: `+${p.minutes_ahead}m`,
      forecast: p.score,
    })),
  ]

  const lastHistorical = forecast.historical[forecast.historical.length - 1]
  if (lastHistorical) {
    const idx = chartData.findIndex((d) => d.time === lastHistorical.time && d.historical !== undefined)
    if (idx >= 0) chartData[idx].current = forecast.current_score
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="time" stroke="#6b7280" fontSize={11} />
          <YAxis domain={[0, 100]} stroke="#6b7280" fontSize={11} />
          <Tooltip
            contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
            labelStyle={{ color: '#9ca3af' }}
          />
          <Legend />
          <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Critical', fill: '#ef4444', fontSize: 10 }} />
          <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'High', fill: '#f59e0b', fontSize: 10 }} />
          <Line type="monotone" dataKey="historical" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} name="Historical" connectNulls />
          <Line type="monotone" dataKey="current" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 6 }} name="Current" connectNulls />
          <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeWidth={2} strokeDasharray="6 4" dot={{ r: 4 }} name="Forecast (Prototype)" connectNulls />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-[10px] text-gray-500 mt-2 text-center">
        Conceptual Forecast — {forecast.method}
      </p>
    </div>
  )
}
