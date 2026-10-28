import { NavLink } from 'react-router-dom'
import { HomeIcon, BookIcon, PracticeIcon, ReadingIcon, ChartIcon } from '@/components/icons/UiIcons'

const tabs = [
  { to: '/', label: 'Heute', Icon: HomeIcon },
  { to: '/learn', label: 'Lernen', Icon: BookIcon },
  { to: '/practice', label: 'Üben', Icon: PracticeIcon },
  { to: '/immerse', label: 'Lesen', Icon: ReadingIcon },
  { to: '/stats', label: 'Fortschritt', Icon: ChartIcon },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Hauptnavigation">
      <div className="bottom-nav-inner">
        {tabs.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'bottom-nav-item--active' : ''}`}
          >
            <span className="bottom-nav-icon">
              <Icon />
            </span>
            <span className="bottom-nav-label">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
