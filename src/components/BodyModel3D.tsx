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
  badge: string
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
  const [cameraView, setCameraView] = useState<'perspective' | 'isometric'>('perspective')
  const [lightPreset, setLightPreset] = useState<'nominal' | 'solar' | 'night'>('nominal')

  const subsystems: Record<string, SubsystemInfo> = {
    helmet: {
      id: 'helmet',
      title: 'Neuro-Ocular & Cranial Monitor (SANS)',
      shortLabel: 'Helmet / SANS',
      badge: 'SANS',
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
      badge: 'ECG',
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
      badge: 'PLSS',
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
      badge: 'ARED',
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
    if (text.includes('sans') || text.includes('head') || text.includes('eye') || text.includes('helmet')) {
      setActiveSubsystem('helmet')
      setPromptFeedback('Focusing on Neuro-Ocular Cranial Subsystem (SANS protocol active).')
    } else if (text.includes('heart') || text.includes('hr') || text.includes('cardio') || text.includes('ecg')) {
      setActiveSubsystem('dcm')
      setPromptFeedback('Focusing on Astroskin Chest DCM & cardiovascular telemetry.')
    } else if (text.includes('o2') || text.includes('co2') || text.includes('oxygen') || text.includes('air') || text.includes('plss')) {
      setActiveSubsystem('plss')
      setPromptFeedback('Focusing on PLSS life-support loop and canister reserves.')
    } else if (text.includes('bone') || text.includes('leg') || text.includes('boot') || text.includes('exercise')) {
      setActiveSubsystem('boots')
      setPromptFeedback('Focusing on Musculoskeletal Countermeasure Boots & ARED compliance.')
    } else {
      setPromptFeedback(`AstroPulse query evaluated: "${promptText}". Telemetry synced.`)
    }
    setPromptText('')
    setTimeout(() => setPromptFeedback(null), 4000)
  }

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-xl">
      {/* Brainwave-Style Studio Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-[#FAFAFA] px-4 py-2.5 text-xs">
        {/* Project breadcrumb */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white p-0.5 shadow-2xs">
            <img src="/logo.png" alt="AstroPulse Mechanical Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1 font-semibold text-gray-900">
              <span>EMU Spacesuit Twin</span>
              <span className="text-gray-400 text-[10px]">v2.4</span>
            </div>
            <p className="text-[10px] text-gray-500 font-mono">Biomechanical CAD Studio</p>
          </div>
        </div>

        {/* Studio Viewport Tools */}
        <div className="hidden sm:flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-2 py-1 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveSubsystem('dcm')}
            title="Reset to Core"
            className="rounded px-2 py-0.5 text-[11px] font-medium text-gray-600 hover:bg-gray-100"
          >
            Reset
          </button>
          <span className="h-3 w-[1px] bg-gray-200" />
          <button
            type="button"
            onClick={() => setCameraView(cameraView === 'perspective' ? 'isometric' : 'perspective')}
            className="rounded px-2 py-0.5 text-[11px] font-medium text-blue-600 hover:bg-blue-50"
          >
            {cameraView === 'perspective' ? 'Perspective' : 'Isometric'}
          </button>
          <span className="h-3 w-[1px] bg-gray-200" />
          <span className="px-1.5 font-mono text-[11px] font-semibold text-gray-700">100%</span>
        </div>

        {/* Right Status & Action */}
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${
              status === 'critical'
                ? 'border-rose-200 bg-rose-50 text-rose-700'
                : status === 'warning'
                  ? 'border-amber-200 bg-amber-50 text-amber-800'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-800'
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
            onClick={() => {
              const report = `EMU Spacesuit Subsystem Report:\n- Active: ${active.title}\n- Status: ${active.status.toUpperCase()}\n- Nominal Range: ${active.nominalRange}\n- Reading HR: ${reading?.hr ?? 0} bpm`
              navigator.clipboard?.writeText(report)
              alert('Copied 3D Telemetry Subsystem Report to clipboard!')
            }}
            className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 transition"
          >
            Export Spec
          </button>
        </div>
      </div>

      {/* Main Studio Viewport Grid */}
      <div className="relative grid min-h-[440px] grid-cols-1 md:grid-cols-12 bg-[#F8F7F7]">
        {/* Left Scene Hierarchy Sidebar */}
        <div className="hidden md:flex md:col-span-3 flex-col border-r border-gray-100 bg-white/80 p-3 backdrop-blur-sm">
          {/* Scene / Sensors toggle */}
          <div className="flex rounded-lg bg-gray-100 p-0.5 text-[11px] font-medium text-gray-600 mb-3">
            <button
              type="button"
              onClick={() => setActiveTab('scene')}
              className={`flex-1 rounded-md py-1 transition ${
                activeTab === 'scene'
                  ? 'bg-white font-semibold text-gray-900 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Hierarchy
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('assets')}
              className={`flex-1 rounded-md py-1 transition ${
                activeTab === 'assets'
                  ? 'bg-white font-semibold text-gray-900 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Sensors
            </button>
          </div>

          {/* Subsystems Tree */}
          <div className="space-y-1 text-xs flex-1">
            <p className="px-1 text-[10px] font-mono uppercase tracking-wider text-gray-400">
              Suit Assemblies
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
                      ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200/60'
                      : 'text-gray-600 hover:bg-gray-100/70 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="rounded bg-gray-100 px-1 py-0.2 font-mono text-[9px] font-bold text-gray-600">
                      {sub.badge}
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

          {/* Interactive Lighting Environment */}
          <div className="mt-4 space-y-1.5 text-xs border-t border-gray-100 pt-3">
            <p className="px-1 text-[10px] font-mono uppercase tracking-wider text-gray-400">
              Lighting Scenario
            </p>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => setLightPreset('nominal')}
                className={`rounded py-1 font-mono text-[10px] transition border ${
                  lightPreset === 'nominal'
                    ? 'border-blue-300 bg-blue-50 text-blue-700 font-semibold'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Studio
              </button>
              <button
                type="button"
                onClick={() => setLightPreset('solar')}
                className={`rounded py-1 font-mono text-[10px] transition border ${
                  lightPreset === 'solar'
                    ? 'border-amber-300 bg-amber-50 text-amber-800 font-semibold'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Solar
              </button>
              <button
                type="button"
                onClick={() => setLightPreset('night')}
                className={`rounded py-1 font-mono text-[10px] transition border ${
                  lightPreset === 'night'
                    ? 'border-gray-400 bg-gray-100 text-gray-900 font-semibold'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Shadow
              </button>
            </div>
          </div>
        </div>

        {/* Center 3D Viewport */}
        <div className="relative md:col-span-6 flex flex-col items-center justify-center min-h-[400px]">
          <div className="absolute inset-0 bg-[#F8F7F7]" />

          {/* ThreeJS Canvas Viewport */}
          <div className="relative h-full w-full min-h-[400px]">
            <Astronaut3D
              status={status}
              reading={reading}
              interactive={true}
              selectedSubsystem={activeSubsystem}
              onSelectSubsystem={setActiveSubsystem}
            />

            {/* Orbit Instructions badge */}
            <div className="pointer-events-none absolute top-3 left-3 flex items-center gap-1.5 rounded-md border border-gray-200/80 bg-white/90 px-2 py-0.5 text-[10px] font-mono text-gray-500 shadow-2xs">
              <span className="text-blue-500 font-bold">↺</span>
              <span>Rotate 360° • Pinch / Scroll to Zoom</span>
            </div>
          </div>
        </div>

        {/* Right Properties Panel */}
        <div className="hidden md:flex md:col-span-3 flex-col border-l border-gray-100 bg-white/80 p-3 backdrop-blur-sm text-xs">
          {/* Header tab switcher */}
          <div className="flex rounded-lg bg-gray-100 p-0.5 text-[11px] font-medium text-gray-600 mb-3">
            <button
              type="button"
              onClick={() => setRightTab('subsystem')}
              className={`flex-1 rounded-md py-1 transition ${
                rightTab === 'subsystem'
                  ? 'bg-white font-semibold text-gray-900 shadow-2xs'
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
                  ? 'bg-white font-semibold text-gray-900 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Materials
            </button>
          </div>

          {rightTab === 'subsystem' ? (
            <div className="space-y-3">
              {/* Active Subsystem Card */}
              <div className="rounded-xl border border-gray-200/80 bg-white p-3 shadow-2xs">
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
                <p className="mt-1 font-mono text-[10px] text-blue-600 font-semibold">{active.nominalRange}</p>
                <p className="mt-1 text-[11px] text-gray-500">{active.sensorType}</p>
              </div>

              {/* Clinical Protocol */}
              <div className="rounded-xl border border-gray-200/80 bg-white p-3 shadow-2xs">
                <p className="text-[10px] font-mono uppercase text-gray-400 font-semibold">Clinical Protocol</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-700">{active.clinicalNote}</p>
              </div>

              {/* Real-time telemetry feed */}
              <div className="rounded-xl border border-gray-200/80 bg-white p-3 shadow-2xs font-mono">
                <p className="text-[10px] uppercase text-gray-400 font-semibold">Live Signals</p>
                <div className="mt-1.5 flex items-baseline justify-between">
                  <span className="text-gray-600">Heart Rate:</span>
                  <span className="font-bold text-gray-900">{reading ? Math.round(reading.hr) : '--'} bpm</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-gray-600">SpO₂:</span>
                  <span className="font-bold text-emerald-700">{reading ? reading.spo2.toFixed(1) : '--'}%</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-gray-600">Core Temp:</span>
                  <span className="font-bold text-gray-900">{reading ? reading.temp.toFixed(1) : '--'}°C</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 font-mono text-xs">
              <p className="text-[10px] uppercase text-gray-400 font-semibold">Suit Material Swatches</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-gray-200 bg-white p-2.5 text-center shadow-2xs">
                  <div className="mx-auto mb-1.5 h-10 w-10 rounded-full bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 shadow-xs" />
                  <span className="text-[10px] text-gray-700 block font-semibold">Gold Visor</span>
                  <span className="text-[9px] text-gray-400">95% Metal</span>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-2.5 text-center shadow-2xs">
                  <div className="mx-auto mb-1.5 h-10 w-10 rounded-full bg-gradient-to-tr from-gray-200 via-white to-gray-300 shadow-xs" />
                  <span className="text-[10px] text-gray-700 block font-semibold">Ortho-Fabric</span>
                  <span className="text-[9px] text-gray-400">Thermal Mylar</span>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-2.5 text-center shadow-2xs">
                  <div className="mx-auto mb-1.5 h-10 w-10 rounded-full bg-gradient-to-tr from-gray-700 via-gray-900 to-black shadow-xs" />
                  <span className="text-[10px] text-gray-700 block font-semibold">Joint Bearing</span>
                  <span className="text-[9px] text-gray-400">Carbon Alloy</span>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-2.5 text-center shadow-2xs">
                  <div className="mx-auto mb-1.5 h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 via-blue-300 to-blue-600 shadow-xs" />
                  <span className="text-[10px] text-gray-700 block font-semibold">Astroskin PPG</span>
                  <span className="text-[9px] text-gray-400">Dual 880nm</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Docked Bottom Clinical Prompt Bar (cleanly integrated, not covering model feet) */}
      <div className="border-t border-gray-100 bg-[#FAFAFA] p-3">
        {promptFeedback && (
          <div className="mb-2 rounded-lg border border-blue-200 bg-white px-3 py-1 font-mono text-[11px] text-blue-700 shadow-xs">
            ✨ {promptFeedback}
          </div>
        )}

        <form
          onSubmit={handlePromptSubmit}
          className="relative flex items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-2.5 py-1.5 shadow-xs"
        >
          {/* Quick select menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAddMenu((prev) => !prev)}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm font-bold"
            >
              +
            </button>
            {showAddMenu && (
              <div className="absolute bottom-9 left-0 z-30 w-48 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSubsystem('dcm')
                    setShowAddMenu(false)
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-gray-700 hover:bg-gray-100 font-mono text-[11px]"
                >
                  <span className="font-bold text-blue-600">[ECG]</span> Astroskin Patch
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSubsystem('helmet')
                    setShowAddMenu(false)
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-gray-700 hover:bg-gray-100 font-mono text-[11px]"
                >
                  <span className="font-bold text-amber-600">[SANS]</span> Cranial Doppler
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSubsystem('plss')
                    setShowAddMenu(false)
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-gray-700 hover:bg-gray-100 font-mono text-[11px]"
                >
                  <span className="font-bold text-emerald-600">[PLSS]</span> Scrubber Loop
                </button>
              </div>
            )}
          </div>

          {/* Quick Inspiration Button */}
          <button
            type="button"
            onClick={() => {
              const samplePrompts = [
                'Check SANS intracranial pressure',
                'Assess cardiovascular fatigue',
                'Inspect PLSS oxygen loop',
                'Examine ARED exercise countermeasure',
              ]
              const random = samplePrompts[Math.floor(Math.random() * samplePrompts.length)]
              setPromptText(random)
            }}
            className="hidden sm:flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-200 transition"
          >
            <span className="text-blue-500 font-bold">✨</span>
            <span>Inspire</span>
          </button>

          {/* Input field */}
          <input
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Query suit telemetry (e.g. 'check SANS ICP', 'cardio baseline', 'PLSS O2')..."
            className="flex-1 bg-transparent px-2 font-body text-xs text-gray-900 placeholder-gray-400 outline-none"
          />

          {/* Submit */}
          <button
            type="submit"
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}
