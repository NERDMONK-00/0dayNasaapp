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
    <header className="sticky top-0 z-40 border-b-2 border-[var(--outline)] bg-[rgba(11,11,43,0.62)] backdrop-blur-lg">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-3 border-[var(--outline)] bg-[#4de1ff]/15 text-xs font-medium text-[#dfeeff] shadow-[var(--shadow)]">
            ISS
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-slate-300">AstraOps</p>
            <p className="text-sm font-medium text-white">Mission health</p>
          </div>
        </div>

        <nav className="hidden items-center gap-2 rounded-full border-3 border-[var(--outline)] bg-[rgba(20,19,74,0.55)] px-2 py-1.5 shadow-[var(--shadow)] md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-[11px] font-medium tracking-[0.18em] uppercase transition ${
                  isActive ? 'bg-[#4de1ff]/15 text-[#dfeeff]' : 'text-slate-200 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-full border-3 border-[var(--outline)] bg-[#3ddc97]/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-emerald-200 shadow-[var(--shadow)] md:block">
            Link stable
          </div>
          <button
            type="button"
            aria-label="Open navigation menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border-3 border-[var(--outline)] bg-[rgba(20,19,74,0.6)] text-lg text-white shadow-[var(--shadow)] md:hidden"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  )
}
