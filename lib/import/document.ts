/**
 * Format-neutral document model shared by the HWPX and HWP importers, and
 * its rendering to Markdown.
 *
 * Each importer only recovers structure — paragraphs with styled runs,
 * tables with cell coordinates, image references — and hands the blocks to
 * renderDocument(), so both formats get the same heading inference, table
 * handling and image embedding.
 */

export interface CharStyle {
  /** Font size in 1/100 pt. */
  height: number;
  bold: boolean;
  italic: boolean;
  strike: boolean;
}

export interface Segment {
  text: string;
  style: CharStyle | undefined;
}

export type Block =
  | {
      kind: 'para';
      segments: Segment[];
      /** Outline level (0-based) from the paragraph's style or numbering, if any. */
      outline: number | null;
      inTable: boolean;
    }
  | { kind: 'table'; rows: Cell[][] }
  | { kind: 'image'; imageId: string };

export interface Cell {
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
  blocks: Block[];
}

export interface ImageSource {
  bytes: Uint8Array;
  mediaType: string;
}

export interface ImportOptions {
  /**
   * Re-encode an image the Markdown pipeline can't show (e.g. BMP).
   * Returns a data URI, or null when the image can't be converted.
   */
  convertImage?: (bytes: Uint8Array, mediaType: string) => Promise<string | null>;
  /** Total budget for embedded image data URIs, in characters. */
  maxImageChars?: number;
}

export interface ImportResult {
  markdown: string;
  /** Images left out because of their format or the size budget. */
  skippedImages: number;
}

/** markdown-it only accepts data URIs of these image types. */
const DISPLAYABLE_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp']);
const DEFAULT_MAX_IMAGE_CHARS = 2_000_000;

const IMAGE_TYPES_BY_EXTENSION: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  bmp: 'image/bmp',
};

export function mediaTypeForExtension(extension: string): string | undefined {
  return IMAGE_TYPES_BY_EXTENSION[extension.toLowerCase()];
}

/**
 * Hancom stores inline control placeholders and font-specific symbols (such as
 * its circled numbers) in the Private Use Areas; no web font can show them.
 */
export const PRIVATE_USE_RE = /[\uE000-\uF8FF]|[\uDB80-\uDBFF][\uDC00-\uDFFF]/g;

export async function renderDocument(
  blocks: Block[],
  resolveImage: (imageId: string) => ImageSource | undefined,
  options: ImportOptions = {}
): Promise<ImportResult> {
  const { images, skipped } = await embedImages(collectImageIds(blocks), resolveImage, options);
  const ctx: RenderContext = { bodyHeight: bodyHeight(blocks), images };
  const markdown = renderBlocks(blocks, ctx).replace(/\n{3,}/g, '\n\n').trim() + '\n';
  return { markdown, skippedImages: skipped };
}

// ---------------------------------------------------------------------------
// Blocks → Markdown

interface RenderContext {
  /** Most common body font size, in 1/100 pt. */
  bodyHeight: number;
  images: Map<string, string | null>;
}

function escapeInline(text: string): string {
  return text.replace(/([\\`*_[\]<>~])/g, '\\$1');
}

/** Collapse the runs of a paragraph into Markdown, merging same-style neighbours. */
function renderSegments(segments: Segment[]): string {
  const merged: Segment[] = [];
  for (const seg of segments) {
    const last = merged[merged.length - 1];
    if (last && sameEmphasis(last.style, seg.style)) last.text += seg.text;
    else merged.push({ ...seg });
  }

  return merged
    .map(({ text, style }) => {
      const escaped = escapeInline(text);
      if (!style || !escaped.trim()) return escaped;
      // Emphasis markers must hug the text, so keep surrounding spaces outside.
      const [, lead, core, tail] = escaped.match(/^(\s*)([\s\S]*?)(\s*)$/)!;
      // Markers can't span a line break, so wrap each line on its own.
      const marked = core.split('\n').map((line) => {
        if (!line.trim()) return line;
        let out = line;
        if (style.strike) out = `~~${out}~~`;
        if (style.italic) out = `*${out}*`;
        if (style.bold) out = `**${out}**`;
        return out;
      }).join('\n');
      return lead + marked + tail;
    })
    .join('');
}

function sameEmphasis(a: CharStyle | undefined, b: CharStyle | undefined): boolean {
  return (
    (a?.bold ?? false) === (b?.bold ?? false) &&
    (a?.italic ?? false) === (b?.italic ?? false) &&
    (a?.strike ?? false) === (b?.strike ?? false)
  );
}

function plainText(segments: Segment[]): string {
  return segments.map((s) => s.text).join('');
}

/** Pick a heading level for a paragraph, or null for body text. */
function headingLevel(block: Extract<Block, { kind: 'para' }>, ctx: RenderContext): number | null {
  const text = plainText(block.segments).trim();
  if (!text || text.includes('\n') || text.length > 80) return null;
  if (block.outline !== null) return Math.min(block.outline + 1, 6);
  // Large-font sentences and dates ("…공고합니다.", "2026. 1. 2.") aren't titles.
  if (block.inTable || /[.!?。]$/.test(text)) return null;

  // Size-only headings: every visible character must be noticeably larger
  // than body text.
  const visible = block.segments.filter((s) => s.text.trim());
  const minHeight = Math.min(...visible.map((s) => s.style?.height ?? ctx.bodyHeight));
  const allBold = visible.every((s) => s.style?.bold);
  const ratio = minHeight / ctx.bodyHeight;
  if (ratio >= 1.6) return 1;
  if (ratio >= 1.3) return 2;
  if (ratio >= 1.15 && allBold) return 3;
  return null;
}

function renderParagraph(block: Extract<Block, { kind: 'para' }>, ctx: RenderContext): string {
  const level = headingLevel(block, ctx);
  if (level !== null) {
    const text = escapeInline(plainText(block.segments).trim().replace(/\s+/g, ' '));
    return `${'#'.repeat(level)} ${text}`;
  }

  // Leading spaces would turn an indented paragraph into a code block, and a
  // leading "#" or "2026." would start a heading or an ordered list.
  return renderSegments(block.segments)
    .split('\n')
    .map((line) => line.trim().replace(/^(#{1,6}(?:\s|$))/, '\\$1').replace(/^(\d+)([.)])(?=\s|$)/, '$1\\$2'))
    .join('\n')
    .trim();
}

function renderImage(block: Extract<Block, { kind: 'image' }>, ctx: RenderContext): string {
  const uri = ctx.images.get(block.imageId);
  return uri ? `![](${uri})` : '';
}

function renderBlocks(blocks: Block[], ctx: RenderContext): string {
  const out: string[] = [];
  for (const block of blocks) {
    let rendered = '';
    if (block.kind === 'para') rendered = renderParagraph(block, ctx);
    else if (block.kind === 'table') rendered = renderTable(block, ctx);
    else rendered = renderImage(block, ctx);
    if (rendered) out.push(rendered);
  }
  return out.join('\n\n');
}

/** Bounds on the rendered grid, so a damaged cell address can't exhaust memory. */
const MAX_TABLE_COLUMNS = 64;
const MAX_TABLE_ROWS = 2000;

function renderTable(block: Extract<Block, { kind: 'table' }>, ctx: RenderContext): string {
  const cells = block.rows.flat().filter((c) => c.col < MAX_TABLE_COLUMNS && c.row < MAX_TABLE_ROWS);
  if (cells.length === 0) return '';

  // A single-cell table is a layout box (title banners, notes): unwrap it.
  if (cells.length === 1) return renderBlocks(cells[0].blocks, ctx);

  const rowCount = Math.min(Math.max(...cells.map((c) => c.row + c.rowSpan)), MAX_TABLE_ROWS);
  const colCount = Math.min(Math.max(...cells.map((c) => c.col + c.colSpan)), MAX_TABLE_COLUMNS);
  const grid: string[][] = Array.from({ length: rowCount }, () => Array(colCount).fill(''));

  for (const cell of cells) {
    // Merged cells keep their text in the top-left slot; GFM has no spans.
    grid[cell.row][cell.col] = renderCell(cell.blocks, ctx);
  }
  const rows = grid.filter((row) => row.some(Boolean));
  if (rows.length === 0) return '';

  const banner = bannerHeading(rows);
  if (banner) return banner;

  const lines = rows.map((row) => `| ${row.join(' | ')} |`);
  lines.splice(1, 0, `| ${Array(colCount).fill('---').join(' | ')} |`);
  return lines.join('\n');
}

/**
 * Public-sector documents draw section titles as a one-row table with spacer
 * cells, e.g. | 1 | | 사업 개요 | |. Turn those into a heading.
 */
function bannerHeading(rows: string[][]): string | null {
  if (rows.length !== 1) return null;
  const filled = rows[0].filter(Boolean);
  if (filled.length === rows[0].length || filled.length > 3) return null;
  const parts = filled.map((cell) => cell.replace(/\*\*/g, '').trim());
  const text = parts.join(' ');
  if (text.length > 50 || text.includes('<br>') || text.includes('![')) return null;
  if (parts.length > 1 && /^\d+$/.test(parts[0])) {
    return `## ${parts[0]}. ${parts.slice(1).join(' ')}`;
  }
  return `## ${text}`;
}

function renderCell(blocks: Block[], ctx: RenderContext): string {
  const parts: string[] = [];
  for (const block of blocks) {
    if (block.kind === 'para') {
      const text = renderSegments(block.segments)
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .join('<br>');
      if (text) parts.push(text);
    } else if (block.kind === 'table') {
      // GFM can't nest tables; keep the nested cells' text in reading order.
      const nested = block.rows.flat().map((c) => renderCell(c.blocks, ctx)).filter(Boolean);
      if (nested.length) parts.push(nested.join(' / '));
    } else {
      const image = renderImage(block, ctx);
      if (image) parts.push(image);
    }
  }
  return parts.join('<br>').replace(/\|/g, '\\|');
}

/** The body font size: the height covering the most characters outside tables. */
function bodyHeight(blocks: Block[]): number {
  const counts = new Map<number, number>();
  for (const block of blocks) {
    if (block.kind !== 'para' || block.inTable) continue;
    for (const seg of block.segments) {
      const height = seg.style?.height;
      if (height) counts.set(height, (counts.get(height) ?? 0) + seg.text.trim().length);
    }
  }
  let best = 1000;
  let bestCount = 0;
  for (const [height, count] of counts) {
    if (count > bestCount) {
      best = height;
      bestCount = count;
    }
  }
  return best;
}

// ---------------------------------------------------------------------------
// Images

function collectImageIds(blocks: Block[], into: string[] = []): string[] {
  for (const block of blocks) {
    if (block.kind === 'image') into.push(block.imageId);
    else if (block.kind === 'table') {
      for (const cell of block.rows.flat()) collectImageIds(cell.blocks, into);
    }
  }
  return into;
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function embedImages(
  ids: string[],
  resolveImage: (imageId: string) => ImageSource | undefined,
  options: ImportOptions
): Promise<{ images: Map<string, string | null>; skipped: number }> {
  const images = new Map<string, string | null>();
  let budget = options.maxImageChars ?? DEFAULT_MAX_IMAGE_CHARS;
  let skipped = 0;

  for (const id of ids) {
    if (images.has(id)) continue;
    const source = resolveImage(id);
    let uri: string | null = null;
    if (source) {
      if (DISPLAYABLE_IMAGE_TYPES.has(source.mediaType)) {
        uri = `data:${source.mediaType};base64,${toBase64(source.bytes)}`;
      } else if (options.convertImage) {
        uri = await options.convertImage(source.bytes, source.mediaType).catch(() => null);
      }
    }
    if (uri && uri.length > budget) uri = null;
    if (uri) budget -= uri.length;
    else skipped++;
    images.set(id, uri);
  }

  return { images, skipped };
}
