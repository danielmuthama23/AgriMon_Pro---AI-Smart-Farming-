// ─── SVG bar chart ────────────────────────────────────────────────────────────
interface BarData { label: string; value: number }
interface BarChartProps { data: BarData[]; width?: number; height?: number; color?: string }

export function BarChart({ data, width = 320, height = 120, color = '#16a34a' }: BarChartProps) {
  if (!data.length) return null
  const max = Math.max(...data.map(d => d.value), 1)
  const bw = (width - 20) / data.length - 4
  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      {data.map((d, i) => {
        const bh = Math.max(((d.value / max) * (height - 28)), 2)
        const x = 10 + i * ((width - 20) / data.length)
        return (
          <g key={i}>
            <rect x={x} y={height - bh - 18} width={bw} height={bh} rx="2" fill={color} opacity="0.82" />
            <text x={x + bw / 2} y={height - 4} textAnchor="middle"
              style={{ fontSize: 8, fill: '#6b7280' }}>{d.label}</text>
            <text x={x + bw / 2} y={height - bh - 22} textAnchor="middle"
              style={{ fontSize: 8, fill: color, fontWeight: 600 }}>{d.value}</text>
          </g>
        )
      })}
    </svg>
  )
}
