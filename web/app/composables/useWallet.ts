import { BrowserProvider, formatEther, parseEther, getAddress } from 'ethers'
import type {
  WalletBalance,
  TransactionResult
} from '~/utils/ethereum'
import {
  TEST_RECIPIENT_ADDRESS,
  formatEthBalance,
  formatAddress,
  isValidEthAmount,
  parseAddressInput,
  isValidENSName
} from '~/utils/ethereum'

// Shared state across all useWallet instances (singleton pattern)
let ethersProvider: BrowserProvider | null = null
let ethersSigner: any = null

const walletState = ref({
  isConnected: false,
  address: null as string | null,
  isConnecting: false
})

const balance = ref<WalletBalance | null>(null)
const isLoadingBalance = ref(false)
const isClientMounted = ref(false)

export const useWallet = () => {
  // Check if wallet is available (client-side only)
  const isWalletAvailable = computed(() => {
    return isClientMounted.value && !!window.ethereum
  })

  // Initialize client-side state
  onMounted(() => {
    isClientMounted.value = true
  })

  // Connect to MetaMask
  const connectWallet = async (): Promise<boolean> => {
    if (!isWalletAvailable.value) {
      throw new Error('No wallet detected. Please install MetaMask.')
    }

    try {
      walletState.value.isConnecting = true

      // Request account access
      const accounts = await window.ethereum!.request({
        method: 'eth_requestAccounts'
      })

      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      // Create provider and signer (store outside reactivity)
      ethersProvider = new BrowserProvider(window.ethereum!)
      ethersSigner = await ethersProvider.getSigner()
      const address = await ethersSigner.getAddress()

      walletState.value = {
        isConnected: true,
        address,
        isConnecting: false
      }

      // Setup event listeners
      window.ethereum!.on('accountsChanged', handleAccountsChanged)
      window.ethereum!.on('chainChanged', handleChainChanged)

      // Load initial balance
      await loadBalance()

      return true
    } catch (error: any) {
      walletState.value.isConnecting = false
      throw new Error(error.message || 'Failed to connect wallet')
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.removeAllListeners()
    }

    // Clear ethers objects
    ethersProvider = null
    ethersSigner = null

    walletState.value = {
      isConnected: false,
      address: null,
      isConnecting: false
    }

    balance.value = null
  }

  // Load wallet balance
  const loadBalance = async (): Promise<WalletBalance | null> => {
    if (!walletState.value.isConnected || !walletState.value.address || !ethersProvider) {
      return null
    }

    try {
      isLoadingBalance.value = true

      const balanceWei = await ethersProvider.getBalance(walletState.value.address)
      const balanceEth = formatEther(balanceWei)

      balance.value = {
        wei: balanceWei,
        eth: balanceEth,
        formatted: formatEthBalance(balanceWei)
      }

      return balance.value
    } catch (error) {
      console.error('Failed to load balance:', error)
      return null
    } finally {
      isLoadingBalance.value = false
    }
  }

  // Send ETH to test address
  const sendEth = async (amountEth: string): Promise<TransactionResult> => {
    if (!walletState.value.isConnected || !ethersSigner || !ethersProvider) {
      throw new Error('Wallet not connected')
    }

    if (!isValidEthAmount(amountEth)) {
      throw new Error('Invalid amount. Must be between 0 and 1000 ETH')
    }

    try {
      // Validate recipient address
      const toAddress = getAddress(TEST_RECIPIENT_ADDRESS)
      const value = parseEther(amountEth)

      // Check balance
      const currentBalance = await ethersProvider.getBalance(walletState.value.address!)
      if (currentBalance < value) {
        throw new Error('Insufficient balance')
      }

      // Get gas estimate
      const feeData = await ethersProvider.getFeeData()
      const estimatedGas = await ethersSigner.estimateGas({
        to: toAddress,
        value
      })

      // Calculate total cost
      const gasLimit = (estimatedGas * 110n) / 100n // 10% buffer
      const maxCost = value + (gasLimit * (feeData.maxFeePerGas || feeData.gasPrice || 0n))

      if (currentBalance < maxCost) {
        throw new Error('Insufficient balance for transaction including gas')
      }

      // Send transaction
      const tx = await ethersSigner.sendTransaction({
        to: toAddress,
        value,
        gasLimit
      })

      // Wait for confirmation
      const receipt = await tx.wait(1)

      // Reload balance after successful transaction
      await loadBalance()

      return {
        success: true,
        hash: receipt?.hash
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Transaction failed'
      }
    }
  }

  // Enhanced send function with ENS support
  const sendEthToAddress = async (
    amountEth: string,
    recipient: string
  ): Promise<TransactionResult> => {
    if (!walletState.value.isConnected || !ethersSigner || !ethersProvider) {
      throw new Error('Wallet not connected')
    }

    if (!isValidEthAmount(amountEth)) {
      throw new Error('Invalid amount. Must be between 0 and 1000 ETH')
    }

    try {
      // Resolve ENS name or validate address
      const toAddress = await parseAddressInput(recipient, ethersProvider)

      if (!toAddress) {
        throw new Error(`Invalid recipient: ${recipient}. Must be a valid address or ENS name.`)
      }

      const value = parseEther(amountEth)

      // Check balance
      const currentBalance = await ethersProvider.getBalance(walletState.value.address!)
      if (currentBalance < value) {
        throw new Error('Insufficient balance')
      }

      // Get gas estimate
      const feeData = await ethersProvider.getFeeData()
      const estimatedGas = await ethersSigner.estimateGas({
        to: toAddress,
        value
      })

      // Calculate total cost
      const gasLimit = (estimatedGas * 110n) / 100n // 10% buffer
      const maxCost = value + (gasLimit * (feeData.maxFeePerGas || feeData.gasPrice || 0n))

      if (currentBalance < maxCost) {
        throw new Error('Insufficient balance for transaction including gas')
      }

      // Send transaction
      const tx = await ethersSigner.sendTransaction({
        to: toAddress,
        value,
        gasLimit
      })

      // Wait for confirmation
      const receipt = await tx.wait(1)

      // Reload balance
      await loadBalance()

      return {
        success: true,
        hash: receipt?.hash,
        resolvedAddress: toAddress,
        originalInput: recipient
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Transaction failed'
      }
    }
  }

  // Event handlers
  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet()
    }
    // Could reconnect with new account here if needed
  }

  const handleChainChanged = () => {
    // Reload the page when chain changes
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  // Computed values
  const formattedAddress = computed(() =>
    walletState.value.address ? formatAddress(walletState.value.address) : null
  )

  const formattedBalance = computed(() =>
    balance.value ? balance.value.formatted : null
  )

  return {
    // State
    walletState: readonly(walletState),
    balance: readonly(balance),
    isLoadingBalance: readonly(isLoadingBalance),

    // Computed
    isWalletAvailable,
    formattedAddress,
    formattedBalance,

    // Actions
    connectWallet,
    disconnectWallet,
    loadBalance,
    sendEth,
    sendEthToAddress
  }
}
