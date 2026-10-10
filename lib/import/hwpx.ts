/**
 * Convert a Hancom HWPX document (OWPML: a ZIP of XML parts) to Markdown.
 *
 * Runs entirely in the browser: the archive is unzipped with fflate and the
 * XML parts are read with DOMParser. Structure is recovered from the document
 * itself — outline styles become headings, runs keep bold/italic/strike, and
 * tables become GFM tables. Headings that were only styled with a bigger font
 * (common in Korean public-sector documents) are recovered by comparing each
 * paragraph's font size to the document's body size.
 */

import { unzipSync } from 'fflate';

export interface HwpxConversion {
  markdown: string;
  /** Images left out because of their format or the size budget. */
  skippedImages: number;
}

export interface HwpxOptions {
  /**
   * Re-encode an image the Markdown pipeline can't show (e.g. BMP) as PNG.
   * Returns a data URI, or null when the image can't be converted.
   */
  convertImage?: (bytes: Uint8Array, mediaType: string) => Promise<string | null>;
  /** Total budget for embedded image data URIs, in characters. */
  maxImageChars?: number;
}

export class HwpxError extends Error {
  constructor(public readonly code: 'not-hwpx' | 'no-content') {
    super(code === 'not-hwpx' ? 'Not an HWPX file' : 'The HWPX file has no readable sections');
    this.name = 'HwpxError';
  }
}

/** markdown-it only accepts data URIs of these image types. */
const DISPLAYABLE_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp']);
const DEFAULT_MAX_IMAGE_CHARS = 2_000_000;

interface CharStyle {
  /** Font size in 1/100 pt. */
  height: number;
  bold: boolean;
  italic: boolean;
  strike: boolean;
}

interface Header {
  charPr: Map<string, CharStyle>;
  /** paraPr id → outline level (0-based), for paragraphs numbered as an outline. */
  outlineLevel: Map<string, number>;
  /** style id → outline level (0-based), for the built-in "개요 N" styles. */
  styleOutlineLevel: Map<string, number>;
}

interface BinItem {
  path: string;
  mediaType: string;
}

interface Segment {
  text: string;
  style: CharStyle | undefined;
}

type Block =
  | { kind: 'para'; segments: Segment[]; outline: number | null; inTable: boolean }
  | { kind: 'table'; rows: Cell[][] }
  | { kind: 'image'; alt: string; itemId: string };

interface Cell {
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
  blocks: Block[];
}

// ---------------------------------------------------------------------------
// XML helpers — match on localName so namespace prefixes don't matter.

function parseXml(source: string): Document {
  return new DOMParser().parseFromString(source, 'application/xml');
}

function children(el: Element, localName?: string): Element[] {
  const out: Element[] = [];
  for (const child of Array.from(el.children)) {
    if (!localName || child.localName === localName) out.push(child);
  }
  return out;
}

function firstChild(el: Element, localName: string): Element | undefined {
  return children(el, localName)[0];
}

function descendants(root: Document | Element, localName: string): Element[] {
  return Array.from(root.getElementsByTagNameNS('*', localName));
}

function intAttr(el: Element | undefined, name: string, fallback: number): number {
  const value = el ? parseInt(el.getAttribute(name) ?? '', 10) : NaN;
  return Number.isNaN(value) ? fallback : value;
}

// ---------------------------------------------------------------------------
// Package parts

const decoder = new TextDecoder('utf-8');

function readText(files: Record<string, Uint8Array>, path: string): string | null {
  const bytes = files[path];
  return bytes ? decoder.decode(bytes) : null;
}

function readPackage(files: Record<string, Uint8Array>) {
  const sections: string[] = [];
  const binItems = new Map<string, BinItem>();

  const hpf = readText(files, 'Contents/content.hpf');
  if (hpf) {
    const doc = parseXml(hpf);

    const hrefById = new Map<string, string>();
    for (const item of descendants(doc, 'item')) {
      const id = item.getAttribute('id') ?? '';
      const href = item.getAttribute('href') ?? '';
      hrefById.set(id, href);
      if (href.startsWith('BinData/')) {
        binItems.set(id, { path: href, mediaType: imageMediaType(href, item.getAttribute('media-type')) });
      }
    }
    for (const ref of descendants(doc, 'itemref')) {
      const href = hrefById.get(ref.getAttribute('idref') ?? '');
      if (href && /^Contents\/section\d+\.xml$/.test(href)) sections.push(href);
    }
  }

  // Fall back to the conventional part names when the manifest is missing.
  if (sections.length === 0) {
    sections.push(
      ...Object.keys(files)
        .filter((p) => /^Contents\/section\d+\.xml$/.test(p))
        .sort((a, b) => sectionIndex(a) - sectionIndex(b))
    );
  }

  return { sections, binItems };
}

const IMAGE_TYPES_BY_EXTENSION: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  bmp: 'image/bmp',
};

/** Hancom writes non-standard types such as "image/jpg"; trust the extension first. */
function imageMediaType(href: string, declared: string | null): string {
  const extension = href.split('.').pop()?.toLowerCase() ?? '';
  return IMAGE_TYPES_BY_EXTENSION[extension] ?? declared ?? '';
}

function sectionIndex(path: string): number {
  return parseInt(path.match(/section(\d+)/)?.[1] ?? '0', 10);
}

function readHeader(source: string | null): Header {
  const header: Header = {
    charPr: new Map(),
    outlineLevel: new Map(),
    styleOutlineLevel: new Map(),
  };
  if (!source) return header;
  const doc = parseXml(source);

  for (const el of descendants(doc, 'charPr')) {
    const strikeShape = firstChild(el, 'strikeout')?.getAttribute('shape') ?? 'NONE';
    header.charPr.set(el.getAttribute('id') ?? '', {
      height: intAttr(el, 'height', 1000),
      bold: !!firstChild(el, 'bold'),
      italic: !!firstChild(el, 'italic'),
      strike: strikeShape !== 'NONE' && strikeShape !== '3D',
    });
  }

  for (const el of descendants(doc, 'paraPr')) {
    const heading = firstChild(el, 'heading');
    if (heading?.getAttribute('type') === 'OUTLINE') {
      header.outlineLevel.set(el.getAttribute('id') ?? '', intAttr(heading, 'level', 0));
    }
  }

  for (const el of descendants(doc, 'style')) {
    const name = el.getAttribute('name') ?? '';
    const engName = el.getAttribute('engName') ?? '';
    const match = name.match(/^개요\s*(\d)$/) ?? engName.match(/^Outline\s*(\d)$/);
    if (match) header.styleOutlineLevel.set(el.getAttribute('id') ?? '', parseInt(match[1], 10) - 1);
  }

  return header;
}

// ---------------------------------------------------------------------------
// Section → blocks

function readParagraph(p: Element, header: Header, inTable: boolean): Block[] {
  const blocks: Block[] = [];
  const segments: Segment[] = [];
  // Tables and pictures anchored in a paragraph are emitted after its text.
  const trailing: Block[] = [];

  for (const run of children(p, 'run')) {
    const style = header.charPr.get(run.getAttribute('charPrIDRef') ?? '');
    for (const node of children(run)) {
      switch (node.localName) {
        case 't':
          segments.push({ text: readTextNode(node), style });
          break;
        case 'lineBreak':
          segments.push({ text: '\n', style });
          break;
        case 'tab':
          segments.push({ text: ' ', style });
          break;
        case 'tbl':
          trailing.push(readTable(node, header));
          break;
        case 'pic': {
          const img = descendants(node, 'img')[0];
          const itemId = img?.getAttribute('binaryItemIDRef');
          if (itemId) trailing.push({ kind: 'image', alt: '', itemId });
          break;
        }
        // secPr, ctrl (page numbers, columns, fields) and drawing objects
        // carry layout only.
      }
    }
  }

  const paraPrId = p.getAttribute('paraPrIDRef') ?? '';
  const styleId = p.getAttribute('styleIDRef') ?? '';
  const outline = header.styleOutlineLevel.get(styleId) ?? header.outlineLevel.get(paraPrId) ?? null;

  blocks.push({ kind: 'para', segments, outline, inTable });
  blocks.push(...trailing);
  return blocks;
}

/**
 * Hancom stores inline control placeholders and some font-specific symbols in
 * the Private Use Area; no web font can show them.
 */
const PRIVATE_USE_RE = /[\ue000-\uf8ff]/g;

function readTextNode(t: Element): string {
  let text = '';
  for (const node of Array.from(t.childNodes)) {
    if (node.nodeType === 3) {
      text += node.nodeValue ?? '';
    } else if (node.nodeType === 1) {
      const name = (node as Element).localName;
      if (name === 'lineBreak') text += '\n';
      else if (name === 'tab' || name === 'fwSpace' || name === 'nbSpace') text += ' ';
    }
  }
  return text.replace(PRIVATE_USE_RE, '');
}

function readParagraphs(container: Element, header: Header, inTable: boolean): Block[] {
  return children(container, 'p').flatMap((p) => readParagraph(p, header, inTable));
}

function readTable(tbl: Element, header: Header): Block {
  const rows: Cell[][] = [];
  children(tbl, 'tr').forEach((tr, rowIndex) => {
    const row: Cell[] = [];
    children(tr, 'tc').forEach((tc, colIndex) => {
      const addr = firstChild(tc, 'cellAddr');
      const span = firstChild(tc, 'cellSpan');
      const subList = firstChild(tc, 'subList');
      row.push({
        row: intAttr(addr, 'rowAddr', rowIndex),
        col: intAttr(addr, 'colAddr', colIndex),
        rowSpan: Math.max(1, intAttr(span, 'rowSpan', 1)),
        colSpan: Math.max(1, intAttr(span, 'colSpan', 1)),
        blocks: subList ? readParagraphs(subList, header, true) : [],
      });
    });
    rows.push(row);
  });
  return { kind: 'table', rows };
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
function renderSegments(segments: Segment[], plain = false): string {
  const merged: Segment[] = [];
  for (const seg of segments) {
    const last = merged[merged.length - 1];
    if (last && sameEmphasis(last.style, seg.style)) last.text += seg.text;
    else merged.push({ ...seg });
  }

  return merged
    .map(({ text, style }) => {
      const escaped = escapeInline(text);
      if (plain || !style || !escaped.trim()) return escaped;
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
  if (block.inTable) return null;

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

  // Leading spaces would turn an indented paragraph into a code block.
  return renderSegments(block.segments)
    .split('\n')
    .map((line) => line.trim().replace(/^(#{1,6}(?:\s|$))/, '\\$1'))
    .join('\n')
    .trim();
}

function renderImage(block: Extract<Block, { kind: 'image' }>, ctx: RenderContext): string {
  const uri = ctx.images.get(block.itemId);
  return uri ? `![${block.alt}](${uri})` : '';
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

function renderTable(block: Extract<Block, { kind: 'table' }>, ctx: RenderContext): string {
  const cells = block.rows.flat();
  if (cells.length === 0) return '';

  // A single-cell table is a layout box (title banners, notes): unwrap it.
  if (cells.length === 1) return renderBlocks(cells[0].blocks, ctx);

  const rowCount = Math.max(...cells.map((c) => c.row + c.rowSpan));
  const colCount = Math.max(...cells.map((c) => c.col + c.colSpan));
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

function collectImageIds(blocks: Block[], into: string[] = []): string[] {
  for (const block of blocks) {
    if (block.kind === 'image') into.push(block.itemId);
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
  files: Record<string, Uint8Array>,
  binItems: Map<string, BinItem>,
  options: HwpxOptions
): Promise<{ images: Map<string, string | null>; skipped: number }> {
  const images = new Map<string, string | null>();
  let budget = options.maxImageChars ?? DEFAULT_MAX_IMAGE_CHARS;
  let skipped = 0;

  for (const id of ids) {
    if (images.has(id)) continue;
    const item = binItems.get(id);
    const bytes = item && files[item.path];
    let uri: string | null = null;
    if (item && bytes) {
      if (DISPLAYABLE_IMAGE_TYPES.has(item.mediaType)) {
        uri = `data:${item.mediaType};base64,${toBase64(bytes)}`;
      } else if (options.convertImage) {
        uri = await options.convertImage(bytes, item.mediaType).catch(() => null);
      }
    }
    if (uri && uri.length > budget) uri = null;
    if (uri) budget -= uri.length;
    else skipped++;
    images.set(id, uri);
  }

  return { images, skipped };
}

// ---------------------------------------------------------------------------

export function isHwpxArchive(data: Uint8Array): boolean {
  // ZIP local file header signature "PK\x03\x04".
  return data.length > 4 && data[0] === 0x50 && data[1] === 0x4b && data[2] === 0x03 && data[3] === 0x04;
}

export async function hwpxToMarkdown(
  data: ArrayBuffer | Uint8Array,
  options: HwpxOptions = {}
): Promise<HwpxConversion> {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  if (!isHwpxArchive(bytes)) throw new HwpxError('not-hwpx');

  let files: Record<string, Uint8Array>;
  try {
    files = unzipSync(bytes);
  } catch {
    throw new HwpxError('not-hwpx');
  }
  const mimetype = readText(files, 'mimetype')?.trim();
  if (mimetype && mimetype !== 'application/hwp+zip') throw new HwpxError('not-hwpx');

  const pkg = readPackage(files);
  const header = readHeader(readText(files, 'Contents/header.xml'));

  const blocks: Block[] = [];
  for (const path of pkg.sections) {
    const source = readText(files, path);
    if (!source) continue;
    const root = parseXml(source).documentElement;
    blocks.push(...readParagraphs(root, header, false));
  }
  if (pkg.sections.length === 0) throw new HwpxError('no-content');

  const { images, skipped } = await embedImages(collectImageIds(blocks), files, pkg.binItems, options);
  const ctx: RenderContext = { bodyHeight: bodyHeight(blocks), images };
  const markdown = renderBlocks(blocks, ctx).replace(/\n{3,}/g, '\n\n').trim() + '\n';

  return { markdown, skippedImages: skipped };
}
