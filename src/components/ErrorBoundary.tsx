import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-shell flex items-center justify-center px-6">
          <div className="card-surface p-6 text-center max-w-sm">
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Etwas ist schiefgelaufen</h1>
            <p className="text-[var(--text-secondary)] text-sm mt-2 font-semibold">Bitte die Seite neu laden.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-duo mt-4 w-full"
            >
              Neu laden
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
