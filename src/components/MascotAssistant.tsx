import { useEffect, useMemo, useRef, useState } from 'react'
import { useDashboardContext } from '../hooks/useDashboardContext'

const SKETCHFAB_EMBED_URL =
  'https://sketchfab.com/models/777cc66d50da4f9ab4d12e7971c73c08/embed?ui_infos=0&ui_watermark=0&autostart=1&transparent=1'

type AssistantMessage = {
  id: number
  role: 'assistant' | 'user'
  text: string
  tag?: 'info' | 'normal' | 'warning' | 'critical'
}

const assistantSuggestions = [
  'Summarize today',
  'Why is my HRV low?',
  'Explain this alert',
  'What should I do now?',
]

function isReducedMotionPreferred() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function FallbackMascot({ mood }: { mood: 'normal' | 'warning' | 'critical' }) {
  const moodClasses = {
    normal: 'from-emerald-300 to-cyan-300',
    warning: 'from-amber-300 to-orange-300',
    critical: 'from-rose-300 to-red-400',
  }

  return (
    <div className="relative flex h-16 w-16 items-center justify-center rounded-[24px] border border-white/15 bg-slate-900/70 shadow-[0_18px_45px_rgba(15,23,42,0.45)] backdrop-blur-md">
      <div className={`absolute inset-0 rounded-[24px] bg-gradient-to-br ${moodClasses[mood]} opacity-25`} />
      <div className="relative text-3xl">🐈</div>
      <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-slate-900 bg-emerald-400" />
    </div>
  )
}

function MascotModel({ mood }: { mood: 'normal' | 'warning' | 'critical' }) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleOffline = () => setFailed(!navigator.onLine)
    handleOffline()
    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOffline)
    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOffline)
    }
  }, [])

  if (failed || !navigator.onLine) {
    return <FallbackMascot mood={mood} />
  }

  return (
    <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-[24px] border border-white/15 bg-slate-900/70 shadow-[0_18px_45px_rgba(15,23,42,0.45)] backdrop-blur-md">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 text-2xl">🐈</div>
      )}
      <iframe
        title="Orbitkat mascot preview"
        src={SKETCHFAB_EMBED_URL}
        className="h-full w-full border-0"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        loading="lazy"
      />
      <div className="pointer-events-none absolute right-2 top-2 h-3 w-3 rounded-full border border-slate-900 bg-emerald-400" />
    </div>
  )
}

function MessageBubble({ message }: { message: AssistantMessage }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6 ${
          isUser
            ? 'bg-cyan-500/20 text-cyan-50 ring-1 ring-cyan-400/30'
            : 'bg-slate-800/80 text-slate-100 ring-1 ring-slate-700/80'
        }`}
      >
        {message.text}
      </div>
    </div>
  )
}

function SuggestionChips({ onSelect }: { onSelect: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {assistantSuggestions.map((item) => (
        <button
          type="button"
          key={item}
          onClick={() => onSelect(item)}
          className="rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1.5 text-xs text-slate-200 transition hover:border-cyan-400/30 hover:bg-cyan-500/10"
        >
          {item}
        </button>
      ))}
    </div>
  )
}

function ChatPanel({ onClose }: { onClose: () => void }) {
  const { engine, context } = useDashboardContext()
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 1,
      role: 'assistant',
      text: 'Hello! I’m Orbitkat, your mission-support mascot. I can summarize today, explain alerts, and compare crew members.',
      tag: 'info',
    },
  ])
  const [draft, setDraft] = useState('')
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const sendMessage = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return

    const nextUserMessage: AssistantMessage = { id: Date.now(), role: 'user', text: trimmed }
    const reply = engine.reply(trimmed, context)
    const nextAssistantMessage: AssistantMessage = { id: Date.now() + 1, role: 'assistant', text: reply.text, tag: context.missionStatus }

    setMessages((previous) => [...previous, nextUserMessage, nextAssistantMessage])
    setDraft('')
  }

  const mood: 'normal' | 'warning' | 'critical' = context.missionStatus

  return (
    <aside
      className="fixed bottom-24 right-4 z-[120] flex h-[min(560px,calc(100vh-6rem))] w-[min(380px,calc(100vw-1rem))] flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[#091827]/85 shadow-[0_28px_90px_rgba(2,6,23,0.7)] backdrop-blur-xl md:bottom-20 md:right-5"
      role="dialog"
      aria-modal="false"
      aria-label="Orbitkat assistant panel"
    >
      <div className="flex items-center justify-between border-b border-slate-700/80 bg-slate-900/80 px-4 py-3">
        <div className="flex items-center gap-3">
          <MascotModel mood={mood} />
          <div>
            <p className="text-sm font-semibold text-white">Orbitkat</p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">Mission AI</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Minimize assistant"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-lg text-slate-200"
          >
            −
          </button>
        </div>
      </div>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-[#091827]/60 p-3" aria-live="polite">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      <div className="border-t border-slate-700/80 bg-slate-900/80 p-3">
        <SuggestionChips onSelect={sendMessage} />
        <div className="mt-3 flex items-center gap-2">
          <input
            aria-label="Assistant prompt"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') sendMessage(draft)
            }}
            placeholder="Ask Orbitkat..."
            className="h-11 flex-1 rounded-full border border-slate-700 bg-slate-800/80 px-3 text-sm text-white outline-none ring-0 placeholder:text-slate-400 focus:border-cyan-400/60"
          />
          <button
            type="button"
            aria-label="Send message"
            onClick={() => sendMessage(draft)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-500/20 text-lg text-cyan-100 ring-1 ring-cyan-400/30"
          >
            ↑
          </button>
          <button
            type="button"
            aria-label="Voice prompt"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-lg text-slate-200"
          >
            ◉
          </button>
        </div>
      </div>
    </aside>
  )
}

export function MascotAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const reducedMotion = useMemo(() => isReducedMotionPreferred(), [])
  const { context } = useDashboardContext()
  const mood: 'normal' | 'warning' | 'critical' = context.missionStatus

  useEffect(() => {
    setIsReady(true)
  }, [])

  if (!isReady) return null

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          aria-label="Open Orbitkat assistant"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-[110] flex h-20 w-20 items-center justify-center rounded-[28px] border border-white/10 bg-slate-900/80 p-2 shadow-[0_18px_50px_rgba(2,6,23,0.6)] backdrop-blur-xl transition-transform hover:scale-[1.02] md:bottom-5 md:right-5"
          style={{
            animation: reducedMotion ? 'none' : 'float 3.5s ease-in-out infinite',
          }}
        >
          <div className="relative">
            <MascotModel mood={mood} />
            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-slate-900 bg-emerald-400" />
          </div>
        </button>
      )}

      {isOpen && <ChatPanel onClose={() => setIsOpen(false)} />}
    </>
  )
}
