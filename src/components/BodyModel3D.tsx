import { useState } from 'react'
import { Astronaut3D } from './Astronaut3D'
import type { AlertLevel, VitalReading } from '../types'

interface BodyModel3DProps {
  status?: AlertLevel
  reading?: VitalReading
}

interface SubsystemInfo {
  id: string
  title: string
  shortLabel: string
  sensorType: string
  clinicalNote: string
  nominalRange: string
  status: 'nominal' | 'caution' | 'critical'
}

export function BodyModel3D({ status = 'normal', reading }: BodyModel3DProps) {
  const [activeSubsystem, setActiveSubsystem] = useState<string>('dcm')
  const [activeTab, setActiveTab] = useState<'scene' | 'assets'>('scene')
  const [rightTab, setRightTab] = useState<'subsystem' | 'materials'>('subsystem')
  const [promptText, setPromptText] = useState('')
  const [promptFeedback, setPromptFeedback] = useState<string | null>(null)
  const [showAddMenu, setShowAddMenu] = useState(false)

  const subsystems: Record<string, SubsystemInfo> = {
    helmet: {
      id: 'helmet',
      title: 'Neuro-Ocular & Cranial Monitor (SANS)',
      shortLabel: 'Helmet / SANS',
      sensorType: 'Infrared Tympanic Thermistor + Transcranial Doppler',
      clinicalNote:
        'Continuous screening for Spaceflight Associated Neuro-ocular Syndrome (optic disc edema, cephalad fluid shift, elevated ICP).',
      nominalRange: 'ICP < 15 mmHg | Core Temp 36.5°C - 37.5°C',
      status: reading && reading.temp > 37.8 ? 'caution' : 'nominal',
    },
    dcm: {
      id: 'dcm',
      title: 'Cardiovascular & Astroskin Smart Garment',
      shortLabel: 'Astroskin DCM',
      sensorType: '3-Lead ECG Patch + Dual-Wavelength PPG + Bio-Impedance',
      clinicalNote:
        'Tracks resting heart rate, RMSSD HRV, and stroke volume against rolling baseline to detect autonomic fatigue and hypovolemia.',
      nominalRange: 'HR 55 - 85 bpm | HRV > 40 ms',
      status:
        reading && (reading.hr > 110 || (reading.hr > 90 && reading.hrv < 35))
          ? 'critical'
          : reading && reading.hr > 88
            ? 'caution'
            : 'nominal',
    },
    plss: {
      id: 'plss',
      title: 'Primary Life Support (PLSS) & Gas Loop',
      shortLabel: 'PLSS O₂/CO₂',
      sensorType: 'Non-Dispersive Infrared (NDIR) CO₂ + Fuel Cell O₂',
      clinicalNote:
        'Monitors inspired gas partial pressure and suit loop scrubber performance to prevent hypercapnia and hypoxia.',
      nominalRange: 'pCO₂ < 1200 ppm | Suit Loop O₂ 95-100%',
      status:
        reading && (reading.spo2 < 90 || reading.co2 > 1600)
          ? 'critical'
          : reading && (reading.spo2 < 94 || reading.co2 > 1100)
            ? 'caution'
            : 'nominal',
    },
    boots: {
      id: 'boots',
      title: 'Musculoskeletal Countermeasure & Impact Dosimetry',
      shortLabel: 'Boots / IMU',
      sensorType: 'Piezoelectric Insole Load Cells + 6-DoF IMU',
      clinicalNote:
        'Verifies daily 2.5-hour ARED high-resistance exercise compliance to prevent 1.0-1.5% monthly bone mineral density loss.',
      nominalRange: 'Daily Impact Force > 1200 N | 45 min cycle',
      status: 'nominal',
    },
  }

  const active = subsystems[activeSubsystem] ?? subsystems.dcm

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!promptText.trim()) return
    const text = promptText.toLowerCase()
    if (text.includes('sans') || text.includes('head') || text.includes('eye')) {
      setActiveSubsystem('helmet')
      setPromptFeedback('Focusing on Neuro-Ocular Cranial Subsystem (SANS screening).')
    } else if (text.includes('heart') || text.includes('hr') || text.includes('cardio')) {
      setActiveSubsystem('dcm')
      setPromptFeedback('Focusing on Astroskin Chest DCM & cardiovascular telemetry.')
    } else if (text.includes('o2') || text.includes('co2') || text.includes('oxygen') || text.includes('air')) {
      setActiveSubsystem('plss')
      setPromptFeedback('Focusing on PLSS life support loop and scrubber reserves.')
    } else if (text.includes('bone') || text.includes('leg') || text.includes('exercise')) {
      setActiveSubsystem('boots')
      setPromptFeedback('Focusing on Musculoskeletal Countermeasure Boots.')
    } else {
      setPromptFeedback(`AstroPulse Twin query registered: "${promptText}". Telemetry synced.`)
    }
    setPromptText('')
    setTimeout(() => setPromptFeedback(null), 4000)
  }

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-xl">
      {/* Brainwave-Style Studio Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-[#FAFAFA] px-4 py-2.5 text-xs">
        {/* Project info breadcrumb */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white font-mono text-sm shadow-sm">
            🧑‍🚀
          </div>
          <div>
            <div className="flex items-center gap-1 font-medium text-gray-900">
              <span>EMU Suit Twin</span>
              <span className="text-gray-400">▾</span>
            </div>
            <p className="text-[10px] text-gray-400">3D Biomechanical Studio</p>
          </div>
        </div>

        {/* Center Canvas Tools */}
        <div className="hidden sm:flex items-center gap-1 rounded-xl border border-gray-200/80 bg-white px-2 py-1 shadow-sm">
          <button
            type="button"
            title="Inspect"
            className="rounded p-1 text-gray-600 hover:bg-gray-100"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </button>
          <button
            type="button"
            title="Bounding Box"
            className="rounded p-1 text-gray-400 hover:bg-gray-100"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <span className="mx-1 h-3.5 w-[1px] bg-gray-200" />
          <span className="px-1.5 font-mono text-[11px] font-semibold text-gray-700">100%</span>
          <span className="text-[10px] text-gray-400">▾</span>
          <span className="mx-1 h-3.5 w-[1px] bg-gray-200" />
          <button
            type="button"
            onClick={() => setActiveSubsystem('dcm')}
            className="rounded px-1.5 py-0.5 text-[10px] font-medium text-gray-500 hover:bg-gray-100"
          >
            Reset
          </button>
        </div>

        {/* Right Status & Export */}
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
              status === 'critical'
                ? 'border-rose-200 bg-rose-50 text-rose-600'
                : status === 'warning'
                  ? 'border-amber-200 bg-amber-50 text-amber-700'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                status === 'critical'
                  ? 'bg-rose-500 animate-pulse'
                  : status === 'warning'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
              }`}
            />
            {status}
          </span>
          <button
            type="button"
            onClick={() => alert('Exporting 3D Telemetry Twin snapshot...')}
            className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition"
          >
            Export
          </button>
        </div>
      </div>

      {/* Main Studio Work Area */}
      <div className="relative grid min-h-[460px] grid-cols-1 md:grid-cols-12 bg-[#F8F7F7]">
        {/* Left Scene Hierarchy Sidebar (Brainwave layout) */}
        <div className="hidden md:flex md:col-span-3 flex-col border-r border-gray-100 bg-white/70 p-3 backdrop-blur-sm">
          {/* Scene / Assets switcher */}
          <div className="flex rounded-lg bg-gray-100 p-0.5 text-[11px] font-medium text-gray-600 mb-3">
            <button
              type="button"
              onClick={() => setActiveTab('scene')}
              className={`flex-1 rounded-md py-1 transition ${
                activeTab === 'scene'
                  ? 'bg-white font-semibold text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Scene
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('assets')}
              className={`flex-1 rounded-md py-1 transition ${
                activeTab === 'assets'
                  ? 'bg-white font-semibold text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Sensors
            </button>
          </div>

          {/* Subsystems Tree */}
          <div className="space-y-1 text-xs">
            <p className="px-1 text-[10px] font-mono uppercase tracking-wider text-gray-400">
              Subsystems
            </p>

            {Object.values(subsystems).map((sub) => {
              const isSelected = sub.id === activeSubsystem
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setActiveSubsystem(sub.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs transition ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100/70'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-gray-400 text-xs">
                      {sub.id === 'helmet'
                        ? '🪖'
                        : sub.id === 'dcm'
                          ? '🫀'
                          : sub.id === 'plss'
                            ? '🎒'
                            : '🥾'}
                    </span>
                    <span className="truncate text-[11px]">{sub.shortLabel}</span>
                  </div>
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      sub.status === 'critical'
                        ? 'bg-rose-500'
                        : sub.status === 'caution'
                          ? 'bg-amber-400'
                          : 'bg-emerald-500'
                    }`}
                  />
                </button>
              )
            })}
          </div>

          {/* Environment Objects */}
          <div className="mt-4 space-y-1 text-xs border-t border-gray-100 pt-3">
            <p className="px-1 text-[10px] font-mono uppercase tracking-wider text-gray-400">
              Studio Lighting
            </p>
            <div className="flex items-center justify-between rounded px-2 py-1 text-[11px] text-gray-500">
              <span>☀️ Key Light (6500K)</span>
              <span className="text-[10px] text-gray-400">1.6x</span>
            </div>
            <div className="flex items-center justify-between rounded px-2 py-1 text-[11px] text-gray-500">
              <span>💡 Fill Light (Ambient)</span>
              <span className="text-[10px] text-gray-400">0.9x</span>
            </div>
            <div className="flex items-center justify-between rounded px-2 py-1 text-[11px] text-gray-500">
              <span>🌐 Studio Stage</span>
              <span className="text-[10px] text-emerald-600 font-mono">#F8F7F7</span>
            </div>
          </div>
        </div>

        {/* Center 3D Viewport */}
        <div className="relative md:col-span-6 flex flex-col items-center justify-center p-2 min-h-[380px]">
          {/* Subtle 3D background */}
          <div className="absolute inset-0 bg-[#F8F7F7]" />

          {/* ThreeJS Canvas Viewport */}
          <div className="relative h-full w-full min-h-[360px]">
            <Astronaut3D
              status={status}
              reading={reading}
              interactive={true}
              selectedSubsystem={activeSubsystem}
              onSelectSubsystem={setActiveSubsystem}
            />

            {/* Orbit Instructions badge */}
            <div className="pointer-events-none absolute top-3 left-3 flex items-center gap-1.5 rounded-md border border-gray-200/80 bg-white/80 px-2 py-0.5 text-[10px] font-mono text-gray-500 shadow-sm">
              <span>↻</span>
              <span>Rotate 360° • Pinch / Scroll to Zoom</span>
            </div>

            {/* Bottom Floating Prompt Bar (Brainwave vibe) */}
            <div className="absolute bottom-3 inset-x-3 flex flex-col items-center">
              {promptFeedback && (
                <div className="mb-2 rounded-lg border border-blue-200 bg-white px-3 py-1 font-mono text-[11px] text-blue-700 shadow-md animate-fade-in">
                  ✨ {promptFeedback}
                </div>
              )}

              <form
                onSubmit={handlePromptSubmit}
                className="relative flex w-full max-w-lg items-center gap-1.5 rounded-2xl border border-black/[0.08] bg-white px-2 py-1.5 shadow-lg"
              >
                {/* Plus button with popup options */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowAddMenu((prev) => !prev)}
                    className="flex h-7 w-7 items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition text-sm font-semibold"
                  >
                    +
                  </button>
                  {showAddMenu && (
                    <div className="absolute bottom-9 left-0 z-20 w-44 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSubsystem('dcm')
                          setShowAddMenu(false)
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-gray-700 hover:bg-gray-100"
                      >
                        <span>🫀</span> Astroskin PPG
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSubsystem('helmet')
                          setShowAddMenu(false)
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-gray-700 hover:bg-gray-100"
                      >
                        <span>🪖</span> SANS Doppler
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSubsystem('plss')
                          setShowAddMenu(false)
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-gray-700 hover:bg-gray-100"
                      >
                        <span>🎒</span> Suit Loop NDIR
                      </button>
                    </div>
                  )}
                </div>

                {/* Inspiration Pill */}
                <button
                  type="button"
                  onClick={() => {
                    const samplePrompts = [
                      'Check SANS intracranial pressure',
                      'Assess cardiovascular fatigue',
                      'Inspect PLSS oxygen loop',
                      'Examine exercise countermeasure impact',
                    ]
                    const random = samplePrompts[Math.floor(Math.random() * samplePrompts.length)]
                    setPromptText(random)
                  }}
                  className="hidden sm:flex items-center gap-1 rounded-xl bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-200 transition"
                >
                  <span className="text-emerald-500">✨</span>
                  <span>Inspiration</span>
                  <span className="text-[9px] text-gray-400">▾</span>
                </button>

                {/* Input field */}
                <input
                  type="text"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Ask AstroPulse Twin (e.g. SANS check, vitals)..."
                  className="flex-1 bg-transparent px-2 font-body text-xs text-gray-900 placeholder-gray-400 outline-none"
                />

                {/* Voice mic icon placeholder */}
                <button
                  type="button"
                  onClick={() => alert('Speech telemetry input ready.')}
                  className="rounded p-1 text-gray-400 hover:text-gray-700"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>

                {/* Send button */}
                <button
                  type="submit"
                  className="flex h-7 w-7 items-center justify-center rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Properties Panel (Brainwave layout) */}
        <div className="hidden md:flex md:col-span-3 flex-col border-l border-gray-100 bg-white/70 p-3 backdrop-blur-sm text-xs">
          {/* Design / Animation tab header */}
          <div className="flex rounded-lg bg-gray-100 p-0.5 text-[11px] font-medium text-gray-600 mb-3">
            <button
              type="button"
              onClick={() => setRightTab('subsystem')}
              className={`flex-1 rounded-md py-1 transition ${
                rightTab === 'subsystem'
                  ? 'bg-white font-semibold text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Inspection
            </button>
            <button
              type="button"
              onClick={() => setRightTab('materials')}
              className={`flex-1 rounded-md py-1 transition ${
                rightTab === 'materials'
                  ? 'bg-white font-semibold text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Materials
            </button>
          </div>

          {rightTab === 'subsystem' ? (
            <div className="space-y-3">
              {/* Active Subsystem Header */}
              <div className="rounded-xl border border-gray-200/80 bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 text-xs">{active.title}</span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      active.status === 'critical'
                        ? 'bg-rose-500'
                        : active.status === 'caution'
                          ? 'bg-amber-400'
                          : 'bg-emerald-500'
                    }`}
                  />
                </div>
                <p className="mt-1 font-mono text-[10px] text-blue-600">{active.nominalRange}</p>
                <p className="mt-1 text-[11px] text-gray-500">{active.sensorType}</p>
              </div>

              {/* Clinical Note Card */}
              <div className="rounded-xl border border-gray-200/80 bg-white p-3 shadow-sm">
                <p className="text-[10px] font-mono uppercase text-gray-400">Clinical Protocol</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-700">{active.clinicalNote}</p>
              </div>

              {/* Real-time reading preview */}
              <div className="rounded-xl border border-gray-200/80 bg-white p-3 shadow-sm font-mono">
                <p className="text-[10px] uppercase text-gray-400">Telemetry Feed</p>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-gray-600">Heart Rate:</span>
                  <span className="font-bold text-gray-900">{reading ? Math.round(reading.hr) : '--'} bpm</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-gray-600">SpO₂:</span>
                  <span className="font-bold text-emerald-600">{reading ? reading.spo2.toFixed(1) : '--'}%</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-gray-600">Core Temp:</span>
                  <span className="font-bold text-gray-900">{reading ? reading.temp.toFixed(1) : '--'}°C</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 font-mono text-xs">
              {/* Materials spheres preview like the Brainwave image */}
              <p className="text-[10px] uppercase text-gray-400">Suit Materials</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-gray-200 bg-white p-2.5 text-center shadow-sm">
                  <div className="mx-auto mb-1.5 h-10 w-10 rounded-full bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 shadow-md" />
                  <span className="text-[10px] text-gray-700">Gold Visor</span>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-2.5 text-center shadow-sm">
                  <div className="mx-auto mb-1.5 h-10 w-10 rounded-full bg-gradient-to-tr from-gray-200 via-white to-gray-300 shadow-md" />
                  <span className="text-[10px] text-gray-700">Ortho-Fabric</span>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-2.5 text-center shadow-sm">
                  <div className="mx-auto mb-1.5 h-10 w-10 rounded-full bg-gradient-to-tr from-gray-700 via-gray-900 to-black shadow-md" />
                  <span className="text-[10px] text-gray-700">Carbon Joints</span>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-2.5 text-center shadow-sm">
                  <div className="mx-auto mb-1.5 h-10 w-10 rounded-full bg-gradient-to-tr from-blue-400 via-blue-200 to-blue-500 shadow-md" />
                  <span className="text-[10px] text-gray-700">Astroskin DCM</span>
                </div>
              </div>

              {/* Camera preset */}
              <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                <p className="text-[10px] uppercase text-gray-400">Camera Preset</p>
                <div className="mt-2 flex gap-1.5">
                  <button
                    type="button"
                    className="flex-1 rounded-lg bg-gray-100 py-1 text-[11px] font-semibold text-gray-800"
                  >
                    Perspective
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-lg border border-gray-200 py-1 text-[11px] text-gray-500 hover:bg-gray-50"
                  >
                    Isometric
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
