import { useBudgetStore } from '../store/budgetStore'
import { useHederaTx } from '../hooks/useHederaTx'
import { BarChart } from '../components/BarChart'

export function Budget() {
  const { budget, transactions, totalInput, totalRevenue, profit, roi, loading } = useBudgetStore()
  const { submit, submitting, lastTx } = useHederaTx()

  if (loading) return <div style={{ padding:40, textAlign:'center', color:'#6b7280' }}>Loading…</div>

  return (
    <div>
      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:16 }}>
        {[
          { label:'Total Input Cost',    val:`KSh ${totalInput.toLocaleString()}`,   color:'#dc2626', icon:'📤' },
          { label:'Total Revenue',       val:`KSh ${totalRevenue.toLocaleString()}`, color:'#16a34a', icon:'📥' },
          { label:`Net Profit (ROI ${roi}%)`, val:`KSh ${profit.toLocaleString()}`,
            color: profit > 0 ? '#16a34a' : '#dc2626', icon:'💰' },
        ].map(m => (
          <div key={m.label} style={{ background:'#fff', border:`2px solid ${m.color}30`,
            borderRadius:12, padding:'20px 18px', textAlign:'center' }}>
            <div style={{ fontSize:28 }}>{m.icon}</div>
            <div style={{ fontSize:22, fontWeight:800, color:m.color, marginTop:4 }}>{m.val}</div>
            <div style={{ fontSize:11, color:'#6b7280', marginTop:4 }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
        {/* Inputs */}
        <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'16px 20px' }}>
          <div style={{ fontWeight:700, marginBottom:14, color:'#dc2626' }}>📤 Input Costs (KSh)</div>
          {budget.input_costs.map(c => (
            <div key={c.item} style={{ display:'flex', justifyContent:'space-between',
              alignItems:'center', padding:'7px 0', borderBottom:'1px solid #f3f4f6' }}>
              <span style={{ fontSize:13 }}>{c.item}</span>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:70, height:5, background:'#e5e7eb', borderRadius:3 }}>
                  <div style={{ height:5, borderRadius:3, background:'#ef4444',
                    width:`${(c.amount/totalInput)*100}%` }} />
                </div>
                <span style={{ fontSize:13, fontWeight:600, color:'#dc2626', minWidth:70, textAlign:'right' }}>
                  {c.amount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
          <div style={{ marginTop:12, textAlign:'right', fontWeight:700, color:'#dc2626' }}>
            Total: KSh {totalInput.toLocaleString()}
          </div>
        </div>

        {/* Revenue */}
        <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'16px 20px' }}>
          <div style={{ fontWeight:700, marginBottom:14, color:'#16a34a' }}>📥 Revenue (KSh)</div>
          {budget.output_revenue.map(r => (
            <div key={r.item} style={{ display:'flex', justifyContent:'space-between',
              alignItems:'center', padding:'7px 0', borderBottom:'1px solid #f3f4f6' }}>
              <span style={{ fontSize:13 }}>{r.item}</span>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:70, height:5, background:'#e5e7eb', borderRadius:3 }}>
                  <div style={{ height:5, borderRadius:3, background:'#16a34a',
                    width:`${(r.amount/totalRevenue)*100}%` }} />
                </div>
                <span style={{ fontSize:13, fontWeight:600, color:'#16a34a', minWidth:70, textAlign:'right' }}>
                  {r.amount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
          <div style={{ marginTop:12, textAlign:'right', fontWeight:700, color:'#16a34a' }}>
            Total: KSh {totalRevenue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'16px 20px', marginBottom:16 }}>
        <div style={{ fontWeight:700, marginBottom:12, color:'#065f46' }}>📊 Revenue vs Cost (KSh '000)</div>
        <BarChart
          data={[
            ...budget.input_costs.map(c => ({ label:c.item.split(' ')[0], value:Math.round(c.amount/1000) })),
            ...budget.output_revenue.map(r => ({ label:r.item.split(' ')[0], value:Math.round(r.amount/1000) })),
          ]}
          color="#065f46" width={700} height={130}
        />
      </div>

      {/* Quick transaction recorder */}
      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'16px 20px', marginBottom:16 }}>
        <div style={{ fontWeight:700, marginBottom:12, color:'#065f46' }}>⚡ Record Transaction (Hedera)</div>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          {[
            { label:'Record Maize Sale', type:'sale' as const, desc:'Maize – 1t @ KSh 45,000', amount:45000 },
            { label:'Record Input Purchase', type:'purchase' as const, desc:'DAP Fertiliser – 50kg', amount:6500 },
          ].map(btn => (
            <button key={btn.label} disabled={submitting}
              onClick={() => submit(btn.type, btn.desc, btn.amount)}
              style={{ background:'#065f46', color:'#fff', border:'none', borderRadius:8,
                padding:'10px 18px', fontSize:12, fontWeight:600, cursor:'pointer',
                opacity: submitting ? 0.6 : 1 }}>
              {submitting ? 'Submitting…' : btn.label}
            </button>
          ))}
        </div>
        {lastTx && (
          <div style={{ marginTop:10, fontSize:12, color:'#7c3aed', background:'#faf5ff',
            borderRadius:6, padding:'8px 12px' }}>
            ✅ TX confirmed: {lastTx.id} · {lastTx.desc} · KSh {lastTx.amount.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  )
}
