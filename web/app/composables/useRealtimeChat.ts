import {
  TOOL_DEFINITIONS,
  TOOL_NAMES
} from '~/utils/realtimeTools'
import {
  TOOL_HANDLERS,
  type ToolHandlerContext,
  type ToolResponse
} from '~/utils/toolHandlers'
import {
  SYSTEM_INSTRUCTIONS
} from '~/utils/systemInstructions'

export interface RealtimeEvent {
  type: string
  event_id?: string
  timestamp?: string
  [key: string]: unknown
}

export interface RealtimeSession {
  isActive: boolean
  isConnecting: boolean
  events: RealtimeEvent[]
}

export const useRealtimeChat = () => {
  const peerConnection = ref<RTCPeerConnection | null>(null)
  const dataChannel = ref<RTCDataChannel | null>(null)
  const audioElement = ref<HTMLAudioElement | null>(null)
  const session = ref<RealtimeSession>({
    isActive: false,
    isConnecting: false,
    events: []
  })

  // Track if session has been initialized with tools
  const sessionInitialized = ref(false)

  // Set up tool handler context
  const toast = useToast()
  const { walletState, loadBalance, sendEth } = useWallet()

  const toolContext: ToolHandlerContext = {
    toast,
    walletState,
    loadBalance,
    sendEth
  }

  // Initialize session with tools and instructions
  const initializeSession = () => {
    if (sessionInitialized.value || !dataChannel.value) return

    console.log('Initializing session with tools and instructions')

    const sessionUpdate: RealtimeEvent = {
      type: 'session.update',
      session: {
        type: 'realtime',
        instructions: SYSTEM_INSTRUCTIONS,
        tools: TOOL_DEFINITIONS,
        tool_choice: 'auto'
      }
    }

    sendClientEvent(sessionUpdate)

    // Send initial greeting message
    setTimeout(() => {
      sendClientEvent({
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'system',
          content: [
            {
              type: 'input_text',
              text: 'Session initialized. You are now Speaky, an Ethereum wallet assistant. Greet the user warmly and let them know you can help with wallet operations. If their wallet isn\'t connected, encourage them to connect it first.'
            }
          ]
        }
      })
      sendClientEvent({ type: 'response.create' })
    }, 100)

    sessionInitialized.value = true
  }

  // Handle function calls from the AI
  const handleFunctionCall = async (functionCall: unknown) => {
    const call = functionCall as { name?: string, arguments?: string, call_id?: string }

    if (!call.name || !TOOL_HANDLERS[call.name as keyof typeof TOOL_HANDLERS]) {
      console.error(`Unknown tool: ${call.name}`)
      return
    }

    try {
      let result: ToolResponse
      const params = call.arguments ? JSON.parse(call.arguments) : {}

      // Route to appropriate handler
      switch (call.name) {
        case TOOL_NAMES.SHOW_TOAST:
          result = await TOOL_HANDLERS.show_toast(params, toolContext)
          break

        case TOOL_NAMES.GET_WALLET_BALANCE:
          result = await TOOL_HANDLERS.get_wallet_balance(toolContext)
          break

        case TOOL_NAMES.CHECK_WALLET_CONNECTION:
          result = await TOOL_HANDLERS.check_wallet_connection(toolContext)
          break

        case TOOL_NAMES.SEND_ETHEREUM:
          result = await TOOL_HANDLERS.send_ethereum(params, toolContext)
          break

        case TOOL_NAMES.ESTIMATE_TRANSACTION_GAS:
          result = await TOOL_HANDLERS.estimate_transaction_gas(params, toolContext)
          break

        default:
          result = {
            success: false,
            message: `Tool ${call.name} is not implemented yet`,
            errorCode: 'NOT_IMPLEMENTED'
          }
      }

      // Send response back to AI
      setTimeout(() => {
        sendClientEvent({
          type: 'conversation.item.create',
          item: {
            type: 'function_call_output',
            call_id: call.call_id || '',
            output: JSON.stringify(result)
          }
        })
        sendClientEvent({ type: 'response.create' })
      }, 100)
    } catch (error: unknown) {
      console.error('Tool execution error:', error)

      // Send error response
      setTimeout(() => {
        sendClientEvent({
          type: 'conversation.item.create',
          item: {
            type: 'function_call_output',
            call_id: call.call_id || '',
            output: JSON.stringify({
              success: false,
              message: `Failed to execute ${call.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
              errorCode: 'EXECUTION_ERROR'
            })
          }
        })
        sendClientEvent({ type: 'response.create' })
      }, 100)
    }
  }

  const sendClientEvent = (message: RealtimeEvent) => {
    if (!dataChannel.value) return

    message.event_id = message.event_id || crypto.randomUUID()
    dataChannel.value.send(JSON.stringify(message))

    if (!message.timestamp) {
      message.timestamp = new Date().toLocaleTimeString()
    }
    session.value.events.unshift(message)
  }

  const sendTextMessage = (text: string) => {
    const event: RealtimeEvent = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text
          }
        ]
      }
    }

    sendClientEvent(event)
    sendClientEvent({ type: 'response.create' })
  }

  const startSession = async () => {
    if (!import.meta.client) return

    try {
      session.value.isConnecting = true

      const tokenData = await $fetch('/api/token') as { value: string }
      const EPHEMERAL_KEY = tokenData.value

      const pc = new RTCPeerConnection()

      audioElement.value = document.createElement('audio')
      audioElement.value.autoplay = true
      pc.ontrack = (e) => {
        if (audioElement.value && e.streams.length > 0) {
          audioElement.value.srcObject = e.streams[0] as MediaProvider
        }
      }

      const ms = await navigator.mediaDevices.getUserMedia({ audio: true })
      const tracks = ms.getTracks()
      if (tracks.length > 0 && tracks[0]) {
        pc.addTrack(tracks[0], ms)
      }

      const dc = pc.createDataChannel('oai-events')
      dataChannel.value = dc

      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      const baseUrl = 'https://api.openai.com/v1/realtime/calls'
      const model = 'gpt-realtime'
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          'Authorization': `Bearer ${EPHEMERAL_KEY}`,
          'Content-Type': 'application/sdp'
        }
      })

      const sdp = await sdpResponse.text()
      const answer = { type: 'answer' as RTCSdpType, sdp }
      await pc.setRemoteDescription(answer)

      peerConnection.value = pc
    } catch (error) {
      session.value.isConnecting = false
      throw error
    }
  }

  const stopSession = () => {
    if (dataChannel.value) {
      dataChannel.value.close()
    }

    if (peerConnection.value) {
      peerConnection.value.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop()
        }
      })
      peerConnection.value.close()
    }

    session.value.isActive = false
    session.value.isConnecting = false
    dataChannel.value = null
    peerConnection.value = null
  }

  // Set up event listeners when data channel is available
  watchEffect(() => {
    if (dataChannel.value) {
      // Append new server events to the list and handle them immediately
      dataChannel.value.addEventListener('message', (e) => {
        const event: RealtimeEvent = JSON.parse(e.data)
        if (!event.timestamp) {
          event.timestamp = new Date().toLocaleTimeString()
        }
        session.value.events.unshift(event)

        // Handle session initialization
        if (event.type === 'session.created') {
          initializeSession()
        }

        // Handle function calls in response.done events
        if (event.type === 'response.done' && 'response' in event && event.response && typeof event.response === 'object' && 'output' in event.response) {
          const response = event.response as { output: unknown[] }
          response.output.forEach((output: unknown) => {
            if (typeof output === 'object' && output && 'type' in output && output.type === 'function_call') {
              const functionCall = output as { name?: string }
              console.log('Processing function call:', functionCall.name)
              handleFunctionCall(output)
            }
          })
        }
      })

      // Set session active when the data channel is opened
      dataChannel.value.addEventListener('open', () => {
        session.value.isActive = true
        session.value.isConnecting = false
        session.value.events = []
        // Reset session initialization flag for new sessions
        sessionInitialized.value = false
      })
    }
  })

  return {
    session: readonly(session),
    startSession,
    stopSession,
    sendClientEvent,
    sendTextMessage
  }
}
