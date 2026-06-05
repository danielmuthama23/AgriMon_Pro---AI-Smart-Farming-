// ─── Zustand budget state store ───────────────────────────────────────────────
import { create } from 'zustand'
import type { Budget } from '../types/farm'
import type { HederaTransaction } from '../types/hedera'
import { activeBudgetSource, activeTransactionSource } from '../data/budget'

interface BudgetState {
  budget:       Budget
  transactions: HederaTransaction[]
  loading:      boolean
  totalInput:   number
  totalRevenue: number
  profit:       number
  roi:          string
  load:         () => Promise<void>
  addTransaction: (tx: HederaTransaction) => void
}

const emptyBudget: Budget = { input_costs: [], output_revenue: [] }

const calcDerived = (budget: Budget) => {
  const totalInput   = budget.input_costs.reduce((s, c) => s + c.amount, 0)
  const totalRevenue = budget.output_revenue.reduce((s, c) => s + c.amount, 0)
  const profit       = totalRevenue - totalInput
  const roi          = totalInput > 0 ? ((profit / totalInput) * 100).toFixed(1) : '0.0'
  return { totalInput, totalRevenue, profit, roi }
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budget:       emptyBudget,
  transactions: [],
  loading:      true,
  totalInput:   0,
  totalRevenue: 0,
  profit:       0,
  roi:          '0.0',

  load: async () => {
    const [budget, transactions] = await Promise.all([
      activeBudgetSource.fetchBudget(),
      activeTransactionSource.fetchAll(),
    ])
    set({ budget, transactions, loading: false, ...calcDerived(budget) })
  },

  addTransaction: (tx) => {
    const txs = [tx, ...get().transactions]
    set({ transactions: txs })
  },
}))
