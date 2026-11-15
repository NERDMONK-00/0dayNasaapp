import { useMemo, useState } from 'react'
import { useMissionState } from '../state/store'
import { buildExplainableAlert, evaluateThresholds } from '../processing/anomaly'
import type { AlertItem, ScenarioId } from '../types'

const scenarios: Array<{ id: ScenarioId; label: string }> = [
  { id: 'normal', label: 'Normal' },
  { id: 'dehydration', label: 'Dehydration' },
  { id: 'fever', label: 'Fever' },
  { id: 'sleep', label: 'Sleep deprivation' },
  { id: 'co2', label: 'CO₂ rise' },
  { id: 'spo2', label: 'SpO₂ drop' },
]

export function TestPage() {
  const { missionState, selectedAstronautId, setAlerts, simulator } = useMissionState()
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId>('normal')
  const [isRunning, setIsRunning] = useState(false)

  const astronaut = missionState.astronauts.find((person) => person.id === selectedAstronautId) ?? missionState.astronauts[0]
  const current = missionState.currentReadings[selectedAstronautId]
  const latestAlerts = useMemo<AlertItem[]>(() => missionState.alerts.filter((alert) => alert.astronautId === selectedAstronautId), [missionState.alerts, selectedAstronautId])

  const runScenario = () => {
    simulator.setScenario(selectedScenario)
    setIsRunning(true)

    const reading = missionState.currentReadings[selectedAstronautId]
    const history = missionState.history[selectedAstronautId] ?? []
    const nextAlerts = [
      ...evaluateThresholds(reading),
      ...buildExplainableAlert(reading, history, selectedAstronautId),
    ]

    setAlerts(nextAlerts.slice(0, 10))
  }

  return (
    <div className="space-y-6 px-2 pb-10 pt-6 md:px-4">
      <section className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl md:p-6">
        <p className="text-[10px] uppercase tracking-[0.32em] text-[#9ec9ff]">Simulation</p>
        <h1 className="mt-3 text-4xl font-light tracking-[-0.07em] text-white md:text-5xl">Test and validate crew health</h1>
      </section>

      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-5">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <p className="text-[10px] uppercase tracking-[0.26em] text-slate-400">01. Crew</p>
            <div className="mt-4 rounded-[22px] border border-white/10 bg-[#07121d] p-3 text-white">
              {astronaut.name}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <p className="text-[10px] uppercase tracking-[0.26em] text-slate-400">02. Scenario</p>
            <div className="mt-4 grid gap-2">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => setSelectedScenario(scenario.id)}
                  className={`rounded-2xl border px-3 py-3 text-left text-sm transition ${
                    selectedScenario === scenario.id ? 'border-[#4da3ff]/40 bg-[#4da3ff]/10 text-white' : 'border-white/10 bg-[#07121d] text-slate-200'
                  }`}
                >
                  {scenario.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={runScenario} className="rounded-full border border-[#4da3ff]/40 bg-[#4da3ff]/15 px-5 py-3 text-sm font-medium text-white">
              Run test
            </button>
            <button type="button" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200">
              Stop
            </button>
            <button type="button" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200">
              Restart
            </button>
          </div>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.26em] text-slate-400">Live stream</p>
            <span className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.2em] ${isRunning ? 'bg-emerald-500/10 text-emerald-200' : 'bg-white/5 text-slate-300'}`}>
              {isRunning ? 'Streaming' : 'Idle'}
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {[
              ['HR', `${Math.round(current.hr)} bpm`],
              ['SpO₂', `${Math.round(current.spo2)}%`],
              ['CO₂', `${Math.round(current.co2)} ppm`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[22px] border border-white/10 bg-[#07121d] p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">{label}</p>
                <p className="mt-2 text-2xl font-medium text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            {latestAlerts.length === 0 ? (
              <div className="rounded-[22px] border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">No active alerts. Crew remains within nominal thresholds.</div>
            ) : (
              latestAlerts.map((alert) => (
                <div key={alert.id} className="rounded-[22px] border border-white/10 bg-[#07121d] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">{alert.title}</p>
                    <span className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.2em] ${alert.level === 'critical' ? 'bg-red-500/10 text-red-200' : alert.level === 'warning' ? 'bg-amber-500/10 text-amber-200' : 'bg-emerald-500/10 text-emerald-200'}`}>
                      {alert.level}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{alert.reason}</p>
                  <p className="mt-2 text-xs text-cyan-200">Suggested action: {alert.action}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
