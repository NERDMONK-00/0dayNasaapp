import { NavLink, Route, Routes, BrowserRouter } from 'react-router-dom'
import { useState } from 'react'
import { signalStatus } from './components/MetricCard'
import { useMissionState } from './state/store'
import { buildExplainableAlert, evaluateThresholds } from './processing/anomaly'
import type { AlertItem, ScenarioId } from './types'
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'
import { ReportPage } from './pages/ReportPage'
import { StatusPage } from './pages/StatusPage'
import { MonitorPage } from './pages/MonitorPage'
import { ChecksPage } from './pages/ChecksPage'

const scenarioButtons: Array<{ id: ScenarioId; label: string }> = [
  { id: 'normal', label: 'Normal' },
  { id: 'dehydration', label: 'Dehydration' },
  { id: 'fever', label: 'Fever onset' },
  { id: 'sleep', label: 'Sleep debt' },
  { id: 'co2', label: 'CO2 rise' },
  { id: 'spo2', label: 'SpO2 drop' },
]

const statusStyles = {
  normal: 'bg-emerald-500/10 text-emerald-200 border border-emerald-400/20',
  warning: 'bg-amber-500/10 text-amber-200 border border-amber-400/25',
  critical: 'bg-rose-500/10 text-rose-200 border border-rose-400/25',
}

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/monitor', label: 'Monitor' },
  { to: '/status', label: 'Status' },
  { to: '/report', label: 'Report' },
  { to: '/checks', label: 'Checks' },
  { to: '/about', label: 'About us' },
]

function App() {
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
    ? 'Critical'
    : latestAlerts.some((alert) => alert.level === 'warning')
      ? 'Warning'
      : 'Nominal'

  const shell = (
    <div className="min-h-screen bg-[#07111d] text-slate-100">
      <div className="mx-auto max-w-[1500px] p-3 md:p-5">
        <div className="grid min-h-[calc(100vh-1.5rem)] gap-4 xl:grid-cols-[280px_1fr]">
          <aside className="rounded-[32px] border border-slate-700/60 bg-[#0d1728]/90 p-4 shadow-[0_30px_80px_rgba(3,7,18,0.9)] backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.38em] text-slate-500">Mission</p>
                <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.06em] text-white">AstraOps</h2>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/40 bg-cyan-400/10 text-[11px] font-semibold text-cyan-200">
                AO
              </div>
            </div>

            <nav className="mb-6 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex w-full items-center rounded-2xl border px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? 'border-cyan-400/40 bg-cyan-500/10 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.15)]'
                        : 'border-transparent bg-[#111d2d] text-slate-300 hover:border-slate-700 hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="mb-6 rounded-[24px] border border-slate-700/80 bg-[#111d2d] p-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Crew status</p>
              <div className="mt-4 space-y-3">
                {missionState.astronauts.map((person) => {
                  const current = missionState.currentReadings[person.id]
                  const isSelected = selectedAstronautId === person.id
                  const currentStatus = signalStatus(Number(current.hr), 50, 110, 55, 96)

                  return (
                    <button
                      key={person.id}
                      type="button"
                      onClick={() => setSelectedAstronautId(person.id)}
                      className={`flex w-full items-center justify-between rounded-2xl border p-3 text-left transition ${
                        isSelected
                          ? 'border-cyan-400/35 bg-cyan-500/10'
                          : 'border-slate-700/80 bg-[#0d1624] hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold text-slate-950" style={{ backgroundColor: person.accent }}>
                          {person.name.slice(0, 1)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{person.name}</p>
                          <p className="text-[11px] text-slate-400">{person.role}</p>
                        </div>
                      </div>

                      <span className={`rounded-full px-2 py-1 text-[9px] uppercase tracking-[0.16em] ${statusStyles[currentStatus]}`}>
                        {currentStatus}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-700/80 bg-[#111d2d] p-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Scenario control</p>
              <div className="mt-4 space-y-2">
                {scenarioButtons.map((button) => (
                  <button
                    key={button.id}
                    type="button"
                    onClick={() => onScenarioClick(button.id)}
                    className={`w-full rounded-2xl border px-3 py-2.5 text-left text-sm transition ${
                      scenario === button.id
                        ? 'border-cyan-400/40 bg-[#102a3f] text-cyan-100'
                        : 'border-slate-700 bg-[#0d1624] text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="rounded-[32px] border border-slate-700/60 bg-[#0b1625]/75 p-4 shadow-[0_30px_80px_rgba(2,6,23,0.9)] backdrop-blur-xl md:p-6">
            <header className="mb-5 flex flex-col gap-4 rounded-[28px] border border-slate-700/70 bg-gradient-to-r from-[#0f1d2d] via-[#111e32] to-[#0e1728] p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.38em] text-cyan-300">Flight deck</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-white md:text-5xl">Astronaut health telemetry</h1>
              </div>

              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium ${statusStyles[missionStatus === 'Critical' ? 'critical' : missionStatus === 'Warning' ? 'warning' : 'normal']}`}>
                  {missionStatus}
                </span>
                <button
                  type="button"
                  onClick={refreshAlerts}
                  className="rounded-2xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/15"
                >
                  Run scan
                </button>
              </div>
            </header>

            <Routes>
              <Route path="/" element={<HomePage />} />
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

  return <BrowserRouter>{shell}</BrowserRouter>
}

export default App
