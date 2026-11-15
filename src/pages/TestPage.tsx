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
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center border-b border-gray-200 pb-4">
        <div>
          <span className="page-kicker">Section 4.1 & 6.1 Simulation Lab</span>
          <h1 className="page-title text-2xl sm:text-3xl">
            Physiology Simulator & Scenario Injector
          </h1>
          <p className="text-xs text-gray-500 font-mono mt-1">
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
          <div className="hud-card">
            <span className="page-kicker">Step 01 • Select Subject</span>
            <div className="mt-2.5 flex gap-2">
              {missionState.astronauts.map((astro) => (
                <button
                  key={astro.id}
                  type="button"
                  onClick={() => setSelectedAstronautId(astro.id)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 font-mono text-xs border transition ${
                    selectedAstronautId === astro.id
                      ? 'border-blue-300 bg-blue-50 text-blue-700 shadow-glow'
                      : 'border-gray-200 bg-gray-50 text-gray-500 hover:text-gray-900'
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

          <div className="hud-card">
            <span className="page-kicker">Step 02 • Inject Clinical Scenario</span>
            <h3 className="font-display text-sm font-bold text-gray-900 mt-1">
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
                        ? 'border-blue-300 bg-blue-50 shadow-glow'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900 text-xs">{sc.label}</span>
                      {isSelected && (
                        <span className="rounded bg-blue-400/20 px-1.5 py-0.5 font-mono text-[9px] text-blue-600 uppercase">
                          Active Inject
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-mono text-[11px] text-blue-500">{sc.affectedSignals}</p>
                    <p className="mt-0.5 text-[11px] text-gray-500">{sc.pattern}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Model Parameter Controls (Appendix A Table A1) */}
          <div className="hud-card font-mono text-xs space-y-3">
            <span className="page-kicker">Appendix A • Detector Parameters</span>
            <h4 className="font-display text-xs font-bold text-gray-900">Tune Algorithm Sensitivity</h4>

            <div>
              <div className="flex justify-between text-[11px] text-gray-700">
                <span>Baseline Window (W):</span>
                <span className="text-blue-600">{wWindow} Hours</span>
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
              <div className="flex justify-between text-[11px] text-gray-700">
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
              <div className="flex justify-between text-[11px] text-gray-700">
                <span>Critical Threshold:</span>
                <span className="text-rose-400">{zCritical.toFixed(1)} σ</span>
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
          <div className="hud-card">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
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

            <h3 className="font-display text-xl font-bold text-gray-900 mt-2">{meta.label}</h3>
            <p className="mt-1 text-xs text-gray-700 leading-relaxed">{meta.description}</p>

            <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs">
              <span className="font-mono text-[10px] uppercase text-blue-600">Expected Detector Response:</span>
              <p className="mt-0.5 text-gray-800">{meta.expectedRule}</p>
            </div>

            {/* Time to Detection Counter */}
            <div className="mt-3 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3 font-mono text-xs">
              <span className="text-gray-700">Time-To-Detection (Latency):</span>
              <span className="font-bold text-blue-600 text-sm">
                {detectionLatency ? `${detectionLatency}s` : injectStartTime ? 'Detecting drift...' : 'N/A (Nominal)'}
              </span>
            </div>
          </div>

          {/* Real-time Telemetry Readout Grid */}
          <div className="hud-card">
            <span className="page-kicker">Live Sensor Streams • {astronaut.name}</span>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-xs">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-2.5">
                <span className="text-[10px] text-gray-500">HEART RATE</span>
                <p className="text-lg font-bold text-blue-600">{Math.round(current.hr)} bpm</p>
                <span className="text-[10px] text-gray-400">
                  Norm: {baselines.hr?.mean ?? 68} bpm
                </span>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-2.5">
                <span className="text-[10px] text-gray-500">HRV (RMSSD)</span>
                <p className="text-lg font-bold text-blue-600">{Math.round(current.hrv)} ms</p>
                <span className="text-[10px] text-gray-400">
                  Norm: {baselines.hrv?.mean ?? 52} ms
                </span>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-2.5">
                <span className="text-[10px] text-gray-500">SPO₂ SATURATION</span>
                <p
                  className={`text-lg font-bold ${
                    current.spo2 < 92 ? 'text-rose-400' : 'text-emerald-700'
                  }`}
                >
                  {current.spo2.toFixed(1)}%
                </p>
                <span className="text-[10px] text-gray-400">Target: &gt;95%</span>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-2.5">
                <span className="text-[10px] text-gray-500">TEMPERATURE</span>
                <p
                  className={`text-lg font-bold ${
                    current.temp > 38.0 ? 'text-rose-400' : 'text-amber-300'
                  }`}
                >
                  {current.temp.toFixed(1)}°C
                </p>
                <span className="text-[10px] text-gray-400">Norm: 36.7°C</span>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-2.5">
                <span className="text-[10px] text-gray-500">RESPIRATION</span>
                <p className="text-lg font-bold text-gray-800">{Math.round(current.resp)} br/m</p>
                <span className="text-[10px] text-gray-400">Norm: 15 br/m</span>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-2.5">
                <span className="text-[10px] text-gray-500">CABIN CO₂</span>
                <p
                  className={`text-lg font-bold ${
                    current.co2 > 1500 ? 'text-rose-400' : 'text-gray-800'
                  }`}
                >
                  {Math.round(current.co2)} ppm
                </p>
                <span className="text-[10px] text-gray-400">Limit: 1600 ppm</span>
              </div>
            </div>
          </div>

          {/* Fired Alerts Log in Test Environment */}
          <div className="hud-card">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="page-kicker">Fired Decision Support Alerts ({activeAlerts.length})</span>
              <span className="font-mono text-[10px] text-gray-500">Deterministic Audit Trail</span>
            </div>

            <div className="mt-3 space-y-2.5">
              {activeAlerts.length === 0 ? (
                <div className="rounded-lg border border-emerald-300 bg-emerald-950/20 p-3 font-mono text-xs text-emerald-200">
                  ✓ Nominal status. No statistical deviation or threshold breach detected.
                </div>
              ) : (
                activeAlerts.map((al) => (
                  <div
                    key={al.id}
                    className={`rounded-lg border p-3 text-xs transition ${
                      al.level === 'critical'
                        ? 'border-rose-500/50 bg-rose-950/30'
                        : 'border-amber-500/40 bg-amber-950/20'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-gray-900">
                      <span>{al.title}</span>
                      <span className={`hud-chip ${al.level === 'critical' ? 'hud-chip-crit' : 'hud-chip-warn'}`}>
                        {al.level.toUpperCase()}
                      </span>
                    </div>
                    <p className="mt-1.5 text-gray-700 font-mono text-[11px]">{al.evidence}</p>
                    <p className="mt-1 text-emerald-700 font-semibold">{al.action}</p>
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
