import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import SceneBackdrop from './SceneBackdrop'
import { useMissionState } from '../state/store'
import { computeRiskIndex } from '../processing/anomaly'
import { MascotAssistant } from './MascotAssistant'

const links = [
  { to: '/', label: 'Overview', badge: 'HUD' },
  { to: '/astronauts', label: 'Crew & 3D Twin', badge: 'Live' },
  { to: '/test', label: 'Simulation Lab', badge: 'Scenarios' },
  { to: '/results', label: 'Evaluation Matrix', badge: 'Paper' },
  { to: '/how-it-works', label: 'Architecture', badge: 'Formulas' },
  { to: '/references', label: 'NASA References', badge: 'Library' },
  { to: '/about', label: 'Research & Ethics', badge: 'NASA HRP' },
  { to: '/team', label: 'Team', badge: 'Nepal' },
]

export default function AppShell() {
  const { missionState, selectedAstronautId, setSelectedAstronautId, spaceWeatherStatus } =
    useMissionState()
  const [missionElapsedSeconds, setMissionElapsedSeconds] = useState(142 * 86400 + 18 * 3600 + 22 * 60 + 10)
  const [showAssistant, setShowAssistant] = useState(false)

  // Live Mission Elapsed Time counter
  useEffect(() => {
    const timer = setInterval(() => {
      setMissionElapsedSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const days = Math.floor(missionElapsedSeconds / 86400)
  const hours = Math.floor((missionElapsedSeconds % 86400) / 3600)
  const minutes = Math.floor((missionElapsedSeconds % 3600) / 60)
  const seconds = missionElapsedSeconds % 60
  const metString = `T+ ${days}d ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const selectedReading = missionState.currentReadings[selectedAstronautId]
  const selectedBaselines = missionState.baselines[selectedAstronautId] ?? {}
  const currentRisk = computeRiskIndex(selectedReading, selectedBaselines, spaceWeatherStatus)

  return (
    <div className="relative min-h-screen text-slate-100">
      <SceneBackdrop />

      {/* Top Aerospace Telemetry Ticker */}
      <header className="sticky top-0 z-30 border-b border-sky-500/20 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs">
          {/* Mission & Earth Comm Status */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 animate-ping rounded-full bg-cyan-400" />
              <span className="font-mono text-cyan-300 font-bold tracking-wider">{metString}</span>
              <span className="rounded bg-sky-950 px-1.5 py-0.5 font-mono text-[10px] text-sky-400 border border-sky-800/60">
                MARS TRANSIT
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 border-l border-slate-800 pl-3 font-mono text-[11px] text-slate-400">
              <span className="text-amber-400">⚡ 18m 42s Light Delay</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400">Autonomous Edge CDSS: Active</span>
            </div>
          </div>

          {/* NASA DONKI Space Weather Banner */}
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <div className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/80 px-2.5 py-0.5">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  spaceWeatherStatus === 'storm'
                    ? 'bg-rose-400 animate-pulse'
                    : spaceWeatherStatus === 'elevated'
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                }`}
              />
              <span className="text-slate-400">DONKI:</span>
              <span
                className={
                  spaceWeatherStatus === 'storm'
                    ? 'text-rose-400 font-semibold'
                    : spaceWeatherStatus === 'elevated'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                }
              >
                {spaceWeatherStatus === 'storm'
                  ? 'SOLAR STORM (X1.2)'
                  : spaceWeatherStatus === 'elevated'
                    ? 'ELEVATED (M2.1)'
                    : 'CALM (KP 2.1)'}
              </span>
            </div>

            {/* AI Assistant Quick Toggle */}
            <button
              type="button"
              onClick={() => setShowAssistant((prev) => !prev)}
              className="flex items-center gap-1.5 rounded-md border border-cyan-500/40 bg-cyan-950/40 px-2.5 py-0.5 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-900/50 transition font-mono text-[11px]"
            >
              <span>🤖</span>
              <span className="hidden md:inline">Mission Co-Pilot</span>
            </button>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 border-t border-slate-800/60">
          <div className="flex items-center gap-3">
            <NavLink to="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-950/60 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)] group-hover:border-cyan-300 transition">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <span className="font-display text-lg font-bold tracking-tight text-white group-hover:text-cyan-300 transition">
                  ASTROPULSE
                </span>
                <span className="hidden sm:inline-block ml-2 text-[9px] font-mono tracking-widest text-cyan-400 uppercase border border-cyan-500/30 rounded px-1">
                  NASA Space Apps
                </span>
              </div>
            </NavLink>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 overflow-x-auto py-1 text-sm">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium whitespace-nowrap transition text-xs ${
                    isActive
                      ? 'border border-cyan-400/50 bg-cyan-950/50 text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                      : 'border border-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900/60 hover:text-slate-200'
                  }`
                }
              >
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Crew Selector Pill Quick-Switcher */}
          <div className="hidden lg:flex items-center gap-1.5 border-l border-slate-800/80 pl-3">
            {missionState.astronauts.map((astro) => {
              const isSelected = astro.id === selectedAstronautId
              const reading = missionState.currentReadings[astro.id]
              const isCritical = reading.spo2 < 90 || reading.hr > 120 || reading.temp > 38.5
              const isWarning = reading.hr > 90 || reading.spo2 < 95

              return (
                <button
                  key={astro.id}
                  type="button"
                  onClick={() => setSelectedAstronautId(astro.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-left transition font-mono text-xs ${
                    isSelected
                      ? 'border border-sky-400 bg-sky-950/70 text-white shadow-[0_0_10px_rgba(56,189,248,0.25)]'
                      : 'border border-slate-800/60 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isCritical
                        ? 'bg-rose-400 animate-ping'
                        : isWarning
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                    }`}
                  />
                  <span>{astro.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-slate-500">{Math.round(reading.hr)}</span>
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Main Page Workspace */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-28 pt-6">
        <Outlet />
      </main>

      {/* Floating Mission AI Decision Support Co-Pilot Drawer */}
      <MascotAssistant
        isOpen={showAssistant}
        onClose={() => setShowAssistant(false)}
        riskScore={currentRisk}
      />
    </div>
  )
}
