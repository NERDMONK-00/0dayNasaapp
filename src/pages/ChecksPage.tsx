export function ChecksPage() {
  const checklist = [
    'Vitals trend within expected range',
    'Cabin atmosphere stable',
    'Sleep recovery adequate',
    'Hydration protocol checked',
    'Thermal control nominal',
  ]

  return (
    <div className="rounded-[30px] border border-gray-200 bg-gray-50 p-6 md:p-8">
      <p className="text-xs uppercase tracking-[0.32em] text-blue-600">Checks</p>
      <h1 className="mt-4 text-4xl font-semibold text-gray-900">Self-check checklist</h1>

      <div className="mt-6 space-y-3">
        {checklist.map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-2xl border border-gray-300 bg-gray-100 p-4">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-xs text-emerald-700">
              ✓
            </div>
            <p className="text-sm text-gray-800">{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
