/**
 * Convert a legacy Hancom HWP 5.0 document to Markdown.
 *
 * An HWP 5.0 file is a Compound File Binary (OLE) container. DocInfo holds
 * the shared character/paragraph shapes and styles; each BodyText/SectionN
 * stream holds the paragraphs as a flat list of tagged records whose levels
 * encode the tree (tables, cells, text boxes nest under their paragraph).
 * Streams are raw-deflate compressed when the header says so.
 *
 * Layout follows Hancom's published "HWP 5.0 file format" specification.
 * Everything runs in the browser; the parsed structure goes through the same
 * renderer as HWPX (./document).
 */

import { inflateSync } from 'fflate';
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

export type HwpErrorCode = 'not-hwp' | 'old-version' | 'encrypted' | 'distribution' | 'corrupt';

export class HwpError extends Error {
  constructor(public readonly code: HwpErrorCode) {
    super(`HWP import failed: ${code}`);
    this.name = 'HwpError';
  }
}

const corrupt = () => new HwpError('corrupt');

// ---------------------------------------------------------------------------
// Little-endian readers that fail loudly instead of reading past the end.

function u8(d: Uint8Array, o: number): number {
  if (o >= d.length) throw corrupt();
  return d[o];
}

function u16(d: Uint8Array, o: number): number {
  if (o + 2 > d.length) throw corrupt();
  return d[o] | (d[o + 1] << 8);
}

function u32(d: Uint8Array, o: number): number {
  if (o + 4 > d.length) throw corrupt();
  return (d[o] | (d[o + 1] << 8) | (d[o + 2] << 16) | (d[o + 3] << 24)) >>> 0;
}

function utf16(d: Uint8Array, o: number, count: number): string {
  let s = '';
  for (let i = 0; i < count; i++) s += String.fromCharCode(u16(d, o + i * 2));
  return s;
}

// ---------------------------------------------------------------------------
// Compound File Binary container

const CFB_SIGNATURE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
/** Sector ids at or above this are markers (free, end of chain, FAT, DIFAT). */
const MAX_REG_SECTOR = 0xfffffffa;
const NO_STREAM = 0xffffffff;

export function isCompoundFile(data: Uint8Array): boolean {
  return data.length >= 512 && CFB_SIGNATURE.every((b, i) => data[i] === b);
}

/** Read every stream of a compound file into a map keyed by its path. */
function readCompoundFile(buf: Uint8Array): Map<string, Uint8Array> {
  const sectorShift = u16(buf, 0x1e);
  if (sectorShift !== 9 && sectorShift !== 12) throw corrupt();
  const sectorSize = 1 << sectorShift;
  const miniSectorSize = 1 << u16(buf, 0x20);
  const firstDirSector = u32(buf, 0x30);
  const miniStreamCutoff = u32(buf, 0x38);
  const firstMiniFatSector = u32(buf, 0x3c);
  let difatSector = u32(buf, 0x44);
  const difatCount = u32(buf, 0x48);
  const sectorCount = Math.floor(buf.length / sectorSize) - 1;
  const offsetOf = (sector: number) => {
    if (sector >= sectorCount) throw corrupt();
    return (sector + 1) * sectorSize;
  };

  // The FAT's own sectors are listed in the header, then in a DIFAT chain.
  const fatSectors: number[] = [];
  for (let i = 0; i < 109; i++) {
    const sector = u32(buf, 0x4c + i * 4);
    if (sector < MAX_REG_SECTOR) fatSectors.push(sector);
  }
  const perDifat = sectorSize / 4 - 1;
  for (let n = 0; n < difatCount && difatSector < MAX_REG_SECTOR; n++) {
    const base = offsetOf(difatSector);
    for (let i = 0; i < perDifat; i++) {
      const sector = u32(buf, base + i * 4);
      if (sector < MAX_REG_SECTOR) fatSectors.push(sector);
    }
    difatSector = u32(buf, base + perDifat * 4);
  }

  const perSector = sectorSize / 4;
  const fat = new Uint32Array(fatSectors.length * perSector);
  fatSectors.forEach((sector, i) => {
    const base = offsetOf(sector);
    for (let j = 0; j < perSector; j++) fat[i * perSector + j] = u32(buf, base + j * 4);
  });

  // Chains are followed with a step limit so a looping table can't hang us.
  const chain = (start: number, table: Uint32Array): number[] => {
    const out: number[] = [];
    for (let s = start; s < MAX_REG_SECTOR; s = table[s]) {
      if (s >= table.length || out.length > table.length) throw corrupt();
      out.push(s);
    }
    return out;
  };
  const readChain = (start: number): Uint8Array => {
    const sectors = chain(start, fat);
    const out = new Uint8Array(sectors.length * sectorSize);
    sectors.forEach((s, i) => {
      const base = offsetOf(s);
      out.set(buf.subarray(base, base + sectorSize), i * sectorSize);
    });
    return out;
  };

  interface DirEntry {
    name: string;
    type: number;
    left: number;
    right: number;
    child: number;
    start: number;
    size: number;
  }
  const dir = readChain(firstDirSector);
  const entries: DirEntry[] = [];
  for (let p = 0; p + 128 <= dir.length; p += 128) {
    const nameBytes = Math.min(u16(dir, p + 64), 64);
    entries.push({
      name: utf16(dir, p, Math.max(0, nameBytes / 2 - 1)),
      type: u8(dir, p + 66),
      left: u32(dir, p + 68),
      right: u32(dir, p + 72),
      child: u32(dir, p + 76),
      start: u32(dir, p + 116),
      size: u32(dir, p + 120),
    });
  }
  const root = entries[0];
  if (!root || root.type !== 5) throw corrupt();

  const miniStream = root.start < MAX_REG_SECTOR ? readChain(root.start) : new Uint8Array(0);
  const miniFatBytes = firstMiniFatSector < MAX_REG_SECTOR ? readChain(firstMiniFatSector) : new Uint8Array(0);
  const miniFat = new Uint32Array(miniFatBytes.length / 4);
  for (let i = 0; i < miniFat.length; i++) miniFat[i] = u32(miniFatBytes, i * 4);

  const readStream = (entry: DirEntry): Uint8Array => {
    if (entry.size < miniStreamCutoff) {
      const sectors = chain(entry.start, miniFat);
      const out = new Uint8Array(sectors.length * miniSectorSize);
      sectors.forEach((s, i) => {
        const base = s * miniSectorSize;
        if (base + miniSectorSize > miniStream.length) throw corrupt();
        out.set(miniStream.subarray(base, base + miniSectorSize), i * miniSectorSize);
      });
      return out.subarray(0, entry.size);
    }
    return readChain(entry.start).subarray(0, entry.size);
  };

  // Siblings form a red-black tree through left/right; storages open a
  // subtree through child.
  const streams = new Map<string, Uint8Array>();
  const visited = new Set<number>();
  const walk = (id: number, prefix: string) => {
    if (id === NO_STREAM || id >= entries.length || visited.has(id)) return;
    visited.add(id);
    const entry = entries[id];
    walk(entry.left, prefix);
    walk(entry.right, prefix);
    if (entry.type === 2) streams.set(prefix + entry.name, readStream(entry));
    else if (entry.type === 1) walk(entry.child, `${prefix}${entry.name}/`);
  };
  walk(root.child, '');
  return streams;
}

// ---------------------------------------------------------------------------
// Records

interface HwpRecord {
  tag: number;
  level: number;
  data: Uint8Array;
  children: HwpRecord[];
}

const TAG = {
  BIN_DATA: 18,
  CHAR_SHAPE: 21,
  PARA_SHAPE: 25,
  STYLE: 26,
  PARA_HEADER: 66,
  PARA_TEXT: 67,
  PARA_CHAR_SHAPE: 68,
  CTRL_HEADER: 71,
  LIST_HEADER: 72,
  TABLE: 77,
  SHAPE_COMPONENT_PICTURE: 85,
} as const;

function readRecords(data: Uint8Array): HwpRecord[] {
  const records: HwpRecord[] = [];
  let p = 0;
  while (p + 4 <= data.length) {
    const header = u32(data, p);
    p += 4;
    let size = header >>> 20;
    if (size === 0xfff) {
      size = u32(data, p);
      p += 4;
    }
    if (p + size > data.length) throw corrupt();
    records.push({ tag: header & 0x3ff, level: (header >>> 10) & 0x3ff, data: data.subarray(p, p + size), children: [] });
    p += size;
  }
  return records;
}

/** Rebuild the tree: a record owns the following records with a deeper level. */
function toTree(records: HwpRecord[]): HwpRecord[] {
  const roots: HwpRecord[] = [];
  const stack: HwpRecord[] = [];
  for (const record of records) {
    while (stack.length && stack[stack.length - 1].level >= record.level) stack.pop();
    (stack.length ? stack[stack.length - 1].children : roots).push(record);
    stack.push(record);
  }
  return roots;
}

// ---------------------------------------------------------------------------
// DocInfo

interface DocInfo {
  charShapes: CharStyle[];
  /** Outline level per paragraph shape, when its numbering is an outline. */
  paraOutline: (number | null)[];
  /** Outline level per style, for the built-in "개요 N" styles. */
  styleOutline: (number | null)[];
  /** BinData stream name per 1-based bin item id. */
  binItems: ({ stream: string; mediaType: string; compressed: boolean } | null)[];
}

function readDocInfo(data: Uint8Array, documentCompressed: boolean): DocInfo {
  const info: DocInfo = { charShapes: [], paraOutline: [], styleOutline: [], binItems: [] };
  for (const record of readRecords(data)) {
    const d = record.data;
    switch (record.tag) {
      case TAG.CHAR_SHAPE: {
        // Seven font ids (u16) and four seven-byte arrays precede the size.
        const props = u32(d, 46);
        // Hangul sets the strikeout flag on plain text too, paired with the
        // "3D" line shape (15) — the same as strikeout shape="3D" in HWPX.
        const strikeShape = (props >>> 26) & 0xf;
        info.charShapes.push({
          height: u32(d, 42) | 0,
          italic: (props & 1) !== 0,
          bold: (props & 2) !== 0,
          strike: ((props >>> 18) & 7) !== 0 && strikeShape !== 15,
        });
        break;
      }
      case TAG.PARA_SHAPE: {
        const props = u32(d, 0);
        const headType = (props >>> 23) & 3; // 1 = outline
        info.paraOutline.push(headType === 1 ? (props >>> 25) & 7 : null);
        break;
      }
      case TAG.STYLE: {
        const nameLength = u16(d, 0);
        const name = utf16(d, 2, nameLength);
        const englishName = utf16(d, 4 + nameLength * 2, u16(d, 2 + nameLength * 2));
        const match = name.match(/^개요\s*(\d)$/) ?? englishName.match(/^Outline\s*(\d)$/);
        info.styleOutline.push(match ? parseInt(match[1], 10) - 1 : null);
        break;
      }
      case TAG.BIN_DATA: {
        const props = u16(d, 0);
        // Only embedded data (type 1) lives in the file; links point elsewhere.
        if ((props & 0xf) !== 1) {
          info.binItems.push(null);
          break;
        }
        const id = u16(d, 2);
        const extension = utf16(d, 6, u16(d, 4)).toLowerCase();
        const compression = (props >>> 4) & 3; // 0 = as document, 1 = yes, 2 = no
        info.binItems.push({
          stream: `BinData/BIN${id.toString(16).toUpperCase().padStart(4, '0')}.${extension}`,
          mediaType: mediaTypeForExtension(extension) ?? '',
          compressed: compression === 1 || (compression === 0 && documentCompressed),
        });
        break;
      }
    }
  }
  return info;
}

// ---------------------------------------------------------------------------
// BodyText → blocks

/** Control characters followed by seven more code units of parameters. */
const EXTENDED_CONTROLS = new Set([1, 2, 3, 11, 12, 14, 15, 16, 17, 18, 21, 22, 23]);
const INLINE_CONTROLS = new Set([4, 5, 6, 7, 8, 9, 19, 20]);
const TAB = 9;
const LINE_BREAK = 10;
const NON_BREAKING_SPACE = 30;
const FIXED_WIDTH_SPACE = 31;

/** Guards against pathological nesting in damaged files. */
const MAX_DEPTH = 32;

function controlId(record: HwpRecord): string {
  const id = u32(record.data, 0);
  return String.fromCharCode(id >>> 24, (id >>> 16) & 0xff, (id >>> 8) & 0xff, id & 0xff);
}

function readParagraph(para: HwpRecord, info: DocInfo, inTable: boolean, depth: number): Block[] {
  if (depth > MAX_DEPTH) throw corrupt();
  const paraShapeId = u16(para.data, 8);
  const styleId = u8(para.data, 10);
  const text = para.children.find((r) => r.tag === TAG.PARA_TEXT)?.data;
  const shapeRecord = para.children.find((r) => r.tag === TAG.PARA_CHAR_SHAPE)?.data;
  const controls = para.children.filter((r) => r.tag === TAG.CTRL_HEADER);

  // (start position, char shape id) pairs, positions in UTF-16 code units.
  const shapeRuns: [number, number][] = [];
  if (shapeRecord) {
    for (let o = 0; o + 8 <= shapeRecord.length; o += 8) shapeRuns.push([u32(shapeRecord, o), u32(shapeRecord, o + 4)]);
  }
  let runIndex = 0;
  const styleAt = (position: number): CharStyle | undefined => {
    while (runIndex + 1 < shapeRuns.length && shapeRuns[runIndex + 1][0] <= position) runIndex++;
    return shapeRuns.length ? info.charShapes[shapeRuns[runIndex][1]] : undefined;
  };

  const segments: Segment[] = [];
  // Tables, pictures and text boxes anchored here are emitted after the text.
  const trailing: Block[] = [];
  let controlIndex = 0;
  const push = (value: string, position: number) => {
    const style = styleAt(position);
    const last = segments[segments.length - 1];
    if (last && last.style === style) last.text += value;
    else segments.push({ text: value, style });
  };

  if (text) {
    const length = Math.floor(text.length / 2);
    for (let i = 0; i < length; i++) {
      const code = u16(text, i * 2);
      if (code >= 32) {
        push(String.fromCharCode(code), i);
      } else if (EXTENDED_CONTROLS.has(code)) {
        const control = controls[controlIndex++];
        if (control) trailing.push(...readControl(control, info, depth + 1));
        i += 7;
      } else if (INLINE_CONTROLS.has(code)) {
        if (code === TAB) push(' ', i);
        i += 7;
      } else if (code === LINE_BREAK) {
        push('\n', i);
      } else if (code === NON_BREAKING_SPACE || code === FIXED_WIDTH_SPACE) {
        push(' ', i);
      }
      // 13 ends the paragraph; the rest are reserved.
    }
  }
  for (const segment of segments) segment.text = segment.text.replace(PRIVATE_USE_RE, '');

  const outline = info.styleOutline[styleId] ?? info.paraOutline[paraShapeId] ?? null;
  return [{ kind: 'para', segments, outline, inTable }, ...trailing];
}

function readControl(control: HwpRecord, info: DocInfo, depth: number): Block[] {
  if (depth > MAX_DEPTH) throw corrupt();
  switch (controlId(control)) {
    case 'tbl ':
      return readTable(control, info, depth);
    // Headers/footers repeat on every page; hidden comments aren't content.
    case 'head':
    case 'foot':
    case 'tcmt':
      return [];
  }

  // Drawing objects (possibly grouped), text boxes and footnotes keep their
  // pictures and paragraphs somewhere in the subtree; take them in order.
  const blocks: Block[] = [];
  const collect = (record: HwpRecord, level: number) => {
    if (level > MAX_DEPTH) throw corrupt();
    for (const child of record.children) {
      if (child.tag === TAG.PARA_HEADER) {
        blocks.push(...readParagraph(child, info, false, depth + 1));
      } else if (child.tag === TAG.SHAPE_COMPONENT_PICTURE) {
        // Border, image rectangle, crop and padding come before the bin item id.
        blocks.push({ kind: 'image', imageId: String(u16(child.data, 71)) });
      } else {
        collect(child, level + 1);
      }
    }
  };
  collect(control, depth);
  return blocks;
}

function readTable(control: HwpRecord, info: DocInfo, depth: number): Block[] {
  const records = control.children;
  const table = records.find((r) => r.tag === TAG.TABLE);
  if (!table) return [];
  const rowCount = u16(table.data, 4);
  const colCount = u16(table.data, 6);

  const rows: Cell[][] = [];
  // A caption is also a paragraph list under the table; it has no cell address.
  const caption: Block[] = [];
  for (let i = 0; i < records.length; i++) {
    const header = records[i];
    if (header.tag !== TAG.LIST_HEADER) continue;
    const d = header.data;
    const isCell = d.length >= 16 && u16(d, 10) < rowCount && u16(d, 8) < colCount;
    const cell: Cell = {
      col: isCell ? u16(d, 8) : 0,
      row: isCell ? u16(d, 10) : 0,
      colSpan: isCell ? Math.min(Math.max(1, u16(d, 12)), colCount - u16(d, 8)) : 1,
      rowSpan: isCell ? Math.min(Math.max(1, u16(d, 14)), rowCount - u16(d, 10)) : 1,
      blocks: [],
    };
    // A cell's paragraphs follow its list header as siblings (some writers
    // nest them one level deeper instead).
    const nested = header.children.filter((r) => r.tag === TAG.PARA_HEADER);
    if (nested.length) {
      for (const para of nested) cell.blocks.push(...readParagraph(para, info, true, depth + 1));
    } else {
      const paragraphCount = u16(d, 0);
      for (let n = 0; n < paragraphCount && records[i + 1]?.tag === TAG.PARA_HEADER; n++) {
        cell.blocks.push(...readParagraph(records[++i], info, true, depth + 1));
      }
    }
    if (isCell) (rows[cell.row] ??= []).push(cell);
    else caption.push(...cell.blocks.map((b) => (b.kind === 'para' ? { ...b, inTable: false } : b)));
  }
  return [{ kind: 'table', rows: rows.filter(Boolean) }, ...caption];
}

// ---------------------------------------------------------------------------

const SIGNATURE = 'HWP Document File';

const decompress = (data: Uint8Array): Uint8Array => {
  try {
    return inflateSync(data);
  } catch {
    throw corrupt();
  }
};

export async function hwpToMarkdown(
  data: ArrayBuffer | Uint8Array,
  options: ImportOptions = {}
): Promise<ImportResult> {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  if (!isCompoundFile(bytes)) {
    // HWP 3.0 and earlier use their own container with this text signature.
    throw new HwpError(ascii(bytes.subarray(0, 17)) === SIGNATURE ? 'old-version' : 'not-hwp');
  }

  let streams: Map<string, Uint8Array>;
  try {
    streams = readCompoundFile(bytes);
  } catch (error) {
    throw error instanceof HwpError ? error : corrupt();
  }

  const fileHeader = streams.get('FileHeader');
  if (!fileHeader || ascii(fileHeader.subarray(0, 17)) !== SIGNATURE) {
    throw new HwpError('not-hwp');
  }
  const props = u32(fileHeader, 36);
  if (props & 2) throw new HwpError('encrypted');
  // Distribution documents keep their body encrypted in ViewText/.
  if (props & 4) throw new HwpError('distribution');
  const compressed = (props & 1) !== 0;
  const unpack = (stream: Uint8Array) => (compressed ? decompress(stream) : stream);

  const docInfoStream = streams.get('DocInfo');
  if (!docInfoStream) throw corrupt();
  const info = readDocInfo(unpack(docInfoStream), compressed);

  const sections = [...streams.keys()]
    .filter((name) => /^BodyText\/Section\d+$/.test(name))
    .sort((a, b) => parseInt(a.slice(16), 10) - parseInt(b.slice(16), 10));
  if (sections.length === 0) throw corrupt();

  const blocks: Block[] = [];
  for (const name of sections) {
    for (const record of toTree(readRecords(unpack(streams.get(name)!)))) {
      if (record.tag === TAG.PARA_HEADER) blocks.push(...readParagraph(record, info, false, 0));
    }
  }

  return renderDocument(blocks, (imageId) => {
    const item = info.binItems[parseInt(imageId, 10) - 1];
    const stream = item && streams.get(item.stream);
    if (!item || !stream) return undefined;
    let imageBytes = stream;
    if (item.compressed) {
      try {
        imageBytes = inflateSync(stream);
      } catch {
        // Some writers flag images as compressed but store them raw.
      }
    }
    return { bytes: imageBytes, mediaType: item.mediaType };
  }, options);
}

function ascii(bytes: Uint8Array): string {
  return String.fromCharCode(...bytes);
}
