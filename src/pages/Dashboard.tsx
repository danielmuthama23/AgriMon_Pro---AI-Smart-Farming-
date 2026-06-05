// ─── Dashboard page ───────────────────────────────────────────────────────────
import { useFarmStore } from '../store/farmStore'
import { useBudgetStore } from '../store/budgetStore'
import { MetricCard } from '../components/MetricCard'
import { Gauge } from '../components/Gauge'
import { Sparkline } from '../components/Sparkline'
import { rand } from '../data/synthetic'

const sev = { high:'#ef4444', medium:'#f59e0b', low:'#22c55e', info:'#3b82f6' }
const sevBg = { high:'#fef2f2', medium:'#fffbeb', low:'#f0fdf4', info:'#eff6ff' }

export function Dashboard({ onNavigate }: { onNavigate: (tab: string, zone?: number) => void }) {
  const { sensors, weather, alerts } = useFarmStore()
  const { roi, profit } = useBudgetStore()

  const avgMoisture = sensors.length
    ? Math.round(sensors.reduce((s, z) => s + z.soil_moisture, 0) / sensors.length)
    : 0
  const diseaseCount = sensors.filter(z => z.disease !== 'None Detected').length

  return (
    <div>
      {/* Metrics */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <MetricCard icon="🗺️" label="Active Zones"      value={sensors.length} color="#065f46" />
        <MetricCard icon="💧" label="Avg Soil Moisture" value={`${avgMoisture}%`} color="#0369a1" />
        <MetricCard icon="🦠" label="Disease Alerts"    value={diseaseCount}    color="#dc2626"
          onClick={() => onNavigate('disease')} />
        <MetricCard icon="📈" label="Season ROI"        value={`${roi}%`}       color="#7c3aed" />
        <MetricCard icon="🚁" label="Drones Active"     value="3 / 4"           color="#d97706" />
        <MetricCard icon="📹" label="CCTV Cameras"      value="5 / 6"           color="#0284c7"
          onClick={() => onNavigate('cctv')} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Zone overview */}
        <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'16px 20px' }}>
          <div style={{ fontWeight:700, marginBottom:12, color:'#065f46' }}>📍 Zone Overview</div>
          {sensors.map(z => (
            <div key={z.id} onClick={() => onNavigate('sensors', z.id)}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0',
                borderBottom:'1px solid #f3f4f6', cursor:'pointer' }}>
              <div style={{ width:8, height:8, borderRadius:'50%', flexShrink:0,
                background: z.alert ? '#ef4444' : z.disease !== 'None Detected' ? '#f59e0b' : '#22c55e' }} />
              <div style={{ flex:1, fontSize:13, fontWeight:500 }}>{z.zone}</div>
              <Gauge value={z.drone_health_score} max={100} size={40}
                color={z.drone_health_score > 70 ? '#22c55e' : '#f59e0b'} />
              <span style={{ fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20,
                background: z.disease !== 'None Detected' ? '#fef2f2' : '#f0fdf4',
                color: z.disease !== 'None Detected' ? '#dc2626' : '#16a34a' }}>
                {z.disease !== 'None Detected' ? '⚠' : '✓'}
              </span>
              <Sparkline data={Array.from({length:8},()=>rand(20,80))} color="#0369a1" w={60} h={28} />
            </div>
          ))}
        </div>

        {/* Alerts */}
        <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'16px 20px' }}>
          <div style={{ fontWeight:700, marginBottom:12, color:'#065f46' }}>🔔 Recent Alerts</div>
          {alerts.map(a => (
            <div key={a.id} style={{ padding:'8px 10px', marginBottom:6, borderRadius:8,
              background: sevBg[a.severity], borderLeft:`3px solid ${sev[a.severity]}` }}>
              <div style={{ fontSize:12, color:'#111827', fontWeight:500 }}>{a.msg}</div>
              <div style={{ fontSize:10, color:'#9ca3af', marginTop:2 }}>{a.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather */}
      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12,
        padding:'16px 20px', marginTop:16 }}>
        <div style={{ fontWeight:700, marginBottom:12, color:'#065f46' }}>☀️ 14-Day Weather</div>
        <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:4 }}>
          {weather.slice(0,10).map((w,i) => (
            <div key={i} style={{ flex:'0 0 88px', textAlign:'center', background:'#f0fdf4',
              borderRadius:10, padding:'10px 6px', border:'1px solid #bbf7d0' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#065f46' }}>{w.day}</div>
              <div style={{ fontSize:18, margin:'4px 0' }}>{w.forecast.split(' ')[0]}</div>
              <div style={{ fontSize:12, fontWeight:600 }}>{w.temp_max}°/{w.temp_min}°</div>
              <div style={{ fontSize:10, color:'#0369a1' }}>💧{w.rain_mm}mm</div>
              <div style={{ fontSize:10, color:'#6b7280' }}>{w.humidity}%RH</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
