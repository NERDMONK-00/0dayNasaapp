export function StatusPage() {
  return (
    <div className="space-y-6 rounded-[30px] border border-white/10 bg-slate-950/35 p-6 md:p-8">
      <div className="border-b border-white/10 pb-4">
        <p className="text-xs uppercase tracking-[0.32em] text-blue-400">Status</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">System condition overview</h1>
      </div>

      <div className="mt-6 space-y-4">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Nominal</p>
          <p className="mt-2 text-sm text-slate-200">Cabin pressure and core vitals are within expected operating ranges.</p>
        </div>
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Monitor</p>
          <p className="mt-2 text-sm text-slate-200">Recovery metrics show mild fatigue after extended task execution.</p>
        </div>
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-rose-300">Critical</p>
          <p className="mt-2 text-sm text-slate-200">Immediate action if oxygen saturation falls below threshold or cabin CO₂ spikes.</p>
        </div>
      </div>
    </div>
  )
}
