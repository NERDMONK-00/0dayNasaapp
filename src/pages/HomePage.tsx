import { Link } from 'react-router-dom'
import { useMissionState } from '../state/store'
import { SpaceScene } from '../components/SpaceScene'

export function HomePage() {
  const { missionState } = useMissionState()
  const selected = missionState.astronauts[0]
  const current = missionState.currentReadings[selected.id]

  return (
    <div className="space-y-8 pb-12 pt-3">
      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#0f1630]/70 p-4 shadow-[0_30px_80px_rgba(7,12,20,0.7)] backdrop-blur-xl md:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1d3557_0%,rgba(11,11,43,0.55)_30%,transparent_65%)]" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] text-[#9ec9ff]">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Deep space monitor
            </div>

            <div>
              <h1 className="font-display text-4xl leading-[0.92] tracking-[-0.07em] text-white md:text-6xl xl:text-7xl">
                Keeping astronauts healthy, far from Earth.
              </h1>
              <p className="mt-4 max-w-lg text-base text-slate-300 md:text-lg">
                Real-time health intelligence for autonomous missions. Track crew vitals, explain anomalies, and keep support clear when every second matters.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/test" className="toon-btn">
                Start Test
              </Link>
              <Link to="/astronauts" className="toon-btn toon-btn-pink">
                Meet the Crew
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="toon-card toon-card-hover">
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-300">Mission clock</p>
                <p className="toon-number mt-3 text-2xl text-white">21:14:22</p>
              </div>
              <div className="toon-card toon-card-hover">
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-300">Earth link</p>
                <p className="mt-3 text-xl text-amber-200">Delayed</p>
              </div>
              <div className="toon-card toon-card-hover">
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-300">Live HR</p>
                <p className="toon-number mt-3 text-2xl text-white">{Math.round(current.hr)} bpm</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <SpaceScene />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
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

      <section className="rounded-[32px] border border-white/10 bg-[#121c34]/70 p-5 text-center backdrop-blur-xl md:p-7">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#9ec9ff]">Mission ready</p>
        <h3 className="mt-3 text-3xl font-medium text-white">Autonomous health support for long-duration missions</h3>
        <Link to="/about" className="toon-btn mt-5">
          Learn more
        </Link>
      </section>
    </div>
  )
}
