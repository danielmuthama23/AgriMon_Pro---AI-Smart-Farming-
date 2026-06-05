// ─── Hedera transaction hook ──────────────────────────────────────────────────
import { useState } from 'react'
import { submitTransaction } from '../lib/hedera/transactions'
import { useBudgetStore } from '../store/budgetStore'
import type { HederaTransaction } from '../types/hedera'

export function useHederaTx() {
  const [submitting, setSubmitting] = useState(false)
  const [lastTx, setLastTx] = useState<HederaTransaction | null>(null)
  const addTransaction = useBudgetStore(s => s.addTransaction)

  async function submit(type: 'sale' | 'purchase', description: string, amountKsh: number) {
    setSubmitting(true)
    try {
      const tx = await submitTransaction({ type, description, amountKsh })
      setLastTx(tx)
      addTransaction(tx)
      return tx
    } finally {
      setSubmitting(false)
    }
  }

  return { submit, submitting, lastTx }
}
