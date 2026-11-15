export function PromptInput() {
  const suggestions = ['Why is my HRV low?', 'Summarize today', 'Am I fit for EVA?']

  return (
    <div className="rounded-[28px] border border-slate-700/80 bg-[#111d2d] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.26em] text-slate-400">Medical co-pilot</p>
        <button className="rounded-full border border-slate-700 bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300">
          Voice
        </button>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          aria-label="Medical co-pilot prompt"
          placeholder="Ask the co-pilot for guidance"
          className="h-12 w-full rounded-2xl border border-slate-700 bg-[#0d1624] px-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/40 focus:outline-none"
        />
        <button className="h-12 rounded-2xl bg-cyan-500 px-5 text-sm font-medium text-slate-950 transition hover:bg-cyan-400">
          Send
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            className="rounded-full border border-slate-700 bg-slate-800/70 px-2.5 py-1.5 text-[11px] text-slate-300"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
