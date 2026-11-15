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
  normal: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-300 bg-amber-50 text-amber-700',
  watch: 'border-amber-300 bg-amber-50 text-amber-700',
  critical: 'border-rose-300 bg-rose-50 text-rose-700',
}

export function MetricCard({ title, value, unit, status, detail, accent }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-lg shadow-gray-200/60">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{title}</p>
        <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${statusClasses[status]}`}>
          {status}
        </span>
      </div>

      <div className="mb-2 flex items-end gap-2">
        <span className="text-3xl font-semibold text-gray-900" style={{ color: accent }}>{value}</span>
        {unit ? <span className="text-sm text-gray-500">{unit}</span> : null}
      </div>

      <p className="text-xs text-gray-500">{detail}</p>
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
