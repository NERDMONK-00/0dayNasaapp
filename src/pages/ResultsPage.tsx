import { useMissionState } from '../state/store'

export function ResultsPage() {
  const { missionState, selectedAstronautId } = useMissionState()
  const astronaut = missionState.astronauts.find((person) => person.id === selectedAstronautId) ?? missionState.astronauts[0]
  const alerts = missionState.alerts.filter((alert) => alert.astronautId === selectedAstronautId)
  const current = missionState.currentReadings[selectedAstronautId]
  const score = Math.max(65, 96 - (current.hr > 90 ? 8 : 0) - (current.spo2 < 95 ? 6 : 0) - (current.temp > 37.8 ? 5 : 0))

  return (
    <div className="space-y-6 px-2 pb-10 pt-6 md:px-4">
      <section className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl md:p-6">
        <p className="text-[10px] uppercase tracking-[0.32em] text-[#9ec9ff]">Results</p>
        <h1 className="mt-3 text-4xl font-light tracking-[-0.07em] text-white md:text-5xl">Crew health report</h1>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Health score</p>
          <p className="mt-4 text-4xl font-medium text-white">{Math.round(score)}</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Alerts</p>
          <p className="mt-4 text-4xl font-medium text-white">{alerts.length}</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Crew</p>
          <p className="mt-4 text-3xl font-medium text-white">{astronaut.name}</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <p className="text-[10px] uppercase tracking-[0.26em] text-slate-400">Timeline</p>
          <div className="mt-4 space-y-3">
            {alerts.length === 0 ? (
              <div className="rounded-[22px] border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">No deviations noted. The astronaut remains within expected mission thresholds.</div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="rounded-[22px] border border-white/10 bg-[#07121d] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">{alert.title}</p>
                    <span className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.2em] ${alert.level === 'critical' ? 'bg-red-500/10 text-red-200' : alert.level === 'warning' ? 'bg-amber-500/10 text-amber-200' : 'bg-emerald-500/10 text-emerald-200'}`}>
                      {alert.level}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{alert.reason}</p>
                  <p className="mt-2 text-xs text-cyan-200">Recommended action: {alert.action}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <p className="text-[10px] uppercase tracking-[0.26em] text-slate-400">Quick actions</p>
          <div className="mt-4 space-y-3">
            <button type="button" className="flex w-full items-center justify-between rounded-[22px] border border-white/10 bg-[#07121d] px-4 py-3 text-left text-sm text-slate-200">
              <span>Export PDF</span>
              <span>→</span>
            </button>
            <button type="button" className="flex w-full items-center justify-between rounded-[22px] border border-white/10 bg-[#07121d] px-4 py-3 text-left text-sm text-slate-200">
              <span>Export CSV</span>
              <span>→</span>
            </button>
            <button type="button" className="flex w-full items-center justify-between rounded-[22px] border border-white/10 bg-[#07121d] px-4 py-3 text-left text-sm text-slate-200">
              <span>Share with Ground Control</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
