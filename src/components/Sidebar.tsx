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
    <aside className="rounded-[32px] border border-gray-300/60 bg-[#0d1728]/90 p-4 shadow-[0_30px_80px_rgba(3,7,18,0.9)] backdrop-blur-sm">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.36em] text-gray-400">Mission</p>
          <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.07em] text-gray-900">AstraOps</h2>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-200 bg-blue-500/10 text-[11px] font-semibold text-blue-700">
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
                  ? 'border-blue-200 bg-blue-500/10 text-cyan-100 '
                  : 'border-transparent bg-[#111d2d] text-gray-700 hover:border-gray-300 hover:text-gray-900'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 rounded-[24px] border border-gray-300/80 bg-[#111d2d] p-4">
        <p className="text-[10px] uppercase tracking-[0.24em] text-gray-400">Mission day</p>
        <p className="mt-3 text-2xl font-semibold text-gray-900">42</p>
        <div className="mt-4 flex items-center justify-between text-xs text-gray-700">
          <span>Link status</span>
          <span className="text-emerald-700">Online</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-gray-700">
          <span>Last sync</span>
          <span>11:45</span>
        </div>
      </div>
    </aside>
  )
}
