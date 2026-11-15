import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/astronauts', label: 'Astronaut' },
  { to: '/test', label: 'Test' },
  { to: '/results', label: 'Results' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/about', label: 'About' },
]

export function SpaceNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#02070d]/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#4da3ff]/40 bg-[#4da3ff]/10 text-xs font-medium text-[#dfeeff]">
            ISS
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-slate-400">AstraOps</p>
            <p className="text-sm font-medium text-white">Mission health</p>
          </div>
        </div>

        <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1.5 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-[11px] font-medium tracking-[0.18em] uppercase transition ${
                  isActive ? 'bg-[#4da3ff]/15 text-[#dfeeff]' : 'text-slate-300 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-emerald-200 md:block">
            Link stable
          </div>
          <button
            type="button"
            aria-label="Open navigation menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-white md:hidden"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  )
}
