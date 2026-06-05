// ─── Application navigation bar ──────────────────────────────────────────────
interface Tab { id: string; label: string }

interface NavBarProps {
  tabs: Tab[]
  active: string
  onChange: (id: string) => void
}

export function NavBar({ tabs, active, onChange }: NavBarProps) {
  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb',
      padding: '0 12px', display: 'flex', gap: 2, overflowX: 'auto', flexWrap: 'nowrap' }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          padding: '10px 14px', fontSize: 12, cursor: 'pointer',
          fontWeight: active === t.id ? 700 : 500,
          color: active === t.id ? '#065f46' : '#6b7280',
          background: 'none', border: 'none',
          borderBottom: active === t.id ? '3px solid #065f46' : '3px solid transparent',
          whiteSpace: 'nowrap', transition: 'all 0.15s',
        }}>{t.label}</button>
      ))}
    </div>
  )
}
