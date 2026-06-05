// ─── Hedera transaction submission ───────────────────────────────────────────
import { getClient, isDemo } from './client'
import type { HederaTransaction } from '../../types/hedera'

interface TxPayload {
  type: 'sale' | 'purchase'
  description: string
  amountKsh: number
  memo?: string
}

export async function submitTransaction(payload: TxPayload): Promise<HederaTransaction> {
  if (isDemo()) {
    return {
      id:     `0.0.${Math.floor(Math.random() * 100000 + 400000)}`,
      type:   payload.type,
      desc:   payload.description,
      amount: payload.amountKsh,
      status: 'confirmed',
      ts:     new Date().toISOString().slice(0, 16).replace('T', ' '),
    }
  }
  const client = await getClient()
  if (!client) throw new Error('Hedera client unavailable')
  const { TopicMessageSubmitTransaction } = await import('@hashgraph/sdk')
  const topicId = import.meta.env.VITE_HEDERA_TX_TOPIC_ID || '0.0.1234567'
  const txResponse = await new (TopicMessageSubmitTransaction as any)()
    .setTopicId(topicId)
    .setMessage(JSON.stringify({ ...payload, ts: Date.now() }))
    .execute(client)
  const receipt = await txResponse.getReceipt(client)
  return {
    id:     txResponse.transactionId.toString(),
    type:   payload.type,
    desc:   payload.description,
    amount: payload.amountKsh,
    status: receipt.status.toString() === 'SUCCESS' ? 'confirmed' : 'failed',
    ts:     new Date().toISOString().slice(0, 16).replace('T', ' '),
    topicId,
  }
}

export const submitCropSale = (crop: string, tonnes: number, pricePerTonne: number) =>
  submitTransaction({ type: 'sale', description: `${crop} – ${tonnes}t @ KSh ${pricePerTonne.toLocaleString()}/t`, amountKsh: tonnes * pricePerTonne, memo: 'crop_sale' })

export const submitInputPurchase = (item: string, amountKsh: number) =>
  submitTransaction({ type: 'purchase', description: item, amountKsh, memo: 'input_purchase' })
