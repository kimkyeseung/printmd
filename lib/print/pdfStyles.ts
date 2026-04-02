import type { GlobalStyles } from '@/types/style';

interface PdfStyleOptions {
  linkColor?: string;
  codeBackground?: string;
  textColor?: string;
}

/**
 * Inline CSS styles for PDF generation.
 * html2canvas needs styles inline (or in a <style> tag within the element)
 * because it doesn't reliably pick up external stylesheets for dynamically created elements.
 *
 * Accepts optional theme values so the PDF matches the on-screen preset.
 */
export function getPdfStyles(options?: PdfStyleOptions): string {
  const linkColor = options?.linkColor || '#0366d6';
  const codeBg = options?.codeBackground || '#f5f5f5';
  const textColor = options?.textColor || '#1a1a1a';

  // Derive semi-transparent overlays from text color for borders/backgrounds
  const isLightText = isLight(textColor);
  const overlayBase = isLightText ? '255, 255, 255' : '0, 0, 0';

  return `
    .preview-content {
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    .preview-content h1,
    .preview-content h2,
    .preview-content h3,
    .preview-content h4,
    .preview-content h5,
    .preview-content h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: 600;
      line-height: 1.3;
    }
    .preview-content h1 {
      font-size: 2em;
      padding-bottom: 0.3em;
      border-bottom: 1px solid rgba(${overlayBase}, 0.15);
    }
    .preview-content h2 {
      font-size: 1.5em;
      padding-bottom: 0.3em;
      border-bottom: 1px solid rgba(${overlayBase}, 0.15);
    }
    .preview-content h3 { font-size: 1.25em; }
    .preview-content h4 { font-size: 1em; }
    .preview-content h5 { font-size: 0.875em; }
    .preview-content h6 { font-size: 0.85em; opacity: 0.7; }
    .preview-content p {
      margin-top: 0;
      margin-bottom: 1em;
    }
    .preview-content a {
      color: ${linkColor};
      text-decoration: none;
    }
    .preview-content ul {
      margin-top: 0;
      margin-bottom: 1em;
      padding-left: 2em;
      list-style-type: disc;
    }
    .preview-content ol {
      margin-top: 0;
      margin-bottom: 1em;
      padding-left: 2em;
      list-style-type: decimal;
    }
    .preview-content li {
      margin-bottom: 0.25em;
    }
    .preview-content li > ul,
    .preview-content li > ol {
      margin-top: 0.25em;
      margin-bottom: 0;
    }
    .preview-content blockquote {
      margin: 0 0 1em;
      padding: 0.5em 1em;
      border-left: 4px solid rgba(${overlayBase}, 0.25);
      opacity: 0.85;
      background-color: rgba(${overlayBase}, 0.04);
    }
    .preview-content blockquote p:last-child {
      margin-bottom: 0;
    }
    .preview-content code {
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
      font-size: 0.875em;
      padding: 0.2em 0.4em;
      background-color: ${codeBg};
      border-radius: 3px;
    }
    .preview-content pre {
      margin: 0 0 1em;
      padding: 1em;
      overflow-x: auto;
      background-color: ${codeBg};
      border-radius: 6px;
    }
    .preview-content pre code {
      padding: 0;
      background-color: transparent;
      font-size: 0.85em;
      line-height: 1.5;
    }
    .preview-content hr {
      height: 0.25em;
      margin: 1.5em 0;
      padding: 0;
      background-color: rgba(${overlayBase}, 0.20);
      border: 0;
    }
    .preview-content table {
      width: 100%;
      margin-bottom: 1em;
      border-collapse: collapse;
      border-spacing: 0;
    }
    .preview-content table th,
    .preview-content table td {
      padding: 0.5em 1em;
      border: 1px solid rgba(${overlayBase}, 0.20);
    }
    .preview-content table th {
      font-weight: 600;
      background-color: rgba(${overlayBase}, 0.06);
    }
    .preview-content table tr:nth-child(even) {
      background-color: rgba(${overlayBase}, 0.03);
    }
    .preview-content img {
      max-width: 100%;
      height: auto;
    }
    .preview-content strong { font-weight: 600; }
    .preview-content em { font-style: italic; }
    .preview-content del { text-decoration: line-through; }
    .preview-content input[type="checkbox"] { margin-right: 0.5em; }
  `;
}

/** Simple check: is the color perceived as "light"? */
function isLight(color: string): boolean {
  // Handle hex colors
  const hex = color.replace('#', '');
  if (/^[0-9a-f]{3,8}$/i.test(hex)) {
    const full = hex.length === 3
      ? hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
      : hex.slice(0, 6);
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    // Perceived brightness
    return (r * 299 + g * 587 + b * 114) / 1000 > 128;
  }
  return false;
}
