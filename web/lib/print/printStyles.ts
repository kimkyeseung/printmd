import type { PrintSettings } from '@/types/print';
import { getPaperDimensions } from './paperSizes';

export function generatePrintStyles(settings: PrintSettings): string {
  const { width, height } = getPaperDimensions(settings.paperSize, settings.orientation);
  const { margins } = settings;

  return `
@media print {
  @page {
    size: ${width}mm ${height}mm;
    margin: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm;
  }

  html, body {
    width: ${width}mm;
    height: ${height}mm;
    margin: 0;
    padding: 0;
    background: ${settings.includeBackground ? 'inherit' : 'white'} !important;
    -webkit-print-color-adjust: ${settings.includeBackground ? 'exact' : 'economy'};
    print-color-adjust: ${settings.includeBackground ? 'exact' : 'economy'};
  }

  /* Hide UI elements */
  header,
  .no-print,
  .style-panel,
  .toolbar,
  .editor-panel,
  .split-divider,
  .adsense {
    display: none !important;
  }

  /* Show only preview */
  .preview-panel,
  .preview-container,
  .preview-content {
    display: block !important;
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
    position: static !important;
  }

  /* Page breaks */
  h1, h2, h3, h4, h5, h6 {
    page-break-after: avoid;
    break-after: avoid;
  }

  p, li, blockquote {
    orphans: 3;
    widows: 3;
  }

  pre, code, table, figure, img {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Links */
  a {
    text-decoration: none;
    color: inherit;
  }

  a[href^="http"]:after {
    content: none;
  }
}
`;
}

export function generateHeaderFooterStyles(settings: PrintSettings): string {
  const { header, footer } = settings;

  if (!header.enabled && !footer.enabled) return '';

  const styles: string[] = ['@media print {'];

  if (header.enabled) {
    styles.push(`
  @page {
    @top-left {
      content: "${replaceVariables(header.left)}";
      font-size: 10px;
      color: #666;
    }
    @top-center {
      content: "${replaceVariables(header.center)}";
      font-size: 10px;
      color: #666;
    }
    @top-right {
      content: "${replaceVariables(header.right)}";
      font-size: 10px;
      color: #666;
    }
  }`);
  }

  if (footer.enabled) {
    styles.push(`
  @page {
    @bottom-left {
      content: "${replaceVariables(footer.left)}";
      font-size: 10px;
      color: #666;
    }
    @bottom-center {
      content: "${replaceVariables(footer.center)}";
      font-size: 10px;
      color: #666;
    }
    @bottom-right {
      content: "${replaceVariables(footer.right)}";
      font-size: 10px;
      color: #666;
    }
  }`);
  }

  styles.push('}');
  return styles.join('\n');
}

function replaceVariables(text: string): string {
  return text
    .replace(/{title}/g, '" attr(data-title) "')
    .replace(/{date}/g, new Date().toLocaleDateString())
    .replace(/{page}/g, '" counter(page) "')
    .replace(/{pages}/g, '" counter(pages) "');
}
