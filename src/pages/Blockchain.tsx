import { useBudgetStore } from '../store/budgetStore'
import { hederaConfig, isDemo } from '../lib/hedera/client'

const MCP_CONNECTORS = [
  { name:'Drone Data Oracle',   status:'active',  desc:'Drone telemetry → Hedera HCS topic stream' },
  { name:'Soil Sensor MCP',     status:'active',  desc:'NPK/moisture readings → immutable records'  },
  { name:'Weather MCP',         status:'active',  desc:'OpenWeather data → farm advisories'          },
  { name:'CCTV Audit MCP',      status:'active',  desc:'Security events → Hedera audit trail'        },
  { name:'Market Price Feed',   status:'pending', desc:'NARIG commodity prices connector'             },
  { name:'Agri-Finance MCP',    status:'active',  desc:'Input purchase + sales tokenisation'         },
]

export function Blockchain() {
  const { transactions, loading } = useBudgetStore()

  return (
    <div>
      {/* Header */}
      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'16px 20px', marginBottom:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
          <span style={{ fontSize:24 }}>⛓</span>
          <div>
            <div style={{ fontWeight:700, fontSize:15, color:'#065f46' }}>Hedera Hashgraph · Farm Ledger</div>
            <div style={{ fontSize:11, color:'#6b7280' }}>
              Immutable records · Carbon-neutral DLT · MCP-connected data oracle ·&nbsp;
              {isDemo() ? (
                <span style={{ color:'#d97706', fontWeight:600 }}>Demo Mode (no credentials)</span>
              ) : (
                <span style={{ color:'#16a34a', fontWeight:600 }}>Connected – {hederaConfig.network}</span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          {[
            { label:'Network',    val: hederaConfig.network,       color:'#7c3aed' },
            { label:'Account ID', val: hederaConfig.accountId,     color:'#065f46' },
            { label:'HBAR Balance',val:'1,284.6 ℏ',               color:'#d97706' },
            { label:'Transactions',val: transactions.length,       color:'#0369a1' },
          ].map(m => (
            <div key={m.label} style={{ flex:'1 1 120px', background:'#f9fafb', borderRadius:10, padding:'12px 14px' }}>
              <div style={{ fontSize:11, color:'#6b7280' }}>{m.label}</div>
              <div style={{ fontSize:14, fontWeight:700, color:m.color }}>{m.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'16px 20px', marginBottom:16 }}>
        <div style={{ fontWeight:700, marginBottom:14, color:'#065f46', fontSize:15 }}>🔗 Transaction History</div>
        {loading ? <div style={{ color:'#6b7280', fontSize:13 }}>Loading…</div> :
          transactions.map((t, i) => (
            <div key={i} style={{ padding:'12px 0', borderBottom:'1px solid #f3f4f6',
              display:'flex', gap:14, alignItems:'flex-start' }}>
              <div style={{ width:36, height:36, borderRadius:8,
                background: t.type==='sale' ? '#f0fdf4' : '#fef2f2',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
                {t.type==='sale' ? '📤' : '📥'}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600 }}>{t.desc}</div>
                <div style={{ fontSize:11, color:'#9ca3af' }}>{t.ts} · TX: {t.id}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:14, fontWeight:700,
                  color: t.type==='sale' ? '#16a34a' : '#dc2626' }}>
                  {t.type==='sale' ? '+' : '−'}KSh {t.amount.toLocaleString()}
                </div>
                <span style={{ background: t.status==='confirmed' ? '#f0fdf4' : '#fffbeb',
                  color: t.status==='confirmed' ? '#16a34a' : '#d97706',
                  fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20 }}>{t.status}</span>
              </div>
            </div>
          ))
        }
      </div>

      {/* MCP connectors */}
      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'16px 20px' }}>
        <div style={{ fontWeight:700, marginBottom:12, color:'#065f46' }}>🔌 MCP Integration Points</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:10 }}>
          {MCP_CONNECTORS.map(m => (
            <div key={m.name} style={{ background: m.status==='active' ? '#f0fdf4' : '#fffbeb',
              border:`1px solid ${m.status==='active' ? '#bbf7d0' : '#fde68a'}`,
              borderRadius:10, padding:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                <span style={{ fontSize:13, fontWeight:700 }}>{m.name}</span>
                <span style={{ background: m.status==='active' ? '#f0fdf4' : '#fffbeb',
                  color: m.status==='active' ? '#16a34a' : '#d97706',
                  fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20 }}>{m.status}</span>
              </div>
              <div style={{ fontSize:11, color:'#6b7280' }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
