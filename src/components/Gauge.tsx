// ─── SVG arc gauge ────────────────────────────────────────────────────────────
interface GaugeProps { value: number; max?: number; label?: string; color?: string; size?: number }

export function Gauge({ value, max = 100, label, color = '#22c55e', size = 60 }: GaugeProps) {
  const pct = Math.min(Math.max(value, 0) / max, 1)
  const r = size * 0.38, cx = size / 2, cy = size / 2
  const arc = (p: number) => {
    const a = Math.PI * 1.5 * p - Math.PI * 0.75
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as [number, number]
  }
  const [x1, y1] = arc(0), [x2, y2] = arc(Math.max(pct, 0.001))
  const large = pct > 0.667 ? 1 : 0
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <path d={`M ${arc(0)[0]} ${arc(0)[1]} A ${r} ${r} 0 1 1 ${arc(1)[0]} ${arc(1)[1]}`}
        fill="none" stroke="#e5e7eb" strokeWidth={size * 0.07} strokeLinecap="round" />
      {pct > 0 && (
        <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`}
          fill="none" stroke={color} strokeWidth={size * 0.07} strokeLinecap="round" />
      )}
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: size * 0.19, fontWeight: 600, fill: color }}>{Math.round(value)}</text>
      {label && <text x={cx} y={cy + size * 0.23} textAnchor="middle"
        style={{ fontSize: size * 0.12, fill: '#9ca3af' }}>{label}</text>}
    </svg>
  )
}
