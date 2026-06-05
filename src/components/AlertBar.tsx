// ─── High-severity alert strip ────────────────────────────────────────────────
import type { AlertItem } from '../types/farm'

interface AlertBarProps { alerts: AlertItem[] }

export function AlertBar({ alerts }: AlertBarProps) {
  const high = alerts.filter(a => a.severity === 'high')
  if (!high.length) return null
  return (
    <div style={{ background: '#fef2f2', borderBottom: '2px solid #ef4444',
      padding: '8px 20px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <span style={{ color: '#ef4444', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>⚠ ALERTS</span>
      {high.map(a => (
        <span key={a.id} style={{ fontSize: 12, color: '#7f1d1d', background: '#fee2e2',
          borderRadius: 6, padding: '2px 10px' }}>{a.msg}</span>
      ))}
    </div>
  )
}
