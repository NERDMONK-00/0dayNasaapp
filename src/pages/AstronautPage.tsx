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
        <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Score</p>
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
    <div className="space-y-6 px-2 pb-10 pt-6 md:px-4">
      <section className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#9ec9ff]">Crew</p>
            <h1 className="mt-3 text-4xl font-light tracking-[-0.07em] text-white md:text-5xl">Astronaut status</h1>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-slate-300">
            Mission day 42
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          {missionState.astronauts.map((person) => {
            const reading = missionState.currentReadings[person.id]
            const selected = selectedAstronautId === person.id
            return (
              <button
                key={person.id}
                type="button"
                onClick={() => setSelectedAstronautId(person.id)}
                className={`flex w-full items-center justify-between rounded-[26px] border p-4 text-left transition ${
                  selected ? 'border-[#4da3ff]/40 bg-[#4da3ff]/10' : 'border-white/10 bg-white/[0.04] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-semibold text-slate-950" style={{ backgroundColor: person.accent }}>
                    {person.name.slice(0, 1)}
                  </div>
                  <div>
                    <p className="text-lg font-medium text-white">{person.name}</p>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{person.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-200">{Math.round(reading.hr)} bpm</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-300">Stable</p>
                </div>
              </button>
            )
          })}
        </div>

        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] text-xl font-semibold text-slate-950" style={{ backgroundColor: astronaut.accent }}>
                {astronaut.name.slice(0, 1)}
              </div>
              <div>
                <p className="text-xl font-medium text-white">{astronaut.name}</p>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{astronaut.role}</p>
              </div>
            </div>
            <HealthRing value={Math.max(70, Math.min(99, Math.round(score)))} color="#4da3ff" />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {vitals.map((item) => (
              <div key={item.label} className="rounded-[22px] border border-white/10 bg-[#07121d]/80 p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">{item.label}</p>
                <p className={`mt-3 text-2xl font-medium ${item.tone}`}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            <SignalChart title="Heart rate" color="#4da3ff" data={history} valueKey="hr" unit="bpm" />
            <SignalChart title="SpO₂" color="#34d399" data={history} valueKey="spo2" unit="%" />
          </div>
        </div>
      </section>
    </div>
  )
}
