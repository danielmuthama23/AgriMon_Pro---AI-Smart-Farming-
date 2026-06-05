// ─── MCP Weather connector ───────────────────────────────────────────────────
// SWAP: set VITE_USE_REAL_WEATHER=true and configure openWeatherSource
import { registerTool } from './mcpClient'
import { activeWeatherSource } from '../../data/synthetic'

export function initWeatherMCP() {
  registerTool({
    name: 'get_weather_forecast',
    description: 'Returns 14-day weather history and forecast for the farm location',
    connector: 'weatherMCP',
    invoke: async () => {
      const data = await activeWeatherSource.fetch14Days()
      return data
    },
  })

  registerTool({
    name: 'get_irrigation_advice',
    description: 'Returns irrigation scheduling advice based on forecast rain',
    connector: 'weatherMCP',
    invoke: async () => {
      const data = await activeWeatherSource.fetch14Days()
      const rainIn48h = data.slice(0, 2).some(d => d.rain_mm > 10)
      return {
        should_irrigate: !rainIn48h,
        reason: rainIn48h
          ? 'Rain expected within 48h – hold irrigation'
          : 'No significant rain forecast – proceed with scheduled irrigation',
        next_rain_day: data.find(d => d.rain_mm > 5)?.day ?? 'None in 14 days',
      }
    },
  })
}
