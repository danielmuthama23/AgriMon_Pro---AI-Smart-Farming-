import { ANIMALS, FEED_RECS, FARM_STRUCTURES } from '../data/constants'
import { rand } from '../data/synthetic'

export function Livestock() {
  return (
    <div>
      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'16px 20px', marginBottom:16 }}>
        <div style={{ fontWeight:700, marginBottom:14, color:'#065f46', fontSize:15 }}>🐄 Livestock Feed Management</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12 }}>
          {ANIMALS.map(animal => {
            const rec = FEED_RECS[animal]
            const count = Math.floor(rand(5, 120, 0))
            return (
              <div key={animal} style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:10, padding:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700 }}>{animal}</div>
                    <div style={{ fontSize:12, color:'#6b7280' }}>{count} animals</div>
                  </div>
                  <span style={{ background:'#f0fdf4', color:'#16a34a', fontSize:10, fontWeight:600,
                    padding:'2px 8px', borderRadius:20 }}>{rec.daily_kg}kg/head/day</span>
                </div>
                <div style={{ fontSize:11, color:'#374151', background:'#f0fdf4', borderRadius:6,
                  padding:'8px 10px', marginBottom:10, lineHeight:1.6 }}>
                  🌽 {rec.feed}
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
                  <span style={{ color:'#6b7280' }}>Daily feed cost</span>
                  <span style={{ fontWeight:700, color:'#065f46' }}>KSh {(rec.cost_ksh * count).toLocaleString()}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'16px 20px' }}>
        <div style={{ fontWeight:700, marginBottom:14, color:'#065f46' }}>🏗️ Farm Structures</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:10 }}>
          {FARM_STRUCTURES.map(s => {
            const isWarn = s.status.includes('Repair') || s.status.includes('Alert')
            return (
              <div key={s.name} style={{ background: isWarn ? '#fffbeb' : '#f9fafb',
                border:`1px solid ${isWarn ? '#fcd34d' : '#e5e7eb'}`, borderRadius:10, padding:12 }}>
                <div style={{ fontSize:22, marginBottom:4 }}>{s.icon}</div>
                <div style={{ fontSize:13, fontWeight:700 }}>{s.name}</div>
                <div style={{ fontSize:11, color:'#6b7280' }}>Capacity: {s.capacity}</div>
                <div style={{ fontSize:11, color:'#6b7280', marginBottom:6 }}>
                  CCTV: {s.cameras} cam{s.cameras !== 1 ? 's' : ''}
                </div>
                <span style={{ background: isWarn ? '#fffbeb' : '#f0fdf4',
                  color: isWarn ? '#d97706' : '#16a34a',
                  fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20 }}>{s.status}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
