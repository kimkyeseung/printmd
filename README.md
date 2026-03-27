# printmd

**Markdown to beautifully styled PDFs — free, no signup, runs in your browser.**

[printmd.app](https://printmd.app)

---

## What is printmd?

printmd is a free web tool that lets you write or paste Markdown, apply custom styles, and export as PDF or print — all without leaving your browser. No data is sent to any server.

## Features

- **15 Built-in Presets** — Default, Dark, Document, Blog, Minimal, Sepia, Ocean, Forest, Sunset, Newspaper, Academic, Notebook, Terminal, Elegant, Pastel
- **Per-element Styling** — Customize fonts, colors, spacing, and borders for headings, paragraphs, tables, code blocks, and more
- **Live Preview** — See changes in real time as you type
- **Inline Editing** — Double-click any block in the preview to edit its Markdown source
- **PDF Export & Print** — Save as PDF or print directly with custom headers/footers (page numbers, date, title)
- **Save & Load** — Save documents locally with folder organization
- **PWA / Offline** — Works without internet after first visit. Add to home screen for native-like experience
- **Custom Fonts** — Upload your own .woff2, .ttf, .otf files
- **Style Sharing** — Share your custom styles via URL
- **Drag & Drop** — Drop .md files to open instantly
- **Undo / Redo** — Full style change history
- **Slide Mode** — Present Markdown as slides
- **i18n** — English and Korean
- **Chrome Extension** — Send any GitHub README, Notion, or Confluence page to printmd for styled printing

## Tech Stack

| | |
|---|---|
| Framework | [Next.js](https://nextjs.org) 16 + [React](https://react.dev) 19 |
| Editor | [CodeMirror](https://codemirror.net) 6 |
| Markdown | [markdown-it](https://github.com/markdown-it/markdown-it) + [highlight.js](https://highlightjs.org) |
| PDF | [jsPDF](https://github.com/parallax/jsPDF) + [html2canvas](https://html2canvas.hertzen.com) |
| State | [Zustand](https://github.com/pmndrs/zustand) + [zundo](https://github.com/charkour/zundo) |
| PWA | [Serwist](https://serwist.pages.dev) |
| Styling | [Tailwind CSS](https://tailwindcss.com) v4 |
| Testing | [Vitest](https://vitest.dev) + [Playwright](https://playwright.dev) |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run e2e tests
npm run test:e2e
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file:

```env
# Google AdSense (optional)
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx

# Kakao AdFit (optional)
NEXT_PUBLIC_KAKAO_ADFIT_UNIT_ID=xxxxxxxx
```

The app works without any environment variables. Ad-related features are simply disabled.

## Project Structure

```
app/
  [locale]/           # i18n routes (en, ko)
    markdown-editor/  # Editor landing page
    markdown-to-pdf/  # PDF converter landing page
    markdown-print/   # Print landing page
    github/           # GitHub README import
    presets/           # Theme preset gallery
    guide/             # Markdown syntax guide
    cheatsheet/        # Quick reference
components/
  editor/             # CodeMirror editor
  preview/            # Markdown preview & slide view
  style/              # Style panel (theme, element, color, font)
  print/              # Print preview & settings
  save/               # Save/load dialogs
hooks/                # Custom React hooks
lib/
  i18n/               # Internationalization
  themes/             # Theme presets & color roles
  markdown/           # Parser & sanitizer
  share/              # URL-based style/document sharing
stores/               # Zustand stores
extension/            # Chrome extension source
```

## Privacy

All processing happens client-side. Your documents never leave your browser. No accounts, no tracking, no data collection beyond standard analytics.

## Support

If printmd has been helpful, consider supporting the project:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/kimkyeseung)

## License

MIT License — see [LICENSE](LICENSE) for details.
