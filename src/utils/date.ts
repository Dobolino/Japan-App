import type { UserProgress } from '@/types'

/** Local calendar date as YYYY-MM-DD (timezone-safe for streaks). */
export function localDateKey(d = new Date()): string {
  return d.toLocaleDateString('sv-SE')
}

export function updateStreak(progress: UserProgress): { currentStreak: number; longestStreak: number } {
  const today = localDateKey()
  const yesterday = localDateKey(new Date(Date.now() - 86_400_000))
  const last = progress.lastStudyDate ? localDateKey(new Date(progress.lastStudyDate)) : null

  let streak = progress.currentStreak
  if (last === yesterday) streak = progress.currentStreak + 1
  else if (last === today) streak = progress.currentStreak
  else streak = 1

  return { currentStreak: streak, longestStreak: Math.max(streak, progress.longestStreak ?? 0) }
}
