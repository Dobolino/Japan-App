import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Start', icon: '⊞' },
  { to: '/learn', label: 'Lernen', icon: '本' },
  { to: '/immerse', label: 'Lesen', icon: '読' },
  { to: '/practice', label: 'Üben', icon: '✎' },
  { to: '/stats', label: 'Stats', icon: '◈' },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Hauptnavigation">
      <div className="bottom-nav-inner">
        {tabs.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            aria-label={label}
            className={({ isActive }) =>
              `bottom-nav-item ${isActive ? 'bottom-nav-item--active' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`text-[22px] leading-none jp transition-transform ${isActive ? 'scale-110' : ''}`} aria-hidden="true">
                  {icon}
                </span>
                <span className="bottom-nav-label">{label}</span>
                {isActive && <span className="bottom-nav-dot" aria-hidden="true" />}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
