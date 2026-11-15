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
  sensorType: string
  clinicalNote: string
  nominalRange: string
  status: 'nominal' | 'caution' | 'critical'
}

export function BodyModel3D({ status = 'normal', reading }: BodyModel3DProps) {
  const [activeSubsystem, setActiveSubsystem] = useState<string>('dcm')

  const subsystems: Record<string, SubsystemInfo> = {
    helmet: {
      id: 'helmet',
      title: 'Neuro-Ocular & Cranial Monitor (SANS)',
      sensorType: 'Infrared Tympanic Thermistor + Transcranial Doppler Sensor',
      clinicalNote:
        'Continuous screening for Spaceflight Associated Neuro-ocular Syndrome (optic disc edema, cephalad fluid shift, elevated ICP).',
      nominalRange: 'ICP < 15 mmHg | Core Temp 36.5°C - 37.5°C',
      status: reading && reading.temp > 37.8 ? 'caution' : 'nominal',
    },
    dcm: {
      id: 'dcm',
      title: 'Cardiovascular & Astroskin Smart Garment',
      sensorType: '3-Lead ECG Patch + Dual-Wavelength Optical PPG + Bio-Impedance',
      clinicalNote:
        'Tracks resting heart rate, RMSSD HRV, and stroke volume against rolling personal baseline to catch autonomic fatigue and hypovolemia.',
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
      title: 'Primary Life Support (PLSS) & Cabin O₂/CO₂',
      sensorType: 'Non-Dispersive Infrared (NDIR) CO₂ + Galvanic Fuel Cell O₂',
      clinicalNote:
        'Monitors inspired gas partial pressure and suit loop scrubber performance to prevent hypercapnic headaches and hypoxia.',
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
      sensorType: 'Piezoelectric Insole Load Cells + 6-DoF IMU Accelerometer',
      clinicalNote:
        'Verifies daily 2.5-hour ARED high-resistance exercise compliance to prevent 1.0-1.5% monthly bone mineral density loss in microgravity.',
      nominalRange: 'Daily Impact Force > 1200 N | 45 min ARED cycle',
      status: 'nominal',
    },
  }

  const active = subsystems[activeSubsystem] ?? subsystems.dcm

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-blue-200 bg-white p-4 shadow-2xl backdrop-blur-sm">
      {/* Header telemetry badge */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                status === 'critical'
                  ? 'bg-rose-400 opacity-75'
                  : status === 'warning'
                    ? 'bg-amber-400 opacity-75'
                    : 'bg-blue-400 opacity-75'
              }`}
            />
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                status === 'critical'
                  ? 'bg-rose-500'
                  : status === 'warning'
                    ? 'bg-amber-500'
                    : 'bg-blue-500'
              }`}
            />
          </span>
          <p className="font-mono text-xs uppercase tracking-widest text-blue-600">
            3D Biomechanical Telemetry Twin
          </p>
        </div>
        <div className="flex gap-1.5">
          {Object.keys(subsystems).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveSubsystem(key)}
              className={`rounded px-2 py-0.5 font-mono text-[11px] uppercase transition ${
                activeSubsystem === key
                  ? 'border border-blue-300 bg-blue-500/20 text-blue-700'
                  : 'border border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:text-gray-800'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Viewport */}
      <div className="relative min-h-[380px] w-full flex-1">
        <Astronaut3D
          status={status}
          reading={reading}
          interactive={true}
          selectedSubsystem={activeSubsystem}
          onSelectSubsystem={setActiveSubsystem}
        />

        {/* Orbit Hint overlay */}
        <div className="pointer-events-none absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-mono text-gray-500 backdrop-blur-sm">
          <svg className="h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Drag to rotate 3D spacesuit • Scroll to zoom
        </div>
      </div>

      {/* Subsystem Telemetry Details Box */}
      <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                active.status === 'critical'
                  ? 'bg-rose-400'
                  : active.status === 'caution'
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
              }`}
            />
            <span className="font-semibold text-gray-900">{active.title}</span>
          </div>
          <span className="font-mono text-[10px] text-blue-600">{active.nominalRange}</span>
        </div>
        <p className="mt-1 text-[11px] text-gray-500">{active.sensorType}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-gray-700">{active.clinicalNote}</p>
      </div>
    </div>
  )
}
