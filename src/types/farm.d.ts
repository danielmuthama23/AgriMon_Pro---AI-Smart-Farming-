// ─── Farm core types ─────────────────────────────────────────────────────────

export interface SensorReading {
  zone: string
  id: number
  soil_moisture: number   // %
  soil_temp: number       // °C
  soil_ph: number
  nitrogen: number        // mg/kg
  phosphorus: number      // mg/kg
  potassium: number       // mg/kg
  air_temp: number        // °C
  humidity: number        // %
  light_lux: number
  co2_ppm: number
  disease: string
  nutrient: string
  soil_type: string
  yield_est: number       // t/ha
  drone_health_score: number
  alert: boolean
  timestamp?: number
}

export interface WeatherDay {
  day: string
  rain_mm: number
  temp_max: number
  temp_min: number
  humidity: number
  wind_kmh: number
  forecast: string
}

export interface AlertItem {
  id: number
  type: 'disease' | 'nutrient' | 'security' | 'weather' | 'drone' | 'transaction'
  msg: string
  severity: 'high' | 'medium' | 'low' | 'info'
  time: string
}

export interface BudgetItem {
  item: string
  amount: number
  category?: string
}

export interface Budget {
  input_costs: BudgetItem[]
  output_revenue: BudgetItem[]
}

export interface DataSource {
  id: string
  name: string
  type: 'synthetic' | 'api' | 'mqtt' | 'websocket'
  status: 'active' | 'pending' | 'error' | 'offline'
  lastUpdate?: number
}
