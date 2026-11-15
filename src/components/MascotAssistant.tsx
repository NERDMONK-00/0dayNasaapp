import { useMemo, useState } from 'react'
import { RuleBasedEngine } from '../assistant/RuleBasedEngine'
import { useMissionState } from '../state/store'
import type { RiskScore } from '../types'

interface MascotAssistantProps {
  isOpen: boolean
  onClose: () => void
  riskScore?: RiskScore
}

export function MascotAssistant({ isOpen, onClose, riskScore }: MascotAssistantProps) {
  const { missionState, selectedAstronautId } = useMissionState()
  const [messages, setMessages] = useState<Array<{ role: 'ai' | 'user'; text: string; time: string }>>([
    {
      role: 'ai',
      text: `AstroPulse Clinical Decision Support online. I monitor crew physiological baselines, autonomous EVA readiness, and space weather correlation. How can I assist with Commander ${missionState.astronauts.find((a) => a.id === selectedAstronautId)?.name}?`,
      time: 'T+ 00:00',
    },
  ])
  const [input, setInput] = useState('')

  const engine = useMemo(() => new RuleBasedEngine(), [])
  const astronaut = missionState.astronauts.find((a) => a.id === selectedAstronautId) ?? missionState.astronauts[0]
  const reading = missionState.currentReadings[selectedAstronautId]
  const history = missionState.history[selectedAstronautId] ?? []
  const alerts = missionState.alerts.filter((a) => a.astronautId === selectedAstronautId)
  const baselines = missionState.baselines[selectedAstronautId] ?? {}

  const handleSend = (textToSend?: string) => {
    const query = (textToSend ?? input).trim()
    if (!query) return

    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    const userMsg = { role: 'user' as const, text: query, time: timeStr }

    const isCritical = reading.spo2 < 90 || reading.temp > 38.5 || reading.hr > 120
    const isWarning = reading.hr > 90 || reading.spo2 < 95

    const reply = engine.reply(query, {
      selectedAstronautId,
      selectedAstronaut: astronaut,
      currentReading: reading,
      history,
      alerts,
      baselines,
      allCrew: missionState.astronauts,
      allReadings: missionState.currentReadings,
      missionStatus: isCritical ? 'critical' : isWarning ? 'warning' : 'normal',
    })

    let replyText = reply.text
    if (query.toLowerCase().includes('eva')) {
      replyText = `[EVA READINESS ASSESSMENT]: AstroPulse Risk Index for ${astronaut.name} is currently ${riskScore?.total ?? 18}/100 (${riskScore?.band.toUpperCase()}). ${
        riskScore && riskScore.total < 34
          ? 'STATUS: GO for scheduled Extravehicular Activity. Vitals and suit environmental reserves within nominal baseline envelope.'
          : 'STATUS: CAUTION / NO-GO. Elevated physiological drift or space weather radiation caution active. Recommend postponing EVA airlock depressurization.'
      }`
    } else if (query.toLowerCase().includes('risk')) {
      replyText = `[RISK INDEX FORMULA: R = 0.60·P + 0.20·E + 0.20·W]: Current score: ${riskScore?.total ?? 18}/100. Breakdown: Physiological component P=${riskScore?.physiology ?? 12}, Cabin Environment E=${riskScore?.environment ?? 14}, NASA DONKI Space Weather W=${riskScore?.spaceWeather ?? 0}. Dominant driver: ${riskScore?.dominantFactor ?? 'Nominal'}.`
    }

    const aiMsg = { role: 'ai' as const, text: replyText, time: timeStr }

    setMessages((prev) => [...prev, userMsg, aiMsg])
    setInput('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="flex h-[600px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-blue-200 bg-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/50 px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-slate-900/60 p-0.5 shadow-sm">
              <img src="/logo.png" alt="AstroPulse Mechanical Twin" className="h-full w-full object-contain" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-white">
                Mission Medical Co-Pilot (Orbitkat CDSS)
              </h3>
              <p className="font-mono text-[11px] text-blue-500">
                Earth-Independent Clinical Decision Support • Crew: {astronaut.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Quick Prompt Pills */}
        <div className="flex gap-2 border-b border-white/10 bg-slate-950/50 px-4 py-2 overflow-x-auto text-xs">
          {[
            'Assess EVA Readiness',
            'Explain current Risk Index',
            'Summarize today',
            'Why is HRV low?',
            'Compare crew members',
          ].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSend(prompt)}
              className="rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono text-[11px] text-slate-300 hover:border-blue-300 hover:text-blue-700 transition whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Conversation Message List */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4 text-xs leading-relaxed">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[10px] text-gray-400">
                  {m.role === 'user' ? 'Flight Surgeon' : 'Orbitkat Co-Pilot'}
                </span>
                <span className="font-mono text-[9px] text-gray-400">{m.time}</span>
              </div>
              <div
                className={`max-w-[85%] rounded-xl px-4 py-2.5 ${
                  m.role === 'user'
                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                    : 'bg-slate-950/50 text-slate-100 border border-white/10'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="border-t border-white/10 bg-slate-950/50 p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask medical decision support query (e.g. EVA safety, SANS risk, hypoxia)..."
              className="flex-1 rounded-lg border border-white/15 bg-white/10 px-3 py-2 font-mono text-xs text-white placeholder-gray-400 focus:border-blue-300 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-500 px-4 py-2 font-display text-xs font-semibold text-white hover:bg-blue-600 transition"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
