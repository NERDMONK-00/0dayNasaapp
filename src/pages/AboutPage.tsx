export function AboutPage() {
  return (
    <div className="page-shell route-about">
      <section className="page-panel">
        <p className="page-kicker">Mission context</p>
        <h1 className="page-title">About the mission</h1>
      </section>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="toon-card">
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-300">Problem</p>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            Astronauts must operate far from Earth with limited communication latency. A small health drift can become mission-critical before a human team responds. This app focuses on early detection and clear, explainable support.
          </p>
        </div>

        <div className="toon-card">
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-300">Technologies</p>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            React + Vite + TypeScript, Tailwind, Recharts, simulator-driven vitals, and a shared DataSource abstraction designed for future hardware upgrades.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="toon-card">
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-300">Objective</p>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            Reduce time to interpret a crew health anomaly by combining signals, baseline learning, and human-readable guidance.
          </p>
        </div>

        <div className="toon-card">
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-300">Why it matters</p>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            Crew autonomy increases in deep space missions, so the system must support decisions without relying on constant Earth response.
          </p>
        </div>

        <div className="toon-card">
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-300">Design goal</p>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            Give the mission team a fast, clear overview that feels like a real control room while staying simple enough to explain easily.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-[30px] border-3 border-[var(--outline)] bg-[rgba(17,16,44,0.38)] p-5 shadow-[var(--shadow)] backdrop-blur-md">
        <p className="text-[10px] uppercase tracking-[0.28em] text-slate-300">Credits</p>
        <ul className="mt-4 space-y-2 text-sm text-slate-200">
          <li>Model: NASA-inspired mission visual system</li>
          <li>3D model generated with Tripo AI</li>
          <li>AI tools were used in development for concepting, iteration, and UI direction</li>
        </ul>
      </div>

      <div className="mt-6 rounded-[30px] border-3 border-[var(--outline)] bg-[rgba(17,16,44,0.38)] p-5 shadow-[var(--shadow)] backdrop-blur-md">
        <p className="text-[10px] uppercase tracking-[0.28em] text-slate-300">Limitations</p>
        <p className="mt-3 text-sm leading-7 text-slate-200">
          This is simulated mission data for demo purposes. The app provides decision support, not diagnosis, and is designed to be upgraded to hardware later through the DataSource interface.
        </p>
      </div>
    </div>
  )
}
