import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { useStore } from './store/useStore'
import BottomNav from './components/BottomNav'
import HomePage from './pages/HomePage'
import LearnPage from './pages/LearnPage'
import PracticePage from './pages/PracticePage'
import StatsPage from './pages/StatsPage'
import CharacterDetailPage from './pages/CharacterDetailPage'

export default function App() {
  const initItems = useStore((s) => s.initItems)
  useEffect(() => { initItems() }, [initItems])

  return (
    <HashRouter>
      <div className="flex flex-col h-full" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/"         element={<HomePage />} />
            <Route path="/learn"    element={<LearnPage />} />
            <Route path="/learn/:id" element={<CharacterDetailPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/stats"    element={<StatsPage />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </HashRouter>
  )
}
