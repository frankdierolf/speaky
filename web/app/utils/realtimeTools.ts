/**
 * Real-time Tool Definitions for OpenAI Voice Assistant
 *
 * This file contains all tool definitions that the voice assistant can use.
 * Each tool is categorized and includes comprehensive documentation with example voice commands.
 */

// ===== TYPES =====

export interface BaseToolDefinition {
  type: 'function'
  name: string
  description: string
  parameters: {
    type: 'object'
    strict: true
    properties: Record<string, any>
    required: string[]
  }
}

export interface ToastToolParams {
  title: string
  description?: string
  type?: 'success' | 'error' | 'info' | 'warning'
  icon?: string
}

export interface SendEthParams {
  amount: string
  recipient?: string // Optional recipient (ENS or address)
}

export interface EstimateGasParams {
  amount: string
}

// ===== TOOL CATEGORIES =====

/**
 * UI TOOLS - Tools for user interface interactions
 */
export const UI_TOOLS = {
  /**
   * Display toast notifications
   *
   * Example voice commands:
   * - "Show me a success message"
   * - "Display an error notification"
   * - "Give me a warning about something"
   */
  SHOW_TOAST: {
    type: 'function',
    name: 'show_toast',
    description: 'Display a toast notification to the user. Use this to show success messages, errors, warnings, or general information.',
    parameters: {
      type: 'object',
      strict: true,
      properties: {
        title: {
          type: 'string',
          description: 'The main title of the toast notification (required)'
        },
        description: {
          type: 'string',
          description: 'Optional description text providing more details'
        },
        type: {
          type: 'string',
          enum: ['success', 'error', 'info', 'warning'],
          description: 'The type/color of notification: success (green), error (red), info (blue), warning (yellow)'
        },
        icon: {
          type: 'string',
          description: 'Optional Lucide icon name (e.g., "check", "alert-circle", "info")'
        }
      },
      required: ['title']
    }
  } as BaseToolDefinition
} as const

/**
 * WALLET QUERY TOOLS - Tools for reading wallet information
 */
export const WALLET_QUERY_TOOLS = {
  /**
   * Get current wallet balance
   *
   * Example voice commands:
   * - "What's my wallet balance?"
   * - "How much ETH do I have?"
   * - "Check my balance"
   * - "What's my current balance?"
   */
  GET_BALANCE: {
    type: 'function',
    name: 'get_wallet_balance',
    description: 'Get the current Ethereum wallet balance in ETH. The wallet must be connected first. Returns formatted balance and wallet address.',
    parameters: {
      type: 'object',
      strict: true,
      properties: {},
      required: []
    }
  } as BaseToolDefinition,

  /**
   * Check wallet connection status
   *
   * Example voice commands:
   * - "Is my wallet connected?"
   * - "Am I connected to my wallet?"
   * - "Check wallet connection"
   */
  CHECK_CONNECTION: {
    type: 'function',
    name: 'check_wallet_connection',
    description: 'Check if the Ethereum wallet is currently connected and return connection status with wallet address if available.',
    parameters: {
      type: 'object',
      strict: true,
      properties: {},
      required: []
    }
  } as BaseToolDefinition
} as const

/**
 * TRANSACTION TOOLS - Tools for blockchain transactions
 */
export const TRANSACTION_TOOLS = {
  /**
   * Send Ethereum to an address or ENS name
   *
   * Example voice commands:
   * - "Send 0.01 ETH to vitalik.eth"
   * - "Transfer 0.1 Ethereum to frank.eth"
   * - "Send one ETH to alice.eth"
   * - "Send 0.001 ETH to 0x742d35..."
   * - "Send 0.01 ETH" (uses default test address)
   *
   * Supports ENS names (.eth, .xyz, .app, etc.) and regular addresses
   */
  SEND_ETH: {
    type: 'function',
    name: 'send_ethereum',
    description: 'Send Ethereum to an address or ENS name. User will need to approve the transaction in MetaMask.',
    parameters: {
      type: 'object',
      strict: true,
      properties: {
        amount: {
          type: 'string',
          description: 'The amount of ETH to send as a string (e.g., "0.01", "0.1", "1.0"). Must be between 0 and 1000 ETH.'
        },
        recipient: {
          type: 'string',
          description: 'The recipient address or ENS name (e.g., "vitalik.eth", "0x123..."). If not provided, uses test address.'
        }
      },
      required: ['amount']
    }
  } as BaseToolDefinition,

  /**
   * Estimate gas cost for transaction
   *
   * Example voice commands:
   * - "How much will it cost to send 0.1 ETH?"
   * - "Estimate gas for sending 1 ETH"
   * - "What's the transaction fee?"
   */
  ESTIMATE_GAS: {
    type: 'function',
    name: 'estimate_transaction_gas',
    description: 'Estimate the gas cost for sending a specific amount of ETH. Provides estimated gas fee in ETH and USD equivalent.',
    parameters: {
      type: 'object',
      strict: true,
      properties: {
        amount: {
          type: 'string',
          description: 'The amount of ETH to estimate gas for (e.g., "0.01", "0.1", "1.0")'
        }
      },
      required: ['amount']
    }
  } as BaseToolDefinition
} as const

// ===== COMBINED TOOL DEFINITIONS =====

/**
 * All available tools organized by category
 */
export const ALL_TOOLS = {
  ...UI_TOOLS,
  ...WALLET_QUERY_TOOLS,
  ...TRANSACTION_TOOLS
} as const

/**
 * Array of all tool definitions for OpenAI API
 */
export const TOOL_DEFINITIONS: BaseToolDefinition[] = [
  UI_TOOLS.SHOW_TOAST,
  WALLET_QUERY_TOOLS.GET_BALANCE,
  WALLET_QUERY_TOOLS.CHECK_CONNECTION,
  TRANSACTION_TOOLS.SEND_ETH,
  TRANSACTION_TOOLS.ESTIMATE_GAS
]

/**
 * Tool names for easy reference
 */
export const TOOL_NAMES = {
  SHOW_TOAST: 'show_toast',
  GET_WALLET_BALANCE: 'get_wallet_balance',
  CHECK_WALLET_CONNECTION: 'check_wallet_connection',
  SEND_ETHEREUM: 'send_ethereum',
  ESTIMATE_TRANSACTION_GAS: 'estimate_transaction_gas'
} as const

/**
 * Voice command examples for user guidance
 */
export const VOICE_COMMAND_EXAMPLES = {
  WALLET_BALANCE: [
    'What\'s my wallet balance?',
    'How much ETH do I have?',
    'Check my balance',
    'Show me my current balance'
  ],
  WALLET_CONNECTION: [
    'Is my wallet connected?',
    'Am I connected to my wallet?',
    'Check wallet connection status'
  ],
  SEND_ETH: [
    'Send 0.01 ETH to vitalik.eth',
    'Transfer 0.1 Ethereum to frank.eth',
    'Send one ETH to alice.eth',
    'Send 0.001 ETH to 0x742d35...',
    'Transfer 0.05 ETH to nick.eth'
  ],
  ESTIMATE_GAS: [
    'How much will it cost to send 0.1 ETH?',
    'Estimate gas for sending 1 ETH',
    'What\'s the transaction fee for 0.05 ETH?'
  ],
  TOAST_NOTIFICATIONS: [
    'Show me a success message',
    'Display an error notification',
    'Give me a warning',
    'Show an info message'
  ]
} as const

/**
 * Error codes for standardized error handling
 */
export const TOOL_ERROR_CODES = {
  WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  INVALID_RECIPIENT: 'INVALID_RECIPIENT',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  GAS_ESTIMATION_FAILED: 'GAS_ESTIMATION_FAILED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  USER_REJECTED: 'USER_REJECTED',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const
