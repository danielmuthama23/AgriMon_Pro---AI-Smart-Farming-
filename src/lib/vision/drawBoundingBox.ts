// ─── YOLO bounding box canvas renderer ───────────────────────────────────────
import type { Detection } from '../../types/vision'

export function drawDetections(
  ctx: CanvasRenderingContext2D,
  detections: Detection[],
  canvasW: number,
  canvasH: number,
): void {
  detections.forEach(det => {
    const { x, y, width, height } = det.bbox
    const bx = x * canvasW, by = y * canvasH
    const bw = width * canvasW, bh = height * canvasH

    // Box
    ctx.strokeStyle = det.color
    ctx.lineWidth = 1.5
    ctx.strokeRect(bx, by, bw, bh)

    // Label background
    const label = `${det.className} ${Math.round(det.confidence * 100)}%`
    ctx.font = '8px monospace'
    const tw = ctx.measureText(label).width
    ctx.fillStyle = det.color
    ctx.fillRect(bx, by - 13, tw + 6, 13)

    // Label text
    ctx.fillStyle = '#fff'
    ctx.fillText(label, bx + 3, by - 3)
  })
}

export function drawTimestamp(ctx: CanvasRenderingContext2D, tick: number): void {
  const now = new Date()
  const ts = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${(tick % 60).toString().padStart(2,'0')}`
  ctx.fillStyle = 'rgba(0,255,0,0.7)'
  ctx.font = '8px monospace'
  ctx.fillText(ts, 4, 10)
}

export function drawRecBadge(ctx: CanvasRenderingContext2D, tick: number, w: number): void {
  if (tick % 2 === 0) {
    ctx.fillStyle = 'rgba(239,68,68,0.85)'
    ctx.fillRect(w - 34, 3, 30, 11)
    ctx.fillStyle = '#fff'
    ctx.font = '7px monospace'
    ctx.fillText('⚠ REC', w - 32, 11)
  }
}
