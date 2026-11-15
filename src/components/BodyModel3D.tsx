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
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-slate-950/80 shadow-2xl backdrop-blur-xl text-slate-100">
      {/* Cinematic Studio Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/40 px-4 py-2.5 text-xs">
        {/* Project breadcrumb */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/15 bg-white/10 p-0.5 shadow-sm">
            <img src="/logo.png" alt="AstroPulse Mechanical Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1 font-semibold text-white">
              <span>EMU Spacesuit Twin</span>
              <span className="text-cyan-400 font-mono text-[10px]">v2.4</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Biomechanical CAD Studio</p>
          </div>
        </div>

        {/* Studio Viewport Tools */}
        <div className="hidden sm:flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-1 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveSubsystem('dcm')}
            title="Reset to Core"
            className="rounded-full px-2 py-0.5 text-[11px] font-medium text-slate-300 hover:text-white hover:bg-white/10"
          >
            Reset
          </button>
          <span className="h-3 w-[1px] bg-white/20" />
          <button
            type="button"
            onClick={() => setCameraView(cameraView === 'perspective' ? 'isometric' : 'perspective')}
            className="rounded-full px-2 py-0.5 text-[11px] font-medium text-cyan-300 hover:bg-white/10"
          >
            {cameraView === 'perspective' ? 'Perspective' : 'Isometric'}
          </button>
          <span className="h-3 w-[1px] bg-white/20" />
          <span className="px-1.5 font-mono text-[11px] font-semibold text-slate-300">100%</span>
        </div>

        {/* Right Status & Action */}
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${
              status === 'critical'
                ? 'border-rose-400/50 bg-rose-500/20 text-rose-300'
                : status === 'warning'
                  ? 'border-amber-400/50 bg-amber-500/20 text-amber-300'
                  : 'border-emerald-400/50 bg-emerald-500/20 text-emerald-300'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                status === 'critical'
                  ? 'bg-rose-500 animate-pulse'
                  : status === 'warning'
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
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
            className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white shadow-sm hover:bg-white/20 transition"
          >
            Export Spec
          </button>
        </div>
      </div>

      {/* Main Studio Viewport Grid */}
      <div className="relative grid min-h-[440px] grid-cols-1 md:grid-cols-12 bg-gradient-to-b from-[#0a0f26] via-[#070b1e] to-[#040612]">
        {/* Left Scene Hierarchy Sidebar */}
        <div className="hidden md:flex md:col-span-3 flex-col border-r border-white/10 bg-black/35 p-3 backdrop-blur-md">
          {/* Scene / Sensors toggle */}
          <div className="flex rounded-full bg-white/5 p-0.5 text-[11px] font-medium text-slate-300 mb-3 border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('scene')}
              className={`flex-1 rounded-full py-1 transition ${
                activeTab === 'scene'
                  ? 'bg-blue-600 font-semibold text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Hierarchy
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('assets')}
              className={`flex-1 rounded-full py-1 transition ${
                activeTab === 'assets'
                  ? 'bg-blue-600 font-semibold text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sensors
            </button>
          </div>

          {/* Subsystems Tree */}
          <div className="space-y-1 text-xs flex-1">
            <p className="px-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Suit Assemblies
            </p>

            {Object.values(subsystems).map((sub) => {
              const isSelected = sub.id === activeSubsystem
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setActiveSubsystem(sub.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs transition border ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-200 font-semibold border-cyan-400/40 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                      : 'text-slate-300 hover:bg-white/5 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="rounded bg-white/10 px-1 py-0.2 font-mono text-[9px] font-bold text-cyan-300">
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
                          : 'bg-emerald-400'
                    }`}
                  />
                </button>
              )
            })}
          </div>

          {/* Interactive Lighting Environment */}
          <div className="mt-4 space-y-1.5 text-xs border-t border-white/10 pt-3">
            <p className="px-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Lighting Scenario
            </p>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => setLightPreset('nominal')}
                className={`rounded-lg py-1 font-mono text-[10px] transition border ${
                  lightPreset === 'nominal'
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 font-semibold'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                Deep Space
              </button>
              <button
                type="button"
                onClick={() => setLightPreset('solar')}
                className={`rounded-lg py-1 font-mono text-[10px] transition border ${
                  lightPreset === 'solar'
                    ? 'border-amber-400 bg-amber-500/20 text-amber-200 font-semibold'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                Solar Flare
              </button>
              <button
                type="button"
                onClick={() => setLightPreset('night')}
                className={`rounded-lg py-1 font-mono text-[10px] transition border ${
                  lightPreset === 'night'
                    ? 'border-indigo-400 bg-indigo-500/20 text-indigo-200 font-semibold'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                Penumbra
              </button>
            </div>
          </div>
        </div>

        {/* Center 3D Viewport */}
        <div className="relative md:col-span-6 flex flex-col items-center justify-center min-h-[400px]">
          {/* Subtle cosmic vignette */}
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/40 pointer-events-none" />

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
            <div className="pointer-events-none absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[10px] font-mono text-cyan-300 shadow-sm backdrop-blur-md">
              <span className="font-bold">↺</span>
              <span>Rotate 360° • Pinch / Scroll to Zoom</span>
            </div>
          </div>
        </div>

        {/* Right Properties Panel */}
        <div className="hidden md:flex md:col-span-3 flex-col border-l border-white/10 bg-black/35 p-3 backdrop-blur-md text-xs">
          {/* Header tab switcher */}
          <div className="flex rounded-full bg-white/5 p-0.5 text-[11px] font-medium text-slate-300 mb-3 border border-white/10">
            <button
              type="button"
              onClick={() => setRightTab('subsystem')}
              className={`flex-1 rounded-full py-1 transition ${
                rightTab === 'subsystem'
                  ? 'bg-blue-600 font-semibold text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Inspection
            </button>
            <button
              type="button"
              onClick={() => setRightTab('materials')}
              className={`flex-1 rounded-full py-1 transition ${
                rightTab === 'materials'
                  ? 'bg-blue-600 font-semibold text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Materials
            </button>
          </div>

          {rightTab === 'subsystem' ? (
            <div className="space-y-3">
              {/* Active Subsystem Card */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 shadow-sm backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-xs">{active.title}</span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      active.status === 'critical'
                        ? 'bg-rose-500'
                        : active.status === 'caution'
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                    }`}
                  />
                </div>
                <p className="mt-1 font-mono text-[10px] text-cyan-300 font-semibold">{active.nominalRange}</p>
                <p className="mt-1 text-[11px] text-slate-300">{active.sensorType}</p>
              </div>

              {/* Clinical Protocol */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 shadow-sm backdrop-blur-sm">
                <p className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Clinical Protocol</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">{active.clinicalNote}</p>
              </div>

              {/* Real-time telemetry feed */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 shadow-sm font-mono backdrop-blur-sm">
                <p className="text-[10px] uppercase text-slate-400 font-semibold">Live Signals</p>
                <div className="mt-1.5 flex items-baseline justify-between">
                  <span className="text-slate-400">Heart Rate:</span>
                  <span className="font-bold text-white">{reading ? Math.round(reading.hr) : '--'} bpm</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-slate-400">SpO₂:</span>
                  <span className="font-bold text-cyan-300">{reading ? reading.spo2.toFixed(1) : '--'}%</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-slate-400">Core Temp:</span>
                  <span className="font-bold text-white">{reading ? reading.temp.toFixed(1) : '--'}°C</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 font-mono text-xs">
              <p className="text-[10px] uppercase text-slate-400 font-semibold">Suit Material Swatches</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-center shadow-sm">
                  <div className="mx-auto mb-1.5 h-10 w-10 rounded-full bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 shadow-md" />
                  <span className="text-[10px] text-slate-200 block font-semibold">Gold Visor</span>
                  <span className="text-[9px] text-slate-400">95% Metal</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-center shadow-sm">
                  <div className="mx-auto mb-1.5 h-10 w-10 rounded-full bg-gradient-to-tr from-gray-200 via-white to-gray-400 shadow-md" />
                  <span className="text-[10px] text-slate-200 block font-semibold">Ortho-Fabric</span>
                  <span className="text-[9px] text-slate-400">Thermal Mylar</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-center shadow-sm">
                  <div className="mx-auto mb-1.5 h-10 w-10 rounded-full bg-gradient-to-tr from-gray-700 via-gray-900 to-black shadow-md" />
                  <span className="text-[10px] text-slate-200 block font-semibold">Joint Bearing</span>
                  <span className="text-[9px] text-slate-400">Carbon Alloy</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-center shadow-sm">
                  <div className="mx-auto mb-1.5 h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 via-blue-300 to-blue-600 shadow-md" />
                  <span className="text-[10px] text-slate-200 block font-semibold">Astroskin PPG</span>
                  <span className="text-[9px] text-slate-400">Dual 880nm</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Docked Bottom Clinical Prompt Bar */}
      <div className="border-t border-white/10 bg-black/40 p-3 backdrop-blur-md">
        {promptFeedback && (
          <div className="mb-2 rounded-lg border border-cyan-400/30 bg-cyan-950/40 px-3 py-1 font-mono text-[11px] text-cyan-200 shadow-sm">
            ✨ {promptFeedback}
          </div>
        )}

        <form
          onSubmit={handlePromptSubmit}
          className="relative flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 shadow-inner"
        >
          {/* Quick select menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAddMenu((prev) => !prev)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition text-sm font-bold"
            >
              +
            </button>
            {showAddMenu && (
              <div className="absolute bottom-9 left-0 z-30 w-48 rounded-2xl border border-white/15 bg-[#0e1632] p-2 shadow-2xl text-xs backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSubsystem('dcm')
                    setShowAddMenu(false)
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-slate-200 hover:bg-white/10 font-mono text-[11px]"
                >
                  <span className="font-bold text-cyan-300">[ECG]</span> Astroskin Patch
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSubsystem('helmet')
                    setShowAddMenu(false)
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-slate-200 hover:bg-white/10 font-mono text-[11px]"
                >
                  <span className="font-bold text-amber-300">[SANS]</span> Cranial Doppler
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSubsystem('plss')
                    setShowAddMenu(false)
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-slate-200 hover:bg-white/10 font-mono text-[11px]"
                >
                  <span className="font-bold text-emerald-300">[PLSS]</span> Scrubber Loop
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
            className="hidden sm:flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-slate-300 hover:bg-white/15 hover:text-white transition"
          >
            <span className="text-cyan-300 font-bold">✨</span>
            <span>Inspire</span>
          </button>

          {/* Input field */}
          <input
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Query suit telemetry (e.g. 'check SANS ICP', 'cardio baseline', 'PLSS O2')..."
            className="flex-1 bg-transparent px-2 font-body text-xs text-white placeholder-slate-400 outline-none"
          />

          {/* Submit */}
          <button
            type="submit"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-500 transition shadow-sm"
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
