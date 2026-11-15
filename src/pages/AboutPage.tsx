export function AboutPage() {
  return (
    <div className="rounded-[30px] border border-slate-800 bg-slate-900/70 p-6 md:p-8">
      <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">About</p>
      <h1 className="mt-4 text-4xl font-semibold text-white">Built for deep-space autonomy</h1>
      <p className="mt-4 max-w-3xl text-base text-slate-300">
        This project is designed for future crewed missions where astronauts cannot rely on real-time
        support from Earth. The system blends rolling personal baselines, rule-based safety checks,
        and explainable alerts into a simple browser-based mission command dashboard.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-5">
          <h2 className="text-lg font-semibold text-white">Mission goal</h2>
          <p className="mt-3 text-sm text-slate-300">
            Detect early signs of stress, illness, dehydration, sleep debt, and atmospheric issues before they become critical.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-5">
          <h2 className="text-lg font-semibold text-white">Hardware-ready</h2>
          <p className="mt-3 text-sm text-slate-300">
            The app is intentionally built around a data-source abstraction so future sensor hardware can be plugged in without changing the rest of the system.
          </p>
        </div>
      </div>
    </div>
  )
}
