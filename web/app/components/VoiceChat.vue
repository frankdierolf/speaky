<script setup lang="ts">
const { session, startSession, stopSession, sendClientEvent, sendTextMessage } = useRealtimeChat()
const { setupTools } = useRealtimeTools(sendClientEvent)

const textMessage = ref('')
const isStarting = ref(false)

const handleStartSession = async () => {
  if (isStarting.value || session.value.isConnecting) return

  try {
    isStarting.value = true
    await startSession()
  } catch {
    const toast = useToast()
    toast.add({
      title: 'Connection Failed',
      description: 'Unable to start voice chat session',
      color: 'error'
    })
  } finally {
    isStarting.value = false
  }
}

const handleStopSession = () => {
  stopSession()
  textMessage.value = ''
}

const handleSendMessage = () => {
  if (textMessage.value.trim() && session.value.isActive) {
    sendTextMessage(textMessage.value.trim())
    textMessage.value = ''
  }
}

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && textMessage.value.trim()) {
    handleSendMessage()
  }
}

watchEffect(() => {
  if (session.value.events.length > 0) {
    setupTools([...session.value.events])
  }
})
</script>

<template>
  <div class="w-full max-w-2xl mx-auto p-6">
    <div class="flex flex-col gap-6">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-3xl font-bold mb-2">
          Voice Chat
        </h1>
        <p class="text-muted-foreground">
          Talk to ChatGPT and ask for toast notifications
        </p>
      </div>

      <!-- Main Chat Card -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">
              Chat Session
            </h2>
            <div class="flex items-center gap-2">
              <div
                v-if="session.isActive"
                class="flex items-center gap-2 text-green-600"
              >
                <div class="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                <span class="text-sm">Connected</span>
              </div>
              <div
                v-else-if="session.isConnecting"
                class="flex items-center gap-2 text-yellow-600"
              >
                <UIcon
                  name="i-lucide-loader-2"
                  class="animate-spin"
                />
                <span class="text-sm">Connecting...</span>
              </div>
              <div
                v-else
                class="flex items-center gap-2 text-gray-500"
              >
                <div class="w-2 h-2 bg-gray-500 rounded-full" />
                <span class="text-sm">Disconnected</span>
              </div>
            </div>
          </div>
        </template>

        <div class="space-y-4">
          <!-- Status Message -->
          <div class="text-center py-8">
            <UIcon
              name="i-lucide-mic"
              class="w-12 h-12 mx-auto mb-4 text-gray-400"
            />
            <p
              v-if="!session.isActive && !session.isConnecting"
              class="text-muted-foreground"
            >
              Start a voice session to begin chatting with ChatGPT
            </p>
            <p
              v-else-if="session.isConnecting"
              class="text-muted-foreground"
            >
              Connecting to voice chat...
            </p>
            <p
              v-else
              class="text-muted-foreground"
            >
              Voice chat is active. Speak to ChatGPT or type below.
            </p>
          </div>

          <!-- Controls -->
          <div class="space-y-3">
            <!-- Start/Stop Button -->
            <div v-if="!session.isActive && !session.isConnecting">
              <UButton
                :loading="isStarting"
                :disabled="isStarting"
                color="primary"
                size="lg"
                block
                icon="i-lucide-mic"
                @click="handleStartSession"
              >
                {{ isStarting ? 'Starting...' : 'Start Voice Chat' }}
              </UButton>
            </div>

            <!-- Active Session Controls -->
            <div
              v-else-if="session.isActive"
              class="space-y-3"
            >
              <!-- Text Input -->
              <div class="flex gap-2">
                <UInput
                  v-model="textMessage"
                  placeholder="Type a message..."
                  class="flex-1"
                  @keydown="onKeyDown"
                />
                <UButton
                  :disabled="!textMessage.trim()"
                  icon="i-lucide-send"
                  @click="handleSendMessage"
                />
              </div>

              <!-- Stop Button -->
              <UButton
                color="error"
                variant="outline"
                block
                icon="i-lucide-phone-off"
                @click="handleStopSession"
              >
                End Session
              </UButton>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
