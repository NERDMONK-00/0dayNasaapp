export function ReportPage() {
  return (
    <div className="rounded-[30px] border border-white/10 bg-slate-950/50 p-6 md:p-8">
      <p className="text-xs uppercase tracking-[0.32em] text-blue-600">Reports</p>
      <h1 className="mt-4 text-4xl font-semibold text-white">Mission health report</h1>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Summary</p>
          <p className="mt-3 text-2xl font-semibold text-white">Stable</p>
          <p className="mt-2 text-sm text-slate-300">No immediate danger detected across all systems.</p>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Risk level</p>
          <p className="mt-3 text-2xl font-semibold text-amber-300">Low</p>
          <p className="mt-2 text-sm text-slate-300">One crew member is nearing a recovery threshold.</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-5">
        <p className="text-sm font-medium text-white">Key insight</p>
        <p className="mt-2 text-sm text-slate-300">
          Recent sleep and hydration trends remain within acceptable limits, but a mild cardiovascular deviation suggests more monitoring in the next cycle.
        </p>
      </div>
    </div>
  )
}
