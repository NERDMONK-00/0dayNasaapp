import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
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
    <div className="app-window text-gray-900">
      {/* No SceneBackdrop — clean light canvas */}

      {/* Top Light Telemetry Bar */}
      <header className="sticky top-0 z-30 border-b border-black/[0.07] bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs">
          {/* Mission Status */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 animate-ping rounded-full bg-blue-500" />
              <span className="font-mono text-blue-600 font-bold tracking-wider">{metString}</span>
              <span className="rounded-md bg-blue-50 px-1.5 py-0.5 font-mono text-[10px] text-blue-500 border border-blue-200">
                MARS TRANSIT
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 border-l border-gray-200 pl-3 font-mono text-[11px] text-gray-500">
              <span className="text-amber-500">⚡ 18m 42s Light Delay</span>
              <span className="text-gray-300">•</span>
              <span className="text-emerald-600">Autonomous Edge CDSS: Active</span>
            </div>
          </div>

          {/* Space Weather + Co-Pilot */}
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <div className="flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-gray-50 px-2.5 py-0.5">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  spaceWeatherStatus === 'storm'
                    ? 'bg-rose-400 animate-pulse'
                    : spaceWeatherStatus === 'elevated'
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                }`}
              />
              <span className="text-gray-500">DONKI:</span>
              <span
                className={
                  spaceWeatherStatus === 'storm'
                    ? 'text-rose-500 font-semibold'
                    : spaceWeatherStatus === 'elevated'
                      ? 'text-amber-600'
                      : 'text-emerald-600'
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
              className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition font-mono text-[11px]"
            >
              <span>🤖</span>
              <span className="hidden md:inline">Mission Co-Pilot</span>
            </button>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 border-t border-black/[0.05]">
          <div className="flex items-center gap-3">
            <NavLink to="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-500 group-hover:bg-blue-100 transition">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <span className="font-display text-lg font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition">
                  ASTROPULSE
                </span>
                <span className="hidden sm:inline-block ml-2 text-[9px] font-mono tracking-widest text-blue-500 uppercase border border-blue-200 rounded px-1 bg-blue-50">
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
                      ? 'border border-blue-200 bg-blue-50 text-blue-600'
                      : 'border border-transparent text-gray-500 hover:border-gray-200 hover:bg-gray-50 hover:text-gray-800'
                  }`
                }
              >
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Crew Selector Pill */}
          <div className="hidden lg:flex items-center gap-1.5 border-l border-gray-200 pl-3">
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
                      ? 'border border-blue-300 bg-blue-50 text-blue-700 shadow-sm'
                      : 'border border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-800'
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
                  <span className="text-[10px] text-gray-400">{Math.round(reading.hr)}</span>
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
