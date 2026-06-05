// ─── MCP Soil Sensor connector ───────────────────────────────────────────────
import { registerTool } from './mcpClient'
import { activeSensorSource } from '../../data/synthetic'

export function initSoilSensorMCP() {
  registerTool({
    name: 'get_soil_readings',
    description: 'Returns NPK, moisture, pH, and temperature for all zones',
    connector: 'soilSensorMCP',
    invoke: async (params) => {
      const readings = await activeSensorSource.fetchAll()
      if (params?.zone !== undefined) {
        return readings.filter(r => r.id === params.zone)
      }
      return readings.map(r => ({
        zone: r.zone, soil_ph: r.soil_ph, soil_moisture: r.soil_moisture,
        soil_temp: r.soil_temp, nitrogen: r.nitrogen,
        phosphorus: r.phosphorus, potassium: r.potassium,
      }))
    },
  })
}
