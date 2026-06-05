// ─── Real API adapter stubs ───────────────────────────────────────────────────
// These are drop-in replacements for the synthetic sources.
// Set the corresponding VITE_ env vars and swap the export in synthetic.ts / budget.ts

import type { SensorReading } from '../types/farm'

// ── IoT / MQTT sensor adapter ─────────────────────────────────────────────────
// Works with Chirpstack, TTN, or any MQTT-over-HTTP gateway
export async function fetchSensorsFromAPI(): Promise<SensorReading[]> {
  const url  = import.meta.env.VITE_SENSOR_API_URL
  const key  = import.meta.env.VITE_SENSOR_API_KEY
  if (!url) throw new Error('VITE_SENSOR_API_URL not set')
  const res = await fetch(`${url}/readings/latest`, {
    headers: { Authorization: `Bearer ${key}`, Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`Sensor API ${res.status}`)
  return res.json()
}

// ── OpenWeatherMap adapter ────────────────────────────────────────────────────
export async function fetchWeatherFromAPI() {
  const key = import.meta.env.VITE_WEATHER_API_KEY
  const lat = import.meta.env.VITE_WEATHER_LAT || '-1.2864'
  const lon = import.meta.env.VITE_WEATHER_LON || '36.8172'
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric&cnt=14`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Weather API ${res.status}`)
  const json = await res.json()
  return json.list.map((d: any) => ({
    day:      new Date(d.dt * 1000).toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short' }),
    rain_mm:  d.rain?.['3h'] ?? 0,
    temp_max: parseFloat(d.main.temp_max.toFixed(1)),
    temp_min: parseFloat(d.main.temp_min.toFixed(1)),
    humidity: d.main.humidity,
    wind_kmh: Math.round(d.wind.speed * 3.6),
    forecast: `${d.weather[0].icon.includes('d') ? '☀️' : '🌙'} ${d.weather[0].description}`,
  }))
}

// ── NARIG / custom market price adapter ──────────────────────────────────────
export async function fetchMarketPrices(): Promise<Record<string, number>> {
  const url = import.meta.env.VITE_MARKET_API_URL
  const key = import.meta.env.VITE_MARKET_API_KEY
  if (!url) throw new Error('VITE_MARKET_API_URL not set')
  const res = await fetch(`${url}/prices/current`, {
    headers: { Authorization: `Bearer ${key}` },
  })
  if (!res.ok) throw new Error(`Market API ${res.status}`)
  return res.json()
}
