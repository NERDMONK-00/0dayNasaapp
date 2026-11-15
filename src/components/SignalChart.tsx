import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { VitalReading } from '../types'

interface SignalChartProps {
  title: string
  color: string
  data: VitalReading[]
  valueKey: keyof VitalReading
  unit: string
}

export function SignalChart({ title, color, data, valueKey, unit }: SignalChartProps) {
  const chartData = data.map((entry) => ({
    time: new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: Number(entry[valueKey]),
  }))

  return (
    <div className="toon-card">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-slate-200">{title}</h3>
        <span className="text-xs text-slate-300">{unit}</span>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`fill-${title}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.9} />
                <stop offset="95%" stopColor={color} stopOpacity={0.15} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.14)" strokeDasharray="0" vertical={false} />
            <XAxis dataKey="time" stroke="#d7ecff" tickLine={false} axisLine={false} minTickGap={18} />
            <YAxis stroke="#d7ecff" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0b0b2b',
                border: '2px solid #120f3a',
                borderRadius: '12px',
                color: '#fff',
              }}
            />
            <Area type="monotone" dataKey="value" stroke={color} fill={`url(#fill-${title})`} strokeWidth={3} strokeLinecap="round" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
