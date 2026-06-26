import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/',         label: 'Start',     icon: '🏠' },
  { to: '/learn',    label: 'Lernen',    icon: '📖' },
  { to: '/practice', label: 'Üben',      icon: '✏️' },
  { to: '/stats',    label: 'Statistik', icon: '📊' },
]

export default function BottomNav() {
  return (
    <nav
      className="flex border-t border-white/10 bg-[#0f0f1a]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {tabs.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs transition-colors ${
              isActive ? 'text-indigo-400' : 'text-white/40'
            }`
          }
        >
          <span className="text-xl leading-none">{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
