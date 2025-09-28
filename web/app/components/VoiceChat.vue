<script setup lang="ts">
const { session, startSession, stopSession } = useRealtimeChat()
const {
  walletState,
  isWalletAvailable,
  formattedAddress,
  formattedBalance,
  connectWallet,
  disconnectWallet
} = useWallet()

const isStarting = ref(false)
const toast = useToast()

const handleStartSession = async () => {
  if (isStarting.value || session.value.isConnecting) return

  try {
    isStarting.value = true
    await startSession()
  } catch {
    toast.add({
      title: 'Connection Failed',
      description: 'Unable to start voice chat session',
      color: 'error'
    })
  } finally {
    isStarting.value = false
  }
}

const handleConnectWallet = async () => {
  if (!isWalletAvailable.value) {
    toast.add({
      title: 'Wallet Not Found',
      description: 'Please install MetaMask to use wallet features',
      color: 'error'
    })
    return
  }

  try {
    await connectWallet()
    toast.add({
      title: 'Wallet Connected',
      description: `Connected to ${formattedAddress.value}`,
      color: 'success'
    })
  } catch (error: any) {
    toast.add({
      title: 'Connection Failed',
      description: error.message || 'Failed to connect wallet',
      color: 'error'
    })
  }
}

const handleDisconnectWallet = () => {
  disconnectWallet()
  toast.add({
    title: 'Wallet Disconnected',
    description: 'Your wallet has been disconnected',
    color: 'info'
  })
}

const handleStopSession = () => {
  stopSession()
}

</script>

<template>
  <div class="w-full max-w-2xl mx-auto p-6">
    <div class="flex flex-col gap-6">
      <!-- Wallet Card -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">
              Ethereum Wallet
            </h2>
            <div class="flex items-center gap-2">
              <div v-if="walletState.isConnected" class="flex items-center gap-2 text-green-600">
                <div class="w-2 h-2 bg-green-600 rounded-full" />
                <span class="text-sm">Connected</span>
              </div>
              <div v-else-if="walletState.isConnecting" class="flex items-center gap-2 text-yellow-600">
                <UIcon name="i-lucide-loader-2" class="animate-spin" />
                <span class="text-sm">Connecting...</span>
              </div>
              <div v-else class="flex items-center gap-2 text-gray-500">
                <div class="w-2 h-2 bg-gray-500 rounded-full" />
                <span class="text-sm">Disconnected</span>
              </div>
            </div>
          </div>
        </template>

        <div class="space-y-4">
          <!-- Wallet Status -->
          <div v-if="walletState.isConnected" class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p class="text-sm text-muted-foreground">
                  Address
                </p>
                <p class="font-mono text-sm">
                  {{ formattedAddress }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-sm text-muted-foreground">
                  Balance
                </p>
                <p class="font-medium">
                  {{ formattedBalance || 'Loading...' }}
                </p>
              </div>
            </div>
            <UButton color="error" variant="outline" block icon="i-lucide-unlink" @click="handleDisconnectWallet">
              Disconnect Wallet
            </UButton>
          </div>

          <!-- Connect Wallet -->
          <div v-else class="text-center py-4">
            <UIcon name="i-lucide-wallet" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <ClientOnly>
              <UButton v-if="isWalletAvailable" :loading="walletState.isConnecting" :disabled="walletState.isConnecting"
                color="primary" size="lg" block icon="i-lucide-wallet" @click="handleConnectWallet">
                {{ walletState.isConnecting ? 'Connecting...' : 'Connect MetaMask' }}
              </UButton>
              <div v-else class="space-y-2">
                <p class="text-sm text-red-600">
                  MetaMask not detected
                </p>
                <UButton to="https://metamask.io" target="_blank" variant="outline" block icon="i-lucide-external-link">
                  Install MetaMask
                </UButton>
              </div>
              <template #fallback>
                <UButton loading disabled color="primary" size="lg" block icon="i-lucide-wallet">
                  Loading wallet...
                </UButton>
              </template>
            </ClientOnly>
          </div>
        </div>
      </UCard>

      <!-- Main Chat Card -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">
              Chat Session
            </h2>
            <div class="flex items-center gap-2">
              <div v-if="session.isActive" class="flex items-center gap-2 text-green-600">
                <div class="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                <span class="text-sm">Connected</span>
              </div>
              <div v-else-if="session.isConnecting" class="flex items-center gap-2 text-yellow-600">
                <UIcon name="i-lucide-loader-2" class="animate-spin" />
                <span class="text-sm">Connecting...</span>
              </div>
              <div v-else class="flex items-center gap-2 text-gray-500">
                <div class="w-2 h-2 bg-gray-500 rounded-full" />
                <span class="text-sm">Disconnected</span>
              </div>
            </div>
          </div>
        </template>

        <div class="space-y-4">
          <!-- Status Message -->
          <div class="text-center py-8">
            <UIcon name="i-lucide-mic" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p v-if="!session.isActive && !session.isConnecting" class="text-muted-foreground">
              Start voice chat
            </p>
            <p v-else-if="session.isConnecting" class="text-muted-foreground">
              Connecting...
            </p>
            <p v-else class="text-muted-foreground">
              Listening
            </p>
          </div>

          <!-- Controls -->
          <div class="space-y-3">
            <!-- Start/Stop Button -->
            <div v-if="!session.isActive && !session.isConnecting">
              <UButton :loading="isStarting" :disabled="isStarting" color="primary" size="lg" block icon="i-lucide-mic"
                @click="handleStartSession">
                {{ isStarting ? 'Starting...' : 'Start Voice Chat' }}
              </UButton>
            </div>

            <!-- Active Session Controls -->
            <div v-else-if="session.isActive" class="space-y-3">
              <!-- Stop Button -->
              <UButton color="error" variant="outline" block icon="i-lucide-phone-off" @click="handleStopSession">
                End Session
              </UButton>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
