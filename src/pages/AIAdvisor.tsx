// ─── AI Advisor page ──────────────────────────────────────────────────────────
import { useRef, useEffect } from 'react'
import { useFarmStore } from '../store/farmStore'
import { useBudgetStore } from '../store/budgetStore'
import { useChatStore } from '../store/chatStore'
import { askClaude } from '../lib/ai/claudeClient'
import { buildSystemPrompt } from '../lib/ai/systemPrompt'

const QUICK_PROMPTS = [
  'What diseases are affecting my farm right now?',
  'Which zone needs the most urgent attention?',
  'How can I improve my nitrogen levels?',
  'What is my best ROI crop this season?',
  'Should I irrigate today given the forecast?',
  'Recommend a fertiliser schedule for Zone A',
  'How do I increase dairy milk yields?',
  'What pests should I scout for this month?',
]

export function AIAdvisor() {
  const { sensors, weather } = useFarmStore()
  const { totalInput, totalRevenue, profit, roi } = useBudgetStore()
  const { history, loading, input, setInput, addMsg, setLoading } = useChatStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, loading])

  const send = async (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || loading) return
    setInput('')
    const userMsg = { role: 'user' as const, content: msg }
    addMsg(userMsg)
    setLoading(true)
    const systemPrompt = buildSystemPrompt({ sensors, weather, totalInput, totalRevenue, profit, roi })
    const response = await askClaude([...history, userMsg], systemPrompt)
    addMsg({ role: 'assistant', content: response.content })
    setLoading(false)
  }

  return (
    <div>
      <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:'16px 20px' }}>
        <div style={{ fontWeight:700, marginBottom:4, color:'#065f46', fontSize:15 }}>🤖 AgriSmart AI Advisor</div>
        <div style={{ fontSize:12, color:'#6b7280', marginBottom:14 }}>
          Powered by Claude · Live sensor + weather + budget context injected automatically
        </div>

        {/* Quick prompts */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:14 }}>
          {QUICK_PROMPTS.map(q => (
            <button key={q} onClick={() => send(q)}
              style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:20,
                padding:'6px 12px', fontSize:11, color:'#065f46', cursor:'pointer', fontWeight:500 }}>
              {q}
            </button>
          ))}
        </div>

        {/* Chat window */}
        <div style={{ background:'#f9fafb', borderRadius:10, border:'1px solid #e5e7eb',
          padding:14, marginBottom:12, minHeight:320, maxHeight:440, overflowY:'auto' }}>
          {history.length === 0 && (
            <div style={{ color:'#9ca3af', fontSize:13, textAlign:'center', marginTop:60 }}>
              <div style={{ fontSize:40 }}>🌿</div>
              <div style={{ marginTop:8 }}>
                Ask anything about your farm — diseases, nutrients, weather, yields, or finances.
              </div>
            </div>
          )}
          {history.map((m, i) => (
            <div key={i} style={{ marginBottom:12,
              display:'flex', justifyContent: m.role==='user' ? 'flex-end' : 'flex-start' }}>
              {m.role === 'assistant' && (
                <div style={{ width:28, height:28, borderRadius:'50%', background:'#f0fdf4',
                  border:'1px solid #bbf7d0', display:'flex', alignItems:'center',
                  justifyContent:'center', fontSize:14, flexShrink:0, marginRight:8, marginTop:2 }}>🌿</div>
              )}
              <div style={{
                background: m.role==='user' ? '#065f46' : '#fff',
                color: m.role==='user' ? '#fff' : '#111827',
                borderRadius: m.role==='user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                padding:'10px 14px', fontSize:13, maxWidth:'80%',
                border: m.role==='assistant' ? '1px solid #e5e7eb' : 'none',
                lineHeight:1.7, whiteSpace:'pre-wrap',
              }}>{m.content}</div>
            </div>
          ))}
          {loading && (
            <div style={{ display:'flex', justifyContent:'flex-start', gap:8, alignItems:'center' }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:'#f0fdf4',
                border:'1px solid #bbf7d0', display:'flex', alignItems:'center',
                justifyContent:'center', fontSize:14 }}>🌿</div>
              <div style={{ background:'#fff', border:'1px solid #e5e7eb',
                borderRadius:'16px 16px 16px 4px', padding:'10px 14px', fontSize:13, color:'#9ca3af' }}>
                Analysing your farm data
                <span style={{ animation:'none' }}> ···</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ display:'flex', gap:10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask about crops, soil, weather, finances…"
            style={{ flex:1, padding:'10px 14px', borderRadius:10,
              border:'1px solid #e5e7eb', fontSize:13, outline:'none',
              fontFamily:'inherit' }}
          />
          <button onClick={() => send()} disabled={loading || !input.trim()} style={{
            background:'#065f46', color:'#fff', border:'none', borderRadius:10,
            padding:'10px 22px', fontSize:13, fontWeight:700, cursor:'pointer',
            opacity: loading || !input.trim() ? 0.5 : 1,
          }}>Send ↗</button>
        </div>
      </div>
    </div>
  )
}
