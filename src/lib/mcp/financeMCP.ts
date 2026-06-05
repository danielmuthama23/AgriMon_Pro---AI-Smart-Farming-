// ─── MCP Finance connector ───────────────────────────────────────────────────
import { registerTool } from './mcpClient'
import { activeBudgetSource, activeTransactionSource } from '../../data/budget'

export function initFinanceMCP() {
  registerTool({
    name: 'get_farm_budget',
    description: 'Returns current season input costs and revenue streams with ROI',
    connector: 'financeMCP',
    invoke: async () => {
      const budget = await activeBudgetSource.fetchBudget()
      const totalIn  = budget.input_costs.reduce((s, c) => s + c.amount, 0)
      const totalOut = budget.output_revenue.reduce((s, c) => s + c.amount, 0)
      return { ...budget, total_input: totalIn, total_revenue: totalOut,
        net_profit: totalOut - totalIn, roi_pct: (((totalOut - totalIn) / totalIn) * 100).toFixed(1) }
    },
  })

  registerTool({
    name: 'get_transactions',
    description: 'Returns Hedera-confirmed farm transaction history',
    connector: 'financeMCP',
    invoke: async () => activeTransactionSource.fetchAll(),
  })
}
