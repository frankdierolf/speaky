# Speaky Changelog

> Development progress tracker for the voice-controlled blockchain project.

[![Live Demo](https://img.shields.io/badge/Demo-changelog.speaky.wtf-blue?style=for-the-badge)](https://changelog.speaky.wtf)
[![Built with Nuxt](https://img.shields.io/badge/Built%20with-Nuxt%20UI-00DC82?style=for-the-badge&logo=nuxt.js)](https://ui.nuxt.com)

## What it does

The Speaky changelog automatically fetches and displays all GitHub releases from the main repository in a beautiful, readable format. Track the project's evolution from basic voice chat to voice-controlled blockchain interaction.

View live at: **[changelog.speaky.wtf](https://changelog.speaky.wtf)**

## Features

- **Automatic synchronization** with GitHub releases
- **Markdown rendering** with syntax highlighting
- **Responsive design** for all device sizes
- **Dark/light theme** support
- **Release categorization** by version and date

## How it works

The changelog fetches release data from the GitHub API for `frankdierolf/speaky` and renders it using Nuxt MDC for enhanced markdown support. Each release includes:

- Version number and release date
- Detailed release notes with markdown formatting
- Links to GitHub releases and commits
- Progress tracking through development phases

## Configuration

The repository is configured in `app/app.config.ts`:

```typescript
export default defineAppConfig({
  repository: 'frankdierolf/speaky', // GitHub repo
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    }
  }
})
```

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

Visit `http://localhost:3000` to view the changelog locally.

### Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
changelog/
├── app/
│   ├── app.config.ts     # Repository configuration
│   ├── app.vue           # Main application layout
│   └── pages/
│       └── index.vue     # Changelog display page
├── public/               # Static assets and favicons
└── nuxt.config.ts        # Nuxt configuration
```

## Technology Stack

- **Framework**: Nuxt 3 with Nuxt UI
- **Content**: Nuxt MDC for markdown rendering
- **Styling**: Tailwind CSS + Nuxt UI components
- **Data**: GitHub API integration
- **Deployment**: Vercel with static generation

## Customization

To use this changelog for your own project:

1. Update `repository` in `app/app.config.ts`
2. Modify colors and theming in the config
3. Customize the layout in `app/app.vue`
4. Deploy to your preferred platform

## Recent Releases

The changelog tracks major milestones in Speaky's development:

- **v0.0.7**: Voice-controlled Ethereum wallet (Phase 2 - 90% complete)
- **v0.0.6**: Project presentation deck
- **v0.0.3**: Vercel deployment fixes and branding
- **v0.0.2**: Changelog application integration
- **v0.0.1**: Initial project foundation

## Contributing

This changelog automatically updates when new releases are published to the main repository. To contribute:

1. Make changes to the main Speaky project
2. Create a new release with proper release notes
3. The changelog will automatically sync the new content

---

Part of the **Speaky** project - making blockchain interaction as natural as conversation.