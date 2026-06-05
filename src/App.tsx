// ─── App root — router, global init, layout shell ────────────────────────────
import { useState, useEffect } from 'react'
import { useFarmStore } from './store/farmStore'
import { useBudgetStore } from './store/budgetStore'
import { useLiveSensors } from './hooks/useLiveSensors'

// Pages
import { Dashboard }  from './pages/Dashboard'
import { Sensors }    from './pages/Sensors'
import { Disease }    from './pages/Disease'
import { Security }   from './pages/Security'
import { Livestock }  from './pages/Livestock'
import { Budget }     from './pages/Budget'
import { Blockchain } from './pages/Blockchain'
import { AIAdvisor }  from './pages/AIAdvisor'
import { Practices }  from './pages/Practices'

// Components
import { AlertBar } from './components/AlertBar'
import { NavBar }   from './components/NavBar'

// MCP bootstrap
import { initDroneOracle }     from './lib/mcp/droneOracle'
import { initSoilSensorMCP }   from './lib/mcp/soilSensorMCP'
import { initWeatherMCP }      from './lib/mcp/weatherMCP'
import { initMarketPriceMCP }  from './lib/mcp/marketPriceMCP'
import { initFinanceMCP }      from './lib/mcp/financeMCP'

const TABS = [
  { id: 'dashboard', label: '📊 Dashboard'       },
  { id: 'sensors',   label: '🌡️ Sensors & Drones' },
  { id: 'disease',   label: '🔬 Disease & Soil'   },
  { id: 'cctv',      label: '📹 CCTV Security'    },
  { id: 'livestock', label: '🐄 Livestock'         },
  { id: 'budget',    label: '💰 Budget & Finance'  },
  { id: 'hedera',    label: '🔗 Blockchain'        },
  { id: 'ai',        label: '🤖 AI Advisor'        },
  { id: 'practices', label: '📚 Best Practices'    },
]

// Boot MCP connectors once
let mcpBooted = false
function bootMCP() {
  if (mcpBooted) return
  mcpBooted = true
  initDroneOracle()
  initSoilSensorMCP()
  initWeatherMCP()
  initMarketPriceMCP()
  initFinanceMCP()
  console.info('[MCP] All connectors registered')
}

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const { alerts, setZone } = useFarmStore()
  const { load: loadBudget } = useBudgetStore()

  // Live sensor refresh every second
  useLiveSensors()

  useEffect(() => {
    bootMCP()
    loadBudget()
  }, [])

  // Allow pages to navigate programmatically
  const handleNavigate = (targetTab: string, zone?: number) => {
    setTab(targetTab)
    if (zone !== undefined) setZone(zone)
  }

  const renderPage = () => {
    switch (tab) {
      case 'dashboard': return <Dashboard onNavigate={handleNavigate} />
      case 'sensors':   return <Sensors />
      case 'disease':   return <Disease />
      case 'cctv':      return <Security />
      case 'livestock': return <Livestock />
      case 'budget':    return <Budget />
      case 'hedera':    return <Blockchain />
      case 'ai':        return <AIAdvisor />
      case 'practices': return <Practices />
      default:          return <Dashboard onNavigate={handleNavigate} />
    }
  }

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:'#f0f4f0', minHeight:'100vh', fontSize:14 }}>

      {/* ── Header ── */}
      <div style={{ background:'linear-gradient(135deg,#064e3b 0%,#065f46 60%,#047857 100%)',
        color:'#fff', padding:'12px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:28 }}>🌿</span>
          <div>
            <div style={{ fontSize:18, fontWeight:700, letterSpacing:-0.5 }}>AgriSmart Pro</div>
            <div style={{ fontSize:11, opacity:0.75 }}>
              Precision Farm Intelligence · MCP + Hedera Secured · YOLOv8 Vision · Claude AI
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:16, alignItems:'center' }}>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:11, opacity:0.7 }}>Farm Status</div>
            <div style={{ fontSize:13, fontWeight:600 }}>
              {new Date().toLocaleDateString('en-KE', { weekday:'short', day:'numeric', month:'short', year:'numeric' })}
            </div>
          </div>
          <div title="System Online" style={{ width:10, height:10, borderRadius:'50%',
            background:'#4ade80', boxShadow:'0 0 8px #4ade80' }} />
        </div>
      </div>

      {/* ── Alert bar ── */}
      <AlertBar alerts={alerts} />

      {/* ── Nav ── */}
      <NavBar tabs={TABS} active={tab} onChange={setTab} />

      {/* ── Page content ── */}
      <div style={{ padding:'20px', maxWidth:1100, margin:'0 auto' }}>
        {renderPage()}
      </div>

      {/* ── Footer ── */}
      <div style={{ background:'#064e3b', color:'#a7f3d0', textAlign:'center',
        padding:'12px 20px', fontSize:11, marginTop:20 }}>
        AgriSmart Pro · MCP Integrated · Hedera Hashgraph Secured · YOLOv8 Computer Vision · Claude AI Advisor
        <br />
        <span style={{ opacity:0.6 }}>Synthetic data mode active — configure .env to connect real data sources</span>
      </div>
    </div>
  )
}
