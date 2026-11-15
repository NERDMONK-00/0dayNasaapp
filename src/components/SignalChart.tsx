import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { SignalBaseline, VitalReading } from '../types'

interface SignalChartProps {
  title: string
  color: string
  data: VitalReading[]
  valueKey: keyof Omit<VitalReading, 'timestamp' | 'astronautId'>
  unit: string
  baseline?: SignalBaseline
}

export function SignalChart({ title, color, data, valueKey, unit, baseline }: SignalChartProps) {
  const chartData = data.slice(-30).map((entry) => ({
    time: new Date(entry.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    value: Number(entry[valueKey]),
    mean: baseline ? baseline.mean : undefined,
  }))

  const currentValue = data.length > 0 ? Number(data[data.length - 1][valueKey]) : 0
  const gradientId = `grad-${valueKey}`

  return (
    <div className="hud-card">
      <div className="mb-2 flex items-center justify-between border-b border-gray-200 pb-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
          <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-gray-800">
            {title}
          </h4>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="font-bold text-gray-900">
            {currentValue} {unit}
          </span>
          {baseline && baseline.mean > 0 && (
            <span className="text-[10px] text-gray-400">
              (μ: {baseline.mean})
            </span>
          )}
        </div>
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 28, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#9CA3AF"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 9, fontFamily: 'JetBrains Mono', fill: '#9CA3AF' }}
              minTickGap={24}
            />
            <YAxis
              stroke="#9CA3AF"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 9, fontFamily: 'JetBrains Mono', fill: '#9CA3AF' }}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '8px',
                color: '#111827',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              }}
              formatter={(val: any) => [`${val} ${unit}`, title]}
            />
            {baseline && baseline.mean > 0 && (
              <ReferenceLine
                y={baseline.mean}
                stroke="#9CA3AF"
                strokeDasharray="3 3"
                strokeWidth={1}
                label={{
                  value: 'BASELINE',
                  fill: '#9CA3AF',
                  fontSize: 8,
                  position: 'insideTopRight',
                  fontFamily: 'JetBrains Mono',
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 4, stroke: color, strokeWidth: 2, fill: '#ffffff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
