// ─── Hedera immutable security incident audit log ────────────────────────────
import { getClient, isDemo } from './client'

export interface SecurityIncident {
  cameraId: number; cameraName: string; event: string
  confidence: number; action: string; timestamp: number
}

export async function logSecurityIncident(incident: SecurityIncident): Promise<string> {
  const demoTxId = `0.0.${Math.floor(Math.random() * 100000 + 400000)}`
  if (isDemo()) { console.info('[Hedera Audit] demo:', incident.event, demoTxId); return demoTxId }
  const client = await getClient()
  if (!client) return demoTxId
  const { TopicMessageSubmitTransaction } = await import('@hashgraph/sdk')
  const topicId = import.meta.env.VITE_HEDERA_AUDIT_TOPIC_ID || '0.0.1234569'
  const tx = await new (TopicMessageSubmitTransaction as any)()
    .setTopicId(topicId).setMessage(JSON.stringify({ ...incident, type: 'security_incident' })).execute(client)
  return tx.transactionId.toString()
}
