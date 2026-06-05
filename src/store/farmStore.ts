// ─── Zustand farm state store ─────────────────────────────────────────────────
import { create } from 'zustand'
import type { SensorReading, WeatherDay, AlertItem } from '../types/farm'
import { activeSensorSource, activeWeatherSource, generateAlerts } from '../data/synthetic'

interface FarmState {
  sensors:      SensorReading[]
  weather:      WeatherDay[]
  alerts:       AlertItem[]
  selectedZone: number
  tick:         number
  loading:      boolean
  // Actions
  refresh:      () => Promise<void>
  tick1s:       () => void
  setZone:      (id: number) => void
}

export const useFarmStore = create<FarmState>((set, get) => ({
  sensors:      [],
  weather:      [],
  alerts:       generateAlerts(),
  selectedZone: 0,
  tick:         0,
  loading:      true,

  refresh: async () => {
    try {
      const [sensors, weather] = await Promise.all([
        activeSensorSource.fetchAll(),
        activeWeatherSource.fetch14Days(),
      ])
      set({ sensors, weather, loading: false })
    } catch (err) {
      console.error('[FarmStore] refresh error:', err)
      set({ loading: false })
    }
  },

  tick1s: () => {
    const { tick } = get()
    const next = tick + 1
    // Refresh sensor data every 5 seconds
    if (next % 5 === 0) get().refresh()
    set({ tick: next })
  },

  setZone: (id: number) => set({ selectedZone: id }),
}))
