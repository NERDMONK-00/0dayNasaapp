export function BodyModel3D() {
  return (
    <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-[30px] border border-slate-700/80 bg-[radial-gradient(circle_at_top,_rgba(90,169,255,0.2),_transparent_30%),linear-gradient(135deg,_#0d1728,_#101c2d_48%,_#0b1524)] p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.06),_transparent_55%)]" />

      <div className="relative h-56 w-48 rounded-[26px] border border-slate-600/70 bg-gradient-to-b from-slate-200/90 via-slate-300/80 to-slate-500/90 shadow-[0_25px_60px_rgba(148,163,184,0.25)]">
        <div className="absolute left-1/2 top-6 h-12 w-12 -translate-x-1/2 rounded-full border border-slate-300/60 bg-white/60" />
        <div className="absolute left-1/2 top-20 h-20 w-12 -translate-x-1/2 rounded-full bg-slate-200/70" />
        <div className="absolute left-1/2 top-36 h-24 w-6 -translate-x-1/2 rounded-full bg-slate-200/70" />
        <div className="absolute left-1/2 top-20 h-24 w-20 -translate-x-1/2 rounded-[28px] border border-sky-300/60 bg-sky-300/30" />
        <div className="absolute left-1/2 top-[92px] h-9 w-9 -translate-x-1/2 rounded-full border border-cyan-400/60 bg-cyan-400/30 shadow-[0_0_24px_rgba(34,211,238,0.6)]" />
        <div className="absolute left-1/2 top-[128px] h-12 w-12 -translate-x-1/2 rounded-full border border-rose-400/60 bg-rose-400/20 shadow-[0_0_24px_rgba(248,113,113,0.5)]" />
        <div className="absolute left-1/2 top-[165px] h-10 w-10 -translate-x-1/2 rounded-full border border-amber-300/50 bg-amber-300/20 shadow-[0_0_24px_rgba(251,191,36,0.6)]" />
      </div>
    </div>
  )
}
