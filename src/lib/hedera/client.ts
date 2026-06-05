// ─── Hedera Hashgraph client ──────────────────────────────────────────────────
import type { HederaConfig } from '../../types/hedera'

export type NetworkType = 'mainnet' | 'testnet' | 'previewnet'

const config: HederaConfig = {
  network:    (import.meta.env.VITE_HEDERA_NETWORK as NetworkType) || 'testnet',
  accountId:  import.meta.env.VITE_HEDERA_ACCOUNT_ID  || '0.0.000000',
  privateKey: import.meta.env.VITE_HEDERA_PRIVATE_KEY || '',
}

let _client: unknown = null

export async function getClient() {
  if (_client) return _client
  if (!config.privateKey) {
    console.warn('[Hedera] No private key — running in demo mode')
    return null
  }
  try {
    const { Client, PrivateKey } = await import('@hashgraph/sdk')
    const client = config.network === 'mainnet' ? Client.forMainnet() : Client.forTestnet()
    client.setOperator(config.accountId, PrivateKey.fromString(config.privateKey))
    _client = client
    return client
  } catch (err) {
    console.error('[Hedera] Client init failed:', err)
    return null
  }
}

export function isDemo(): boolean {
  return !config.privateKey || import.meta.env.VITE_USE_REAL_HEDERA !== 'true'
}

export { config as hederaConfig }
