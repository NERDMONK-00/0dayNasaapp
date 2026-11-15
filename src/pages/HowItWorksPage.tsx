import { useState } from 'react'

const architectureLayers = [
  {
    step: '01',
    name: 'Sensing Layer',
    badge: 'Hardware Agnostic',
    desc: 'Low-power biometric wearables (Astroskin smart shirt, 3-lead ECG, dual-wavelength optical PPG, skin thermistor, insole piezoelectric sensors) coupled with cabin life-support NDIR CO₂ monitors and Timepix silicon radiation dosimeters.',
  },
  {
    step: '02',
    name: 'Edge Processing Layer',
    badge: 'Zero-Cloud Autonomy',
    desc: 'Local browser or microcontroller (ESP32 / Raspberry Pi class) processing pipeline. Strips motion artifacts, computes rolling AR(1) noise filtering, extracts real-time features (RMSSD HRV, resting HR), and isolates health data on-board without cloud dependencies.',
  },
  {
    step: '03',
    name: 'Intelligence & Baseline Layer',
    badge: 'Section 4.2 Algorithm',
    desc: 'Computes rolling personal baselines (mean μ, standard deviation σ, and robust median/MAD). Rejects population-norm false alarms. Evaluates CUSUM cumulative sum drift and multi-signal concordance (e.g. concurrent HR rise + HRV drop).',
  },
  {
    step: '04',
    name: 'Decision Support Layer',
    badge: 'NASA ExMC ConOps',
    desc: 'Transforms mathematical deviations into 4-part auditable alerts: What (deviation %), Why It Matters (clinical spaceflight impact), Evidence (rule fired: CUSUM / Persistence), and Suggested Action (countermeasure protocol). Hard safety rules bypass all statistics for critical emergencies.',
  },
  {
    step: '05',
    name: 'Communication & Sync Layer',
    badge: '20-Min Delay Resilient',
    desc: 'Store-and-forward architecture designed for deep-space transit. When Earth communications blackout occurs (up to 20-min Mars radio latency), all decision support remains 100% operational locally, bundling compressed telemetry summaries to downlink when bandwidth opens.',
  },
  {
    step: '06',
    name: 'Interface & 3D Twin Layer',
    badge: 'Flight Surgeon HUD',
    desc: 'Mission control command center HUD featuring a real-time reactive 3D spacesuit astronaut digital twin, 12-hour EVA readiness forecast matrix, live waveform charts, and an embedded clinical AI co-pilot.',
  },
]

export function HowItWorksPage() {
  const [activeFormula, setActiveFormula] = useState<'risk' | 'robust' | 'cusum'>('risk')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <span className="page-kicker">Section 5 System Architecture & Methods</span>
        <h1 className="page-title text-2xl sm:text-3xl">
          System Architecture & Mathematical Formulations
        </h1>
        <p className="text-xs text-gray-500 font-mono mt-1">
          Complete engineering blueprint for Earth-independent clinical decision support in deep space exploration.
        </p>
      </div>

      {/* 6-Layer Architecture Stack */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="page-kicker">Section 5.1 • Architectural Layers</span>
          <span className="font-mono text-xs text-gray-500">DataSource.subscribe(callback) Contract</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {architectureLayers.map((layer) => (
            <div key={layer.step} className="hud-card hud-card-hover flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
                  <span className="font-mono text-xl font-extrabold text-blue-500">{layer.step}</span>
                  <span className="hud-chip hud-chip-ok font-mono text-[9px]">{layer.badge}</span>
                </div>
                <h3 className="font-display text-base font-bold text-gray-900 mt-3">{layer.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-700">{layer.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Mathematical Formula Explorer */}
      <section className="hud-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
          <div>
            <span className="page-kicker">Core Mathematical Models</span>
            <h3 className="font-display text-lg font-bold text-gray-900">
              Analytical Formulations & Algorithms
            </h3>
          </div>
          <div className="flex gap-1.5 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveFormula('risk')}
              className={`rounded-lg px-3 py-1.5 border transition ${
                activeFormula === 'risk'
                  ? 'border-blue-300 bg-blue-50 text-blue-700 shadow-glow'
                  : 'border-gray-200 bg-gray-50 text-gray-500 hover:text-gray-900'
              }`}
            >
              Risk Index R
            </button>
            <button
              type="button"
              onClick={() => setActiveFormula('robust')}
              className={`rounded-lg px-3 py-1.5 border transition ${
                activeFormula === 'robust'
                  ? 'border-blue-300 bg-blue-50 text-blue-700 shadow-glow'
                  : 'border-gray-200 bg-gray-50 text-gray-500 hover:text-gray-900'
              }`}
            >
              Robust Z-Score
            </button>
            <button
              type="button"
              onClick={() => setActiveFormula('cusum')}
              className={`rounded-lg px-3 py-1.5 border transition ${
                activeFormula === 'cusum'
                  ? 'border-blue-300 bg-blue-50 text-blue-700 shadow-glow'
                  : 'border-gray-200 bg-gray-50 text-gray-500 hover:text-gray-900'
              }`}
            >
              CUSUM Drift S(t)
            </button>
          </div>
        </div>

        <div className="mt-4">
          {activeFormula === 'risk' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-blue-200 bg-gray-50 p-4 font-mono text-sm text-blue-700 shadow-inner">
                R = 0.60 · P(physiology) + 0.20 · E(environment) + 0.20 · W(space weather)
              </div>
              <div className="grid gap-3 sm:grid-cols-3 text-xs text-gray-700">
                <div className="rounded-lg border border-gray-200 bg-white p-3">
                  <strong className="text-blue-600 block mb-1">P (Physiology, 0-100)</strong>
                  P = 100 · (1 - exp(-d / d₀)), where d is the sum of clipped z-score deviations across HR, HRV, SpO₂, Temp, and Resp. Saturates smoothly to avoid clipping.
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-3">
                  <strong className="text-blue-600 block mb-1">E (Environment, 0-100)</strong>
                  Normalized scaling from cabin atmospheric pCO₂ (600 to 1800 ppm) and ambient temperature relative to the nominal astronaut comfort envelope.
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-3">
                  <strong className="text-emerald-700 block mb-1">W (Space Weather, 0-100)</strong>
                  Direct NASA DONKI space weather classification: Calm = 0, Elevated (M-class flare or CME) = 50, Storm (X-class flare or solar proton event) = 100.
                </div>
              </div>
            </div>
          )}

          {activeFormula === 'robust' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-blue-200 bg-gray-50 p-4 font-mono text-sm text-blue-700 shadow-inner">
                z_robust = 0.6745 · (x - median) / MAD
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                Standard standard deviation σ is susceptible to distortion by transient sensor artifacts (e.g. motion artifacts from exercise on ARED). Using Median and Median Absolute Deviation (MAD) provides a breakdown point of 50%, ensuring outlier spikes do not corrupt the learned baseline.
              </p>
            </div>
          )}

          {activeFormula === 'cusum' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-blue-200 bg-gray-50 p-4 font-mono text-sm text-blue-700 shadow-inner">
                S(t) = max(0, S(t-1) + z(t) - k_cusum), alert when S(t) &gt; h
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                Cumulative Sum (CUSUM) control chart algorithm catches subtle, insidious physiological drift (such as progressive dehydration or cumulative sleep deficit) where single-point z-scores never exceed 2.0σ, but persistent positive bias accumulates steadily over hours.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* NASA Engineering Blueprints Alignment */}
      <section className="hud-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
          <div>
            <span className="page-kicker">NASA.gov Engineering Alignment</span>
            <h3 className="font-display text-lg font-bold text-gray-900 mt-0.5">
              Alignment with Official NASA Technical Blueprints (NTRS)
            </h3>
          </div>
          <a href="/references" className="text-xs font-mono text-blue-500 hover:text-blue-700">
            View full citations library →
          </a>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <span className="font-mono text-[10px] text-blue-500 font-bold block mb-1">
              AMRA AID Dashboard (NTRS 20200000666)
            </span>
            <p className="text-gray-700 text-[11px] leading-relaxed">
              Adopts NASA's Autonomous Medical Response Agent Aggregate Information Dashboard design patterns to fuse crew vitals, environmental pCO₂, and mission timelines.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <span className="font-mono text-blue-500 font-bold block mb-1">
              ExMC Medical Data Architecture (NTRS 20220017869)
            </span>
            <p className="text-gray-700 text-[11px] leading-relaxed">
              Structures software modules into independent sensing, intelligence, decision support, and UI layers aligned with NASA Exploration Medical Capability guidelines.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <span className="font-mono text-emerald-400 font-bold block mb-1">
              EIMO Deep-Space Standards (NTRS 20230016189)
            </span>
            <p className="text-gray-700 text-[11px] leading-relaxed">
              Satisfies Earth Independent Medical Operations requirements for passive physiological anomaly detection, encrypted local storage, and latency tolerance.
            </p>
          </div>
        </div>
      </section>

      {/* Hardware Migration Roadmap (Section 5.3 & AGENTS.md) */}
      <section className="hud-card">
        <span className="page-kicker">Section 5.3 • Hardware Migration Roadmap</span>
        <h3 className="font-display text-lg font-bold text-gray-900 mt-1">
          Bridging Simulation to Physical Sensor Hardware
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-gray-700">
          The app follows a strict <code className="text-blue-600 font-mono">DataSource</code> abstraction with a single method <code className="text-blue-600 font-mono">subscribe(callback)</code>. To connect physical hardware during post-hackathon testing, the simulator can be swapped without touching a single line of processing, state, or UI code:
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3 font-mono text-xs">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <span className="text-blue-500 font-bold block mb-1">01. Web Bluetooth (BLE)</span>
            Connect directly to BLE heart rate patches or Astroskin transmitters using standard browser <code className="text-gray-500">navigator.bluetooth</code>.
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <span className="text-blue-500 font-bold block mb-1">02. Web Serial API</span>
            Direct USB UART stream from an ESP32 or Arduino wired to a MAX30102 pulse oximeter and MLX90614 infrared thermistor.
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <span className="text-emerald-400 font-bold block mb-1">03. Local WebSocket Stream</span>
            Stream telemetry payloads from a Raspberry Pi habitat edge server over local zero-cloud Wi-Fi.
          </div>
        </div>
      </section>
    </div>
  )
}
