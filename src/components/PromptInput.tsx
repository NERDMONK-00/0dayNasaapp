export function PromptInput() {
  const suggestions = ['Why is my HRV low?', 'Summarize today', 'Am I fit for EVA?']

  return (
    <div className="rounded-[28px] border border-gray-300/80 bg-[#111d2d] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.26em] text-gray-500">Medical co-pilot</p>
        <button className="rounded-full border border-gray-300 bg-gray-100 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-gray-700">
          Voice
        </button>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          aria-label="Medical co-pilot prompt"
          placeholder="Ask the co-pilot for guidance"
          className="h-12 w-full rounded-2xl border border-gray-300 bg-[#0d1624] px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-200 focus:outline-none"
        />
        <button className="h-12 rounded-2xl bg-blue-500 px-5 text-sm font-medium text-gray-900 transition hover:bg-blue-400">
          Send
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            className="rounded-full border border-gray-300 bg-gray-100 px-2.5 py-1.5 text-[11px] text-gray-700"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
