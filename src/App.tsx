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
      <div
        style={{
          height: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          background: '#0f0f1a',
          // Push content away from Dynamic Island (top) and home bar (bottom)
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {/*
          height: 0 + flex: 1 is the key trick:
          flex grows main to fill space, AND children with h-full
          correctly resolve to the grown height (not 0).
        */}
        <main style={{ flex: 1, height: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/"          element={<HomePage />} />
            <Route path="/learn"     element={<LearnPage />} />
            <Route path="/learn/:id" element={<CharacterDetailPage />} />
            <Route path="/practice"  element={<PracticePage />} />
            <Route path="/stats"     element={<StatsPage />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </HashRouter>
  )
}
