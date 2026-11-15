export function AboutPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <span className="page-kicker">NASA Space Apps Challenge Submission</span>
        <h1 className="page-title text-2xl sm:text-3xl">
          Scientific Context, Ethics & References
        </h1>
        <p className="mt-1 text-xs font-mono text-slate-300">
          Grounding autonomous crew healthcare in NASA Human Research Program (HRP) literature and Earth-independent medical operations.
        </p>
      </div>

      {/* The Five Hazards of Spaceflight (Section 2 of Brief) */}
      <section className="hud-card">
        <span className="page-kicker">NASA Human Research Program (HRP)</span>
        <h3 className="mt-1 font-display text-lg font-bold text-white">
          The Five Hazards of Deep Space Exploration
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-300">
          NASA organizes spaceflight human health risks under five overarching hazards. As missions venture to the Moon (Artemis) and Mars, distance prevents real-time telemedicine with Houston flight surgeons, necessitating on-board autonomous clinical decision support:
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
          <div className="rounded-xl border border-white/10 bg-slate-950/45 p-3.5 text-slate-200">
            <span className="mb-1 block font-mono font-bold text-blue-400">1. Radiation (RE)</span>
            Galactic cosmic rays (GCRs) and solar energetic particle (SEP) events increase cumulative lifetime cancer risk, central nervous system alterations, and cardiovascular damage. AstroPulse integrates live DONKI space-weather alerts to safeguard EVA sorties.
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-950/45 p-3.5 text-slate-200">
            <span className="mb-1 block font-mono font-bold text-blue-400">2. Isolation & Confinement (IC)</span>
            ISS crews witness 16 sunrises/sunsets every 24 hours, fragmenting circadian sleep architecture. Chronic sleep debt impairs executive cognitive speed and teamwork. AstroPulse models individual sleep debt and autonomic HRV recovery.
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-950/45 p-3.5 text-slate-200">
            <span className="mb-1 block font-mono font-bold text-emerald-400">3. Distance from Earth (DE)</span>
            Mars communication latency reaches up to 20 minutes one-way, rendering ground-in-the-loop clinical intervention impossible during acute emergencies. AstroPulse executes 100% locally in the browser with zero cloud dependencies.
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-950/45 p-3.5 text-slate-200">
            <span className="mb-1 block font-mono font-bold text-amber-400">4. Gravity Fields (GF)</span>
            Microgravity induces immediate cephalad fluid shifting (puffy face syndrome), reducing circulating blood volume by 15-20% and driving bone mineral density loss of 1.0-1.5% per month in load-bearing skeletal structures.
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-950/45 p-3.5 text-slate-200">
            <span className="mb-1 block font-mono font-bold text-rose-400">5. Hostile / Closed Environments (CH)</span>
            Habitats and spacesuits are sealed ecosystems where toxic trace gases and carbon dioxide can rapidly build up. AstroPulse fuses cabin pCO₂ and temperature directly into its unified Risk Index.
          </div>

          <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/5 p-3.5 text-slate-200">
            <span className="mb-1 block font-mono font-bold text-emerald-300">Clinical Priority: SANS Syndrome</span>
            Spaceflight-Associated Neuro-ocular Syndrome (SANS) manifests as optic disc edema, globe flattening, and hyperopic vision shifts caused by venous headward fluid stagnation. Continuous multi-signal baseline tracking flags risk factors early.
          </div>
        </div>
      </section>

      {/* Earth Benefit Angle (Section 9 of Brief & Paper) */}
      <section className="hud-card border-emerald-400/30">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-300">
            Dual-Use Innovation • Terrestrial Healthcare
          </span>
        </div>
        <h3 className="mt-1 font-display text-lg font-bold text-white">
          Earth Benefit: Remote High-Altitude & Rural Medicine
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-300">
          The exact operational constraints of deep space missions—<strong className="text-white">zero cloud connectivity, severe power limits, delayed expert access, and extreme physical environments</strong>—mirror the realities of remote and mountainous clinics on Earth, including isolated health posts across the <strong className="text-white">Himalayas in Nepal</strong>.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-slate-300">
          AstroPulse's low-power, browser-based personal baseline engine allows rural community health workers to monitor patients with high-altitude pulmonary edema (HAPE), acute respiratory distress, or sepsis without requiring internet or centralized hospital databases.
        </p>
      </section>

      {/* Section 8 Limitations and Ethics */}
      <section className="hud-card">
        <span className="page-kicker">Section 8 of Technical Paper</span>
        <h3 className="mt-1 font-display text-lg font-bold text-white">
          Limitations, Privacy & Clinical Ethics
        </h3>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs text-slate-200">
          <div className="rounded-lg border border-white/10 bg-slate-950/45 p-3">
            <strong className="mb-1 block text-amber-300">Decision Support, Not Diagnosis</strong>
            AstroPulse provides clinical decision support to augment crew autonomy; it is not a certified medical device and does not replace professional flight surgeon judgment.
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-950/45 p-3">
            <strong className="mb-1 block text-blue-400">Simulated Physiology Data</strong>
            All vital readings in this prototype are generated by the mathematical physiology simulator (Section 4.1). Validation on public physiological repositories (e.g. PhysioNet) and human analog isolation studies is planned for Phase 2.
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-950/45 p-3">
            <strong className="mb-1 block text-emerald-300">Crew Autonomy & Local Privacy</strong>
            Medical data is strictly encrypted and held locally on the spacecraft. Only high-level risk summaries and critical alerts are queued for transmission to Earth ground control.
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-950/45 p-3">
            <strong className="mb-1 block text-blue-400">Combating Alert Fatigue</strong>
            Tiered thresholds, persistence rules (m of n), and multi-signal confirmation specifically mitigate "cry wolf" alarm fatigue, keeping crew trust high.
          </div>
        </div>
      </section>

      {/* Academic References & Systems Library Link */}
      <section className="hud-card">
        <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-3 sm:flex-row sm:items-center">
          <div>
            <span className="page-kicker">Section 13 • Scientific Citations & Engineering Blueprints</span>
            <h3 className="mt-0.5 font-display text-lg font-bold text-white">
              Literature & Official NASA Reference Library
            </h3>
          </div>
          <a
            href="/references"
            className="hud-btn hud-btn-secondary flex items-center gap-1.5 self-start text-xs font-mono sm:self-auto"
          >
            <span>Explore 24+ NASA & Research Citations</span>
            <span>→</span>
          </a>
        </div>

        <ol className="mt-4 list-decimal list-inside space-y-2.5 font-mono text-xs leading-relaxed text-slate-300">
          <li>
            <strong className="text-white">NASA NTRS 20220017869:</strong> <em>Exploration Medical Capability (ExMC) Clinical Decision Support System Architecture Recommendation</em>, Medical Data Architecture (MDA).
          </li>
          <li>
            <strong className="text-white">NASA NTRS 20200000666:</strong> <em>Design of Autonomous Medical Response Agent (AMRA) Aggregate Information Dashboard (AID)</em>, user experience patterns for multi-signal fusion.
          </li>
          <li>
            <strong className="text-white">NASA NTRS 20230016189:</strong> <em>Earth Independent Medical Operations (EIMO)</em>, software requirements for deep-space autonomous care.
          </li>
          <li>
            <strong className="text-white">NASA Twins Study:</strong> Garrett-Bakelman, F. E., et al. (2019). <em>The NASA Twins Study: A multidimensional analysis of a year-long human spaceflight</em>. Science, 364(6436).
          </li>
          <li>
            <strong className="text-white">Canadian Space Agency / Carré Technologies:</strong> <em>Bio-Monitor (Astroskin) Smart Shirt</em>, operational validation aboard the International Space Station and Lunar Gateway.
          </li>
          <li>
            <strong className="text-white">NASA NTRS 20200000615 & 20205011448:</strong> <em>MedICS Clinical Decision Support System</em> &amp; <em>Medical-701 Cognitive Workload OODA Reduction</em>.
          </li>
        </ol>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-xs">
          <span className="text-slate-400">Created by <strong className="text-blue-400">Ayush Neupane</strong> (Nepal)</span>
          <a href="/team" className="font-mono text-blue-400 transition hover:text-blue-300">
            View Creator Profile & Details →
          </a>
        </div>
      </section>
    </div>
  )
}
