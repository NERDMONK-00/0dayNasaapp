import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import { signalStatus } from './components/MetricCard'
import { useMissionState } from './state/store'
import { buildExplainableAlert, evaluateThresholds } from './processing/anomaly'
import type { AlertItem, ScenarioId } from './types'
import { AboutPage } from './pages/AboutPage'
import { ReportPage } from './pages/ReportPage'
import { StatusPage } from './pages/StatusPage'
import { MonitorPage } from './pages/MonitorPage'
import { ChecksPage } from './pages/ChecksPage'
import { Sidebar } from './components/Sidebar'
import { PromptInput } from './components/PromptInput'
import { BodyModel3D } from './components/BodyModel3D'
import { Card } from './components/Card'
import { StatusChip } from './components/StatusChip'

const scenarioButtons: Array<{ id: ScenarioId; label: string }> = [
  { id: 'normal', label: 'Normal' },
  { id: 'dehydration', label: 'Dehydration' },
  { id: 'fever', label: 'Fever onset' },
  { id: 'sleep', label: 'Sleep debt' },
  { id: 'co2', label: 'CO2 rise' },
  { id: 'spo2', label: 'SpO2 drop' },
]

function DashboardOverview() {
  const { missionState, selectedAstronautId, setSelectedAstronautId, setAlerts, simulator } = useMissionState()
  const [scenario, setScenario] = useState<ScenarioId>('normal')

  const reading = missionState.currentReadings[selectedAstronautId]
  const history = missionState.history[selectedAstronautId] ?? []

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
  const missionStatus = latestAlerts.some((alert) => alert.level === 'critical')
    ? 'critical'
    : latestAlerts.some((alert) => alert.level === 'warning')
      ? 'warning'
      : 'normal'

  return (
    <div className="space-y-4">
      <header className="mb-5 flex flex-col gap-4 rounded-[28px] border border-slate-700/70 bg-gradient-to-r from-[#0f1d2d] via-[#111e32] to-[#0e1728] p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.38em] text-cyan-300">Flight deck</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-white md:text-5xl">Astronaut health telemetry</h1>
        </div>

        <div className="flex items-center gap-3">
          <StatusChip status={missionStatus as 'normal' | 'warning' | 'critical'} label={missionStatus} />
          <button
            type="button"
            onClick={refreshAlerts}
            className="rounded-2xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/15"
          >
            Run scan
          </button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-4">
          <div className="rounded-[30px] border border-slate-700/80 bg-[#0d1728]/80 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Crew overview</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Select crew member</h2>
              </div>
              <button className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-slate-300">
                Live
              </button>
            </div>

            <div className="space-y-3">
              {missionState.astronauts.map((person) => {
                const current = missionState.currentReadings[person.id]
                const isSelected = selectedAstronautId === person.id
                const currentStatus = signalStatus(Number(current.hr), 50, 110, 55, 96)

                return (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() => setSelectedAstronautId(person.id)}
                    className={`flex w-full items-center justify-between rounded-[22px] border p-3 text-left transition ${
                      isSelected ? 'border-cyan-400/35 bg-cyan-500/10' : 'border-slate-700 bg-[#0d1624] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold text-slate-950" style={{ backgroundColor: person.accent }}>
                        {person.name.slice(0, 1)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{person.name}</p>
                        <p className="text-[11px] text-slate-400">{person.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-300">{Math.round(Number(current.hr))} bpm</span>
                      <StatusChip status={currentStatus} label={currentStatus} />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-700/80 bg-[#0d1728] p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Hotspots</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Body model</h2>
              </div>
              <button className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-slate-300">
                3D view
              </button>
            </div>
            <BodyModel3D />
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Scenario</p>
            <div className="mt-4 space-y-2">
              {scenarioButtons.map((button) => (
                <button
                  key={button.id}
                  type="button"
                  onClick={() => onScenarioClick(button.id)}
                  className={`w-full rounded-2xl border px-3 py-2.5 text-left text-sm transition ${
                    scenario === button.id ? 'border-cyan-400/40 bg-cyan-500/10 text-cyan-100' : 'border-slate-700 bg-[#0d1624] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Vitals</p>
            <div className="mt-4 space-y-3">
              {[
                { label: 'Heart rate', value: `${Math.round(Number(reading?.hr ?? 0))} bpm`, state: 'warning' },
                { label: 'HRV', value: `${Math.round(Number(reading?.hrv ?? 0))} ms`, state: 'normal' },
                { label: 'SpO2', value: `${Math.round(Number(reading?.spo2 ?? 0))}%`, state: 'normal' },
                { label: 'Temp', value: `${Number(reading?.temp ?? 0).toFixed(1)}°C`, state: 'warning' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-700 bg-[#0d1624] p-3">
                  <div>
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className="mt-1 text-lg font-semibold text-white">{item.value}</p>
                  </div>
                  <StatusChip status={item.state as 'normal' | 'warning' | 'critical'} label={item.state} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[30px] border border-slate-700/80 bg-[#0d1728] p-4">
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Alerts</p>
          <div className="mt-4 space-y-3">
            {latestAlerts.length === 0 ? (
              <div className="rounded-[22px] border border-emerald-400/25 bg-emerald-500/5 p-4 text-sm text-emerald-200">
                No active alerts. System stable.
              </div>
            ) : (
              latestAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="rounded-[22px] border border-slate-700 bg-[#0d1624] p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-white">{alert.title}</p>
                    <StatusChip status={alert.level} label={alert.level} />
                  </div>
                  <p className="text-sm text-slate-200">Why: {alert.reason}</p>
                  <p className="mt-2 text-xs text-cyan-200">Action: {alert.action}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <PromptInput />
          <div className="rounded-[28px] border border-slate-700/80 bg-[#111d2d] p-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Timeline</p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-slate-700 bg-[#0d1624] p-3">HR elevated +12% from baseline</div>
              <div className="rounded-2xl border border-slate-700 bg-[#0d1624] p-3">Sleep debt recovered to 4.8h</div>
              <div className="rounded-2xl border border-slate-700 bg-[#0d1624] p-3">Cabin CO₂ returned to safe range</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-[#07111d] text-slate-100">
      <div className="mx-auto max-w-[1500px] p-3 md:p-5">
        <div className="grid min-h-[calc(100vh-1.5rem)] gap-4 xl:grid-cols-[280px_1fr]">
          <Sidebar />

          <main className="rounded-[32px] border border-slate-700/60 bg-[#0b1625]/75 p-4 shadow-[0_30px_80px_rgba(2,6,23,0.9)] backdrop-blur-xl md:p-6">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/monitor" element={<MonitorPage />} />
              <Route path="/status" element={<StatusPage />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/checks" element={<ChecksPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App
