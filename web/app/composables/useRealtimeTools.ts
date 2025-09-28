/**
 * Real-time Tools Composable (Deprecated)
 *
 * This composable has been simplified. Session initialization and tool handling
 * are now managed directly in useRealtimeChat for better performance.
 *
 * This file is kept for backward compatibility and debugging purposes.
 */

import {
  VOICE_COMMAND_EXAMPLES
} from '~/utils/realtimeTools'

/**
 * @deprecated Use useRealtimeChat instead. Session initialization and tool handling
 * are now managed directly in useRealtimeChat.
 *
 * This function is a no-op placeholder for backward compatibility.
 */
export const useRealtimeTools = () => {
  console.warn('useRealtimeTools is deprecated. Session initialization and tool handling are now managed in useRealtimeChat.')

  return {
    setupTools: () => {
      // No-op - functionality moved to useRealtimeChat
    },
    voiceCommands: VOICE_COMMAND_EXAMPLES
  }
}
