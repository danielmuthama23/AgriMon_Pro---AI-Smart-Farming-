// ─── Computer Vision / YOLO types ────────────────────────────────────────────

export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

export interface Detection {
  classId: number
  className: string
  confidence: number
  bbox: BoundingBox
  color: string
}

export interface CCTVFeed {
  id: number
  name: string
  status: 'active' | 'alert' | 'offline'
  alert: boolean
  detections: string[]
  confidence?: number
  streamUrl?: string    // real RTSP/WS URL in production
}

export interface YOLOResult {
  feedId: number
  detections: Detection[]
  frameTs: number
}
