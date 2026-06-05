// ─── Simulated CCTV canvas frame generator ───────────────────────────────────
// Draws a synthetic "camera view" with moving vegetation, IR lines, and
// YOLO detections. Replace with real RTSP/WebSocket video in production.

import type { CCTVFeed } from '../../types/vision'
import type { Detection } from '../../types/vision'
import { getClassByName } from './classes'

export function renderSimulatedFrame(
  ctx: CanvasRenderingContext2D,
  feed: CCTVFeed,
  tick: number,
  w: number,
  h: number,
): Detection[] {
  const detections: Detection[] = []

  if (feed.status === 'offline') {
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#555'
    ctx.font = '10px monospace'
    ctx.fillText('OFFLINE', w / 2 - 22, h / 2)
    return []
  }

  // Background — dark green field
  ctx.fillStyle = '#0a1a0a'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = 'rgba(0,80,0,0.25)'
  ctx.fillRect(0, h * 0.4, w, h * 0.6)

  // Scanlines
  for (let y = 0; y < h; y += 4) {
    ctx.fillStyle = `rgba(0,255,0,${Math.random() * 0.03 + 0.01})`
    ctx.fillRect(0, y, w, 1)
  }

  // Camera label
  ctx.fillStyle = 'rgba(0,255,0,0.6)'
  ctx.font = '7px monospace'
  ctx.fillText(`CAM-${feed.id}`, 4, 10)

  // Draw detections per feed config
  feed.detections.forEach(className => {
    const cls = getClassByName(className === 'intruder' ? 'person' : className)
    if (!cls) return

    let bx: number, by: number, bw: number, bh: number
    if (className === 'intruder' || className === 'person') {
      bx = 30 + (tick % 8); by = 12 + (tick % 5); bw = 44; bh = 62
    } else if (className === 'animal') {
      bx = 60; by = 45; bw = 52; bh = 36
    } else {
      bx = 75; by = 18; bw = 30; bh = 50
    }

    ctx.strokeStyle = cls.color
    ctx.lineWidth = 1.5
    ctx.strokeRect(bx, by, bw, bh)

    const conf = feed.confidence ?? Math.floor(Math.random() * 10 + 88)
    const label = `${className.toUpperCase()} ${conf}%`
    ctx.font = '7px monospace'
    const tw = ctx.measureText(label).width
    ctx.fillStyle = cls.color
    ctx.fillRect(bx, by - 11, tw + 4, 11)
    ctx.fillStyle = '#fff'
    ctx.fillText(label, bx + 2, by - 2)

    detections.push({
      classId: cls.id, className,
      confidence: conf / 100,
      bbox: { x: bx / w, y: by / h, width: bw / w, height: bh / h },
      color: cls.color,
    })
  })

  return detections
}
