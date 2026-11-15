import { useMemo } from 'react'
import { useMissionState } from '../state/store'
import { SignalChart } from '../components/SignalChart'

function HealthRing({ value, color }: { value: number; color: string }) {
  const circumference = 2 * Math.PI * 42
  const dash = circumference * (value / 100)

  return (
    <div className="relative flex h-28 w-28 items-center justify-center">
      <svg className="h-28 w-28 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="42" stroke="rgba(255,255,255,0.12)" strokeWidth="9" fill="none" />
        <circle
          cx="60"
          cy="60"
          r="42"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-[10px] uppercase tracking-[0.28em] text-slate-300">Score</p>
        <p className="mt-1 text-xl font-semibold text-white">{value}</p>
      </div>
    </div>
  )
}

export function AstronautPage() {
  const { missionState, selectedAstronautId, setSelectedAstronautId } = useMissionState()
  const astronaut = missionState.astronauts.find((person) => person.id === selectedAstronautId) ?? missionState.astronauts[0]
  const current = missionState.currentReadings[selectedAstronautId]
  const history = missionState.history[selectedAstronautId] ?? []

  const vitals = useMemo(
    () => [
      { label: 'Heart rate', value: `${Math.round(current.hr)} bpm`, tone: 'text-amber-300' },
      { label: 'HRV', value: `${Math.round(current.hrv)} ms`, tone: 'text-cyan-300' },
      { label: 'SpO₂', value: `${Math.round(current.spo2)}%`, tone: 'text-emerald-300' },
      { label: 'Temp', value: `${current.temp.toFixed(1)}°C`, tone: 'text-violet-300' },
    ],
    [current],
  )

  const score = 89 - (current.hr > 90 ? 10 : 0) - (current.spo2 < 95 ? 8 : 0) - (current.temp > 37.5 ? 6 : 0)

  return (
    <div className="page-shell">
      <div className="page-grid route-astronauts pb-8">
        <div className="space-y-4">
          <section className="page-panel">
            <div className="page-kicker">Crew</div>
            <h1 className="page-title">Astronaut status</h1>
          </section>

          {missionState.astronauts.map((person) => {
            const reading = missionState.currentReadings[person.id]
            const selected = selectedAstronautId === person.id
            return (
              <button
                key={person.id}
                type="button"
                onClick={() => setSelectedAstronautId(person.id)}
                className={`flex w-full items-center justify-between rounded-[26px] border-3 border-[var(--outline)] p-4 text-left transition ${
                  selected ? 'bg-[#4da3ff]/15' : 'bg-[rgba(20,19,74,0.4)] hover:bg-[rgba(20,19,74,0.6)]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[var(--outline)] text-lg font-semibold text-slate-950" style={{ backgroundColor: person.accent }}>
                    {person.name.slice(0, 1)}
                  </div>
                  <div>
                    <p className="text-lg font-medium text-white">{person.name}</p>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-300">{person.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="toon-number text-sm font-medium text-slate-200">{Math.round(reading.hr)} bpm</p>
                  <span className="toon-chip toon-ok text-[10px] uppercase tracking-[0.2em]">Stable</span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="page-panel">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border-2 border-[var(--outline)] text-xl font-semibold text-slate-950" style={{ backgroundColor: astronaut.accent }}>
                {astronaut.name.slice(0, 1)}
              </div>
              <div>
                <p className="text-xl font-medium text-white">{astronaut.name}</p>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-300">{astronaut.role}</p>
              </div>
            </div>
            <HealthRing value={Math.max(70, Math.min(99, Math.round(score)))} color="#4da3ff" />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {vitals.map((item) => (
              <div key={item.label} className="toon-card">
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-300">{item.label}</p>
                <p className={`toon-number mt-3 text-2xl ${item.tone}`}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            <SignalChart title="Heart rate" color="#4da3ff" data={history} valueKey="hr" unit="bpm" />
            <SignalChart title="SpO₂" color="#34d399" data={history} valueKey="spo2" unit="%" />
          </div>
        </div>
      </div>
    </div>
  )
}
