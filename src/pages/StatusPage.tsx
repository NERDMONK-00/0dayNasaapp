export function StatusPage() {
  return (
    <div className="rounded-[30px] border border-white/10 bg-slate-950/50 p-6 md:p-8">
      <p className="text-xs uppercase tracking-[0.32em] text-blue-600">Status</p>
      <h1 className="mt-4 text-4xl font-semibold text-white">System condition overview</h1>

      <div className="mt-6 space-y-4">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Nominal</p>
          <p className="mt-2 text-sm text-slate-100">Cabin pressure and core vitals are within expected operating ranges.</p>
        </div>
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-700">Monitor</p>
          <p className="mt-2 text-sm text-slate-100">Recovery metrics show mild fatigue after extended task execution.</p>
        </div>
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-rose-700">Critical</p>
          <p className="mt-2 text-sm text-slate-100">Immediate action if oxygen saturation falls below threshold or cabin CO2 spikes.</p>
        </div>
      </div>
    </div>
  )
}
