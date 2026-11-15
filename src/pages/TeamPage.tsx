export function TeamPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <span className="page-kicker">NASA Space Apps Challenge • Team & Engineering Leadership</span>
        <h1 className="page-title text-2xl sm:text-3xl">
          Creator & Core Architecture Team
        </h1>
        <p className="mt-1 text-xs font-mono text-slate-300">
          Pioneering autonomous edge computing and clinical decision support for deep space exploration and remote terrestrial health.
        </p>
      </div>

      {/* Main Profile Showcase Card */}
      <section className="hud-card relative overflow-hidden border-blue-400/20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8">
        <div className="pointer-events-none absolute right-0 top-0 -mr-20 -mt-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start">
          {/* Avatar Column */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="group relative h-44 w-44 overflow-hidden rounded-2xl border-2 border-blue-400/30">
              <img
                src="/team/ayush.jpg"
                alt="Ayush Neupane - Lead Architect"
                className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-2 left-2 rounded border border-white/10 bg-slate-950/70 px-2 py-0.5 font-mono text-[10px] text-blue-300 backdrop-blur-sm">
                ACTIVE CREW
              </div>
            </div>

            {/* External Links Below Avatar */}
            <div className="mt-4 flex w-full max-w-[176px] flex-col gap-2">
              <a
                href="https://github.com/NERDMONK-00"
                target="_blank"
                rel="noopener noreferrer"
                className="hud-btn hud-btn-secondary flex w-full items-center justify-center gap-2 py-1.5 text-xs font-mono"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub Profile</span>
              </a>

              <a
                href="https://github.com/NERDMONK-00/0dayNasaapp"
                target="_blank"
                rel="noopener noreferrer"
                className="hud-btn hud-btn-secondary flex w-full items-center justify-center gap-1.5 py-1.5 text-[11px] font-mono"
              >
                <span>🚀 Project Repo</span>
              </a>
            </div>
          </div>

          {/* Details Column */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
                  Ayush Neupane
                </h2>
                <span className="hud-chip hud-chip-ok font-mono text-[10px]">
                  LEAD ARCHITECT
                </span>
                <span className="hud-chip hud-chip-warn font-mono text-[10px]">
                  NASA SPACE APPS 2026
                </span>
              </div>
              <p className="mt-1 font-mono text-xs text-blue-300">
                Full-Stack Systems Engineer & Edge AI Developer • Nepal 🇳🇵
              </p>
            </div>

            <p className="text-sm leading-relaxed text-slate-300">
              Architect and developer of <strong className="text-white">AstroPulse</strong>. Passionate about solving autonomous healthcare challenges for long-duration deep space exploration where astronauts will be isolated by up to 20 minutes of one-way communication latency.
            </p>

            {/* Core Responsibilities & Engineering Milestones */}
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3.5">
                <span className="mb-1 block font-mono font-bold text-blue-400">
                  1. Zero-Cloud Autonomous Architecture
                </span>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  Engineered the layered system (<code className="font-mono text-blue-300">DataSource</code> → processing → state → UI) ensuring all vital tracking, anomaly detection, and clinical guidance run 100% locally in the browser with zero cloud dependencies.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3.5">
                <span className="mb-1 block font-mono font-bold text-blue-400">
                  2. 3D Biomechanical Telemetry Twin
                </span>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  Built the procedural 3D Extravehicular Mobility Unit (EMU) spacesuit using Three.js and React Three Fiber, featuring heartbeat-reactive chest DCM LEDs, gold EVA visor reflections, PLSS life-support pack, and interactive subsystem diagnostics.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3.5">
                <span className="mb-1 block font-mono font-bold text-emerald-300">
                  3. Personal Baseline & Multi-Signal Detection
                </span>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  Implemented adaptive rolling baselines with robust MAD z-scores, CUSUM cumulative sum drift detection, and persistence rules (m of n) to eliminate false alarms and combat astronaut alert fatigue.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3.5">
                <span className="mb-1 block font-mono font-bold text-amber-300">
                  4. Risk Fusion & EVA Readiness Matrix
                </span>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  Formulated the AstroPulse Unified Risk Index ($R = 0.60\cdot P + 0.20\cdot E + 0.20\cdot W$) fusing physiology, cabin environment, and NASA DONKI space weather into an actionable 12-hour spacewalk planning matrix.
                </p>
              </div>
            </div>

            {/* Dual-Use Terrestrial Impact in Nepal */}
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/5 p-4 text-xs">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="font-display text-sm font-bold text-emerald-300">
                  Dual-Use Mission: High-Altitude Healthcare in Nepal
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                "The severe operational constraints of a Mars transit capsule—zero internet access, delayed clinical guidance, and extreme environments—are identical to the challenges faced by remote health posts across the <strong className="text-white">Himalayan mountain regions of Nepal</strong>. By designing AstroPulse as an autonomous, low-power edge platform, this same software can empower rural health workers to detect High-Altitude Pulmonary Edema (HAPE) and sepsis days before a specialist is reachable."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack & Framework Highlights */}
      <section className="hud-card font-mono text-xs">
        <span className="page-kicker">Technical Stack & Engineering Standards</span>
        <h3 className="mt-1 mb-3 font-display text-base font-bold text-white">
          Technologies Deployed in AstroPulse
        </h3>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <div className="rounded-lg border border-white/10 bg-slate-900/70 p-2.5">
            <span className="block text-[10px] text-slate-400">CORE FRAMEWORK</span>
            <span className="font-bold text-blue-300">React 19 + TypeScript</span>
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-900/70 p-2.5">
            <span className="block text-[10px] text-slate-400">BUILD TOOL</span>
            <span className="font-bold text-blue-300">Vite 8.3 + Tailwind CSS</span>
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-900/70 p-2.5">
            <span className="block text-[10px] text-slate-400">3D GRAPHICS</span>
            <span className="font-bold text-emerald-300">Three.js + R3F + Drei</span>
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-900/70 p-2.5">
            <span className="block text-[10px] text-slate-400">DATA VIZ</span>
            <span className="font-bold text-amber-300">Recharts Telemetry</span>
          </div>
        </div>
      </section>
    </div>
  )
}
