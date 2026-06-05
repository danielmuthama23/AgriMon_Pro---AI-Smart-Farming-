import { useFarmStore } from '../store/farmStore'
import { BEST_PLANTS } from '../data/constants'

export function Disease() {
  const { sensors } = useFarmStore()
  return (
    <div>
      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'16px 20px', marginBottom:16 }}>
        <div style={{ fontWeight:700, marginBottom:4, color:'#065f46', fontSize:15 }}>🔬 Disease Detection · Drone AI Vision</div>
        <div style={{ fontSize:12, color:'#6b7280', marginBottom:14 }}>YOLOv8 + Claude Vision · Confidence threshold: 80%</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:12 }}>
          {sensors.map(z => (
            <div key={z.id} style={{ background: z.disease !== 'None Detected' ? '#fef2f2' : '#f0fdf4',
              border:`1px solid ${z.disease !== 'None Detected' ? '#fca5a5' : '#bbf7d0'}`,
              borderRadius:10, padding:14 }}>
              <div style={{ fontWeight:700, fontSize:13, marginBottom:6 }}>{z.zone}</div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                <span style={{ fontSize:18 }}>{z.disease !== 'None Detected' ? '🦠' : '✅'}</span>
                <span style={{ fontSize:12, fontWeight:600,
                  color: z.disease !== 'None Detected' ? '#dc2626' : '#16a34a' }}>{z.disease}</span>
              </div>
              <div style={{ fontSize:11, color:'#374151' }}><b>Nutrient:</b> {z.nutrient}</div>
              <div style={{ fontSize:11, color:'#374151' }}><b>Soil:</b> {z.soil_type}</div>
              <div style={{ fontSize:11, color:'#374151' }}><b>pH:</b> {z.soil_ph}</div>
              {z.disease !== 'None Detected' && (
                <div style={{ marginTop:8, fontSize:11, background:'#fee2e2', borderRadius:6,
                  padding:'6px 8px', color:'#7f1d1d', lineHeight:1.5 }}>
                  ⚠ Apply fungicide. Isolate affected rows. Re-scout in 7 days.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'16px 20px' }}>
        <div style={{ fontWeight:700, marginBottom:14, color:'#065f46', fontSize:15 }}>🗺️ Soil Analysis & Crop Recommendations</div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead>
              <tr style={{ background:'#f0fdf4' }}>
                {['Zone','Soil Type','pH','N (mg/kg)','P (mg/kg)','K (mg/kg)','Best Crops'].map(h => (
                  <th key={h} style={{ padding:'8px 10px', textAlign:'left', fontWeight:700,
                    color:'#065f46', borderBottom:'2px solid #bbf7d0', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sensors.map((z,i) => (
                <tr key={i} style={{ borderBottom:'1px solid #f3f4f6', background: i%2===0 ? '#fff' : '#f9fafb' }}>
                  <td style={{ padding:'8px 10px', fontWeight:600 }}>{z.zone}</td>
                  <td style={{ padding:'8px 10px' }}>{z.soil_type}</td>
                  <td style={{ padding:'8px 10px' }}>
                    <span style={{ background: z.soil_ph<6?'#fef2f2':z.soil_ph>7.5?'#fffbeb':'#f0fdf4',
                      color: z.soil_ph<6?'#dc2626':z.soil_ph>7.5?'#d97706':'#16a34a',
                      fontSize:10, fontWeight:600, padding:'2px 6px', borderRadius:10 }}>{z.soil_ph}</span>
                  </td>
                  <td style={{ padding:'8px 10px' }}>{z.nitrogen}</td>
                  <td style={{ padding:'8px 10px' }}>{z.phosphorus}</td>
                  <td style={{ padding:'8px 10px' }}>{z.potassium}</td>
                  <td style={{ padding:'8px 10px', color:'#065f46', fontWeight:500 }}>
                    {BEST_PLANTS[z.soil_type]?.join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
