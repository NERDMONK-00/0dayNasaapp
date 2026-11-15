export function AboutPage() {
  return (
    <div className="space-y-6 px-2 pb-10 pt-6 md:px-4">
      <section className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl md:p-6">
        <p className="text-[10px] uppercase tracking-[0.32em] text-[#9ec9ff]">Mission context</p>
        <h1 className="mt-3 text-4xl font-light tracking-[-0.07em] text-white md:text-5xl">About the mission</h1>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Problem</p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Astronauts must operate far from Earth with limited communication latency. A small health drift can become mission-critical before a human team responds. This app focuses on early detection and clear, explainable support.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Technologies</p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            React + Vite + TypeScript, Tailwind, Recharts, simulator-driven vitals, and a shared DataSource abstraction designed for future hardware upgrades.
          </p>
        </div>
      </div>

      <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
        <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Credits</p>
        <ul className="mt-4 space-y-2 text-sm text-slate-300">
          <li>Model: NASA</li>
          <li>Mascot: Orbitkat by @orbitkat.art (Sketchfab)</li>
        </ul>
      </div>

      <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
        <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Limitations</p>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          This is simulated mission data for demo purposes. The app provides decision support, not diagnosis, and is designed to be upgraded to hardware later through the DataSource interface.
        </p>
      </div>
    </div>
  )
}
