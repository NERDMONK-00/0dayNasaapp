export function AboutPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-4">
        <span className="page-kicker">NASA Space Apps Challenge Submission</span>
        <h1 className="page-title text-2xl sm:text-3xl">
          Scientific Context, Ethics & References
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Grounding autonomous crew healthcare in NASA Human Research Program (HRP) literature and Earth-independent medical operations.
        </p>
      </div>

      {/* The Five Hazards of Spaceflight (Section 2 of Brief) */}
      <section className="hud-card">
        <span className="page-kicker">NASA Human Research Program (HRP)</span>
        <h3 className="font-display text-lg font-bold text-white mt-1">
          The Five Hazards of Deep Space Exploration
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-300">
          NASA organizes spaceflight human health risks under five overarching hazards. As missions venture to the Moon (Artemis) and Mars, distance prevents real-time telemedicine with Houston flight surgeons, necessitating on-board autonomous clinical decision support:
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
            <span className="font-mono text-cyan-400 font-bold block mb-1">1. Radiation (RE)</span>
            Galactic cosmic rays (GCRs) and solar energetic particle (SEP) events increase cumulative lifetime cancer risk, central nervous system alterations, and cardiovascular damage. AstroPulse integrates live DONKI space-weather alerts to safeguard EVA sorties.
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
            <span className="font-mono text-sky-400 font-bold block mb-1">2. Isolation & Confinement (IC)</span>
            ISS crews witness 16 sunrises/sunsets every 24 hours, fragmenting circadian sleep architecture. Chronic sleep debt impairs executive cognitive speed and teamwork. AstroPulse models individual sleep debt and autonomic HRV recovery.
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
            <span className="font-mono text-emerald-400 font-bold block mb-1">3. Distance from Earth (DE)</span>
            Mars communication latency reaches up to 20 minutes one-way, rendering ground-in-the-loop clinical intervention impossible during acute emergencies. AstroPulse executes 100% locally in the browser with zero cloud dependencies.
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
            <span className="font-mono text-amber-400 font-bold block mb-1">4. Gravity Fields (GF)</span>
            Microgravity induces immediate cephalad fluid shifting (puffy face syndrome), reducing circulating blood volume by 15-20% and driving bone mineral density loss of 1.0-1.5% per month in load-bearing skeletal structures.
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
            <span className="font-mono text-rose-400 font-bold block mb-1">5. Hostile / Closed Environments (CH)</span>
            Habitats and spacesuits are sealed ecosystems where toxic trace gases and carbon dioxide can rapidly build up. AstroPulse fuses cabin pCO₂ and temperature directly into its unified Risk Index.
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
            <span className="font-mono text-purple-400 font-bold block mb-1">Clinical Priority: SANS Syndrome</span>
            Spaceflight-Associated Neuro-ocular Syndrome (SANS) manifests as optic disc edema, globe flattening, and hyperopic vision shifts caused by venous headward fluid stagnation. Continuous multi-signal baseline tracking flags risk factors early.
          </div>
        </div>
      </section>

      {/* Earth Benefit Angle (Section 9 of Brief & Paper) */}
      <section className="hud-card border-emerald-500/30">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-emerald-400 uppercase tracking-wider font-semibold">
            Dual-Use Innovation • Terrestrial Healthcare
          </span>
        </div>
        <h3 className="font-display text-lg font-bold text-white mt-1">
          Earth Benefit: Remote High-Altitude & Rural Medicine
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-300">
          The exact operational constraints of deep space missions—<strong>zero cloud connectivity, severe power limits, delayed expert access, and extreme physical environments</strong>—mirror the realities of remote and mountainous clinics on Earth, including isolated health posts across the <strong>Himalayas in Nepal</strong>.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-slate-300">
          AstroPulse's low-power, browser-based personal baseline engine allows rural community health workers to monitor patients with high-altitude pulmonary edema (HAPE), acute respiratory distress, or sepsis without requiring internet or centralized hospital databases.
        </p>
      </section>

      {/* Section 8 Limitations and Ethics */}
      <section className="hud-card">
        <span className="page-kicker">Section 8 of Technical Paper</span>
        <h3 className="font-display text-lg font-bold text-white mt-1">
          Limitations, Privacy & Clinical Ethics
        </h3>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs text-slate-300">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <strong className="text-amber-300 block mb-1">Decision Support, Not Diagnosis</strong>
            AstroPulse provides clinical decision support to augment crew autonomy; it is not a certified medical device and does not replace professional flight surgeon judgment.
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <strong className="text-cyan-300 block mb-1">Simulated Physiology Data</strong>
            All vital readings in this prototype are generated by the mathematical physiology simulator (Section 4.1). Validation on public physiological repositories (e.g. PhysioNet) and human analog isolation studies is planned for Phase 2.
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <strong className="text-emerald-300 block mb-1">Crew Autonomy & Local Privacy</strong>
            Medical data is strictly encrypted and held locally on the spacecraft. Only high-level risk summaries and critical alerts are queued for transmission to Earth ground control.
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <strong className="text-sky-300 block mb-1">Combating Alert Fatigue</strong>
            Tiered thresholds, persistence rules (m of n), and multi-signal confirmation specifically mitigate "cry wolf" alarm fatigue, keeping crew trust high.
          </div>
        </div>
      </section>

      {/* Academic References (Section 13) */}
      <section className="hud-card">
        <span className="page-kicker">Section 13 • Scientific Citations</span>
        <h3 className="font-display text-lg font-bold text-white mt-1">
          Literature & Data Source Citations
        </h3>

        <ol className="mt-3 space-y-2 font-mono text-xs text-slate-300 list-decimal list-inside leading-relaxed">
          <li>
            <strong className="text-white">NASA Exploration Medical Capability (ExMC):</strong> <em>Earth-Independent Medical Operations (EIMO) Concept of Operations</em>, Human Research Program Investigators' Workshop (2024).
          </li>
          <li>
            <strong className="text-white">NASA Twins Study:</strong> Garrett-Bakelman, F. E., et al. (2019). <em>The NASA Twins Study: A multidimensional analysis of a year-long human spaceflight</em>. Science, 364(6436).
          </li>
          <li>
            <strong className="text-white">Autonomous Medical CDSS:</strong> Garcia-Gomez, J. M. <em>Basic principles and concept design of a real-time clinical decision support system for autonomous medical care on missions to Mars</em>. arXiv:2010.07029.
          </li>
          <li>
            <strong className="text-white">Canadian Space Agency (CSA):</strong> <em>Bio-Monitor (Astroskin) Smart Shirt System</em>, operational validation aboard the International Space Station.
          </li>
          <li>
            <strong className="text-white">NASA DONKI / CCMC:</strong> <em>Space Weather Database of Notifications, Knowledge, and Information</em>, Community Coordinated Modeling Center, Goddard Space Flight Center.
          </li>
        </ol>
      </section>
    </div>
  )
}
