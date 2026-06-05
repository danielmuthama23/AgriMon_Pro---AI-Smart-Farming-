// ─── MCP Drone Oracle connector ──────────────────────────────────────────────
// Publishes drone telemetry to Hedera HCS; exposes get_drone_status tool
import { registerTool } from './mcpClient'
import { publishSensorReading } from '../hedera/topics'
import { activeSensorSource } from '../../data/synthetic'

export function initDroneOracle() {
  registerTool({
    name: 'get_drone_status',
    description: 'Returns current drone telemetry for all farm zones',
    connector: 'droneOracle',
    invoke: async () => {
      const readings = await activeSensorSource.fetchAll()
      // Side-effect: publish to Hedera
      readings.forEach(r => publishSensorReading(r).catch(() => {}))
      return readings.map(r => ({
        zone: r.zone,
        health: r.drone_health_score,
        yield_est: r.yield_est,
        disease: r.disease,
        timestamp: r.timestamp,
      }))
    },
  })
}
