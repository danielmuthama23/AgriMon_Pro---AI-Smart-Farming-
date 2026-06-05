import { useCCTVTick } from '../hooks/useCCTVTick'
import { CCTVCard } from '../components/CCTVCard'
import { activeCCTVSource } from '../data/cctv'
import { CCTV_INCIDENT_LOG } from '../data/cctv'

const feeds = activeCCTVSource.getFeeds()

export function Security() {
  const tick = useCCTVTick()
  return (
    <div>
      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'16px 20px', marginBottom:16 }}>
        <div style={{ fontWeight:700, marginBottom:4, color:'#065f46', fontSize:15 }}>
          📹 CCTV Security · YOLOv8 Object Detection
        </div>
        <div style={{ fontSize:12, color:'#6b7280', marginBottom:14 }}>
          Real-time computer vision · Person/Animal/Vehicle detection · Hedera-immutable incident log
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
          {feeds.map(cam => <CCTVCard key={cam.id} cam={cam} tick={tick} />)}
        </div>
      </div>

      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'16px 20px' }}>
        <div style={{ fontWeight:700, marginBottom:12, color:'#065f46' }}>🚨 Incident Log (Hedera Immutable)</div>
        {CCTV_INCIDENT_LOG.map((e,i) => (
          <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12,
            padding:'10px 0', borderBottom:'1px solid #f3f4f6' }}>
            <div style={{ background: e.event.includes('PERSON') ? '#fef2f2' : '#f0f9ff',
              padding:'4px 8px', borderRadius:6, fontSize:11, fontWeight:700,
              color: e.event.includes('PERSON') ? '#dc2626' : '#0369a1', whiteSpace:'nowrap' }}>
              {e.time}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600 }}>
                {e.event} <span style={{ color:'#6b7280', fontWeight:400 }}>· {e.cam}</span>
              </div>
              <div style={{ fontSize:11, color:'#6b7280' }}>Confidence: {e.conf}% · {e.action}</div>
            </div>
            <div style={{ fontSize:10, color:'#7c3aed', fontFamily:'monospace',
              background:'#faf5ff', padding:'2px 6px', borderRadius:4 }}>⛓ {e.txid}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
