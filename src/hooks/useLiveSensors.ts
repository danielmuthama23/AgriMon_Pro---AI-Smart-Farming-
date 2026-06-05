// ─── Live sensor refresh hook ─────────────────────────────────────────────────
import { useEffect } from 'react'
import { useFarmStore } from '../store/farmStore'

export function useLiveSensors(intervalMs = 1000) {
  const { refresh, tick1s } = useFarmStore()

  useEffect(() => {
    refresh() // Initial load
    const id = setInterval(tick1s, intervalMs)
    return () => clearInterval(id)
  }, [])
}
