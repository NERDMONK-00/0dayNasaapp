export function AboutPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <span className="page-kicker">0DAY • Mission Storyboard</span>
        <h1 className="page-title text-2xl sm:text-3xl">
          5-Slide Product Demo Deck
        </h1>
        <p className="mt-1 text-sm font-mono text-slate-300">
          Presentation-ready overview for demos, investor discussions, and slide export.
        </p>
      </div>

      <div className="space-y-5">
        <section className="rounded-[28px] border border-white/10 bg-[#171412] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.2)] md:p-8">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <span className="page-kicker">Slide 01</span>
            <span className="rounded-full border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#FFD4C6]">
              Who are we
            </span>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold leading-tight text-white md:text-4xl">
                We are building the crew health intelligence layer for the next era of space missions.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-200">
                0DAY is a mission-focused health monitoring system designed for astronauts living in isolated, high-risk environments where medical decisions must happen locally, instantly, and without Earth-based support.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-[#0f0d0d] p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Team</p>
                <p className="mt-2 text-xl font-bold text-white">Mission Engineers</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0f0d0d] p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Focus</p>
                <p className="mt-2 text-xl font-bold text-white">Clinical Decision Support</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0f0d0d] p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Mission</p>
                <p className="mt-2 text-xl font-bold text-white">Autonomous Crew Safety</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-[#171412] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.2)] md:p-8">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <span className="page-kicker">Slide 02</span>
            <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-200">
              Problem solved
            </span>
          </div>

          <div className="mt-5">
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              Deep-space crews cannot rely on real-time physician support.
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-[#0f0d0d] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-rose-300">Challenge</p>
                <p className="mt-2 text-base leading-7 text-slate-200">
                  Communication delays, crew isolation, and hostile environments make medical monitoring slow, fragile, and dangerous.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0f0d0d] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-rose-300">Where it breaks</p>
                <p className="mt-2 text-base leading-7 text-slate-200">
                  Standard population thresholds fail in individual astronauts. A normal baseline for one person can be abnormal for another.
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-500/5 p-4 text-base leading-7 text-slate-200">
              We solve the problem of <span className="font-semibold text-amber-200">false alarms, delayed diagnosis, and crew autonomy loss</span> by building a local, personalized, explainable health intelligence system.
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-[#171412] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.2)] md:p-8">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <span className="page-kicker">Slide 03</span>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-200">
              Core solution
            </span>
          </div>

          <div className="mt-5">
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              A browser-based astronaut health monitoring platform with adaptive baselines and alert reasoning.
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-[#0f0d0d] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">01</p>
                <p className="mt-2 text-xl font-bold text-white">Personal baselines</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">Rolling mean and standard deviation per astronaut for dynamic risk comparison.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0f0d0d] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">02</p>
                <p className="mt-2 text-xl font-bold text-white">Multi-signal detection</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">Combines HR, HRV, SpO₂, temp, sleep, and CO₂ to reduce false alarms and confirm real threats.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0f0d0d] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300">03</p>
                <p className="mt-2 text-xl font-bold text-white">Explainable alerts</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">Every alert includes a reason, evidence, and recommended action so crews understand the signal.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-[#171412] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.2)] md:p-8">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <span className="page-kicker">Slide 04</span>
            <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-blue-200">
              Real world impact
            </span>
          </div>

          <div className="mt-5">
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              This matters beyond space: remote medicine on Earth faces the same operational constraints.
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-[#0f0d0d] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-blue-300">Space missions</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">Autonomous monitoring in deep-space habitats, lunar missions, and EVA operations.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0f0d0d] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-blue-300">Rural health</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">Remote clinics and mountain regions with limited internet and delayed specialist access.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0f0d0d] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-blue-300">Emergency response</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">High-stakes environments where quick and reliable triage changes the outcome.</p>
              </div>
            </div>
            <p className="mt-5 text-base leading-7 text-slate-200">
              Our system is built to work with <span className="font-semibold text-white">no cloud dependency</span>, local decision support, and simple operational workflows, which makes it valuable in both extraterrestrial and terrestrial environments.
            </p>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-[#171412] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.2)] md:p-8">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <span className="page-kicker">Slide 05</span>
            <span className="rounded-full border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#FFD4C6]">
              Why choose us
            </span>
          </div>

          <div className="mt-5">
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              We combine human-centered monitoring with real operational thinking.
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-[#0f0d0d] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#FFB89D]">Why us</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
                  <li>• Local-first, browser-based architecture</li>
                  <li>• Personalized, not one-size-fits-all anomaly logic</li>
                  <li>• Multi-signal detection with explainable action guidance</li>
                  <li>• Designed around crew autonomy and real-world resilience</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0f0d0d] p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#FFB89D]">Outcome</p>
                <p className="mt-3 text-base leading-7 text-slate-200">
                  We deliver a prototype that is not only technically strong, but also understandable, usable, and ready for demo storytelling across engineering, science, and mission design audiences.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
