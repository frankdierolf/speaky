import type { BrowserProvider, Signer, TransactionResponse } from 'ethers'

// MVP test recipient address - in production this would be configurable
export const TEST_RECIPIENT_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0'

export interface WalletState {
  isConnected: boolean
  address: string | null
  provider: BrowserProvider | null
  signer: Signer | null
  isConnecting: boolean
}

export interface WalletBalance {
  wei: bigint
  eth: string
  formatted: string
}

export interface TransactionResult {
  success: boolean
  hash?: string
  error?: string
}

export interface EthereumWindow {
  ethereum?: {
    request: (args: { method: string, params?: any[] }) => Promise<any>
    on: (event: string, handler: (...args: any[]) => void) => void
    removeAllListeners: () => void
    isMetaMask?: boolean
  }
}

// Extend global Window interface
declare global {
  interface Window extends EthereumWindow {}
}

export function formatEthBalance(wei: bigint): string {
  const eth = Number(wei) / 1e18
  return `${eth.toFixed(4)} ETH`
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function isValidEthAmount(amount: string): boolean {
  try {
    const num = parseFloat(amount)
    return num > 0 && num <= 1000 && !isNaN(num)
  } catch {
    return false
  }
}
