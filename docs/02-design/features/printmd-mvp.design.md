# Design: printmd MVP

> PDCA Phase: **Design**
> Created: 2026-02-24
> Status: Draft
> Plan Reference: [printmd-mvp.plan.md](../../01-plan/features/printmd-mvp.plan.md)

---

## 1. Architecture Design

### 1.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           printmd System Architecture                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                         Chrome Extension                                 ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   ││
│  │  │ background/ │  │  content/   │  │   popup/    │  │   utils/    │   ││
│  │  │ service-    │  │ github.ts   │  │ Popup.tsx   │  │ github-api  │   ││
│  │  │ worker.ts   │  │ injector.ts │  │ Settings    │  │ transfer    │   ││
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                              │                                               │
│                              │ URL Param / SessionStorage                    │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                      printmd.app (Next.js 14)                           ││
│  │                                                                          ││
│  │  ┌─────────────────────────────────────────────────────────────────┐   ││
│  │  │                        app/ (App Router)                         │   ││
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │   ││
│  │  │  │ page.tsx │ │ /github  │ │ /pdf     │ │ /guide   │           │   ││
│  │  │  │ (Editor) │ │ (SEO)    │ │ (SEO)    │ │ (SEO)    │           │   ││
│  │  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │   ││
│  │  └─────────────────────────────────────────────────────────────────┘   ││
│  │                                                                          ││
│  │  ┌─────────────────────────────────────────────────────────────────┐   ││
│  │  │                      components/                                 │   ││
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │   ││
│  │  │  │ Editor/  │ │ Preview/ │ │ Style/   │ │ Print/   │           │   ││
│  │  │  │ - CM6    │ │ - Render │ │ - Panel  │ │ - Modal  │           │   ││
│  │  │  │ - Toolbar│ │ - Sync   │ │ - Themes │ │ - Layout │           │   ││
│  │  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │   ││
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                        │   ││
│  │  │  │ Layout/  │ │ AdSense/ │ │ Common/  │                        │   ││
│  │  │  │ - Header │ │ - Banner │ │ - Button │                        │   ││
│  │  │  │ - Sidebar│ │ - Side   │ │ - Modal  │                        │   ││
│  │  │  └──────────┘ └──────────┘ └──────────┘                        │   ││
│  │  └─────────────────────────────────────────────────────────────────┘   ││
│  │                                                                          ││
│  │  ┌─────────────────────────────────────────────────────────────────┐   ││
│  │  │                        stores/ (Zustand)                         │   ││
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │   ││
│  │  │  │ editor   │ │ style    │ │ print    │ │ ui       │           │   ││
│  │  │  │ Store    │ │ Store    │ │ Store    │ │ Store    │           │   ││
│  │  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │   ││
│  │  └─────────────────────────────────────────────────────────────────┘   ││
│  │                                                                          ││
│  │  ┌─────────────────────────────────────────────────────────────────┐   ││
│  │  │                        lib/                                      │   ││
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │   ││
│  │  │  │ markdown │ │ storage  │ │ themes   │ │ print    │           │   ││
│  │  │  │ parser   │ │ utils    │ │ presets  │ │ utils    │           │   ││
│  │  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │   ││
│  │  └─────────────────────────────────────────────────────────────────┘   ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │ LocalStorage    │  │ SessionStorage  │  │ Google AdSense  │             │
│  │ - content       │  │ - ext content   │  │ - auto ads      │             │
│  │ - styles        │  │ - source url    │  │ - banner slots  │             │
│  │ - themes        │  └─────────────────┘  └─────────────────┘             │
│  └─────────────────┘                                                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Directory Structure

```
printmd/
├── web/                              # Next.js Web Application
│   ├── app/
│   │   ├── layout.tsx               # Root layout with AdSense
│   │   ├── page.tsx                 # Main editor page
│   │   ├── github/
│   │   │   └── page.tsx             # GitHub integration SEO page
│   │   ├── markdown-to-pdf/
│   │   │   └── page.tsx             # PDF conversion SEO page
│   │   ├── guide/
│   │   │   └── page.tsx             # Markdown guide SEO page
│   │   ├── themes/
│   │   │   └── page.tsx             # Theme gallery page
│   │   └── about/
│   │       └── page.tsx             # About page
│   ├── components/
│   │   ├── editor/
│   │   │   ├── Editor.tsx           # CodeMirror wrapper
│   │   │   ├── Toolbar.tsx          # Markdown toolbar
│   │   │   ├── EditorPanel.tsx      # Editor container
│   │   │   └── index.ts
│   │   ├── preview/
│   │   │   ├── Preview.tsx          # Markdown preview
│   │   │   ├── PreviewPanel.tsx     # Preview container
│   │   │   └── index.ts
│   │   ├── style/
│   │   │   ├── StylePanel.tsx       # Style settings panel
│   │   │   ├── ThemeSelector.tsx    # Theme dropdown
│   │   │   ├── GlobalStyleControls.tsx
│   │   │   ├── ListStyleControls.tsx
│   │   │   ├── HeadingStyleControls.tsx
│   │   │   ├── ColorPicker.tsx
│   │   │   ├── Slider.tsx
│   │   │   └── index.ts
│   │   ├── print/
│   │   │   ├── PrintPreview.tsx     # Print preview modal
│   │   │   ├── PrintSettings.tsx    # Paper size, margins
│   │   │   ├── HeaderFooter.tsx     # Header/footer config
│   │   │   └── index.ts
│   │   ├── layout/
│   │   │   ├── Header.tsx           # App header
│   │   │   ├── Sidebar.tsx          # Left sidebar
│   │   │   ├── SplitPane.tsx        # Resizable split view
│   │   │   └── index.ts
│   │   ├── adsense/
│   │   │   ├── AdBanner.tsx         # Header ad banner
│   │   │   ├── AdSidebar.tsx        # Sidebar ad unit
│   │   │   ├── AdMobile.tsx         # Mobile bottom ad
│   │   │   └── index.ts
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       ├── Dropdown.tsx
│   │       ├── Tooltip.tsx
│   │       └── index.ts
│   ├── stores/
│   │   ├── editorStore.ts           # Editor state
│   │   ├── styleStore.ts            # Style settings
│   │   ├── printStore.ts            # Print settings
│   │   └── uiStore.ts               # UI state (modals, panels)
│   ├── lib/
│   │   ├── markdown/
│   │   │   ├── parser.ts            # markdown-it config
│   │   │   ├── plugins.ts           # Custom plugins
│   │   │   └── sanitizer.ts         # DOMPurify wrapper
│   │   ├── storage/
│   │   │   ├── localStorage.ts      # Persistent storage
│   │   │   └── sessionStorage.ts    # Extension data receiver
│   │   ├── themes/
│   │   │   ├── presets.ts           # 5 preset themes
│   │   │   ├── cssVariables.ts      # CSS var generator
│   │   │   └── types.ts             # Theme type definitions
│   │   ├── print/
│   │   │   ├── paperSizes.ts        # A4, Letter, A3 configs
│   │   │   ├── printStyles.ts       # @media print CSS
│   │   │   └── pdfUtils.ts          # PDF generation helpers
│   │   └── file/
│   │       ├── fileHandler.ts       # File read/write
│   │       └── dragDrop.ts          # Drag & drop handler
│   ├── hooks/
│   │   ├── useEditor.ts             # Editor logic
│   │   ├── usePreview.ts            # Preview sync
│   │   ├── useStyle.ts              # Style application
│   │   ├── usePrint.ts              # Print functionality
│   │   ├── useKeyboardShortcuts.ts  # Shortcuts handler
│   │   ├── useLocalStorage.ts       # Storage persistence
│   │   └── useExtensionReceiver.ts  # Extension data handler
│   ├── styles/
│   │   ├── globals.css              # Global styles
│   │   ├── editor.css               # Editor styles
│   │   ├── preview.css              # Preview base styles
│   │   └── print.css                # Print-specific styles
│   ├── types/
│   │   ├── editor.ts
│   │   ├── style.ts
│   │   ├── print.ts
│   │   └── theme.ts
│   └── public/
│       ├── favicon.ico
│       ├── logo.svg
│       └── og-image.png
│
├── extension/                        # Chrome Extension
│   ├── manifest.json                # Manifest V3
│   ├── src/
│   │   ├── background/
│   │   │   └── service-worker.ts    # Background script
│   │   ├── content/
│   │   │   ├── github.ts            # GitHub page detector
│   │   │   ├── injector.ts          # Button injector
│   │   │   └── styles.css           # Injected button styles
│   │   ├── popup/
│   │   │   ├── Popup.tsx            # Popup UI
│   │   │   ├── popup.html
│   │   │   └── popup.css
│   │   └── utils/
│   │       ├── github-api.ts        # GitHub Raw fetch
│   │       ├── transfer.ts          # Content transfer to web
│   │       └── storage.ts           # chrome.storage wrapper
│   ├── vite.config.ts
│   └── package.json
│
├── docs/                            # PDCA Documents
│   ├── 01-plan/
│   ├── 02-design/
│   ├── 03-analysis/
│   └── 04-report/
│
└── package.json                     # Monorepo root (optional)
```

---

## 2. Component Design

### 2.1 Web Components

#### 2.1.1 Editor Components

```typescript
// components/editor/Editor.tsx
interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave?: () => void;
}

// Features:
// - CodeMirror 6 integration
// - Markdown syntax highlighting
// - Line numbers
// - Auto-indent
// - Keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+Z, Tab)
```

```typescript
// components/editor/Toolbar.tsx
interface ToolbarProps {
  onAction: (action: ToolbarAction) => void;
}

type ToolbarAction =
  | 'bold' | 'italic' | 'h1' | 'h2' | 'h3'
  | 'link' | 'image' | 'code' | 'codeblock'
  | 'hr' | 'quote' | 'ul' | 'ol';

// Toolbar buttons:
// [B] [I] [H1] [H2] [H3] | [Link] [Image] | [Code] [CodeBlock] | [---] [Quote] [UL] [OL]
```

#### 2.1.2 Preview Components

```typescript
// components/preview/Preview.tsx
interface PreviewProps {
  markdown: string;
  styles: StyleSettings;
}

// Features:
// - markdown-it rendering
// - DOMPurify sanitization
// - highlight.js code blocks
// - Dynamic CSS variables for styling
// - Scroll sync with editor (optional)
```

#### 2.1.3 Style Components

```typescript
// components/style/StylePanel.tsx
interface StylePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Sections:
// 1. Theme Selector (5 presets)
// 2. Global Styles (font, colors, spacing)
// 3. List Styles (advanced, P1)
// 4. Heading Styles (advanced, P1)
// 5. Save/Reset buttons
```

```typescript
// components/style/GlobalStyleControls.tsx
interface GlobalStyleControlsProps {
  styles: GlobalStyles;
  onChange: (styles: GlobalStyles) => void;
}

interface GlobalStyles {
  fontSize: number;        // 12-24px
  fontFamily: string;      // System fonts
  textColor: string;       // Hex color
  backgroundColor: string; // Hex color
  lineHeight: number;      // 1.2-2.5
  linkColor: string;       // Hex color
  codeBackground: string;  // Hex color
  maxWidth: number;        // 600-1200px
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}
```

```typescript
// components/style/ListStyleControls.tsx (P1)
interface ListStyleControlsProps {
  styles: ListStyles;
  onChange: (styles: ListStyles) => void;
}

interface ListStyles {
  firstChild?: ItemStyle;
  lastChild?: ItemStyle;
  oddChild?: ItemStyle;
  evenChild?: ItemStyle;
  nthChild?: { n: number; style: ItemStyle };
  prefix?: string;  // Emoji, symbol, etc.
  suffix?: string;
}

interface ItemStyle {
  color?: string;
  backgroundColor?: string;
  fontWeight?: string;
}
```

#### 2.1.4 Print Components

```typescript
// components/print/PrintPreview.tsx
interface PrintPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: () => void;
}

// Features:
// - A4/Letter/A3 page visualization
// - Page break indicators
// - Header/footer preview
// - Margin visualization
```

```typescript
// components/print/PrintSettings.tsx
interface PrintSettingsProps {
  settings: PrintSettings;
  onChange: (settings: PrintSettings) => void;
}

interface PrintSettings {
  paperSize: 'A4' | 'Letter' | 'A3';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;    // mm
    right: number;
    bottom: number;
    left: number;
  };
  includeBackground: boolean;
  header: HeaderFooterConfig;
  footer: HeaderFooterConfig;
}

interface HeaderFooterConfig {
  enabled: boolean;
  left: string;   // {title}, {date}, {page}, {pages}
  center: string;
  right: string;
}
```

### 2.2 Extension Components

```typescript
// extension/src/content/github.ts
interface GitHubDetector {
  isMarkdownFile(): boolean;
  isReadmePage(): boolean;
  getMarkdownUrl(): string | null;
  getButtonInsertionPoint(): Element | null;
}

// Detection rules:
// 1. .md file: URL contains '.md' or blob path ends with .md
// 2. README: Repository root with #readme anchor or README section
```

```typescript
// extension/src/content/injector.ts
interface ButtonInjector {
  inject(container: Element, onClick: () => void): void;
  remove(): void;
}

// Button spec:
// - Text: "Open in printmd"
// - Icon: printmd logo (16x16)
// - Style: Match GitHub's button design system
// - Position: Next to "Raw" button for files, in README header for repos
```

```typescript
// extension/src/utils/transfer.ts
interface ContentTransfer {
  // For small content (≤2KB): URL parameter
  transferViaUrl(markdown: string, sourceUrl?: string): void;

  // For large content (>2KB): SessionStorage
  transferViaStorage(markdown: string, sourceUrl?: string): void;
}

// URL format: printmd.app/?src=<encoded-raw-url>
// SessionStorage keys: printmd_content, printmd_source
```

---

## 3. Data Models

### 3.1 State Models (Zustand Stores)

```typescript
// stores/editorStore.ts
interface EditorState {
  content: string;
  sourceUrl: string | null;
  isFromExtension: boolean;
  isDirty: boolean;

  // Actions
  setContent: (content: string) => void;
  setSourceUrl: (url: string | null) => void;
  loadFromExtension: (content: string, sourceUrl?: string) => void;
  reset: () => void;
}
```

```typescript
// stores/styleStore.ts
interface StyleState {
  currentTheme: ThemePreset;
  globalStyles: GlobalStyles;
  listStyles: ListStyles;
  headingStyles: HeadingStyles;
  customThemes: CustomTheme[];

  // Actions
  setTheme: (theme: ThemePreset) => void;
  updateGlobalStyles: (styles: Partial<GlobalStyles>) => void;
  updateListStyles: (styles: Partial<ListStyles>) => void;
  saveCustomTheme: (name: string) => void;
  loadCustomTheme: (id: string) => void;
  resetToDefault: () => void;
}

type ThemePreset = 'default' | 'dark' | 'document' | 'blog' | 'minimal';
```

```typescript
// stores/printStore.ts
interface PrintState {
  settings: PrintSettings;
  isPreviewOpen: boolean;

  // Actions
  updateSettings: (settings: Partial<PrintSettings>) => void;
  openPreview: () => void;
  closePreview: () => void;
  print: () => void;
}
```

```typescript
// stores/uiStore.ts
interface UIState {
  viewMode: 'split' | 'editor' | 'preview';
  isStylePanelOpen: boolean;
  isFullscreen: boolean;
  sidebarWidth: number;

  // Actions
  setViewMode: (mode: ViewMode) => void;
  toggleStylePanel: () => void;
  toggleFullscreen: () => void;
  setSidebarWidth: (width: number) => void;
}
```

### 3.2 LocalStorage Schema

```typescript
// Storage keys and structure
const STORAGE_KEYS = {
  CONTENT: 'printmd_content',
  STYLES: 'printmd_styles',
  PRINT_SETTINGS: 'printmd_print',
  CUSTOM_THEMES: 'printmd_themes',
  UI_PREFERENCES: 'printmd_ui',
};

interface StoredStyles {
  currentTheme: ThemePreset;
  globalStyles: GlobalStyles;
  listStyles: ListStyles;
  headingStyles: HeadingStyles;
}

interface StoredUIPreferences {
  viewMode: ViewMode;
  sidebarWidth: number;
  lastUsedTheme: string;
}
```

### 3.3 Theme Presets

```typescript
// lib/themes/presets.ts
const themePresets: Record<ThemePreset, GlobalStyles> = {
  default: {
    fontSize: 16,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    textColor: '#1a1a1a',
    backgroundColor: '#ffffff',
    lineHeight: 1.6,
    linkColor: '#0066cc',
    codeBackground: '#f5f5f5',
    maxWidth: 800,
    padding: { top: 40, right: 40, bottom: 40, left: 40 },
  },
  dark: {
    fontSize: 16,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    textColor: '#e0e0e0',
    backgroundColor: '#1a1a1a',
    lineHeight: 1.6,
    linkColor: '#6db3f2',
    codeBackground: '#2d2d2d',
    maxWidth: 800,
    padding: { top: 40, right: 40, bottom: 40, left: 40 },
  },
  document: {
    fontSize: 14,
    fontFamily: 'Georgia, "Times New Roman", serif',
    textColor: '#333333',
    backgroundColor: '#ffffff',
    lineHeight: 1.8,
    linkColor: '#1a0dab',
    codeBackground: '#f8f8f8',
    maxWidth: 700,
    padding: { top: 60, right: 60, bottom: 60, left: 60 },
  },
  blog: {
    fontSize: 18,
    fontFamily: '"Noto Sans KR", system-ui, sans-serif',
    textColor: '#2c2c2c',
    backgroundColor: '#fafafa',
    lineHeight: 2.0,
    linkColor: '#0070f3',
    codeBackground: '#f0f0f0',
    maxWidth: 720,
    padding: { top: 48, right: 24, bottom: 48, left: 24 },
  },
  minimal: {
    fontSize: 14,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    textColor: '#000000',
    backgroundColor: '#ffffff',
    lineHeight: 1.5,
    linkColor: '#000000',
    codeBackground: '#f5f5f5',
    maxWidth: 650,
    padding: { top: 20, right: 20, bottom: 20, left: 20 },
  },
};
```

---

## 4. API & Interface Design

### 4.1 Extension to Web Communication

```typescript
// URL Parameter Transfer (≤2KB)
// Format: printmd.app/?src=<encoded-raw-url>
// Example: printmd.app/?src=https%3A%2F%2Fraw.githubusercontent.com%2F...

// Web app parses URL and fetches raw content
function handleUrlParam() {
  const params = new URLSearchParams(window.location.search);
  const srcUrl = params.get('src');
  if (srcUrl) {
    fetch(decodeURIComponent(srcUrl))
      .then(res => res.text())
      .then(content => loadContent(content, srcUrl));
  }
}
```

```typescript
// SessionStorage Transfer (>2KB)
// Extension sets:
sessionStorage.setItem('printmd_content', markdownContent);
sessionStorage.setItem('printmd_source', sourceUrl);

// Web app reads and clears:
function handleSessionStorage() {
  const content = sessionStorage.getItem('printmd_content');
  const source = sessionStorage.getItem('printmd_source');
  if (content) {
    loadContent(content, source);
    sessionStorage.removeItem('printmd_content');
    sessionStorage.removeItem('printmd_source');
  }
}
```

### 4.2 GitHub API Integration

```typescript
// extension/src/utils/github-api.ts
interface GitHubApi {
  /**
   * Get raw markdown content from GitHub
   * @param url GitHub blob URL or raw URL
   * @returns Raw markdown string
   */
  getRawContent(url: string): Promise<string>;

  /**
   * Convert GitHub blob URL to raw URL
   * @param blobUrl GitHub blob URL
   * @returns Raw githubusercontent URL
   */
  toRawUrl(blobUrl: string): string;
}

// URL conversion:
// From: https://github.com/{owner}/{repo}/blob/{branch}/{path}
// To:   https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}
```

### 4.3 Markdown Parser Configuration

```typescript
// lib/markdown/parser.ts
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

const md = new MarkdownIt({
  html: false,        // Disable raw HTML (security)
  linkify: true,      // Auto-convert URLs to links
  typographer: true,  // Smart quotes, etc.
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(str, { language: lang }).value;
    }
    return '';
  },
});

// Plugins to add:
// - markdown-it-anchor (heading anchors)
// - markdown-it-toc (table of contents)
// - markdown-it-task-lists (checkboxes)
```

---

## 5. UI/UX Design

### 5.1 Layout Specifications

```
┌─────────────────────────────────────────────────────────────────────────┐
│ [Logo] printmd                    [Theme▾] [Print] [Save▾] [Settings]  │ 44px
├─────────────────────────────────────────────────────────────────────────┤
│ [AdSense Banner - 728x90 Leaderboard]                                   │ 90px
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────┬──────────────────────┬───────────────────┐   │
│  │                      │                      │                   │   │
│  │   Editor Panel       │   Preview Panel      │   Style Panel     │   │
│  │                      │                      │   (collapsible)   │   │
│  │   ┌──────────────┐   │   ┌──────────────┐   │                   │   │
│  │   │ Toolbar      │   │   │ Source Link  │   │   [Theme Preset]  │   │
│  │   │ [B][I][H1]...│   │   │ (if ext)     │   │   ──────────────  │   │
│  │   └──────────────┘   │   └──────────────┘   │   [Font Size]     │   │
│  │                      │                      │   [Font Family]   │   │
│  │   ┌──────────────┐   │   ┌──────────────┐   │   [Colors...]     │   │
│  │   │              │   │   │              │   │   [Spacing...]    │   │
│  │   │  CodeMirror  │   │   │  Rendered    │   │                   │   │
│  │   │  Editor      │   │   │  Preview     │   │   [AdSense]       │   │
│  │   │              │   │   │              │   │   [300x250]       │   │
│  │   │              │   │   │              │   │                   │   │
│  │   │              │   │   │              │   │                   │   │
│  │   └──────────────┘   │   └──────────────┘   │                   │   │
│  │                      │                      │                   │   │
│  └──────────────────────┴──────────────────────┴───────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

Dimensions:
- Header: 44px fixed
- Ad Banner: 90px (desktop only)
- Style Panel: 300px width (collapsible)
- Editor/Preview: Split 50/50 (resizable)
- Min Editor Width: 300px
- Min Preview Width: 300px
```

### 5.2 Mobile Layout (< 768px)

```
┌───────────────────────────────────┐
│ [≡] printmd         [⚙] [Print]  │ 44px
├───────────────────────────────────┤
│ [Editor] [Preview]  (Tab Switch)  │ 40px
├───────────────────────────────────┤
│                                   │
│   Active Panel                    │
│   (Editor or Preview)             │
│                                   │
│                                   │
│                                   │
│                                   │
│                                   │
│                                   │
│                                   │
├───────────────────────────────────┤
│ [AdSense Mobile Banner - 320x50]  │ 50px
└───────────────────────────────────┘

- Tab-based view switching
- Style panel as bottom sheet modal
- Toolbar in hamburger menu
```

### 5.3 Print Preview Modal

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Print Preview                                              [×] Close   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────────────────────────────┐  ┌─────────────────────────┐ │
│   │                                     │  │ Paper Size              │ │
│   │         ┌───────────────┐           │  │ [A4 ▾]                  │ │
│   │         │               │           │  │                         │ │
│   │         │   A4 Page     │           │  │ Margins (mm)            │ │
│   │         │   Preview     │           │  │ T:[20] R:[20]           │ │
│   │         │               │           │  │ B:[20] L:[20]           │ │
│   │         │               │           │  │                         │ │
│   │         │               │           │  │ Header                  │ │
│   │         │               │           │  │ [✓] Enable              │ │
│   │         │               │           │  │ L:[{title}]             │ │
│   │         │               │           │  │ C:[]                    │ │
│   │         │               │           │  │ R:[{date}]              │ │
│   │         │               │           │  │                         │ │
│   │         └───────────────┘           │  │ Footer                  │ │
│   │                                     │  │ [✓] Enable              │ │
│   │         Page 1 of 3                 │  │ L:[]                    │ │
│   │                                     │  │ C:[{page}/{pages}]      │ │
│   │         [<] [>]                     │  │ R:[]                    │ │
│   │                                     │  │                         │ │
│   └─────────────────────────────────────┘  │ [✓] Include background  │ │
│                                            │                         │ │
│                                            │ ────────────────────    │ │
│                                            │                         │ │
│                                            │ [Print] [Save as PDF]   │ │
│                                            └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.4 Extension Button Injection

```
GitHub .md File View:
┌─────────────────────────────────────────────────────────────────────────┐
│ owner/repo                                                              │
├─────────────────────────────────────────────────────────────────────────┤
│ README.md                                                               │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ [Raw] [Blame] [Edit] [Delete] ... [📄 Open in printmd]              │ │ ← Button here
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ # Project Title                                                         │
│ ...                                                                     │
└─────────────────────────────────────────────────────────────────────────┘

GitHub README Section:
┌─────────────────────────────────────────────────────────────────────────┐
│ owner/repo                                                              │
├─────────────────────────────────────────────────────────────────────────┤
│ README.md                                    [📄 Open in printmd]       │ ← Button here
│ ───────────────────────────────────────────────────────────────────     │
│ # Project Title                                                         │
│ ...                                                                     │
└─────────────────────────────────────────────────────────────────────────┘

Button Specs:
- Icon: printmd logo (16x16px)
- Text: "Open in printmd"
- Style: GitHub secondary button style
- Hover tooltip: "printmd에서 스타일링하고 PDF로 저장하기"
```

---

## 6. Security Design

### 6.1 XSS Prevention

```typescript
// lib/markdown/sanitizer.ts
import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr',
  'ul', 'ol', 'li',
  'blockquote', 'pre', 'code',
  'a', 'img',
  'strong', 'em', 'del', 's',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'div', 'span',
];

const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title',
  'class', 'id',
  'target', 'rel',
];

export function sanitize(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input'],
  });
}
```

### 6.2 Extension Permissions (Minimum)

```json
// extension/manifest.json
{
  "manifest_version": 3,
  "name": "printmd - Markdown to PDF",
  "version": "1.0.0",
  "description": "Open markdown files in printmd for styling and PDF export",

  "permissions": [
    "activeTab",
    "storage"
  ],

  "host_permissions": [
    "https://github.com/*",
    "https://raw.githubusercontent.com/*"
  ],

  "content_scripts": [
    {
      "matches": ["https://github.com/*"],
      "js": ["content/github.js"],
      "css": ["content/styles.css"]
    }
  ],

  "action": {
    "default_popup": "popup/popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },

  "background": {
    "service_worker": "background/service-worker.js"
  }
}
```

### 6.3 Content Security Policy

```typescript
// next.config.js headers
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https://raw.githubusercontent.com",
      "frame-src https://googleads.g.doubleclick.net",
    ].join('; '),
  },
];
```

---

## 7. Implementation Order

### Phase 1: Core Setup (Week 1)

| Order | Task | Files | Depends On |
|-------|------|-------|------------|
| 1.1 | Next.js project setup | next.config.js, package.json | - |
| 1.2 | Tailwind CSS config | tailwind.config.js, globals.css | 1.1 |
| 1.3 | Base layout components | Layout, Header | 1.2 |
| 1.4 | Zustand stores setup | All stores | 1.1 |
| 1.5 | Type definitions | All types/*.ts | 1.1 |

### Phase 2: Editor & Preview (Week 2)

| Order | Task | Files | Depends On |
|-------|------|-------|------------|
| 2.1 | CodeMirror integration | Editor.tsx, editor.css | 1.3 |
| 2.2 | Toolbar component | Toolbar.tsx | 2.1 |
| 2.3 | markdown-it setup | parser.ts, plugins.ts | 1.1 |
| 2.4 | DOMPurify integration | sanitizer.ts | 2.3 |
| 2.5 | Preview component | Preview.tsx, preview.css | 2.3, 2.4 |
| 2.6 | SplitPane layout | SplitPane.tsx, EditorPanel, PreviewPanel | 2.1, 2.5 |
| 2.7 | Editor-Preview sync | usePreview.ts | 2.6 |

### Phase 3: Styling System (Week 2-3)

| Order | Task | Files | Depends On |
|-------|------|-------|------------|
| 3.1 | Theme presets | presets.ts, types.ts | 1.4 |
| 3.2 | CSS variables generator | cssVariables.ts | 3.1 |
| 3.3 | StylePanel component | StylePanel.tsx | 3.1, 3.2 |
| 3.4 | GlobalStyleControls | GlobalStyleControls.tsx, ColorPicker, Slider | 3.3 |
| 3.5 | ThemeSelector | ThemeSelector.tsx | 3.1, 3.3 |
| 3.6 | Style persistence | localStorage.ts, useLocalStorage | 3.4 |
| 3.7 | ListStyleControls (P1) | ListStyleControls.tsx | 3.4 |
| 3.8 | HeadingStyleControls (P1) | HeadingStyleControls.tsx | 3.4 |

### Phase 4: Print Feature (Week 3)

| Order | Task | Files | Depends On |
|-------|------|-------|------------|
| 4.1 | Paper size configs | paperSizes.ts | - |
| 4.2 | Print CSS styles | print.css, printStyles.ts | 4.1 |
| 4.3 | PrintSettings component | PrintSettings.tsx | 4.1 |
| 4.4 | HeaderFooter config | HeaderFooter.tsx | 4.3 |
| 4.5 | PrintPreview modal | PrintPreview.tsx | 4.2, 4.3, 4.4 |
| 4.6 | Print action | usePrint.ts | 4.5 |

### Phase 5: File Handling (Week 3)

| Order | Task | Files | Depends On |
|-------|------|-------|------------|
| 5.1 | File read handler | fileHandler.ts | 2.1 |
| 5.2 | Drag & drop | dragDrop.ts | 5.1 |
| 5.3 | File save/download | fileHandler.ts | 2.1 |
| 5.4 | LocalStorage auto-save | localStorage.ts | 1.4 |

### Phase 6: Extension (Week 4)

| Order | Task | Files | Depends On |
|-------|------|-------|------------|
| 6.1 | Manifest V3 setup | manifest.json | - |
| 6.2 | GitHub detector | github.ts | 6.1 |
| 6.3 | Button injector | injector.ts, styles.css | 6.2 |
| 6.4 | GitHub API utils | github-api.ts | - |
| 6.5 | Content transfer | transfer.ts | 6.4 |
| 6.6 | Popup UI | Popup.tsx, popup.html | 6.1 |
| 6.7 | Extension receiver | useExtensionReceiver.ts | 6.5 |

### Phase 7: SEO & Ads (Week 5)

| Order | Task | Files | Depends On |
|-------|------|-------|------------|
| 7.1 | AdSense components | AdBanner, AdSidebar, AdMobile | 1.3 |
| 7.2 | AdSense integration | layout.tsx | 7.1 |
| 7.3 | GitHub landing page | /github/page.tsx | 1.3 |
| 7.4 | PDF landing page | /markdown-to-pdf/page.tsx | 1.3 |
| 7.5 | Guide page | /guide/page.tsx | 1.3 |
| 7.6 | Meta tags & OG | layout.tsx, all pages | 7.3, 7.4, 7.5 |

### Phase 8: Polish & QA (Week 5-6)

| Order | Task | Description | Depends On |
|-------|------|-------------|------------|
| 8.1 | Keyboard shortcuts | Ctrl+B, Ctrl+I, etc. | 2.2 |
| 8.2 | View modes | Split/Editor/Preview toggle | 2.6 |
| 8.3 | Fullscreen mode | Escape to exit | 8.2 |
| 8.4 | Mobile responsive | Tab-based UI | All |
| 8.5 | Accessibility | WCAG 2.1 AA | All |
| 8.6 | Performance optimization | LCP < 2.5s | All |
| 8.7 | Cross-browser testing | Chrome, Firefox, Safari | All |

---

## 8. Testing Strategy

### 8.1 Unit Tests

```typescript
// Tests to implement
describe('Markdown Parser', () => {
  it('should render basic markdown');
  it('should sanitize HTML');
  it('should highlight code blocks');
});

describe('Theme System', () => {
  it('should apply theme presets');
  it('should generate CSS variables');
  it('should persist styles to localStorage');
});

describe('Print System', () => {
  it('should calculate page breaks');
  it('should render header/footer');
});
```

### 8.2 Integration Tests

```typescript
// E2E test scenarios
describe('Editor Flow', () => {
  it('should type and preview in real-time');
  it('should load file via drag & drop');
  it('should save content to file');
});

describe('Extension Flow', () => {
  it('should detect GitHub markdown page');
  it('should inject button correctly');
  it('should transfer content to web app');
});
```

### 8.3 Performance Benchmarks

| Metric | Target | Test Method |
|--------|--------|-------------|
| LCP | < 2.5s | Lighthouse |
| FID | < 100ms | Lighthouse |
| CLS | < 0.1 | Lighthouse |
| Editor Input | < 100ms | Performance.now() |
| Button Injection | < 500ms | Performance.now() |

---

## 9. Dependencies

### 9.1 Web Dependencies

```json
{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "zustand": "^4.x",
    "@codemirror/lang-markdown": "^6.x",
    "@codemirror/state": "^6.x",
    "@codemirror/view": "^6.x",
    "markdown-it": "^14.x",
    "highlight.js": "^11.x",
    "dompurify": "^3.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "tailwindcss": "^3.x",
    "@types/react": "^18.x",
    "@types/dompurify": "^3.x"
  }
}
```

### 9.2 Extension Dependencies

```json
{
  "devDependencies": {
    "vite": "^5.x",
    "@crxjs/vite-plugin": "^2.x",
    "typescript": "^5.x"
  }
}
```

---

## 10. Checklist

### Design Completeness

- [x] Architecture diagram
- [x] Directory structure
- [x] Component specifications
- [x] Data models
- [x] API interfaces
- [x] UI/UX layouts
- [x] Security measures
- [x] Implementation order
- [x] Testing strategy
- [x] Dependencies list

### Review Items

- [ ] Plan requirements coverage verified
- [ ] Security review completed
- [ ] Performance considerations addressed
- [ ] Accessibility requirements included
- [ ] SEO requirements addressed

---

## Appendix: Requirement Traceability

| Req ID | Design Section | Implementation Order |
|--------|----------------|---------------------|
| WEB-01 | 2.1.1, 5.1 | 2.6 |
| WEB-02 | 2.1.1 | 2.2 |
| WEB-03 | 2.1.1 | 8.1 |
| WEB-04 | 4.3 | 5.1, 5.2 |
| WEB-05 | 4.3 | 5.3 |
| WEB-06 | 3.2 | 5.4 |
| WEB-07 | 4.1, 2.2 | 6.7 |
| WEB-08 | 5.1 | 8.3 |
| WEB-09 | 5.1 | 8.2 |
| WEB-10 | 5.1 | 6.7 |
| WEB-11 | 3.3 | 3.1, 3.5 |
| WEB-12 | 2.1.3, 3.1 | 3.4 |
| WEB-13 | 2.1.3 | 3.7 |
| WEB-14 | 2.1.3 | 3.8 |
| WEB-15 | 2.1.4, 5.3 | 4.5 |
| WEB-16 | 2.1.4 | 4.1, 4.3 |
| WEB-17 | 2.1.4 | 4.3 |
| WEB-18 | 2.1.4 | 4.4 |
| WEB-19 | 2.1.4 | 4.3 |
| WEB-20 | 6.3 | 4.2 |
| WEB-21 | 1.2, 5.1 | 7.1, 7.2 |
| WEB-22 | 1.2 | 7.3, 7.4, 7.5 |
| EXT-01 | 2.2, 5.4 | 6.2 |
| EXT-02 | 2.2, 5.4 | 6.2 |
| EXT-03 | 4.2 | 6.4 |
| EXT-04 | 4.1 | 6.5 |
| EXT-05 | 2.2 | 6.6 |
| EXT-06 | 5.4 | 6.3 |
| EXT-07 | 2.2 | 6.6 |

---

*Design Document - printmd MVP v1.0*
