import { useMemo, useState } from 'react'
import { SignalChart } from './components/SignalChart'
import { MetricCard, signalStatus } from './components/MetricCard'
import { useMissionState } from './state/store'
import { buildExplainableAlert, evaluateThresholds } from './processing/anomaly'
import type { AlertItem, ScenarioId } from './types'

const scenarioButtons: Array<{ id: ScenarioId; label: string }> = [
  { id: 'normal', label: 'Normal' },
  { id: 'dehydration', label: 'Dehydration' },
  { id: 'fever', label: 'Fever onset' },
  { id: 'sleep', label: 'Sleep debt' },
  { id: 'co2', label: 'CO2 rise' },
  { id: 'spo2', label: 'SpO2 drop' },
]

function App() {
  const { missionState, selectedAstronautId, setSelectedAstronautId, setAlerts, simulator } = useMissionState()
  const [scenario, setScenario] = useState<ScenarioId>('normal')

  const astronaut = missionState.astronauts.find((person) => person.id === selectedAstronautId) ?? missionState.astronauts[0]
  const reading = missionState.currentReadings[selectedAstronautId]
  const history = missionState.history[selectedAstronautId] ?? []

  const metrics = useMemo(() => {
    const fields = [
      { key: 'hr', title: 'Heart rate', unit: 'bpm', min: 50, max: 110, warningMin: 55, warningMax: 96 },
      { key: 'hrv', title: 'HRV', unit: 'ms', min: 20, max: 70, warningMin: 25, warningMax: 60 },
      { key: 'spo2', title: 'SpO2', unit: '%', min: 88, max: 100, warningMin: 92, warningMax: 98 },
      { key: 'temp', title: 'Temperature', unit: '°C', min: 35.5, max: 38.1, warningMin: 36.5, warningMax: 37.5 },
      { key: 'resp', title: 'Resp', unit: 'rpm', min: 12, max: 24, warningMin: 14, warningMax: 20 },
      { key: 'co2', title: 'CO2', unit: 'ppm', min: 500, max: 1200, warningMin: 700, warningMax: 1000 },
      { key: 'sleepHours', title: 'Sleep', unit: 'h', min: 4, max: 10, warningMin: 5, warningMax: 8 },
    ] as const

    return fields.map((field) => {
      const value = Number(reading[field.key])
      const status = signalStatus(value, field.min, field.max, field.warningMin, field.warningMax)

      return {
        title: field.title,
        value: value.toFixed(field.key === 'temp' || field.key === 'sleepHours' ? 1 : 0),
        unit: field.unit,
        status,
        detail: field.key === 'hr' ? 'Baseline trend stable' : 'Within monitored range',
      }
    })
  }, [reading])

  const refreshAlerts = () => {
    const nextAlerts: AlertItem[] = []

    if (reading) {
      nextAlerts.push(...evaluateThresholds(reading))
      nextAlerts.push(...buildExplainableAlert(reading, history, selectedAstronautId))
    }

    setAlerts(nextAlerts.slice(0, 10))
  }

  const onScenarioClick = (nextScenario: ScenarioId) => {
    setScenario(nextScenario)
    simulator.setScenario(nextScenario)
    refreshAlerts()
  }

  const latestAlerts = missionState.alerts.length ? missionState.alerts : []

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <header className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-slate-950/20 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-300">Mission control</p>
            <h1 className="mt-2 text-2xl font-semibold text-white md:text-4xl">Astronaut Health Monitoring</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {missionState.astronauts.map((person) => (
              <button
                key={person.id}
                type="button"
                onClick={() => setSelectedAstronautId(person.id)}
                className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                  selectedAstronautId === person.id
                    ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200'
                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500'
                }`}
              >
                {person.name}
              </button>
            ))}
          </div>
        </header>

        <section className="mb-6 grid gap-4 md:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Crew member</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">{astronaut.name}</h2>
              </div>
              <div className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-300">
                {astronaut.role}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <MetricCard
                  key={metric.title}
                  title={metric.title}
                  value={metric.value}
                  unit={metric.unit}
                  status={metric.status}
                  detail={metric.detail}
                  accent={astronaut.accent}
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-400">Scenario control</p>
            <div className="space-y-2">
              {scenarioButtons.map((button) => (
                <button
                  key={button.id}
                  type="button"
                  onClick={() => onScenarioClick(button.id)}
                  className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                    scenario === button.id
                      ? 'border-cyan-400 bg-cyan-500/10 text-cyan-100'
                      : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {button.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={refreshAlerts}
              className="mt-4 w-full rounded-xl bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Generate alert scan
            </button>
          </div>
        </section>

        <section className="mb-6 grid gap-4 xl:grid-cols-2">
          <SignalChart title="Heart rate" color="#f97316" data={history} valueKey="hr" unit="bpm" />
          <SignalChart title="SpO2" color="#22c55e" data={history} valueKey="spo2" unit="%" />
          <SignalChart title="CO2" color="#a78bfa" data={history} valueKey="co2" unit="ppm" />
          <SignalChart title="Sleep" color="#38bdf8" data={history} valueKey="sleepHours" unit="hours" />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-400">Alert history</p>
            <div className="space-y-3">
              {latestAlerts.length === 0 ? (
                <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-3 text-sm text-slate-300">
                  No active alerts. System stable.
                </div>
              ) : (
                latestAlerts.map((alert) => (
                  <div key={alert.id} className="rounded-xl border border-slate-700 bg-slate-800/60 p-3">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{alert.title}</p>
                        <p className="text-xs text-slate-400">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                      </div>
                      <span
                        className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.12em] ${
                          alert.level === 'critical'
                            ? 'border-rose-500/50 bg-rose-500/10 text-rose-200'
                            : alert.level === 'warning'
                              ? 'border-amber-500/50 bg-amber-500/10 text-amber-200'
                              : 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200'
                        }`}
                      >
                        {alert.level}
                      </span>
                    </div>
                    <p className="mb-2 text-sm text-slate-200">Why: {alert.reason}</p>
                    <p className="text-xs text-cyan-200">Action: {alert.action}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-400">System notes</p>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="rounded-xl border border-slate-700 bg-slate-800/60 p-3">Rule-based safeguards are hard thresholds with no ML dependency.</li>
              <li className="rounded-xl border border-slate-700 bg-slate-800/60 p-3">Baseline tracking uses rolling mean and standard deviation per astronaut.</li>
              <li className="rounded-xl border border-slate-700 bg-slate-800/60 p-3">Data source architecture isolates simulator and future hardware inputs.</li>
              <li className="rounded-xl border border-slate-700 bg-slate-800/60 p-3">This app is designed to run in-browser with no cloud service requirement.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
