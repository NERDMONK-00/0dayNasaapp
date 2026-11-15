import { Link } from 'react-router-dom'
import { useMissionState } from '../state/store'
import { computeEVAReadiness, computeRiskIndex } from '../processing/anomaly'
import { BodyModel3D } from '../components/BodyModel3D'
import type { ScenarioId } from '../types'

const scenariosList: Array<{ id: ScenarioId; label: string; icon: string }> = [
  { id: 'normal', label: 'Nominal Flight', icon: '🟢' },
  { id: 'dehydration', label: 'Dehydration Ramp', icon: '💧' },
  { id: 'fever', label: 'Infection / Fever', icon: '🌡️' },
  { id: 'sleep', label: 'Sleep Deprivation', icon: '💤' },
  { id: 'co2', label: 'Cabin CO₂ Spike', icon: '⚠️' },
  { id: 'spo2', label: 'Acute SpO₂ Drop', icon: '🚨' },
  { id: 'solar-storm', label: 'DONKI Solar Storm', icon: '☀️' },
]

export function HomePage() {
  const {
    missionState,
    selectedAstronautId,
    setSelectedAstronautId,
    currentScenario,
    setScenario,
    spaceWeatherStatus,
  } = useMissionState()

  const astronaut =
    missionState.astronauts.find((p) => p.id === selectedAstronautId) ?? missionState.astronauts[0]
  const current = missionState.currentReadings[selectedAstronautId]
  const baselines = missionState.baselines[selectedAstronautId] ?? {}
  const alerts = missionState.alerts.filter((a) => a.astronautId === selectedAstronautId)

  const risk = computeRiskIndex(current, baselines, spaceWeatherStatus)
  const eva = computeEVAReadiness(selectedAstronautId, current, baselines, spaceWeatherStatus)

  const isCritical = risk.band === 'critical'
  const isWatch = risk.band === 'watch'

  return (
    <div className="space-y-6">
      {/* Top Hero Mission Control Kicker */}
      <section className="hud-card relative overflow-hidden border-white/10 bg-[#151412]/80 p-6 md:p-8">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-[#FF5A1F]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="page-kicker">
              <span>Deep Space Health Intelligence</span>
              <span>•</span>
              <span className="text-[#D1D5DB] font-mono">Earth-Independent Medical Operations (EIMO)</span>
            </div>
            <h1 className="page-title mt-2 text-2xl md:text-3xl lg:text-4xl text-white">
              Autonomous Crew Health & Clinical Decision Support
            </h1>
            <p className="page-copy mt-2.5 max-w-2xl text-sm leading-relaxed text-slate-300">
              Personalized rolling baselines, multi-signal anomaly confirmation, and NASA DONKI
              space-weather risk fusion. Designed for lunar and martian transit where Earth communication
              delay exceeds 20 minutes.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link to="/test" className="hud-btn">
                <span>⚡ Open Simulation Lab</span>
              </Link>
              <Link to="/astronauts" className="hud-btn hud-btn-secondary">
                <span>🧑‍🚀 Crew Vitals & 3D Dossier</span>
              </Link>
              <Link to="/results" className="hud-btn hud-btn-secondary">
                <span>📊 Research Evaluation Matrix</span>
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0f0d0d] p-4 lg:w-80 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-mono text-xs text-[#FFB89D]">INJECT SCENARIO</span>
              <span className="font-mono text-[10px] text-slate-400">REAL-TIME</span>
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-xs">
              {scenariosList.map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setScenario(sc.id)}
                  className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left font-mono text-[11px] transition ${
                    currentScenario === sc.id
                      ? 'border border-[#FF5A1F]/40 bg-[#FF5A1F]/10 text-[#FFE7DE] font-semibold'
                      : 'border border-white/10 bg-[#171513] text-slate-300 hover:border-[#FF5A1F]/30 hover:bg-[#1a1715]'
                  }`}
                >
                  <span>{sc.icon}</span>
                  <span className="truncate">{sc.label.split(' ')[0]}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setScenario('normal')}
                className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left font-mono text-[11px] border border-white/10 bg-[#171513] text-slate-300 hover:border-[#FF5A1F]/30 hover:text-[#FFE7DE] transition"
              >
                <span>🔄</span>
                <span className="truncate">Reset Lab</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main 2-Column Operations Deck */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Risk Index + EVA Forecast + Hazards */}
        <div className="space-y-6 lg:col-span-7">
          {/* 1. AstroPulse 0-100 Risk Index (Section 4.7 of Paper) */}
          <div className="hud-card p-4 md:p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="page-kicker">Unified Risk Formula</span>
                <h3 className="font-display text-lg font-bold text-white">
                  AstroPulse Risk Index (R = 0.60·P + 0.20·E + 0.20·W)
                </h3>
              </div>
              <span
                className={`hud-chip ${
                  isCritical ? 'hud-chip-crit' : isWatch ? 'hud-chip-warn' : 'hud-chip-ok'
                }`}
              >
                {risk.band.toUpperCase()} BAND
              </span>
            </div>

            {/* Score Display & Breakdown */}
            <div className="mt-4 grid items-center gap-4 sm:grid-cols-12">
              {/* Radial Big Gauge */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center rounded-xl border border-white/10 bg-[#111214] p-4">
                <div className="relative flex h-32 w-32 items-center justify-center">
                  <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="48" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      stroke={isCritical ? '#ef4444' : isWatch ? '#f59e0b' : '#00f0ff'}
                      strokeWidth="8"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={`${(risk.total / 100) * 301.6} 301.6`}
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="font-mono text-3xl font-extrabold text-white">{risk.total}</span>
                    <span className="block font-mono text-[9px] uppercase tracking-widest text-slate-400">
                      / 100 Risk
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-center font-mono text-[11px] text-slate-300">{risk.dominantFactor}</p>
              </div>

              {/* 3 Weight Breakdown Bars */}
              <div className="sm:col-span-7 space-y-3 font-mono text-xs">
                <div>
                  <div className="mb-1 flex justify-between text-[11px]">
                    <span className="text-slate-300">P (Physiology • 60% wt)</span>
                    <span className="text-sky-300">{risk.physiology} / 100</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#1d1f22]">
                    <div
                      className="h-full bg-sky-400 transition-all duration-500"
                      style={{ width: `${risk.physiology}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex justify-between text-[11px]">
                    <span className="text-slate-300">E (Cabin Environment • 20% wt)</span>
                    <span className="text-sky-300">{risk.environment} / 100</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#1d1f22]">
                    <div
                      className="h-full bg-cyan-400 transition-all duration-500"
                      style={{ width: `${risk.environment}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex justify-between text-[11px]">
                    <span className="text-slate-300">W (DONKI Space Weather • 20% wt)</span>
                    <span
                      className={
                        risk.spaceWeather > 50
                          ? 'text-rose-300'
                          : risk.spaceWeather > 0
                            ? 'text-amber-300'
                            : 'text-emerald-300'
                      }
                    >
                      {risk.spaceWeather} / 100
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#1d1f22]">
                    <div
                      className={`h-full transition-all duration-500 ${
                        risk.spaceWeather > 50
                          ? 'bg-rose-500'
                          : risk.spaceWeather > 0
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                      }`}
                      style={{ width: `${risk.spaceWeather}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. EVA Readiness 12-Hour Hourly Forecast Matrix (Section 4.8) */}
          <div className="hud-card p-4 md:p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="page-kicker">Spacewalk Mission Planning</span>
                <h3 className="font-display text-lg font-bold text-white">
                  12-Hour EVA Readiness Forecast Window
                </h3>
              </div>
              <span
                className={`hud-chip ${
                  eva.overallStatus === 'go'
                    ? 'hud-chip-ok'
                    : eva.overallStatus === 'caution'
                      ? 'hud-chip-warn'
                      : 'hud-chip-crit'
                }`}
              >
                EVA: {eva.overallStatus.toUpperCase()}
              </span>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-slate-300">
              <strong className="text-sky-300">Recommended Window:</strong> {eva.recommendedWindow}
            </p>

            {/* 12-Hour Slot Bar */}
            <div className="mt-4 grid grid-cols-6 gap-1.5 sm:grid-cols-12">
              {eva.slots.map((slot) => {
                const isGo = slot.readiness === 'go'
                const isCaution = slot.readiness === 'caution'
                return (
                  <div
                    key={slot.hourOffset}
                    className={`flex flex-col items-center justify-center rounded-lg border p-1.5 text-center font-mono transition ${
                      isGo
                        ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200'
                        : isCaution
                          ? 'border-amber-500/40 bg-amber-950/30 text-amber-200'
                          : 'border-rose-500/40 bg-rose-950/30 text-rose-200'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400">+{slot.hourOffset}h</span>
                    <span
                      className={`text-[9px] font-bold uppercase ${
                        isGo ? 'text-emerald-300' : isCaution ? 'text-amber-300' : 'text-rose-300'
                      }`}
                    >
                      {slot.readiness}
                    </span>
                    <span className="text-[9px] text-slate-400">{slot.score}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 3. NASA Five Spaceflight Hazards Monitor */}
          <div className="hud-card p-4 md:p-5">
            <span className="page-kicker">NASA Human Research Program (HRP)</span>
            <h3 className="font-display text-lg font-bold text-white">The Five Hazards of Deep Spaceflight</h3>

            <div className="mt-3 grid gap-2.5 text-xs sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-[#111214] p-2.5">
                <div className="flex items-center justify-between font-semibold text-sky-300">
                  <span>1. Radiation & Solar Weather</span>
                  <span className="font-mono text-[10px] text-emerald-300">0.42 mSv/d</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-300">
                  DONKI solar proton flux monitor with cumulative career limit tracking.
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#111214] p-2.5">
                <div className="flex items-center justify-between font-semibold text-sky-300">
                  <span>2. Isolation & Confinement</span>
                  <span className="font-mono text-[10px] text-amber-300">{current.sleepHours.toFixed(1)}h sleep</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-300">
                  Circadian rhythm tracking across 16 sunrises/day with autonomic HRV.
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#111214] p-2.5">
                <div className="flex items-center justify-between font-semibold text-sky-300">
                  <span>3. Distance from Earth</span>
                  <span className="font-mono text-[10px] text-sky-300">18m latency</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-300">
                  Full zero-cloud browser autonomy with store-and-forward Earth downlink.
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#111214] p-2.5">
                <div className="flex items-center justify-between font-semibold text-sky-300">
                  <span>4. Gravity & SANS Syndrome</span>
                  <span className="font-mono text-[10px] text-sky-300">Nominal</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-300">
                  Fluid shift cephalad screening for neuro-ocular disc edema and bone loss.
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#111214] p-2.5 sm:col-span-2">
                <div className="flex items-center justify-between font-semibold text-sky-300">
                  <span>5. Hostile Closed Environment</span>
                  <span className="font-mono text-[10px] font-bold text-emerald-300">
                    {Math.round(current.co2)} ppm CO₂
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-300">
                  Cabin life support loop, toxic volatile gas filtration, recycled water purity, and microbial ecology monitoring.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Biomechanical Twin Viewport */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <BodyModel3D status={risk.band} reading={current} />

          {/* Quick Active Astronaut Biometric Readouts */}
          <div className="hud-card p-4 md:p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-mono text-xs text-sky-300">TELEMETRY: {astronaut.name}</span>
              <span className="font-mono text-[10px] text-slate-400">
                {astronaut.role} • Day {astronaut.missionDays}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="rounded-lg border border-white/10 bg-[#111214] p-2.5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-semibold">HEART RATE</span>
                <p className={`text-xl font-bold ${current.hr > 115 ? 'text-rose-300' : current.hr > 90 ? 'text-amber-300' : 'text-white'}`}>
                  {Math.round(current.hr)} bpm
                </p>
                <span className="text-[10px] text-slate-400">Base: {baselines.hr?.mean ?? 68} bpm</span>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#111214] p-2.5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-semibold">HRV (RMSSD)</span>
                <p className={`text-xl font-bold ${current.hrv < 30 ? 'text-rose-300' : current.hrv < 40 ? 'text-amber-300' : 'text-white'}`}>
                  {Math.round(current.hrv)} ms
                </p>
                <span className="text-[10px] text-slate-400">Base: {baselines.hrv?.mean ?? 52} ms</span>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#111214] p-2.5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-semibold">SPO₂ SATURATION</span>
                <p
                  className={`text-xl font-bold ${
                    current.spo2 < 90 ? 'text-rose-300' : current.spo2 < 94 ? 'text-amber-300' : 'text-emerald-300'
                  }`}
                >
                  {current.spo2.toFixed(1)}%
                </p>
                <span className="text-[10px] text-slate-400">Target: &gt; 95%</span>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#111214] p-2.5 shadow-xs">
                <span className="text-[10px] text-slate-400 font-semibold">CORE TEMP</span>
                <p
                  className={`text-xl font-bold ${
                    current.temp > 38.2 ? 'text-rose-300' : current.temp > 37.6 ? 'text-amber-300' : 'text-white'
                  }`}
                >
                  {current.temp.toFixed(1)}°C
                </p>
                <span className="text-[10px] text-slate-400">Base: 36.7°C</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Crew Health Telemetry Snapshot Strip */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="page-kicker">Multi-Crew Telemetry</div>
          <Link to="/astronauts" className="font-mono text-xs text-sky-300 hover:underline">
            View full crew dossier →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {missionState.astronauts.map((astro) => {
            const rd = missionState.currentReadings[astro.id]
            const isSelected = astro.id === selectedAstronautId
            const astroRisk = computeRiskIndex(
              rd,
              missionState.baselines[astro.id] ?? {},
              spaceWeatherStatus,
            )

            return (
              <button
                key={astro.id}
                type="button"
                onClick={() => setSelectedAstronautId(astro.id)}
                className={`hud-card hud-card-hover text-left transition p-3 ${
                  isSelected ? 'border-sky-400/60 bg-[#101214] shadow-[0_0_0_1px_rgba(56,189,248,0.20)]' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg font-bold text-slate-950"
                      style={{ backgroundColor: astro.accent }}
                    >
                      {astro.name[0]}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{astro.name}</h4>
                      <p className="font-mono text-[10px] text-slate-400">{astro.role}</p>
                    </div>
                  </div>
                  <span
                    className={`hud-chip ${
                      astroRisk.band === 'critical'
                        ? 'hud-chip-crit'
                        : astroRisk.band === 'watch'
                          ? 'hud-chip-warn'
                          : 'hud-chip-ok'
                    }`}
                  >
                    {astroRisk.total} RISK
                  </span>
                </div>

                <div className="mt-3.5 grid grid-cols-4 gap-1 border-t border-white/10 pt-2.5 text-center font-mono text-[11px]">
                  <div>
                    <span className="text-[9px] text-slate-400">HR</span>
                    <p className="font-bold text-white">{Math.round(rd.hr)}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400">HRV</span>
                    <p className="font-bold text-white">{Math.round(rd.hrv)}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400">SpO₂</span>
                    <p className="font-bold text-white">{Math.round(rd.spo2)}%</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400">TEMP</span>
                    <p className="font-bold text-white">{rd.temp.toFixed(1)}°</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Explainable Clinical Decision Support Alerts Feed (Section 4.9) */}
      <section className="hud-card p-4 md:p-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <span className="page-kicker">Explainable Clinical Intelligence</span>
            <h3 className="font-display text-lg font-bold text-white">
              Autonomous Clinical Decision Support Log
            </h3>
          </div>
          <span className="font-mono text-xs text-slate-300">
            {alerts.length} active alert{alerts.length === 1 ? '' : 's'} for {astronaut.name}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {alerts.length === 0 ? (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/30 p-4 text-xs text-emerald-100 font-mono flex items-start gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 font-bold shrink-0 mt-0.5">✓</span>
              <span>All physiological signals, baseline z-scores, and cabin life-support sensors remain strictly within calibrated mission margins. No clinical intervention indicated.</span>
            </div>
          ) : (
            alerts.map((al) => (
              <div
                key={al.id}
                className={`rounded-xl border p-4 text-xs transition ${
                  al.level === 'critical'
                    ? 'border-rose-500/20 bg-rose-950/20'
                    : 'border-amber-500/20 bg-amber-950/20'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        al.level === 'critical' ? 'bg-rose-500 animate-ping' : 'bg-amber-500'
                      }`}
                    />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-300">
                      {al.category ?? 'monitor'}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-300">
                    {al.level}
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  <h4 className="text-base font-semibold text-white">{al.title}</h4>
                  <p className="text-slate-200">{al.what}</p>
                  <p className="text-slate-300"><strong className="text-sky-300">Why it matters:</strong> {al.whyItMatters}</p>
                  <p className="text-slate-300"><strong className="text-sky-300">Evidence:</strong> {al.evidence}</p>
                  <p className="text-slate-300"><strong className="text-sky-300">Reason:</strong> {al.reason}</p>
                  <p className="text-slate-300"><strong className="text-sky-300">Action:</strong> {al.action}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Mission Footer Strip */}
      <footer className="hud-card flex flex-col items-center justify-between gap-3 p-4 text-xs font-mono text-slate-400 sm:flex-row">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-blue-300">0DAY</span>
          <span>•</span>
          <span>NASA Space Apps Challenge 2026</span>
          <span>•</span>
          <span className="text-slate-300">Created by <Link to="/team" className="text-blue-300 hover:text-blue-200 hover:underline">Ayush Neupane</Link> (Nepal)</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/references" className="text-blue-300 transition hover:text-blue-200">
            NASA References &amp; Blueprints →
          </Link>
          <a
            href="https://github.com/NERDMONK-00/0dayNasaapp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 transition hover:text-slate-200"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  )
}
