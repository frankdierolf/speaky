# Speaky Pitch Deck

> ETH Global Hackathon presentation for voice-controlled blockchain interaction.

[![Live Demo](https://img.shields.io/badge/Demo-deck.speaky.wtf-blue?style=for-the-badge)](https://deck.speaky.wtf)
[![ETH Global](https://img.shields.io/badge/ETH%20Global-Hackathon-purple?style=for-the-badge)](https://ethglobal.com)

## About the Presentation

Interactive pitch deck created for the [ETH Global Hackathon](https://ethglobal.com/) to present Speaky's vision for making blockchain interaction as natural as conversation.

**View live at: [deck.speaky.wtf](https://deck.speaky.wtf)**

## Presentation Overview

The deck covers Speaky's complete story across 11 slides:

1. **Introduction** - Project overview and tagline
2. **Problem** - Web3 UX friction and complexity barriers
3. **Solution** - Voice-first blockchain interaction approach
4. **Demo** - Live functionality and user experience
5. **Market** - Target audience and market opportunity
6. **Business** - Revenue model and monetization strategy
7. **Traction** - Current progress and user validation
8. **Technology** - Technical architecture and innovation
9. **Team** - Project leadership and expertise
10. **Ask** - Funding requirements and use of funds
11. **Vision** - Future roadmap and long-term goals

## Key Messages

- **Problem**: Web3 interfaces are intimidating and complex
- **Solution**: Natural voice commands for blockchain operations
- **Vision**: "Siri for Web3" with holographic assistants
- **Progress**: Phase 2 of 4 development roadmap
- **Innovation**: First voice-controlled Ethereum wallet

## Development Phases

- **Phase 1**: ✅ Basic voice chat (Complete)
- **Phase 2**: 🔄 Wallet interaction (90% - missing ENS)
- **Phase 3**: 🔜 3D character with voice
- **Phase 4**: 🔜 WebAR - bring it out of the browser

## Technology Highlights

- **OpenAI Realtime API** for natural language processing
- **WebRTC** for real-time voice streaming
- **Ethers.js** for Ethereum blockchain integration
- **Nuxt 4** for modern web development
- **Future**: Three.js + WebXR for 3D/AR experiences

## Development

### Prerequisites
- Node.js 18+
- PNPM package manager

### Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit `http://localhost:3030` to view the presentation locally.

### Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Editing the Presentation

### Structure
- **Main file**: `slides.md` - Imports all individual slide pages
- **Individual slides**: `/pages/` directory - Each slide as a separate markdown file
- **Styling**: `style.css` - Custom presentation styling

### Slide Editing

To modify content:
1. Edit individual files in `/pages/01-intro.md` through `/pages/11-vision.md`
2. Update `slides.md` if adding/removing slides
3. Modify `style.css` for styling changes

### Navigation
- **Arrow keys** or **click** to navigate
- **F** for fullscreen mode
- **O** for overview mode
- **Space** for next slide

## Key Talking Points

### For Investors
- Voice interface reduces Web3 onboarding friction
- Natural language makes blockchain accessible to mainstream users
- 3D/AR roadmap creates unique differentiation
- Strong technical execution with working prototype

### For Developers
- Clean architecture separating voice, blockchain, and UI layers
- Extensible tool system for adding new blockchain operations
- Real-time WebRTC implementation with OpenAI integration
- Future-ready codebase for 3D and AR experiences

### For Users
- "What's my balance?" - Simple voice commands
- No complex wallet interfaces to learn
- Secure MetaMask integration
- Future holographic assistant experience

## Deployment

The deck is automatically deployed to [deck.speaky.wtf](https://deck.speaky.wtf) via Vercel when changes are pushed to the main branch.

## Contributing

To improve the presentation:
1. Update slide content in `/pages/` directory
2. Test locally with `pnpm dev`
3. Ensure all links and demos work properly
4. Submit pull request with changes

---

Part of the **Speaky** project - making blockchain interaction as natural as conversation.