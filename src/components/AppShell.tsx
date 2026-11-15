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
      {/* Sleek Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#141211]/90 backdrop-blur-xl">
        {/* Top status bar */}
        <div className="border-b border-white/10 bg-[#1b1918] px-3 py-1.5 text-xs sm:px-4">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF5A1F] shadow-[0_0_12px_rgba(255,90,31,0.9)] animate-pulse" />
                <span className="font-mono text-[10px] font-bold tracking-wider text-[#F8FAFC] sm:text-[11px]">{metString}</span>
                <span className="rounded border border-[#FF5A1F]/40 bg-[#FF5A1F]/10 px-1.5 py-0.2 font-mono text-[8px] font-semibold text-[#FFB89D] sm:text-[9px]">
                  MARS TRANSIT
                </span>
              </div>
              <span className="hidden text-slate-500 sm:inline">•</span>
              <div className="hidden items-center gap-2 font-mono text-[10px] text-slate-300 sm:flex">
                <span className="text-[#FFB89D]">⚡ 18m 42s Delay</span>
                <span className="text-slate-500">•</span>
                <span className="text-[#F5D0A9]">Edge CDSS Active</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 font-mono text-[10px] sm:text-[11px]">
              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0f0d0d] px-2.5 py-0.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    spaceWeatherStatus === 'storm'
                      ? 'bg-rose-500 animate-pulse'
                      : spaceWeatherStatus === 'elevated'
                        ? 'bg-amber-400'
                        : 'bg-emerald-500'
                  }`}
                />
                <span className="text-slate-400">DONKI:</span>
                <span
                  className={
                    spaceWeatherStatus === 'storm'
                      ? 'font-semibold text-rose-300'
                      : spaceWeatherStatus === 'elevated'
                        ? 'font-semibold text-amber-300'
                        : 'font-semibold text-emerald-300'
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
                className="flex items-center gap-1.5 rounded-lg border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-2.5 py-0.5 text-[#FFD4C6] transition hover:bg-[#FF5A1F]/20 font-medium"
              >
                <img src="/logo.png" alt="AstroPulse Bot" className="h-3.5 w-3.5 object-contain" />
                <span>Mission Co-Pilot</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Nav Strip */}
        <div className="px-3 py-2 sm:px-4">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#0f0d0d] p-0.5 shadow-[0_0_16px_rgba(255,90,31,0.12)] transition group-hover:border-[#FF5A1F]/60">
                <img
                  src="/logo.png"
                  alt="0day Mechanical Twin Logo"
                  className="h-full w-full object-contain transition transform group-hover:scale-105"
                />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-base font-bold tracking-tight text-white group-hover:text-[#FFB89D] transition">
                  0DAY
                </span>
                <span className="hidden rounded border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-1.5 py-0.2 text-[9px] font-mono tracking-wider uppercase text-[#FFB89D] md:inline-block">
                  NASA Space Apps
                </span>
              </div>
            </NavLink>

            {/* Navigation Links with no native scrollbar */}
            <nav className="flex items-center gap-1 overflow-x-auto whitespace-nowrap py-0.5 text-xs scrollbar-none lg:flex-1 lg:justify-center">
              {links.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `rounded-lg px-2.5 py-1.5 font-medium transition text-[11px] sm:text-xs ${
                      isActive
                        ? 'border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 text-[#FFE7DE] font-semibold shadow-[0_0_18px_rgba(255,90,31,0.12)]'
                        : 'text-[#D1D5DB] hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Crew Switcher Pills */}
            <div className="hidden items-center gap-1 shrink-0 border-l border-white/10 pl-3 xl:flex">
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
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-left transition font-mono text-xs ${
                      isSelected
                        ? 'border border-[#FF5A1F]/40 bg-[#FF5A1F]/10 text-[#FFE7DE] font-semibold shadow-[0_0_20px_rgba(255,90,31,0.12)]'
                        : 'border border-white/10 bg-[#0f0d0d] text-slate-300 hover:border-[#FF5A1F]/35 hover:text-white'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isCritical ? 'bg-rose-500 animate-ping' : isWarning ? 'bg-amber-400' : 'bg-emerald-500'
                      }`}
                    />
                    <span>{displayName}</span>
                    <span className="text-[10px] text-slate-400">{Math.round(reading.hr)}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Page Workspace */}
      <main className="relative z-10 mx-auto w-full max-w-7xl px-3 pb-28 pt-5 sm:px-4 md:px-5 lg:px-6">
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
