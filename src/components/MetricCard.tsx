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
  normal: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300',
  warning: 'border-amber-500/30 bg-amber-500/15 text-amber-300',
  watch: 'border-sky-500/30 bg-sky-500/15 text-sky-300',
  critical: 'border-rose-500/40 bg-rose-500/20 text-rose-300 animate-pulse',
}

export function MetricCard({ title, value, unit, status, detail, accent }: MetricCardProps) {
  return (
    <div className="hud-card backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-mono">{title}</p>
        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase ${statusClasses[status]}`}>
          {status}
        </span>
      </div>

      <div className="mb-2 flex items-end gap-2">
        <span className="text-3xl font-extrabold text-white" style={{ color: accent }}>{value}</span>
        {unit ? <span className="text-sm font-mono text-slate-400">{unit}</span> : null}
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">{detail}</p>
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
