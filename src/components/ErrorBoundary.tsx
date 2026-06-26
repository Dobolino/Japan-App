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
    console.error('App error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-shell flex items-center justify-center p-6 text-center">
          <div className="space-y-4">
            <div className="text-4xl" aria-hidden="true">⚠️</div>
            <h1 className="text-xl font-bold text-white">Etwas ist schiefgelaufen</h1>
            <p className="text-white/50 text-sm">Bitte die Seite neu laden.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-3 rounded-2xl bg-indigo-600 text-white text-sm font-medium"
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
