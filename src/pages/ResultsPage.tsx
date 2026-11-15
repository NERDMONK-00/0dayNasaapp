import { useMissionState } from '../state/store'

export function ResultsPage() {
  const { missionState, selectedAstronautId } = useMissionState()
  const astronaut = missionState.astronauts.find((person) => person.id === selectedAstronautId) ?? missionState.astronauts[0]
  const alerts = missionState.alerts.filter((alert) => alert.astronautId === selectedAstronautId)
  const current = missionState.currentReadings[selectedAstronautId]
  const score = Math.max(65, 96 - (current.hr > 90 ? 8 : 0) - (current.spo2 < 95 ? 6 : 0) - (current.temp > 37.8 ? 5 : 0))

  return (
    <div className="page-shell">
      <div className="page-grid route-results pb-8">
        <div className="space-y-4">
          <section className="page-panel">
            <p className="page-kicker">Results</p>
            <h1 className="page-title">Crew health report</h1>
          </section>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="toon-card">
              <p className="text-[10px] uppercase tracking-[0.28em] text-slate-300">Health score</p>
              <p className="toon-number mt-4 text-4xl text-white">{Math.round(score)}</p>
            </div>
            <div className="toon-card">
              <p className="text-[10px] uppercase tracking-[0.28em] text-slate-300">Alerts</p>
              <p className="toon-number mt-4 text-4xl text-white">{alerts.length}</p>
            </div>
            <div className="toon-card">
              <p className="text-[10px] uppercase tracking-[0.28em] text-slate-300">Crew</p>
              <p className="mt-4 text-3xl font-medium text-white">{astronaut.name}</p>
            </div>
          </div>
        </div>

        <div className="page-panel">
          <div className="space-y-3" aria-live="polite">
            {alerts.length === 0 ? (
              <div className="toon-card border-[var(--ok)] bg-emerald-500/10 text-sm text-emerald-200">No deviations noted. The astronaut remains within expected mission thresholds.</div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="toon-card">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">{alert.title}</p>
                    <span className={`toon-chip ${alert.level === 'critical' ? 'toon-crit' : alert.level === 'warning' ? 'toon-warn' : 'toon-ok'} text-[10px] uppercase tracking-[0.2em]`}>
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
      </div>
    </div>
  )
}
