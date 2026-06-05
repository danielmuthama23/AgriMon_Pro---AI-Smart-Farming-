// ─── Budget & transaction data ────────────────────────────────────────────────
// SWAP POINT: replace generateBudget / generateTransactions with Hedera ledger reads

import type { Budget } from '../types/farm'
import type { HederaTransaction } from '../types/hedera'

export interface BudgetDataSource {
  fetchBudget: () => Promise<Budget> | Budget
}

export interface TransactionDataSource {
  fetchAll: () => Promise<HederaTransaction[]> | HederaTransaction[]
}

// ── Synthetic ─────────────────────────────────────────────────────────────────

export const syntheticBudgetSource: BudgetDataSource = {
  fetchBudget: (): Budget => ({
    input_costs: [
      { item: 'Seeds',            amount: 18500, category: 'inputs'    },
      { item: 'Fertilisers',      amount: 34200, category: 'inputs'    },
      { item: 'Pesticides',       amount: 12400, category: 'inputs'    },
      { item: 'Irrigation Water', amount:  8700, category: 'inputs'    },
      { item: 'Labour',           amount: 45000, category: 'labour'    },
      { item: 'Machinery Hire',   amount: 22000, category: 'machinery' },
      { item: 'Animal Feed',      amount: 38600, category: 'livestock' },
      { item: 'Veterinary',       amount:  9800, category: 'livestock' },
    ],
    output_revenue: [
      { item: 'Maize Sales',    amount: 128000 },
      { item: 'Tomato Sales',   amount:  87500 },
      { item: 'Bean Sales',     amount:  42000 },
      { item: 'Milk Sales',     amount:  96000 },
      { item: 'Eggs (trays)',   amount:  38400 },
      { item: 'Livestock Sales',amount:  75000 },
    ],
  }),
}

export const syntheticTransactionSource: TransactionDataSource = {
  fetchAll: (): HederaTransaction[] => [
    { id: '0.0.487293', type: 'sale',     desc: 'Maize – 3.5t @ KSh 45,000/t',     amount: 157500, status: 'confirmed', ts: '2025-06-03 10:42' },
    { id: '0.0.487101', type: 'purchase', desc: 'Urea Fertiliser – 200kg',           amount:  12400, status: 'confirmed', ts: '2025-06-02 09:15' },
    { id: '0.0.486920', type: 'sale',     desc: 'Milk – 480L @ KSh 50/L',           amount:  24000, status: 'confirmed', ts: '2025-06-01 16:30' },
    { id: '0.0.486734', type: 'purchase', desc: 'Broiler Chick Purchase – 500',      amount:  37500, status: 'pending',   ts: '2025-05-31 11:00' },
    { id: '0.0.486510', type: 'sale',     desc: 'Tomatoes – 800kg @ KSh 80/kg',     amount:  64000, status: 'confirmed', ts: '2025-05-30 08:45' },
    { id: '0.0.486300', type: 'purchase', desc: 'Pesticides – lambda-cyhalothrin 5L',amount:   4200, status: 'confirmed', ts: '2025-05-28 14:20' },
  ],
}

// Real Hedera ledger source example:
//
// export const hederaTransactionSource: TransactionDataSource = {
//   fetchAll: async (): Promise<HederaTransaction[]> => {
//     const { hederaClient } = await import('../lib/hedera/client')
//     return hederaClient.getAccountTransactions()
//   }
// }

export const activeBudgetSource: BudgetDataSource =
  import.meta.env.VITE_USE_REAL_HEDERA === 'true'
    ? syntheticBudgetSource   // swap: hederaBudgetSource
    : syntheticBudgetSource

export const activeTransactionSource: TransactionDataSource =
  import.meta.env.VITE_USE_REAL_HEDERA === 'true'
    ? syntheticTransactionSource  // swap: hederaTransactionSource
    : syntheticTransactionSource
