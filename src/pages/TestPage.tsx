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
    <div className="page-shell">
      <div className="page-grid route-test pb-8">
        <div className="space-y-5">
          <section className="page-panel">
            <div className="page-kicker">Simulation</div>
            <h1 className="page-title">Test and validate crew health</h1>
          </section>

          <div className="page-panel">
            <p className="text-[10px] uppercase tracking-[0.26em] text-slate-300">01. Crew</p>
            <div className="mt-4 rounded-[22px] border-3 border-[var(--outline)] bg-[rgba(7,18,29,0.8)] p-3 text-white shadow-[var(--shadow)]">
              {astronaut.name}
            </div>
          </div>

          <div className="page-panel">
            <p className="text-[10px] uppercase tracking-[0.26em] text-slate-300">02. Scenario</p>
            <div className="mt-4 grid gap-2">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => setSelectedScenario(scenario.id)}
                  className={`rounded-2xl border-3 border-[var(--outline)] px-3 py-3 text-left text-sm transition ${
                    selectedScenario === scenario.id ? 'bg-[#4da3ff]/15 text-white' : 'bg-[rgba(7,18,29,0.8)] text-slate-200'
                  }`}
                >
                  {scenario.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={runScenario} className="toon-btn">Run test</button>
            <button type="button" className="toon-btn toon-btn-yellow">Stop</button>
            <button type="button" className="toon-btn toon-btn-pink">Restart</button>
          </div>
        </div>

        <div className="page-panel">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.26em] text-slate-300">Live stream</p>
            <span className={`toon-chip ${isRunning ? 'toon-ok' : 'toon-warn'} text-[10px] uppercase tracking-[0.2em]`}>
              {isRunning ? 'Streaming' : 'Idle'}
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {[
              ['HR', `${Math.round(current.hr)} bpm`],
              ['SpO₂', `${Math.round(current.spo2)}%`],
              ['CO₂', `${Math.round(current.co2)} ppm`],
            ].map(([label, value]) => (
              <div key={label} className="toon-card">
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-300">{label}</p>
                <p className="toon-number mt-2 text-2xl text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-3" aria-live="polite">
            {latestAlerts.length === 0 ? (
              <div className="toon-card border-[var(--ok)] bg-emerald-500/10 text-sm text-emerald-200">No active alerts. Crew remains within nominal thresholds.</div>
            ) : (
              latestAlerts.map((alert) => (
                <div key={alert.id} className="toon-card">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">{alert.title}</p>
                    <span className={`toon-chip ${alert.level === 'critical' ? 'toon-crit' : alert.level === 'warning' ? 'toon-warn' : 'toon-ok'} text-[10px] uppercase tracking-[0.2em]`}>
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
