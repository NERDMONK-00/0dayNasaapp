const steps = [
  ['Sensors', 'Data is sampled from the mission simulator and later from onboard hardware through the shared DataSource interface.'],
  ['Edge processing', 'Each crew member’s values are normalized and checked against their own baseline range.'],
  ['Personal baseline', 'The app keeps rolling means and standard deviations so the model learns the astronaut’s true norm.'],
  ['Anomaly detection', 'Z-scores and rule-based thresholds identify deviations before they become mission-critical.'],
  ['Explainable alerts', 'Warnings tell you why there is risk and what action to take next.'],
]

export function HowItWorksPage() {
  return (
    <div className="page-shell">
      <div className="page-grid route-how pb-8">
        <div className="space-y-4">
          <section className="page-panel">
            <p className="page-kicker">Workflow</p>
            <h1 className="page-title">How it works</h1>
          </section>

          <div className="space-y-4">
            {steps.map(([title, text], index) => (
              <div key={title} className="toon-card">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border-3 border-[var(--outline)] bg-[#4da3ff]/15 text-sm font-medium text-[#dfeeff]">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-slate-300">Step {index + 1}</p>
                    <h3 className="mt-2 text-2xl font-medium text-white">{title}</h3>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">{text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="page-panel">
          <div className="space-y-4">
            <div className="rounded-[22px] border-3 border-[var(--outline)] bg-[rgba(7,18,29,0.8)] p-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-slate-300">Mission signal</p>
              <div className="mt-3 text-4xl font-bold text-cyan-300">98.4%</div>
              <p className="mt-2 text-sm text-slate-300">Nominal oxygen saturation across the active crew.</p>
            </div>
            <div className="rounded-[22px] border-3 border-[var(--outline)] bg-[rgba(7,18,29,0.8)] p-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-slate-300">Crew baseline</p>
              <div className="mt-3 text-2xl font-bold text-amber-300">+3.4% drift</div>
              <p className="mt-2 text-sm text-slate-300">This is the kind of pattern the system flags for review before true risk emerges.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
