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

function getAstroDisplayName(name: string) {
  return name.replace(/^(Commander|Lt\.|Dr\.)\s*/i, '').split(' ')[0]
}

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
    <div className="app-window text-slate-100">
      {/* 3D Cinematic Space Atmosphere & Planet Curve */}
      <SceneBackdrop />

      {/* Sleek Cinematic Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        {/* Top telemetry ticker strip */}
        <div className="border-b border-white/5 bg-black/30 px-4 py-1.5 text-xs">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-mono text-[11px] font-bold tracking-wider text-cyan-300">{metString}</span>
                <span className="rounded-full bg-blue-500/20 px-2 py-0.5 font-mono text-[9px] font-semibold text-blue-300 border border-blue-400/30">
                  MARS TRANSIT
                </span>
              </div>
              <span className="hidden sm:inline text-white/20">•</span>
              <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-slate-400">
                <span className="text-amber-400">⚡ 18m 42s Comm Delay</span>
                <span className="text-white/20">•</span>
                <span className="text-emerald-400">Autonomous Edge CDSS: Active</span>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-[11px]">
              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/60 px-2.5 py-0.5 backdrop-blur-sm">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    spaceWeatherStatus === 'storm'
                      ? 'bg-rose-500 animate-pulse'
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
                        ? 'text-amber-400 font-semibold'
                        : 'text-emerald-400 font-semibold'
                  }
                >
                  {spaceWeatherStatus === 'storm'
                    ? 'SOLAR STORM'
                    : spaceWeatherStatus === 'elevated'
                      ? 'ELEVATED'
                      : 'CALM'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowAssistant((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-full border border-sky-400/40 bg-sky-500/20 px-3 py-1 text-sky-200 hover:bg-sky-500/30 transition font-medium text-[11px] shadow-sm"
              >
                <img src="/logo.png" alt="AstroPulse Bot" className="h-3.5 w-3.5 object-contain" />
                <span>Mission Co-Pilot</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Nav Strip (matching reference image) */}
        <div className="px-4 py-2.5">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-slate-900/60 p-1 shadow-md group-hover:border-cyan-400/50 transition">
                <img
                  src="/logo.png"
                  alt="AstroPulse Mechanical Twin Logo"
                  className="h-full w-full object-contain transition transform group-hover:scale-110"
                />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-lg font-extrabold tracking-wider text-white group-hover:text-cyan-300 transition">
                  ASTROPULSE
                </span>
                <span className="hidden md:inline-block text-[9px] font-mono tracking-widest text-cyan-400 uppercase border border-cyan-500/30 rounded px-1.5 py-0.2 bg-cyan-950/40">
                  NASA Space Apps
                </span>
              </div>
            </NavLink>

            {/* Navigation Links with glowing blue active indicator */}
            <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 text-xs">
              {links.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `rounded-full px-3 py-1.5 font-medium whitespace-nowrap transition text-xs ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold shadow-[0_0_15px_rgba(37,99,235,0.5)] border border-blue-400/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Crew Switcher Pills */}
            <div className="hidden xl:flex items-center gap-1 shrink-0 border-l border-white/10 pl-3">
              {missionState.astronauts.map((astro) => {
                const isSelected = astro.id === selectedAstronautId
                const reading = missionState.currentReadings[astro.id]
                const isCritical = reading.spo2 < 90 || reading.hr > 120 || reading.temp > 38.5
                const isWarning = reading.hr > 90 || reading.spo2 < 95
                const displayName = getAstroDisplayName(astro.name)

                return (
                  <button
                    key={astro.id}
                    type="button"
                    onClick={() => setSelectedAstronautId(astro.id)}
                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-left transition font-mono text-xs ${
                      isSelected
                        ? 'border border-cyan-400/60 bg-cyan-500/20 text-white font-semibold shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                        : 'border border-white/10 bg-slate-900/60 text-slate-400 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isCritical
                          ? 'bg-rose-500 animate-ping'
                          : isWarning
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                      }`}
                    />
                    <span>{displayName}</span>
                    <span className="text-[10px] text-slate-500">{Math.round(reading.hr)}</span>
                  </button>
                )
              })}
            </div>
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
