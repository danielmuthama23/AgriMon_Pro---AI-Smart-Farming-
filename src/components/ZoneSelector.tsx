// ─── Zone pill selector ───────────────────────────────────────────────────────
import { ZONES } from '../data/constants'

interface ZoneSelectorProps { selected: number; onChange: (id: number) => void }

export function ZoneSelector({ selected, onChange }: ZoneSelectorProps) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
      {ZONES.map((z, i) => (
        <button key={i} onClick={() => onChange(i)} style={{
          padding: '8px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
          background: selected === i ? '#065f46' : '#fff',
          color: selected === i ? '#fff' : '#374151',
          border: '1px solid #e5e7eb', transition: 'all 0.15s',
        }}>{z}</button>
      ))}
    </div>
  )
}
