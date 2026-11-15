import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/monitor', label: 'Crew' },
  { to: '/status', label: 'Alerts' },
  { to: '/report', label: 'Trends' },
  { to: '/checks', label: 'Reports' },
  { to: '/about', label: 'Settings' },
]

export function Sidebar() {
  return (
    <aside className="rounded-[32px] border border-slate-700/60 bg-[#0d1728]/90 p-4 shadow-[0_30px_80px_rgba(3,7,18,0.9)] backdrop-blur-xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.36em] text-slate-500">Mission</p>
          <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.07em] text-white">AstraOps</h2>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-500/10 text-[11px] font-semibold text-cyan-200">
          AO
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex w-full items-center rounded-2xl border px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'border-cyan-400/40 bg-cyan-500/10 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.15)]'
                  : 'border-transparent bg-[#111d2d] text-slate-300 hover:border-slate-700 hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 rounded-[24px] border border-slate-700/80 bg-[#111d2d] p-4">
        <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Mission day</p>
        <p className="mt-3 text-2xl font-semibold text-white">42</p>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-300">
          <span>Link status</span>
          <span className="text-emerald-300">Online</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-300">
          <span>Last sync</span>
          <span>11:45</span>
        </div>
      </div>
    </aside>
  )
}
