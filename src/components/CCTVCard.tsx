// ─── CCTV camera feed card with YOLO overlay ─────────────────────────────────
import { useRef, useEffect } from 'react'
import type { CCTVFeed } from '../types/vision'
import { renderSimulatedFrame } from '../lib/vision/simulatedFeed'
import { drawTimestamp, drawRecBadge } from '../lib/vision/drawBoundingBox'
import { logSecurityIncident } from '../lib/hedera/audit'

interface CCTVCardProps { cam: CCTVFeed; tick: number }

export function CCTVCard({ cam, tick }: CCTVCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width, H = canvas.height

    const detections = renderSimulatedFrame(ctx, cam, tick, W, H)
    drawTimestamp(ctx, tick)
    if (cam.alert) drawRecBadge(ctx, tick, W)

    // Log new intruder detections to Hedera audit
    if (cam.alert && tick % 30 === 0) {
      logSecurityIncident({
        cameraId: cam.id, cameraName: cam.name,
        event: 'INTRUDER_DETECTED',
        confidence: cam.confidence ?? 90,
        action: 'Alert sent to farm manager',
        timestamp: Date.now(),
      }).catch(() => {})
    }
  }, [cam, tick])

  const borderColor = cam.alert ? '#ef4444' : cam.status === 'offline' ? '#374151' : '#166534'

  return (
    <div style={{ border: `1.5px solid ${borderColor}`, borderRadius: 8, overflow: 'hidden', background: '#000' }}>
      <canvas ref={canvasRef} width={160} height={100} style={{ display: 'block' }} />
      <div style={{ padding: '4px 8px', background: '#0a0a0a', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: cam.alert ? '#ef4444' : '#22c55e', fontFamily: 'monospace' }}>
          {cam.name}
        </span>
        <span style={{ fontSize: 9, fontFamily: 'monospace',
          color: cam.status === 'offline' ? '#6b7280' : cam.alert ? '#ef4444' : '#22c55e' }}>
          {cam.status === 'offline' ? 'OFFLINE' : cam.alert ? '⚠ ALERT' : '● LIVE'}
        </span>
      </div>
    </div>
  )
}
