/**
 * Real-time Tool Handlers
 *
 * This file contains all the implementation logic for voice assistant tools.
 * Each handler is responsible for executing the actual functionality and
 * providing appropriate responses back to the AI assistant.
 */

import type {
  ToastToolParams,
  SendEthParams,
  EstimateGasParams
} from './realtimeTools'
import { TOOL_ERROR_CODES } from './realtimeTools'
import { TEST_RECIPIENT_ADDRESS, isValidEthAmount, parseAddressInput } from './ethereum'

// ===== TYPES =====

export interface ToolResponse {
  success: boolean
  message: string
  data?: any
  errorCode?: string
}

export interface ToolHandlerContext {
  toast: any
  walletState: any
  loadBalance: () => Promise<any>
  sendEth: (amount: string) => Promise<any>
  sendEthToAddress: (amount: string, recipient: string) => Promise<any>
  estimateGas?: (amount: string) => Promise<any>
}

// ===== UTILITY FUNCTIONS =====

/**
 * Create standardized success response
 */
function createSuccessResponse(message: string, data?: any): ToolResponse {
  return {
    success: true,
    message,
    data
  }
}

/**
 * Create standardized error response
 */
function createErrorResponse(message: string, errorCode?: string): ToolResponse {
  return {
    success: false,
    message,
    errorCode: errorCode || TOOL_ERROR_CODES.UNKNOWN_ERROR
  }
}

/**
 * Validate wallet connection
 */
function validateWalletConnection(walletState: any): ToolResponse | null {
  if (!walletState.value?.isConnected) {
    return createErrorResponse(
      'Wallet not connected. Please connect your MetaMask wallet first to use this feature.',
      TOOL_ERROR_CODES.WALLET_NOT_CONNECTED
    )
  }
  return null
}

// ===== TOOL HANDLERS =====

/**
 * Handle toast notification display
 *
 * Shows user notifications with different types and styling
 */
export async function handleShowToast(
  params: ToastToolParams,
  context: ToolHandlerContext
): Promise<ToolResponse> {
  try {
    const { toast } = context

    // Map notification types to UI colors
    const colorMap = {
      success: 'success',
      error: 'error',
      warning: 'warning',
      info: 'info'
    } as const

    const color = colorMap[params.type as keyof typeof colorMap] || 'primary'

    // Display the toast notification
    toast.add({
      title: params.title,
      description: params.description,
      color: color as 'success' | 'error' | 'warning' | 'info' | 'primary',
      icon: params.icon
    })

    return createSuccessResponse(
      `Toast notification displayed: "${params.title}"`,
      { type: params.type, title: params.title }
    )
  } catch (error: any) {
    return createErrorResponse(
      'Failed to display toast notification',
      TOOL_ERROR_CODES.UNKNOWN_ERROR
    )
  }
}

/**
 * Handle wallet balance retrieval
 *
 * Gets the current ETH balance from the connected wallet
 */
export async function handleGetWalletBalance(
  context: ToolHandlerContext
): Promise<ToolResponse> {
  try {
    const { walletState, loadBalance } = context

    // Check wallet connection
    const connectionError = validateWalletConnection(walletState)
    if (connectionError) return connectionError

    // Load current balance
    const balance = await loadBalance()

    if (!balance) {
      return createErrorResponse(
        'Failed to load wallet balance. Please try again.',
        TOOL_ERROR_CODES.NETWORK_ERROR
      )
    }

    return createSuccessResponse(
      `Your wallet balance is ${balance.formatted}`,
      {
        balance: balance.formatted,
        address: walletState.value.address,
        wei: balance.wei.toString(),
        eth: balance.eth
      }
    )
  } catch (error: any) {
    return createErrorResponse(
      `Failed to get wallet balance: ${error.message}`,
      TOOL_ERROR_CODES.NETWORK_ERROR
    )
  }
}

/**
 * Handle wallet connection status check
 *
 * Returns the current wallet connection status and address
 */
export async function handleCheckWalletConnection(
  context: ToolHandlerContext
): Promise<ToolResponse> {
  try {
    const { walletState } = context

    if (walletState.value?.isConnected && walletState.value?.address) {
      return createSuccessResponse(
        `Wallet is connected to address ${walletState.value.address.slice(0, 6)}...${walletState.value.address.slice(-4)}`,
        {
          isConnected: true,
          address: walletState.value.address,
          shortAddress: `${walletState.value.address.slice(0, 6)}...${walletState.value.address.slice(-4)}`
        }
      )
    } else if (walletState.value?.isConnecting) {
      return createSuccessResponse(
        'Wallet connection is in progress...',
        { isConnected: false, isConnecting: true }
      )
    } else {
      return createSuccessResponse(
        'No wallet is currently connected. Please connect your MetaMask wallet to use blockchain features.',
        { isConnected: false, isConnecting: false }
      )
    }
  } catch (error: any) {
    return createErrorResponse(
      'Failed to check wallet connection status',
      TOOL_ERROR_CODES.UNKNOWN_ERROR
    )
  }
}

/**
 * Handle Ethereum transaction sending
 *
 * Sends ETH to the predefined test address with user approval
 */
export async function handleSendEthereum(
  params: SendEthParams,
  context: ToolHandlerContext
): Promise<ToolResponse> {
  try {
    const { walletState, sendEthToAddress, toast } = context

    // Check wallet connection
    const connectionError = validateWalletConnection(walletState)
    if (connectionError) return connectionError

    // Validate amount
    if (!isValidEthAmount(params.amount)) {
      return createErrorResponse(
        `Invalid amount: "${params.amount}". Please specify a valid amount between 0 and 1000 ETH.`,
        TOOL_ERROR_CODES.INVALID_AMOUNT
      )
    }

    // Use provided recipient or fall back to test address
    const recipient = params.recipient || TEST_RECIPIENT_ADDRESS

    // Show pending toast for ENS resolution if needed
    if (params.recipient && params.recipient.includes('.')) {
      toast.add({
        title: 'Resolving ENS Name',
        description: `Looking up ${params.recipient}...`,
        color: 'info'
      })
    }

    // Attempt to send transaction
    const result = await sendEthToAddress(params.amount, recipient)

    if (result.success) {
      // Format success message based on whether ENS was used
      const recipientDisplay = params.recipient
        ? `${params.recipient}${result.resolvedAddress !== params.recipient ? ` (${result.resolvedAddress?.slice(0, 6)}...${result.resolvedAddress?.slice(-4)})` : ''}`
        : `test address`

      toast.add({
        title: 'Transaction Sent!',
        description: `Successfully sent ${params.amount} ETH to ${recipientDisplay}`,
        color: 'success'
      })

      return createSuccessResponse(
        `Successfully sent ${params.amount} ETH to ${recipientDisplay}! Transaction hash: ${result.hash}`,
        {
          amount: params.amount,
          hash: result.hash,
          recipient: recipient,
          resolvedAddress: result.resolvedAddress
        }
      )
    } else {
      // Enhanced error handling for ENS failures
      let errorMessage = result.error || 'Transaction failed'
      let errorCode = TOOL_ERROR_CODES.TRANSACTION_FAILED

      if (result.error?.includes('Invalid recipient')) {
        errorMessage = `Could not resolve "${recipient}". Please check the ENS name or address.`
        errorCode = TOOL_ERROR_CODES.INVALID_RECIPIENT
      } else if (result.error?.includes('insufficient')) {
        errorCode = TOOL_ERROR_CODES.INSUFFICIENT_BALANCE
      } else if (result.error?.includes('rejected')) {
        errorCode = TOOL_ERROR_CODES.USER_REJECTED
      }

      toast.add({
        title: 'Transaction Failed',
        description: errorMessage,
        color: 'error'
      })

      return createErrorResponse(errorMessage, errorCode)
    }
  } catch (error: any) {
    // Show error toast
    context.toast.add({
      title: 'Transaction Error',
      description: error.message || 'Failed to send transaction',
      color: 'error'
    })

    return createErrorResponse(
      `Failed to send ETH: ${error.message}`,
      TOOL_ERROR_CODES.TRANSACTION_FAILED
    )
  }
}

/**
 * Handle gas estimation for transactions
 *
 * Estimates the gas cost for sending a specific amount of ETH
 */
export async function handleEstimateGas(
  params: EstimateGasParams,
  context: ToolHandlerContext
): Promise<ToolResponse> {
  try {
    const { walletState, estimateGas } = context

    // Check wallet connection
    const connectionError = validateWalletConnection(walletState)
    if (connectionError) return connectionError

    // Validate amount
    if (!isValidEthAmount(params.amount)) {
      return createErrorResponse(
        `Invalid amount: "${params.amount}". Please specify a valid amount between 0 and 1000 ETH.`,
        TOOL_ERROR_CODES.INVALID_AMOUNT
      )
    }

    // Estimate gas (if function is available)
    if (!estimateGas) {
      return createErrorResponse(
        'Gas estimation feature is not yet implemented',
        TOOL_ERROR_CODES.UNKNOWN_ERROR
      )
    }

    const gasEstimate = await estimateGas(params.amount)

    if (!gasEstimate) {
      return createErrorResponse(
        'Failed to estimate gas costs. Please try again.',
        TOOL_ERROR_CODES.GAS_ESTIMATION_FAILED
      )
    }

    return createSuccessResponse(
      `Estimated gas cost for sending ${params.amount} ETH: ${gasEstimate.formatted}`,
      {
        amount: params.amount,
        gasEstimate: gasEstimate.formatted,
        gasCostWei: gasEstimate.wei.toString(),
        gasCostEth: gasEstimate.eth
      }
    )
  } catch (error: any) {
    return createErrorResponse(
      `Failed to estimate gas: ${error.message}`,
      TOOL_ERROR_CODES.GAS_ESTIMATION_FAILED
    )
  }
}

// ===== EXPORT ALL HANDLERS =====

export const TOOL_HANDLERS = {
  show_toast: handleShowToast,
  get_wallet_balance: handleGetWalletBalance,
  check_wallet_connection: handleCheckWalletConnection,
  send_ethereum: handleSendEthereum,
  estimate_transaction_gas: handleEstimateGas
} as const
