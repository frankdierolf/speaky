# Speaky

> Voice-controlled blockchain interaction. Making Web3 as natural as
> conversation.

[![Live Demo](https://img.shields.io/badge/Demo-speaky.wtf-blue?style=for-the-badge)](https://speaky.wtf)
[![ETH Global](https://img.shields.io/badge/ETH%20Global-Hackathon-purple?style=for-the-badge)](https://ethglobal.com)
[![Phase 2](https://img.shields.io/badge/Phase%202-90%25%20Complete-green?style=for-the-badge)](#roadmap)

## What is Speaky?

Speaky transforms blockchain interaction through natural voice commands. Instead
of complex interfaces, just speak to your Ethereum wallet:

- **"What's my balance?"** - Check your ETH instantly
- **"Send 0.01 ETH"** - Voice-controlled transactions
- **"Is my wallet connected?"** - Status checks

Built for [ETH Global Hackathon](https://ethglobal.com), Speaky is developing
the voice interface for Web3, with plans for 3D holographic characters and AR
experiences.

## 🎬 Demo Video

<a href="https://youtu.be/ZCs3prDRsck" target="_blank">
  <img src="https://i.ibb.co/YT8FHpbk/image.png" alt="Speaky Demo Video" style="max-width: 100%; height: auto; border-radius: 8px;">
</a>

Watch how Speaky transforms blockchain interaction through natural voice
commands.

## Live Deployments

| Application   | Purpose                | URL                                                  |
| ------------- | ---------------------- | ---------------------------------------------------- |
| **Main App**  | Voice wallet interface | [speaky.wtf](https://speaky.wtf)                     |
| **Deck**      | Project presentation   | [deck.speaky.wtf](https://deck.speaky.wtf)           |
| **Changelog** | Development progress   | [changelog.speaky.wtf](https://changelog.speaky.wtf) |

## Quick Start

### Prerequisites

- Node.js 18+
- MetaMask wallet
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/frankdierolf/speaky.git
cd speaky

# Install main app dependencies
cd web
pnpm install

# Set up environment
cp .env.example .env
# Add your OPENAI_API_KEY

# Start development server
pnpm dev
```

Visit `http://localhost:3000` and connect your MetaMask wallet to start using
voice commands.

## Technology Stack

- **Voice AI**: OpenAI Realtime API + WebRTC
- **Blockchain**: Ethers.js + MetaMask integration
- **Frontend**: Nuxt 4 + Nuxt UI
- **Deployment**: Vercel edge functions
- **Future**: Three.js + WebXR for 3D/AR

## Project Structure

```
speaky/

