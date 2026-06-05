// ─── Mini SVG sparkline ───────────────────────────────────────────────────────
interface SparklineProps { data: number[]; color?: string; h?: number; w?: number }

export function Sparkline({ data, color = '#22c55e', h = 32, w = 80 }: SparklineProps) {
  if (data.length < 2) return null
  const min = Math.min(...data), range = Math.max(...data) - min || 1
  const pts = data.map((v, i) =>
    `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 2) - 1}`
  ).join(' ')
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}
