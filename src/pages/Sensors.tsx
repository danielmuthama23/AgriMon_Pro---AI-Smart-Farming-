// ─── Sensors & Drones page ────────────────────────────────────────────────────
import { useFarmStore } from '../store/farmStore'
import { ZoneSelector } from '../components/ZoneSelector'
import { Gauge } from '../components/Gauge'
import { Sparkline } from '../components/Sparkline'
import { BarChart } from '../components/BarChart'
import { BEST_PLANTS } from '../data/constants'
import { rand } from '../data/synthetic'

export function Sensors() {
  const { sensors, selectedZone, setZone } = useFarmStore()
  const zone = sensors[selectedZone]

  return (
    <div>
      <ZoneSelector selected={selectedZone} onChange={setZone} />
      {zone && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          {/* Soil sensors */}
          <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'16px 20px' }}>
            <div style={{ fontWeight:700, marginBottom:14, color:'#065f46', fontSize:15 }}>
              🌡️ Soil Sensors – {zone.zone}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[
                { label:'Soil Moisture', val:zone.soil_moisture, max:100,  color:'#0369a1', unit:'%'   },
                { label:'Soil Temp',     val:zone.soil_temp,     max:50,   color:'#dc2626', unit:'°C'  },
                { label:'Soil pH',       val:zone.soil_ph,       max:14,   color:'#7c3aed', unit:''    },
                { label:'CO₂ ppm',       val:zone.co2_ppm,       max:1000, color:'#065f46', unit:'ppm' },
              ].map(m => (
                <div key={m.label} style={{ textAlign:'center', padding:10, background:'#f9fafb', borderRadius:10 }}>
                  <Gauge value={parseFloat(String(m.val))} max={m.max} color={m.color} size={60} />
                  <div style={{ fontSize:11, color:'#6b7280', marginTop:4 }}>{m.label}</div>
                  <div style={{ fontSize:16, fontWeight:700, color:m.color }}>{m.val}{m.unit}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrients */}
          <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'16px 20px' }}>
            <div style={{ fontWeight:700, marginBottom:14, color:'#065f46', fontSize:15 }}>🧪 Nutrient Levels</div>
            {[
              { label:'Nitrogen (N)',   val:zone.nitrogen,   max:200, color:'#16a34a' },
              { label:'Phosphorus (P)', val:zone.phosphorus, max:100, color:'#2563eb' },
              { label:'Potassium (K)',  val:zone.potassium,  max:250, color:'#d97706' },
            ].map(n => (
              <div key={n.label} style={{ marginBottom:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, fontWeight:500, marginBottom:4 }}>
                  <span>{n.label}</span>
                  <span style={{ color:n.color, fontWeight:700 }}>{n.val} mg/kg</span>
                </div>
                <div style={{ height:8, background:'#e5e7eb', borderRadius:4 }}>
                  <div style={{ height:8, borderRadius:4, background:n.color,
                    width:`${Math.min((n.val/n.max)*100,100)}%`, transition:'width 0.5s' }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop:12, padding:'10px 12px', background:'#f0fdf4',
              borderRadius:8, border:'1px solid #bbf7d0' }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#065f46' }}>Status: {zone.nutrient}</div>
              <div style={{ fontSize:11, color:'#374151', marginTop:4 }}>Soil: <b>{zone.soil_type}</b></div>
              <div style={{ fontSize:11, color:'#374151', marginTop:4 }}>
                Best crops: {BEST_PLANTS[zone.soil_type]?.join(', ')}
              </div>
            </div>
          </div>

          {/* Drone telemetry */}
          <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'16px 20px' }}>
            <div style={{ fontWeight:700, marginBottom:14, color:'#065f46', fontSize:15 }}>🚁 Drone Telemetry</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
              {[
                { label:'Health Score', val:`${Math.round(zone.drone_health_score)}%`, color:'#16a34a' },
                { label:'Est. Yield',   val:`${zone.yield_est} t/ha`,                  color:'#7c3aed' },
                { label:'Air Temp',     val:`${zone.air_temp}°C`,                       color:'#dc2626' },
                { label:'Humidity',     val:`${zone.humidity}%`,                        color:'#0369a1' },
              ].map(m => (
                <div key={m.label} style={{ background:'#f9fafb', borderRadius:10, padding:12, textAlign:'center' }}>
                  <div style={{ fontSize:18, fontWeight:700, color:m.color }}>{m.val}</div>
                  <div style={{ fontSize:11, color:'#6b7280' }}>{m.label}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize:11, color:'#6b7280', marginBottom:4 }}>Live Moisture Trend</div>
            <Sparkline data={Array.from({length:20},()=>rand(30,80))} color="#0369a1" w={280} h={50} />
          </div>

          {/* Yield comparison */}
          <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'16px 20px' }}>
            <div style={{ fontWeight:700, marginBottom:12, color:'#065f46', fontSize:15 }}>🌱 Yield by Zone</div>
            <BarChart
              data={sensors.map((s,i) => ({ label:`Z${i+1}`, value: parseFloat(s.yield_est.toFixed(1)) }))}
              color="#065f46" width={280} height={120}
            />
            <div style={{ fontSize:11, color:'#6b7280', marginTop:6 }}>Estimated yield (t/ha)</div>
          </div>
        </div>
      )}
    </div>
  )
}
