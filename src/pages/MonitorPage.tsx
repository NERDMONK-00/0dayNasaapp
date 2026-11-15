import { useMemo } from 'react'
import { SignalChart } from '../components/SignalChart'
import { useMissionState } from '../state/store'

export function MonitorPage() {
  const { missionState, selectedAstronautId } = useMissionState()

  const astronaut = missionState.astronauts.find((person) => person.id === selectedAstronautId) ?? missionState.astronauts[0]
  const history = missionState.history[selectedAstronautId] ?? []

  const summary = useMemo(
    () => [
      { label: 'Heart rate', value: `${Math.round(Number(history.at(-1)?.hr ?? 0))} bpm`, tone: 'text-orange-300' },
      { label: 'SpO2', value: `${Math.round(Number(history.at(-1)?.spo2 ?? 0))}%`, tone: 'text-emerald-300' },
      { label: 'Temp', value: `${Number(history.at(-1)?.temp ?? 0).toFixed(1)}°C`, tone: 'text-cyan-300' },
      { label: 'CO2', value: `${Math.round(Number(history.at(-1)?.co2 ?? 0))} ppm`, tone: 'text-violet-300' },
    ],
    [history],
  )

  return (
    <div className="rounded-[30px] border border-slate-800 bg-slate-900/70 p-6 md:p-8">
      <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Monitor</p>
      <h1 className="mt-4 text-4xl font-semibold text-white">Live health monitor</h1>

      <div className="mt-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-semibold text-slate-950" style={{ backgroundColor: astronaut.accent }}>
          {astronaut.name.slice(0, 1)}
        </div>
        <div>
          <p className="text-xl font-semibold text-white">{astronaut.name}</p>
          <p className="text-sm text-slate-400">{astronaut.role}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
            <p className={`mt-3 text-2xl font-semibold ${item.tone}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <SignalChart title="Heart rate" color="#f97316" data={history} valueKey="hr" unit="bpm" />
        <SignalChart title="SpO2" color="#22c55e" data={history} valueKey="spo2" unit="%" />
        <SignalChart title="CO2" color="#a78bfa" data={history} valueKey="co2" unit="ppm" />
        <SignalChart title="Sleep" color="#38bdf8" data={history} valueKey="sleepHours" unit="hours" />
      </div>
    </div>
  )
}
