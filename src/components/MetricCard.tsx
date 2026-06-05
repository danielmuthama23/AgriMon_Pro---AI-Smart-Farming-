// ─── Summary metric card ──────────────────────────────────────────────────────
interface MetricCardProps {
  icon: string; label: string; value: string | number
  color?: string; onClick?: () => void
}

export function MetricCard({ icon, label, value, color = '#065f46', onClick }: MetricCardProps) {
  return (
    <div onClick={onClick} style={{
      flex: '1 1 130px', background: '#f9fafb', borderRadius: 10,
      padding: '12px 16px', border: '1px solid #f0f0f0',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'box-shadow 0.15s',
    }}>
      <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{label}</div>
    </div>
  )
}
