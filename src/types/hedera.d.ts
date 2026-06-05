// ─── Hedera Hashgraph types ───────────────────────────────────────────────────

export interface HederaTransaction {
  id: string             // e.g. 0.0.487293
  type: 'sale' | 'purchase' | 'audit' | 'nft_mint'
  desc: string
  amount: number
  status: 'confirmed' | 'pending' | 'failed'
  ts: string
  topicId?: string
}

export interface TopicMessage {
  topicId: string
  sequenceNumber: number
  contents: string       // JSON stringified sensor reading
  consensusTimestamp: string
}

export interface NFTMetadata {
  tokenId: string
  serialNumber: number
  zone: string
  cropType: string
  yieldTonnes: number
  soilPh: number
  certifiedDate: string
  transactionId: string
}

export interface HederaConfig {
  network: 'mainnet' | 'testnet' | 'previewnet'
  accountId: string
  privateKey: string
}
