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
      // Append new server events to the list
      dataChannel.value.addEventListener('message', (e) => {
        const event: RealtimeEvent = JSON.parse(e.data)
        if (!event.timestamp) {
          event.timestamp = new Date().toLocaleTimeString()
        }
        session.value.events.unshift(event)
      })

      // Set session active when the data channel is opened
      dataChannel.value.addEventListener('open', () => {
        session.value.isActive = true
        session.value.isConnecting = false
        session.value.events = []
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
