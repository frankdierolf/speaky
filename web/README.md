# Speaky - Voice Blockchain Interface

> The main application for voice-controlled Ethereum wallet interaction.

[![Live Demo](https://img.shields.io/badge/Demo-speaky.wtf-blue?style=for-the-badge)](https://speaky.wtf)
[![Built with Nuxt](https://img.shields.io/badge/Built%20with-Nuxt%204-00DC82?style=for-the-badge&logo=nuxt.js)](https://nuxt.com)

## What it does

Speaky lets you control your Ethereum wallet through natural voice commands. Connect your MetaMask wallet and start speaking to the blockchain:

### Available Voice Commands

- **Balance checking**: "What's my balance?", "How much ETH do I have?"
- **Send transactions**: "Send 0.01 ETH", "Transfer some Ethereum"
- **Connection status**: "Is my wallet connected?", "Check connection"

All transactions require MetaMask approval for security.

## Environment Setup

Create a `.env` file in the `web/` directory:

```bash
# Required: OpenAI API key for voice processing
OPENAI_API_KEY=your_openai_api_key_here
```

## Development

### Prerequisites
- Node.js 18+
- PNPM package manager
- MetaMask browser extension
- OpenAI API key

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit `http://localhost:3000` to access the application.

### Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Architecture

### Voice Processing Flow
1. **WebRTC Audio Stream** → Real-time voice capture
2. **OpenAI Realtime API** → Natural language understanding
3. **Tool System** → Blockchain operation execution
4. **MetaMask Integration** → Secure transaction approval

### Key Components

- `useRealtimeChat()` - Manages WebRTC and OpenAI integration
- `useWallet()` - Handles MetaMask connection and transactions
- `utils/toolHandlers.ts` - Executes blockchain operations
- `utils/systemInstructions.ts` - AI persona and guidance

### Available Tools

| Tool | Function | Description |
|------|----------|-------------|
| `get_wallet_balance` | Check ETH balance | Real-time balance retrieval |
| `check_wallet_connection` | Verify wallet status | Connection state validation |
| `send_ethereum` | Send ETH | Secure transaction to test address |
| `show_toast` | User notifications | Visual feedback system |

## Technology Stack

- **Frontend**: Nuxt 4 + Nuxt UI + TypeScript
- **Voice**: OpenAI Realtime API + WebRTC
- **Blockchain**: Ethers.js v6 + MetaMask
- **Deployment**: Vercel with edge functions
- **Styling**: Tailwind CSS + Nuxt UI components

## Security

- All private keys remain in MetaMask - never exposed
- Transactions require explicit user approval
- Test environment uses designated recipient address
- No sensitive data stored or transmitted

## Development Notes

### Voice Command Testing
1. Connect MetaMask wallet
2. Click "Start Voice Chat"
3. Test commands like:
   - "What's my balance?"
   - "Send 0.01 ETH"
   - "Am I connected?"

### Adding New Voice Tools
1. Define tool in `utils/realtimeTools.ts`
2. Implement handler in `utils/toolHandlers.ts`
3. Add to system instructions in `utils/systemInstructions.ts`

## Contributing

1. Test voice commands thoroughly
2. Ensure MetaMask integration works
3. Verify transaction flows
4. Check error handling and user feedback

## Live Demo

Try the voice interface at [speaky.wtf](https://speaky.wtf)

---

Part of the **Speaky** project - making blockchain interaction as natural as conversation.