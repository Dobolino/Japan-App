import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Start', icon: '⊞' },
  { to: '/learn', label: 'Lernen', icon: '本' },
  { to: '/practice', label: 'Üben', icon: '✎' },
  { to: '/stats', label: 'Statistik', icon: '◈' },
]

export default function BottomNav() {
  return (
    <nav
      className="flex border-t border-white/8 bottom-nav"
      aria-label="Hauptnavigation"
    >
      {tabs.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          aria-label={label}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors ${
              isActive ? 'text-indigo-400' : 'text-white/30'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`text-[22px] leading-none jp transition-transform ${isActive ? 'scale-110' : ''}`} aria-hidden="true">
                {icon}
              </span>
              <span className={`text-[10px] font-medium ${isActive ? 'text-indigo-400' : 'text-white/30'}`}>{label}</span>
              {isActive && <span className="w-1 h-1 rounded-full bg-indigo-400" aria-hidden="true" />}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
