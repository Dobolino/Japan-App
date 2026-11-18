import { Link, useLocation } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { HomeIcon, CompassIcon, PersonIcon } from '@/components/icons/UiIcons'

const tabs = [
  { to: '/', label: 'Heute', Icon: HomeIcon },
  { to: '/explore', label: 'Entdecken', Icon: CompassIcon },
  { to: '/me', label: 'Ich', Icon: PersonIcon },
]
export default function BottomNav() {
  const { pathname, search } = useLocation()
  const session = useStore((state) => state.activeSession)
  const active =
    pathname === '/'
      ? '/'
      : ['/me', '/stats', '/settings'].includes(pathname) ||
          new URLSearchParams(search).get('from') === 'collection'
        ? '/me'
        : '/explore'
  if (pathname.startsWith('/lesson/') || (pathname === '/practice' && session)) return null
  return (
    <nav className="bottom-nav" aria-label="Hauptnavigation">
      <div className="bottom-nav-inner">
        {tabs.map(({ to, label, Icon }) => (
          <Link
            key={to}
            to={to}
            aria-current={active === to ? 'page' : undefined}
            className={`bottom-nav-item ${active === to ? 'bottom-nav-item--active' : ''}`}
          >
            <span className="bottom-nav-icon">
              <Icon />
            </span>
            <span className="bottom-nav-label">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
