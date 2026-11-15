import { NavLink, Outlet } from 'react-router-dom'
import SceneBackdrop from './SceneBackdrop'

const links = [
  ['/', 'Home'],
  ['/astronauts', 'Astronauts'],
  ['/test', 'Test'],
  ['/results', 'Results'],
  ['/how-it-works', 'How it works'],
  ['/about', 'About'],
]

export default function AppShell() {
  return (
    <div className="relative min-h-screen">
      <div className="starfield" />
      <SceneBackdrop />

      <header className="sticky top-0 z-20 px-4 pt-4">
        <nav className="toon-card mx-auto flex max-w-5xl items-center gap-2 overflow-x-auto !py-2">
          <span className="pr-2 font-display text-xl font-bold">AstroPulse</span>
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `toon-chip whitespace-nowrap ${isActive ? 'toon-warn' : 'bg-transparent'}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-6">
        <Outlet />
      </main>
    </div>
  )
}
