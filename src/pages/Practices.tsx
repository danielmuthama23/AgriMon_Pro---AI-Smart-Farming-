// ─── Best Practices page ──────────────────────────────────────────────────────
import { BEST_PRACTICES, PLANTING_CALENDAR } from '../data/constants'

export function Practices() {
  return (
    <div>
      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'16px 20px', marginBottom:16 }}>
        <div style={{ fontWeight:700, marginBottom:4, color:'#065f46', fontSize:15 }}>📚 High-Yield Best Practices</div>
        <div style={{ fontSize:12, color:'#6b7280', marginBottom:16 }}>
          Evidence-based agronomy · CIMMYT · KALRO · FAO guidelines for East Africa
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:12 }}>
          {BEST_PRACTICES.map(p => (
            <div key={p.cat} style={{ background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:10, padding:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                <span style={{ fontSize:22 }}>{p.icon}</span>
                <span style={{ fontSize:13, fontWeight:700, color:'#065f46' }}>{p.cat}</span>
              </div>
              <div style={{ fontSize:12, color:'#374151', lineHeight:1.7 }}>{p.tip}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Planting calendar */}
      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'16px 20px', marginBottom:16 }}>
        <div style={{ fontWeight:700, marginBottom:14, color:'#065f46', fontSize:15 }}>
          🌾 Seasonal Planting Calendar – East Africa
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(12,1fr)', gap:3, marginBottom:8 }}>
          {['J','F','M','A','M','J','J','A','S','O','N','D'].map((m,i) => (
            <div key={i} style={{ textAlign:'center', fontSize:10, fontWeight:700, color:'#6b7280', padding:'4px 0' }}>{m}</div>
          ))}
        </div>
        {PLANTING_CALENDAR.map(r => (
          <div key={r.crop} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
            <div style={{ width:130, fontSize:11, color:'#374151', fontWeight:500, flexShrink:0 }}>{r.crop}</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(12,1fr)', gap:3, flex:1 }}>
              {Array.from({length:12},(_,i) => (
                <div key={i} style={{ height:18, borderRadius:3,
                  background: r.months.includes(i) ? r.color : '#f3f4f6',
                  transition:'background 0.2s' }} />
              ))}
            </div>
          </div>
        ))}
        <div style={{ marginTop:10, display:'flex', gap:16, flexWrap:'wrap' }}>
          {PLANTING_CALENDAR.map(r => (
            <div key={r.crop} style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'#374151' }}>
              <div style={{ width:14, height:10, borderRadius:2, background:r.color, flexShrink:0 }} />
              {r.crop}
            </div>
          ))}
        </div>
      </div>

      {/* Input cost guide */}
      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'16px 20px' }}>
        <div style={{ fontWeight:700, marginBottom:14, color:'#065f46', fontSize:15 }}>💰 Typical Input Cost Guide (KSh/acre)</div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead>
              <tr style={{ background:'#f0fdf4' }}>
                {['Crop','Seeds','Fertiliser','Pesticides','Labour','Total Input','Expected Yield','Gross Revenue','Net Profit'].map(h => (
                  <th key={h} style={{ padding:'8px 10px', textAlign:'left', fontWeight:700,
                    color:'#065f46', borderBottom:'2px solid #bbf7d0', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { crop:'Maize',    seeds:1200,  fert:4500, pest:800,  labour:6000, yield_t:2.5,  price_t:45000 },
                { crop:'Tomato',   seeds:3500,  fert:8000, pest:4500, labour:12000,yield_t:8.0,  price_t:25000 },
                { crop:'Beans',    seeds:2800,  fert:3000, pest:600,  labour:5000, yield_t:0.8,  price_t:95000 },
                { crop:'Wheat',    seeds:2200,  fert:5500, pest:1200, labour:7000, yield_t:2.0,  price_t:38000 },
                { crop:'Avocado',  seeds:12000, fert:6000, pest:2000, labour:8000, yield_t:3.5,  price_t:60000 },
              ].map((row, i) => {
                const total = row.seeds + row.fert + row.pest + row.labour
                const revenue = Math.round(row.yield_t * row.price_t)
                const profit = revenue - total
                return (
                  <tr key={i} style={{ borderBottom:'1px solid #f3f4f6', background: i%2===0?'#fff':'#f9fafb' }}>
                    <td style={{ padding:'8px 10px', fontWeight:600 }}>{row.crop}</td>
                    <td style={{ padding:'8px 10px' }}>{row.seeds.toLocaleString()}</td>
                    <td style={{ padding:'8px 10px' }}>{row.fert.toLocaleString()}</td>
                    <td style={{ padding:'8px 10px' }}>{row.pest.toLocaleString()}</td>
                    <td style={{ padding:'8px 10px' }}>{row.labour.toLocaleString()}</td>
                    <td style={{ padding:'8px 10px', fontWeight:600, color:'#dc2626' }}>{total.toLocaleString()}</td>
                    <td style={{ padding:'8px 10px' }}>{row.yield_t}t</td>
                    <td style={{ padding:'8px 10px', color:'#16a34a', fontWeight:600 }}>{revenue.toLocaleString()}</td>
                    <td style={{ padding:'8px 10px', fontWeight:700, color: profit>0?'#16a34a':'#dc2626' }}>
                      {profit.toLocaleString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
