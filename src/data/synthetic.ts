// ─── Synthetic data generator ─────────────────────────────────────────────────
// All functions here produce fake but realistic data.
// To connect real hardware/APIs: replace the function body, keep the return type.

import type { SensorReading, WeatherDay, AlertItem } from '../types/farm'
import { ZONES, DISEASES, NUTRIENT_STATUS, SOIL_TYPES } from './constants'

// ── Helpers ───────────────────────────────────────────────────────────────────

export const rand = (min: number, max: number, decimals = 1): number =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals))

export const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

// ── Sensor data ───────────────────────────────────────────────────────────────
// SWAP POINT: replace with MQTT broker call, REST API, or LoRaWAN gateway

export interface SensorDataSource {
  fetchAll: () => Promise<SensorReading[]> | SensorReading[]
}

export const syntheticSensorSource: SensorDataSource = {
  fetchAll: (): SensorReading[] =>
    ZONES.map((zone, i) => ({
      zone,
      id: i,
      soil_moisture:      rand(20, 80),
      soil_temp:          rand(18, 34),
      soil_ph:            rand(5.5, 7.8),
      nitrogen:           rand(10, 180),
      phosphorus:         rand(5, 90),
      potassium:          rand(15, 200),
      air_temp:           rand(20, 38),
      humidity:           rand(35, 90),
      light_lux:          rand(20000, 85000, 0),
      co2_ppm:            rand(380, 850, 0),
      disease:            pick(DISEASES),
      nutrient:           pick(NUTRIENT_STATUS),
      soil_type:          pick(SOIL_TYPES),
      yield_est:          rand(1.2, 6.8),
      drone_health_score: rand(60, 99),
      alert:              Math.random() > 0.7,
      timestamp:          Date.now(),
    })),
}

// Real sensor API example (uncomment and configure .env to use):
//
// export const apiSensorSource: SensorDataSource = {
//   fetchAll: async (): Promise<SensorReading[]> => {
//     const res = await fetch(`${import.meta.env.VITE_SENSOR_API_URL}/readings`, {
//       headers: { Authorization: `Bearer ${import.meta.env.VITE_SENSOR_API_KEY}` }
//     })
//     if (!res.ok) throw new Error('Sensor API error')
//     return res.json()
//   }
// }

// Active source — switch by changing this export
export const activeSensorSource: SensorDataSource =
  import.meta.env.VITE_USE_REAL_SENSORS === 'true'
    ? syntheticSensorSource  // swap: apiSensorSource
    : syntheticSensorSource

// ── Weather data ──────────────────────────────────────────────────────────────
// SWAP POINT: replace with OpenWeatherMap, KMet, or any weather API

export interface WeatherDataSource {
  fetch14Days: () => Promise<WeatherDay[]> | WeatherDay[]
}

const FORECASTS = ['☀️ Sunny', '⛅ Partly Cloudy', '🌧 Rain Expected', '🌦 Showers', '💨 Windy', '☁️ Overcast']

export const syntheticWeatherSource: WeatherDataSource = {
  fetch14Days: (): WeatherDay[] =>
    Array.from({ length: 14 }, (_, i) => ({
      day:      i === 0 ? 'Today' : i === 1 ? 'Yesterday' : `${i}d ago`,
      rain_mm:  rand(0, 35, 1),
      temp_max: rand(24, 38, 1),
      temp_min: rand(14, 22, 1),
      humidity: rand(40, 95, 0),
      wind_kmh: rand(4, 28, 1),
      forecast: i === 5 ? '🌧 Rain Expected' : pick(FORECASTS),
    })),
}

// Real weather API example:
//
// export const openWeatherSource: WeatherDataSource = {
//   fetch14Days: async (): Promise<WeatherDay[]> => {
//     const { VITE_WEATHER_API_KEY: key, VITE_WEATHER_LAT: lat, VITE_WEATHER_LON: lon } = import.meta.env
//     const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric`
//     const res = await fetch(url)
//     const json = await res.json()
//     return json.list.slice(0, 14).map((d: any) => ({
//       day:      new Date(d.dt * 1000).toLocaleDateString('en-KE', { weekday: 'short' }),
//       rain_mm:  d.rain?.['3h'] ?? 0,
//       temp_max: d.main.temp_max,
//       temp_min: d.main.temp_min,
//       humidity: d.main.humidity,
//       wind_kmh: Math.round(d.wind.speed * 3.6),
//       forecast: d.weather[0].description,
//     }))
//   }
// }

export const activeWeatherSource: WeatherDataSource =
  import.meta.env.VITE_USE_REAL_WEATHER === 'true'
    ? syntheticWeatherSource  // swap: openWeatherSource
    : syntheticWeatherSource

// ── Alerts ────────────────────────────────────────────────────────────────────

export const generateAlerts = (): AlertItem[] => [
  { id: 1, type: 'disease',     msg: 'Zone B – Early blight detected on tomato leaves (87% confidence)', severity: 'high',   time: '12m ago' },
  { id: 2, type: 'nutrient',    msg: 'Zone A – Nitrogen below optimal. Recommend 40kg/ha urea',          severity: 'medium', time: '34m ago' },
  { id: 3, type: 'security',    msg: 'CCTV Cam 3 – Motion detected near eastern perimeter (22:14)',      severity: 'high',   time: '2h ago'  },
  { id: 4, type: 'weather',     msg: 'Heavy rain forecast in 48h – adjust irrigation schedule',          severity: 'low',    time: '3h ago'  },
  { id: 5, type: 'drone',       msg: 'Drone 2 battery low (18%) – returning to base',                    severity: 'medium', time: '5h ago'  },
  { id: 6, type: 'transaction', msg: 'Hedera TX confirmed – 3.5 tonnes maize @ KSh 45,000',             severity: 'info',   time: '6h ago'  },
]
