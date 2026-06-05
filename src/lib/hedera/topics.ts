// ─── Hedera Consensus Service ─────────────────────────────────────────────────
import { getClient, isDemo } from './client'
import type { SensorReading } from '../../types/farm'

export async function publishSensorReading(reading: SensorReading): Promise<void> {
  if (isDemo()) { console.debug('[HCS] demo publish:', reading.zone); return }
  const client = await getClient()
  if (!client) return
  const { TopicMessageSubmitTransaction } = await import('@hashgraph/sdk')
  const topicId = import.meta.env.VITE_HEDERA_SENSOR_TOPIC_ID || '0.0.1234568'
  await new (TopicMessageSubmitTransaction as any)()
    .setTopicId(topicId).setMessage(JSON.stringify(reading)).execute(client)
}

export async function createFarmTopic(memo: string): Promise<string> {
  if (isDemo()) return `0.0.${Math.floor(Math.random() * 999999)}`
  const client = await getClient()
  if (!client) throw new Error('Client unavailable')
  const { TopicCreateTransaction } = await import('@hashgraph/sdk')
  const tx = await new (TopicCreateTransaction as any)().setTopicMemo(memo).execute(client)
  const receipt = await tx.getReceipt(client)
  return receipt.topicId!.toString()
}
