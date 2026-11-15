export function ReportPage() {
  return (
    <div className="rounded-[30px] border border-gray-200 bg-gray-50 p-6 md:p-8">
      <p className="text-xs uppercase tracking-[0.32em] text-blue-600">Reports</p>
      <h1 className="mt-4 text-4xl font-semibold text-gray-900">Mission health report</h1>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-300 bg-gray-100 p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-gray-500">Summary</p>
          <p className="mt-3 text-2xl font-semibold text-gray-900">Stable</p>
          <p className="mt-2 text-sm text-gray-700">No immediate danger detected across all systems.</p>
        </div>
        <div className="rounded-2xl border border-gray-300 bg-gray-100 p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-gray-500">Risk level</p>
          <p className="mt-3 text-2xl font-semibold text-amber-300">Low</p>
          <p className="mt-2 text-sm text-gray-700">One crew member is nearing a recovery threshold.</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-300 bg-gray-100 p-5">
        <p className="text-sm font-medium text-gray-900">Key insight</p>
        <p className="mt-2 text-sm text-gray-700">
          Recent sleep and hydration trends remain within acceptable limits, but a mild cardiovascular deviation suggests more monitoring in the next cycle.
        </p>
      </div>
    </div>
  )
}
