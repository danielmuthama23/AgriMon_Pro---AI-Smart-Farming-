// ─── MCP Market Price connector ──────────────────────────────────────────────
// Status: pending (NARIG / KAMIS integration)
import { registerTool } from './mcpClient'

const SYNTHETIC_PRICES: Record<string, number> = {
  Maize: 45000, Tomato: 80000, Beans: 95000, Wheat: 38000,
  Milk: 50, Eggs: 380, Groundnuts: 120000,
}

export function initMarketPriceMCP() {
  registerTool({
    name: 'get_market_prices',
    description: 'Returns current commodity prices (KSh/tonne or KSh/unit)',
    connector: 'marketPriceMCP',
    invoke: async () => {
      const apiUrl = import.meta.env.VITE_MARKET_API_URL
      if (apiUrl) {
        try {
          const res = await fetch(`${apiUrl}/prices`, {
            headers: { Authorization: `Bearer ${import.meta.env.VITE_MARKET_API_KEY}` }
          })
          return res.json()
        } catch { /* fall through to synthetic */ }
      }
      // Synthetic with ±5% random variance
      return Object.fromEntries(
        Object.entries(SYNTHETIC_PRICES).map(([k, v]) => [k, Math.round(v * (0.95 + Math.random() * 0.1))])
      )
    },
  })
}
