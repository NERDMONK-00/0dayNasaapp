import type { AlertLevel, VitalReading } from '../types'

interface MetricCardProps {
  title: string
  value: string
  unit?: string
  status: AlertLevel
  detail: string
  accent: string
}

const statusClasses: Record<AlertLevel, string> = {
  normal: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
  critical: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
}

export function MetricCard({ title, value, unit, status, detail, accent }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/30">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{title}</p>
        <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${statusClasses[status]}`}>
          {status}
        </span>
      </div>

      <div className="mb-2 flex items-end gap-2">
        <span className="text-3xl font-semibold text-white" style={{ color: accent }}>{value}</span>
        {unit ? <span className="text-sm text-slate-400">{unit}</span> : null}
      </div>

      <p className="text-xs text-slate-400">{detail}</p>
    </div>
  )
}

export function signalStatus(value: number, min: number, max: number, warningMin: number, warningMax: number): AlertLevel {
  if (value < min || value > max) return 'critical'
  if (value < warningMin || value > warningMax) return 'warning'
  return 'normal'
}

export function getDisplayReading(reading: VitalReading | undefined, field: keyof VitalReading): string {
  if (!reading) return '--'
  if (field === 'temp') return Number(reading.temp).toFixed(1)
  if (field === 'sleepHours') return Number(reading.sleepHours).toFixed(1)
  return String(Math.round(Number(reading[field])))
}
