export function HomePage() {
  return (
    <div className="rounded-[30px] border border-slate-700/70 bg-[#0d1728] p-6 md:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.34em] text-cyan-300">Overview</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-white md:text-6xl">
            Mission readiness dashboard
          </h1>
        </div>
        <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200">
          Stable phase
        </div>
      </div>

      <p className="mt-5 max-w-2xl text-base text-slate-300 md:text-lg">
        Autonomous health monitoring for deep-space crews. Track vitals, understand anomalies,
        and keep astronauts safe with clear reasoning and action guidance.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-slate-700/80 bg-[#111d2d] p-5">
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Crew</p>
          <p className="mt-3 text-3xl font-semibold text-white">3</p>
          <p className="mt-2 text-sm text-slate-300">Active astronauts on current mission</p>
        </div>
        <div className="rounded-[24px] border border-slate-700/80 bg-[#111d2d] p-5">
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Signals</p>
          <p className="mt-3 text-3xl font-semibold text-white">7</p>
          <p className="mt-2 text-sm text-slate-300">Vitals monitored in real time</p>
        </div>
        <div className="rounded-[24px] border border-slate-700/80 bg-[#111d2d] p-5">
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Status</p>
          <p className="mt-3 text-3xl font-semibold text-emerald-300">Nominal</p>
          <p className="mt-2 text-sm text-slate-300">No critical intervention required</p>
        </div>
      </div>
    </div>
  )
}
