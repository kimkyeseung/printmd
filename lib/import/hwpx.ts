/**
 * Convert a Hancom HWPX document (OWPML: a ZIP of XML parts) to Markdown.
 *
 * Runs entirely in the browser: the archive is unzipped with fflate and the
 * XML parts are read with DOMParser into the shared block model, which
 * ./document renders.
 */

import { unzipSync } from 'fflate';
import {
  mediaTypeForExtension,
  PRIVATE_USE_RE,
  renderDocument,
  type Block,
  type Cell,
  type CharStyle,
  type ImportOptions,
  type ImportResult,
  type Segment,
} from './document';

export class HwpxError extends Error {
  constructor(public readonly code: 'not-hwpx' | 'no-content') {
    super(code === 'not-hwpx' ? 'Not an HWPX file' : 'The HWPX file has no readable sections');
    this.name = 'HwpxError';
  }
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

/** Hancom writes non-standard types such as "image/jpg"; trust the extension first. */
function imageMediaType(href: string, declared: string | null): string {
  return mediaTypeForExtension(href.split('.').pop() ?? '') ?? declared ?? '';
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
        case 'pic':
        case 'rect':
        case 'ellipse':
        case 'polygon':
        case 'curve':
        case 'arc':
        case 'container':
          trailing.push(...readDrawing(node, header));
          break;
        // secPr and ctrl (page numbers, columns, fields) carry layout only.
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
 * Pictures and text boxes, possibly grouped in a container, in document order.
 */
function readDrawing(node: Element, header: Header): Block[] {
  if (node.localName === 'pic') {
    const itemId = descendants(node, 'img')[0]?.getAttribute('binaryItemIDRef');
    return itemId ? [{ kind: 'image', imageId: itemId }] : [];
  }
  const blocks: Block[] = [];
  for (const child of children(node)) {
    if (child.localName === 'drawText') {
      const subList = firstChild(child, 'subList');
      if (subList) blocks.push(...readParagraphs(subList, header, false));
    } else {
      blocks.push(...readDrawing(child, header));
    }
  }
  return blocks;
}

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

export function isHwpxArchive(data: Uint8Array): boolean {
  // ZIP local file header signature "PK\x03\x04".
  return data.length > 4 && data[0] === 0x50 && data[1] === 0x4b && data[2] === 0x03 && data[3] === 0x04;
}

export async function hwpxToMarkdown(
  data: ArrayBuffer | Uint8Array,
  options: ImportOptions = {}
): Promise<ImportResult> {
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

  return renderDocument(blocks, (id) => {
    const item = pkg.binItems.get(id);
    const bytes = item && files[item.path];
    return item && bytes ? { bytes, mediaType: item.mediaType } : undefined;
  }, options);
}
