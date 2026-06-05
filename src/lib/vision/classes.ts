// ─── YOLO detection class definitions ────────────────────────────────────────
export interface YOLOClass {
  id: number; name: string; color: string; alertOnDetect: boolean
}

export const YOLO_CLASSES: YOLOClass[] = [
  { id: 0,  name: 'person',    color: '#ef4444', alertOnDetect: true  },
  { id: 1,  name: 'worker',    color: '#22c55e', alertOnDetect: false },
  { id: 2,  name: 'vehicle',   color: '#3b82f6', alertOnDetect: false },
  { id: 3,  name: 'cow',       color: '#f59e0b', alertOnDetect: false },
  { id: 4,  name: 'goat',      color: '#f59e0b', alertOnDetect: false },
  { id: 5,  name: 'sheep',     color: '#f59e0b', alertOnDetect: false },
  { id: 6,  name: 'chicken',   color: '#d97706', alertOnDetect: false },
  { id: 7,  name: 'intruder',  color: '#dc2626', alertOnDetect: true  },
]

export const getClassById = (id: number): YOLOClass =>
  YOLO_CLASSES[id] ?? { id, name: 'unknown', color: '#6b7280', alertOnDetect: false }

export const getClassByName = (name: string): YOLOClass | undefined =>
  YOLO_CLASSES.find(c => c.name === name)
