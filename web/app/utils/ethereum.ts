import type { BrowserProvider, Signer, TransactionResponse } from 'ethers'
import { isAddress, getAddress } from 'ethers'

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
  resolvedAddress?: string
  originalInput?: string
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

/**
 * Resolve ENS name to Ethereum address
 * @param ensName - ENS name like "vitalik.eth"
 * @param provider - Ethers provider instance
 * @returns Resolved address or null if not found
 */
export async function resolveENSName(
  ensName: string,
  provider: BrowserProvider
): Promise<string | null> {
  try {
    // ethers.js v6 automatically handles ENS resolution
    const address = await provider.resolveName(ensName)
    return address
  } catch (error) {
    console.error('ENS resolution failed:', error)
    return null
  }
}

/**
 * Check if input is valid ENS name format
 * @param input - String to check
 * @returns true if valid ENS name pattern
 */
export function isValidENSName(input: string): boolean {
  // Basic ENS validation - ends with .eth, .xyz, .app, etc.
  const ensPattern = /^[a-zA-Z0-9-]+\.(eth|xyz|app|art|luxe|kred|club)$/
  return ensPattern.test(input.toLowerCase())
}

/**
 * Parse address or ENS name input
 * @param input - Address or ENS name
 * @param provider - Ethers provider for ENS resolution
 * @returns Resolved address or null
 */
export async function parseAddressInput(
  input: string,
  provider: BrowserProvider
): Promise<string | null> {
  // Check if it's already a valid address
  if (isAddress(input)) {
    return getAddress(input) // Normalize the address
  }

  // Check if it looks like an ENS name
  if (isValidENSName(input)) {
    return await resolveENSName(input, provider)
  }

  return null
}
