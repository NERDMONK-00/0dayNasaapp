const steps = [
  ['Sensors', 'Data is sampled from the mission simulator and later from onboard hardware through the shared DataSource interface.'],
  ['Edge processing', 'Each crew member’s values are normalized and checked against their own baseline range.'],
  ['Personal baseline', 'The app keeps rolling means and standard deviations so the model learns the astronaut’s true norm.'],
  ['Anomaly detection', 'Z-scores and rule-based thresholds identify deviations before they become mission-critical.'],
  ['Explainable alerts', 'Warnings tell you why there is risk and what action to take next.'],
]

export function HowItWorksPage() {
  return (
    <div className="space-y-6 px-2 pb-10 pt-6 md:px-4">
      <section className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl md:p-6">
        <p className="text-[10px] uppercase tracking-[0.32em] text-[#9ec9ff]">Workflow</p>
        <h1 className="mt-3 text-4xl font-light tracking-[-0.07em] text-white md:text-5xl">How it works</h1>
      </section>

      <div className="space-y-4">
        {steps.map(([title, text], index) => (
          <div key={title} className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-[#4da3ff]/30 bg-[#4da3ff]/10 text-sm font-medium text-[#dfeeff]">
                {index + 1}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Step {index + 1}</p>
                <h3 className="mt-2 text-2xl font-medium text-white">{title}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">{text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
