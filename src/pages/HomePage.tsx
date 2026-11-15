import { Link } from 'react-router-dom'
import { useMissionState } from '../state/store'

export function HomePage() {
  const { missionState } = useMissionState()
  const selected = missionState.astronauts[0]
  const current = missionState.currentReadings[selected.id]

  return (
    <div className="page-shell">
      <section className="page-grid route-home gap-5 pb-8">
        <div className="page-panel">
          <div className="page-kicker">Deep space monitor</div>
          <h1 className="page-title">Keeping astronauts healthy, far from Earth.</h1>
          <p className="page-copy mt-4 max-w-xl">
            Real-time health intelligence for autonomous missions. Track crew vitals, explain anomalies, and keep support clear when every second matters.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/test" className="toon-btn">Start Test</Link>
            <Link to="/astronauts" className="toon-btn toon-btn-pink">Meet the Crew</Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="toon-card toon-card-hover">
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-200">Mission clock</p>
              <p className="toon-number mt-3 text-2xl text-white">21:14:22</p>
            </div>
            <div className="toon-card toon-card-hover">
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-200">Earth link</p>
              <p className="mt-3 text-xl text-amber-200">Delayed</p>
            </div>
            <div className="toon-card toon-card-hover">
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-200">Live HR</p>
              <p className="toon-number mt-3 text-2xl text-white">{Math.round(current.hr)} bpm</p>
            </div>
          </div>
        </div>

        <div className="page-panel min-h-[420px] md:min-h-[560px]">
          <div className="flex h-full min-h-[360px] items-center justify-center rounded-[22px] border-3 border-[var(--outline)] bg-[radial-gradient(circle_at_top,_rgba(77,225,255,0.18),_rgba(11,11,43,0.3)_35%,_rgba(5,8,18,0.18)_100%)] text-center shadow-[var(--shadow)]">
            <div className="space-y-3">
              <div className="text-6xl" aria-hidden="true">🛰️</div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-sky-100">Orbital view</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 pb-8 md:grid-cols-3">
        {[
          ['Personal baseline', 'Rolling baselines adapt to each astronaut and catch drift before it becomes a critical event.'],
          ['Explainable alerts', 'Every warning includes the actual reading, the baseline range, and the suggested action.'],
          ['Autonomous onboard', 'Mission logic runs locally so crews can respond without waiting for Earth support.'],
        ].map(([title, copy]) => (
          <div key={title} className="toon-card toon-card-hover">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#9ec9ff]">Feature</p>
            <h3 className="mt-3 text-2xl text-white">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-200">{copy}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 pb-4 md:grid-cols-2">
        <div className="page-panel">
          <p className="page-kicker">Mission telemetry</p>
          <h3 className="mt-3 text-2xl text-white">Crew health snapshot</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-200">
            <li>• Heart rate trend remains within expected range</li>
            <li>• SpO₂ reserves are stable during EVA prep</li>
            <li>• CO₂ concentration remains acceptable with filtration loop status nominal</li>
          </ul>
        </div>

        <div className="page-panel">
          <p className="page-kicker">Decision support</p>
          <h3 className="mt-3 text-2xl text-white">Clear response guidance</h3>
          <p className="mt-4 text-sm leading-7 text-slate-200">
            This system continuously compares crew vitals against personal baselines and mission thresholds, then explains each alert in plain language with a recommended action.
          </p>
        </div>
      </section>

      <section className="page-panel text-center">
        <p className="page-kicker">Mission ready</p>
        <h3 className="mt-3 text-3xl font-medium text-white">Autonomous health support for long-duration missions</h3>
        <Link to="/about" className="toon-btn mt-5">Learn more</Link>
      </section>
    </div>
  )
}
