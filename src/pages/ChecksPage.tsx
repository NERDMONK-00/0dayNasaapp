export function ChecksPage() {
  const checklist = [
    'Vitals trend within expected range',
    'Cabin atmosphere stable',
    'Sleep recovery adequate',
    'Hydration protocol checked',
    'Thermal control nominal',
  ]

  return (
    <div className="space-y-6 rounded-[30px] border border-white/10 bg-slate-950/35 p-6 md:p-8">
      <div className="border-b border-white/10 pb-4">
        <p className="text-xs uppercase tracking-[0.32em] text-blue-400">Checks</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Self-check checklist</h1>
      </div>

      <div className="mt-6 space-y-3">
        {checklist.map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 p-4">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-xs text-emerald-300">
              ✓
            </div>
            <p className="text-sm text-slate-200">{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
