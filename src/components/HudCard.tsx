import type { ReactNode } from 'react'

export function HudCard({
  eyebrow,
  title,
  children,
  action,
}: {
  eyebrow?: string
  title?: string
  children?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-900/60[0.04] p-4 shadow-[0_18px_60px_rgba(15,23,42,0.18)] backdrop-blur-sm">
      {(eyebrow || title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            {eyebrow && <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">{eyebrow}</p>}
            {title && <h3 className="mt-2 text-lg font-medium text-white">{title}</h3>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  )
}
