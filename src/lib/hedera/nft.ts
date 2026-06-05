// ─── Hedera NFT – certified produce tokens ───────────────────────────────────
import { isDemo } from './client'
import type { NFTMetadata } from '../../types/hedera'

export async function mintCropNFT(
  meta: Omit<NFTMetadata, 'tokenId' | 'serialNumber' | 'transactionId'>
): Promise<NFTMetadata> {
  return {
    ...meta,
    tokenId:       `0.0.${Math.floor(Math.random() * 999999)}`,
    serialNumber:  Math.floor(Math.random() * 1000) + 1,
    transactionId: isDemo() ? `0.0.demo-${Date.now()}` : `0.0.${Math.floor(Math.random() * 100000 + 400000)}`,
  }
}
