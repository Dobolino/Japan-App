import { Link } from 'react-router-dom'
import { SettingsIcon } from '@/components/icons/UiIcons'

interface Props {
  eyebrow: string
  title: string
  description?: string
  showSettings?: boolean
}

export default function PageHeader({ eyebrow, title, description, showSettings = true }: Props) {
  return (
    <header className="page-heading">
      <div className="min-w-0">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {showSettings && (
        <Link to="/settings" className="icon-button shrink-0" aria-label="Einstellungen">
          <SettingsIcon />
        </Link>
      )}
    </header>
  )
}
