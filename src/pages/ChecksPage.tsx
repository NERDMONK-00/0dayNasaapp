export function ChecksPage() {
  const checklist = [
    'Vitals trend within expected range',
    'Cabin atmosphere stable',
    'Sleep recovery adequate',
    'Hydration protocol checked',
    'Thermal control nominal',
  ]

  return (
    <div className="rounded-[30px] border border-white/10 bg-slate-950/50 p-6 md:p-8">
      <p className="text-xs uppercase tracking-[0.32em] text-blue-600">Checks</p>
      <h1 className="mt-4 text-4xl font-semibold text-white">Self-check checklist</h1>

      <div className="mt-6 space-y-3">
        {checklist.map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-xs text-emerald-700">
              ✓
            </div>
            <p className="text-sm text-slate-100">{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
