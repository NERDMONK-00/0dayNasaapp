import { useEffect, useMemo, useState } from 'react'
import { useMissionState } from '../state/store'
import { evaluateAllAlerts, computeRiskIndex } from '../processing/anomaly'
import type { AlertItem, ScenarioId } from '../types'

interface ScenarioMeta {
  id: ScenarioId
  label: string
  pattern: string
  affectedSignals: string
  description: string
  expectedRule: string
}

const scenarioCatalog: ScenarioMeta[] = [
  {
    id: 'normal',
    label: '01. Nominal Flight Baseline',
    pattern: 'Circadian drift + AR(1) noise',
    affectedSignals: 'All signals nominal',
    description: 'Autonomous microgravity baseline without clinical pathology. Tests false alarm rate.',
    expectedRule: 'No alerts fired. Baseline continues learning.',
  },
  {
    id: 'dehydration',
    label: '02. Progressive Dehydration',
    pattern: 'Gradual ramp over simulated hours',
    affectedSignals: 'HR ↑ (+25 bpm), HRV ↓ (-35%), Temp slightly ↑',
    description: 'Intravascular fluid deficit typical of cephalad fluid shift and inadequate fluid replacement.',
    expectedRule: '[Multi-Signal Confirmation] HR + HRV concurrent divergence.',
  },
  {
    id: 'fever',
    label: '03. Systemic Infection / Fever Onset',
    pattern: 'Sigmoidal ramp to 38.6°C then plateau',
    affectedSignals: 'Temp ↑ (38.6°C), HR ↑ (+32 bpm), Resp ↑',
    description: 'Immune dysfunction and latent herpes/Epstein-Barr reactivation observed in spaceflight.',
    expectedRule: '[Multi-Signal Confirmation] Core temp and respiratory elevation.',
  },
  {
    id: 'sleep',
    label: '04. Circadian & Sleep Debt',
    pattern: 'Multi-cycle sleep deficit accumulation',
    affectedSignals: 'Sleep hours ↓ (<4.5h), HRV ↓, resting HR creep',
    description: 'Crews experience 16 sunrises/day on ISS, leading to cumulative cognitive fatigue.',
    expectedRule: '[CUSUM Drift & Persistence] Chronic resting sympathetic elevation.',
  },
  {
    id: 'co2',
    label: '05. Cabin CO₂ Scrubbing Failure',
    pattern: 'Ramped reversible accumulation',
    affectedSignals: 'Cabin CO₂ ↑ (1800 ppm), Resp ↑ (+7 br/min)',
    description: 'Life support LiOH canister saturation triggering mild hypercapnia and SANS aggravation.',
    expectedRule: '[Environmental Hard Safety Override] pCO₂ exceeds 1600 ppm limit.',
  },
  {
    id: 'spo2',
    label: '06. Sudden SpO₂ Drop',
    pattern: 'Acute step drop to 88%',
    affectedSignals: 'SpO₂ ↓ (88.0%), Resp ↑ (+8 br/min)',
    description: 'Rapid depressurization or suit oxygen delivery obstruction requiring immediate purge.',
    expectedRule: '[Hard Safety Override] Direct sensor violation bypassing statistics.',
  },
  {
    id: 'solar-storm',
    label: '07. NASA DONKI Solar Radiation Storm',
    pattern: 'X-class solar flare & SEP event',
    affectedSignals: 'Space weather status = Storm, HRV ↓ autonomic stress',
    description: 'Coronal mass ejection transit detected by DONKI. Demands complete EVA lockdown.',
    expectedRule: '[EVA Planner Override & Risk Index] W=100 drives Risk Index to Critical.',
  },
]

export function TestPage() {
  const {
    missionState,
    selectedAstronautId,
    setSelectedAstronautId,
    currentScenario,
    setScenario,
    spaceWeatherStatus,
  } = useMissionState()

  const [activeScenario, setActiveScenario] = useState<ScenarioId>(currentScenario)
  const [injectStartTime, setInjectStartTime] = useState<number | null>(null)
  const [detectionLatency, setDetectionLatency] = useState<number | null>(null)
  const [wWindow, setWWindow] = useState<number>(72)
  const [zWatch, setZWatch] = useState<number>(2.0)
  const [zCritical, setZCritical] = useState<number>(3.0)

  const astronaut =
    missionState.astronauts.find((p) => p.id === selectedAstronautId) ?? missionState.astronauts[0]
  const current = missionState.currentReadings[selectedAstronautId]
  const history = missionState.history[selectedAstronautId] ?? []
  const baselines = missionState.baselines[selectedAstronautId] ?? {}

  const activeAlerts = useMemo<AlertItem[]>(() => {
    return evaluateAllAlerts(current, history).filter((a) => a.astronautId === selectedAstronautId)
  }, [current, history, selectedAstronautId])

  const risk = computeRiskIndex(current, baselines, spaceWeatherStatus)

  // Track detection latency
  useEffect(() => {
    if (injectStartTime && activeAlerts.length > 0 && !detectionLatency) {
      setDetectionLatency(Math.round((Date.now() - injectStartTime) / 100) / 10)
    }
  }, [injectStartTime, activeAlerts, detectionLatency])

  const handleApplyScenario = (sc: ScenarioId) => {
    setActiveScenario(sc)
    setScenario(sc)
    setInjectStartTime(Date.now())
    setDetectionLatency(null)
  }

  const handleResetToNormal = () => {
    setActiveScenario('normal')
    setScenario('normal')
    setInjectStartTime(null)
    setDetectionLatency(null)
  }

  const meta = scenarioCatalog.find((s) => s.id === activeScenario) ?? scenarioCatalog[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center border-b border-white/10 pb-4">
        <div>
          <span className="page-kicker">Section 4.1 & 6.1 Simulation Lab</span>
          <h1 className="page-title text-2xl sm:text-3xl">
            Physiology Simulator & Scenario Injector
          </h1>
          <p className="mt-1 text-xs font-mono text-slate-300">
            Validate personal baselines, multi-signal confirmation, and hard rules on synthetic astronaut profiles.
          </p>
        </div>

        {/* Quick Reset Button */}
        <button
          type="button"
          onClick={handleResetToNormal}
          className="hud-btn hud-btn-secondary text-xs"
        >
          <span>↺ Reset to Nominal Baseline</span>
        </button>
      </div>

      {/* Main 2-Column Lab Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Scenario Catalog Selector */}
        <div className="space-y-4 lg:col-span-5">
          <div className="hud-card p-4">
            <span className="page-kicker">Step 01 • Select Subject</span>
            <div className="mt-2.5 flex gap-2">
              {missionState.astronauts.map((astro) => (
                <button
                  key={astro.id}
                  type="button"
                  onClick={() => setSelectedAstronautId(astro.id)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 font-mono text-[11px] transition ${
                    selectedAstronautId === astro.id
                      ? 'border-[#FF5A1F]/40 bg-[#FF5A1F]/10 text-[#FFE7DE] shadow-[0_0_18px_rgba(255,90,31,0.12)]'
                      : 'border-white/10 bg-[#171412] text-slate-300 hover:text-white'
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: astro.accent }}
                  />
                  <span>{astro.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="hud-card p-4">
            <span className="page-kicker">Step 02 • Inject Clinical Scenario</span>
            <h3 className="mt-1 font-display text-sm font-bold text-white">
              Test Synthetic Stress Patterns
            </h3>

            <div className="mt-3 space-y-2">
              {scenarioCatalog.map((sc) => {
                const isSelected = activeScenario === sc.id
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => handleApplyScenario(sc.id)}
                    className={`flex w-full flex-col rounded-xl border p-3 text-left transition ${
                      isSelected
                        ? 'border-[#FF5A1F]/40 bg-[#FF5A1F]/10 shadow-[0_0_18px_rgba(255,90,31,0.12)]'
                        : 'border-white/10 bg-[#171412] hover:border-[#FF5A1F]/30 hover:bg-[#1c1918]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{sc.label}</span>
                      {isSelected && (
                        <span className="rounded bg-[#FF5A1F]/15 px-1.5 py-0.5 font-mono text-[9px] uppercase text-[#FFD4C6]">
                          Active Inject
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-mono text-[11px] text-[#FFB89D]">{sc.affectedSignals}</p>
                    <p className="mt-0.5 text-[11px] text-slate-300">{sc.pattern}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Model Parameter Controls (Appendix A Table A1) */}
          <div className="hud-card space-y-3 p-4 font-mono text-xs">
            <span className="page-kicker">Appendix A • Detector Parameters</span>
            <h4 className="font-display text-xs font-bold text-white">Tune Algorithm Sensitivity</h4>

            <div>
              <div className="flex justify-between text-[11px] text-slate-200">
                <span>Baseline Window (W):</span>
                <span className="text-[#8AC5FF]">{wWindow} Hours</span>
              </div>
              <input
                type="range"
                min="24"
                max="168"
                step="24"
                value={wWindow}
                onChange={(e) => setWWindow(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-200">
                <span>Watch Threshold (k):</span>
                <span className="text-amber-300">{zWatch.toFixed(1)} σ</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="2.8"
                step="0.1"
                value={zWatch}
                onChange={(e) => setZWatch(Number(e.target.value))}
                className="w-full accent-amber-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-200">
                <span>Critical Threshold:</span>
                <span className="text-rose-300">{zCritical.toFixed(1)} σ</span>
              </div>
              <input
                type="range"
                min="2.5"
                max="4.0"
                step="0.1"
                value={zCritical}
                onChange={(e) => setZCritical(Number(e.target.value))}
                className="w-full accent-rose-400"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Detection Telemetry & Analysis */}
        <div className="space-y-4 lg:col-span-7">
          {/* Active Scenario Dossier Box */}
          <div className="hud-card p-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="page-kicker">Live Injection Status</span>
              <span
                className={`hud-chip ${
                  risk.band === 'critical'
                    ? 'hud-chip-crit'
                    : risk.band === 'watch'
                      ? 'hud-chip-warn'
                      : 'hud-chip-ok'
                }`}
              >
                {risk.band.toUpperCase()} (Risk {risk.total}/100)
              </span>
            </div>

            <h3 className="mt-2 font-display text-xl font-bold text-white">{meta.label}</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-200">{meta.description}</p>

            <div className="mt-3 rounded-lg border border-white/10 bg-[#171412] p-3 text-xs">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8AC5FF]">Expected Detector Response:</span>
              <p className="mt-0.5 text-slate-200">{meta.expectedRule}</p>
            </div>

            {/* Time to Detection Counter */}
            <div className="mt-3 flex items-center justify-between rounded-lg border border-[#FF5A1F]/25 bg-[#FF5A1F]/10 p-3 font-mono text-xs">
              <span className="text-slate-200">Time-To-Detection (Latency):</span>
              <span className="text-sm font-bold text-[#FFD4C6]">
                {detectionLatency ? `${detectionLatency}s` : injectStartTime ? 'Detecting drift...' : 'N/A (Nominal)'}
              </span>
            </div>
          </div>

          {/* Real-time Telemetry Readout Grid */}
          <div className="hud-card p-4">
            <span className="page-kicker">Live Sensor Streams • {astronaut.name}</span>
            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 font-mono text-xs">
              <div className="rounded-lg border border-white/10 bg-[#171412] p-2.5">
                <span className="text-[10px] text-slate-400">HEART RATE</span>
                <p className="mt-1 text-lg font-bold text-[#8AC5FF]">{Math.round(current.hr)} bpm</p>
                <span className="text-[10px] text-slate-400">
                  Norm: {baselines.hr?.mean ?? 68} bpm
                </span>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#171412] p-2.5">
                <span className="text-[10px] text-slate-400">HRV (RMSSD)</span>
                <p className="mt-1 text-lg font-bold text-[#8AC5FF]">{Math.round(current.hrv)} ms</p>
                <span className="text-[10px] text-slate-400">
                  Norm: {baselines.hrv?.mean ?? 52} ms
                </span>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#171412] p-2.5">
                <span className="text-[10px] text-slate-400">SPO₂ SATURATION</span>
                <p
                  className={`mt-1 text-lg font-bold ${
                    current.spo2 < 92 ? 'text-rose-300' : 'text-emerald-300'
                  }`}
                >
                  {current.spo2.toFixed(1)}%
                </p>
                <span className="text-[10px] text-slate-400">Target: &gt;95%</span>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#171412] p-2.5">
                <span className="text-[10px] text-slate-400">TEMPERATURE</span>
                <p
                  className={`mt-1 text-lg font-bold ${
                    current.temp > 38.0 ? 'text-rose-300' : 'text-amber-300'
                  }`}
                >
                  {current.temp.toFixed(1)}°C
                </p>
                <span className="text-[10px] text-slate-400">Norm: 36.7°C</span>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#171412] p-2.5">
                <span className="text-[10px] text-slate-400">RESPIRATION</span>
                <p className="mt-1 text-lg font-bold text-white">{Math.round(current.resp)} br/m</p>
                <span className="text-[10px] text-slate-400">Norm: 15 br/m</span>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#171412] p-2.5">
                <span className="text-[10px] text-slate-400">CABIN CO₂</span>
                <p
                  className={`mt-1 text-lg font-bold ${
                    current.co2 > 1500 ? 'text-rose-300' : 'text-white'
                  }`}
                >
                  {Math.round(current.co2)} ppm
                </p>
                <span className="text-[10px] text-slate-400">Limit: 1600 ppm</span>
              </div>
            </div>
          </div>

          {/* Fired Alerts Log in Test Environment */}
          <div className="hud-card p-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="page-kicker">Fired Decision Support Alerts ({activeAlerts.length})</span>
              <span className="font-mono text-[10px] text-slate-300">Deterministic Audit Trail</span>
            </div>

            <div className="mt-3 space-y-2.5">
              {activeAlerts.length === 0 ? (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3 font-mono text-xs text-emerald-200">
                  ✓ Nominal status. No statistical deviation or threshold breach detected.
                </div>
              ) : (
                activeAlerts.map((al) => (
                  <div
                    key={al.id}
                    className={`rounded-lg border p-3 text-xs transition ${
                      al.level === 'critical'
                        ? 'border-rose-500/30 bg-rose-950/20'
                        : 'border-amber-500/30 bg-amber-950/20'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-white">
                      <span>{al.title}</span>
                      <span className={`hud-chip ${al.level === 'critical' ? 'hud-chip-crit' : 'hud-chip-warn'}`}>
                        {al.level.toUpperCase()}
                      </span>
                    </div>
                    <p className="mt-1.5 font-mono text-[11px] text-slate-200">{al.evidence}</p>
                    <p className="mt-1 font-semibold text-emerald-200">{al.action}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
