import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { useStoreHydration } from '@/hooks/useStoreHydration'
import { useTheme } from '@/hooks/useTheme'
import { unlockAudio } from '@/utils/audio'
import ErrorBoundary from '@/components/ErrorBoundary'
import BottomNav from '@/components/BottomNav'
import StorageNotice from '@/components/StorageNotice'
import HomePage from '@/pages/HomePage'
import LearnPage from '@/pages/LearnPage'
import PracticePage from '@/pages/PracticePage'
import StatsPage from '@/pages/StatsPage'
import CharacterDetailPage from '@/pages/CharacterDetailPage'
import ImmersePage from '@/pages/ImmersePage'
import SettingsPage from '@/pages/SettingsPage'
import CoursePage from '@/pages/CoursePage'
import LessonPage from '@/pages/LessonPage'
import MissionsPage from '@/pages/MissionsPage'
import TrainingPage from '@/pages/TrainingPage'
import NotebookPage from '@/pages/NotebookPage'

function AppRoutes() {
  const hydrated = useStoreHydration()
  useTheme()

  useEffect(() => {
    const onInteract = () => {
      unlockAudio()
      window.removeEventListener('pointerdown', onInteract)
      window.removeEventListener('keydown', onInteract)
    }
    window.addEventListener('pointerdown', onInteract, { passive: true })
    window.addEventListener('keydown', onInteract)
    return () => {
      window.removeEventListener('pointerdown', onInteract)
      window.removeEventListener('keydown', onInteract)
    }
  }, [])

  if (!hydrated) {
    return (
      <div className="app-shell flex items-center justify-center">
        <p className="text-[var(--text-muted)] text-sm" role="status">
          Lädt…
        </p>
      </div>
    )
  }

  return (
    <HashRouter>
      <div className="app-shell">
        <StorageNotice />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/learn/:id" element={<CharacterDetailPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/immerse" element={<ImmersePage />} />
            <Route path="/immerse/:storyId" element={<ImmersePage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/course" element={<CoursePage />} />
            <Route path="/lesson/:lessonId" element={<LessonPage />} />
            <Route path="/missions" element={<MissionsPage />} />
            <Route path="/missions/:missionId" element={<MissionsPage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/training/:mode" element={<TrainingPage />} />
            <Route path="/notebook" element={<NotebookPage />} />
            <Route
              path="*"
              element={
                <div className="page-width">
                  <h1>Seite nicht gefunden</h1>
                  <a href="#/" className="text-link">
                    Zur Startseite
                  </a>
                </div>
              }
            />
            <Route path="/settings" element={<SettingsPage />} />
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
