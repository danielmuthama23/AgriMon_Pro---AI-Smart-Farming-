// ─── AI system prompt builder ────────────────────────────────────────────────
// Injects live farm context so Claude answers are grounded in real data

import type { SensorReading, WeatherDay } from '../../types/farm'

export interface FarmContext {
  sensors: SensorReading[]
  weather: WeatherDay[]
  totalInput: number
  totalRevenue: number
  profit: number
  roi: string
}

export function buildSystemPrompt(ctx: FarmContext): string {
  const zoneLines = ctx.sensors.map(s =>
    `  ${s.zone}: pH ${s.soil_ph}, moisture ${s.soil_moisture}%, N=${s.nitrogen}mg/kg, ` +
    `P=${s.phosphorus}mg/kg, K=${s.potassium}mg/kg, disease="${s.disease}", ` +
    `nutrient="${s.nutrient}", soil="${s.soil_type}", est_yield=${s.yield_est}t/ha`
  ).join('\n')

  const wx = ctx.weather[0]
  const weatherLine = wx
    ? `Today: ${wx.forecast}, max ${wx.temp_max}°C / min ${wx.temp_min}°C, rain ${wx.rain_mm}mm, humidity ${wx.humidity}%`
    : 'Not available'

  return `You are AgriSmart AI, an expert agricultural advisor for smallholder and commercial farmers in East Africa (Kenya).

You have real-time access to the following farm data:

ZONE SENSOR READINGS (live):
${zoneLines}

WEATHER (farm location):
${weatherLine}
Rain forecast in 5 days: ${ctx.weather[5]?.rain_mm ?? 0}mm

FARM FINANCES (current season):
  Total inputs:  KSh ${ctx.totalInput.toLocaleString()}
  Total revenue: KSh ${ctx.totalRevenue.toLocaleString()}
  Net profit:    KSh ${ctx.profit.toLocaleString()}
  ROI:           ${ctx.roi}%

INSTRUCTIONS:
- Provide concise, actionable, evidence-based advice tailored to East African conditions.
- Reference specific zones by name when relevant (e.g. "Zone A – Maize").
- Use KSh for all monetary values.
- For disease or nutrient issues, give a specific remedy with product name and rate.
- For financial questions, calculate and show the numbers.
- Keep answers under 300 words unless the user asks for more detail.
- If asked about best practices, draw from CIMMYT, KALRO, and FAO guidelines.`
}
