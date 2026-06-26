import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { useStoreHydration } from '@/hooks/useStoreHydration'
import ErrorBoundary from '@/components/ErrorBoundary'
import BottomNav from '@/components/BottomNav'
import HomePage from '@/pages/HomePage'
import LearnPage from '@/pages/LearnPage'
import PracticePage from '@/pages/PracticePage'
import StatsPage from '@/pages/StatsPage'
import CharacterDetailPage from '@/pages/CharacterDetailPage'

function AppRoutes() {
  const initItems = useStore((s) => s.initItems)
  const hydrated = useStoreHydration()

  useEffect(() => {
    if (hydrated) initItems()
  }, [hydrated, initItems])

  if (!hydrated) {
    return (
      <div className="app-shell flex items-center justify-center">
        <p className="text-white/40 text-sm" role="status">Lädt…</p>
      </div>
    )
  }

  return (
    <HashRouter>
      <div className="app-shell">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/learn/:id" element={<CharacterDetailPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </HashRouter>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  )
}
