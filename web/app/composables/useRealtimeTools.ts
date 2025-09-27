import type { RealtimeEvent } from './useRealtimeChat'

export interface ToastToolParams {
  title: string
  description?: string
  type?: 'success' | 'error' | 'info' | 'warning'
  icon?: string
}

export const useRealtimeTools = (sendClientEvent: (event: RealtimeEvent) => void) => {
  const toast = useToast()
  const toolsRegistered = ref(false)
  const processedEvents = new Set<string>()

  const toastToolDefinition = {
    type: 'function',
    name: 'show_toast',
    description: 'Display a toast notification to the user',
    parameters: {
      type: 'object',
      strict: true,
      properties: {
        title: {
          type: 'string',
          description: 'The main title of the toast notification'
        },
        description: {
          type: 'string',
          description: 'Optional description text for the toast'
        },
        type: {
          type: 'string',
          enum: ['success', 'error', 'info', 'warning'],
          description: 'The type/color of the toast notification'
        },
        icon: {
          type: 'string',
          description: 'Optional icon name for the toast'
        }
      },
      required: ['title']
    }
  }

  const sessionUpdate: RealtimeEvent = {
    type: 'session.update',
    session: {
      type: 'realtime',
      tools: [toastToolDefinition],
      tool_choice: 'auto'
    }
  }

  const colorMap = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info'
  } as const

  const handleFunctionCall = (functionCall: unknown) => {
    const call = functionCall as { name?: string, arguments?: string, call_id?: string }
    if (call.name === 'show_toast') {
      try {
        const params: ToastToolParams = JSON.parse(call.arguments || '{}')
        const color = colorMap[params.type as keyof typeof colorMap] || 'primary'

        toast.add({
          title: params.title,
          description: params.description,
          color: color as 'success' | 'error' | 'warning' | 'info' | 'primary',
          icon: params.icon
        })

        setTimeout(() => {
          sendClientEvent({
            type: 'conversation.item.create',
            item: {
              type: 'function_call_output',
              call_id: call.call_id || '',
              output: JSON.stringify({
                success: true,
                message: 'Toast notification displayed successfully'
              })
            }
          })
          sendClientEvent({ type: 'response.create' })
        }, 100)
      } catch {
        toast.add({
          title: 'Error',
          description: 'Failed to process toast notification',
          color: 'error'
        })
      }
    }
  }

  const setupTools = (events: RealtimeEvent[]) => {
    if (!events || events.length === 0) return

    const sessionCreatedEvent = events.find(event => event.type === 'session.created')
    if (sessionCreatedEvent && !toolsRegistered.value) {
      sendClientEvent(sessionUpdate)
      toolsRegistered.value = true
    }

    events.forEach((event) => {
      const eventId = event.event_id || `${event.type}-${event.timestamp}`
      if (processedEvents.has(eventId)) return

      if (event.type === 'response.done' && (event as unknown as { response?: { output?: unknown[] } }).response?.output) {
        const outputs = (event as unknown as { response: { output: unknown[] } }).response.output
        outputs.forEach((output: unknown) => {
          if ((output as { type?: string }).type === 'function_call') {
            handleFunctionCall(output)
          }
        })
      }

      processedEvents.add(eventId)
    })
  }

  return {
    setupTools
  }
}
