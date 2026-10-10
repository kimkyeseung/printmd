/**
 * Builds small HWP 5.0 files for tests: a minimal Compound File Binary
 * writer plus helpers for the DocInfo/BodyText records the importer reads.
 */
import { deflateSync } from 'fflate';

const SECTOR = 512;
const END_OF_CHAIN = 0xfffffffe;
const FAT_SECTOR = 0xfffffffd;
const NO_STREAM = 0xffffffff;

// fflate output comes from Node's realm under jsdom; copy into a local array.
const local = (bytes: Uint8Array) => Uint8Array.from(bytes);

class Writer {
  private bytes: number[] = [];
  u8(v: number) { this.bytes.push(v & 0xff); return this; }
  u16(v: number) { return this.u8(v).u8(v >>> 8); }
  u32(v: number) { return this.u16(v & 0xffff).u16(v >>> 16); }
  utf16(s: string) { for (const ch of s) this.u16(ch.charCodeAt(0)); return this; }
  raw(b: Uint8Array | number[]) { for (const v of b) this.bytes.push(v); return this; }
  zeros(n: number) { for (let i = 0; i < n; i++) this.bytes.push(0); return this; }
  pad(length: number) { while (this.bytes.length < length) this.bytes.push(0); return this; }
  get length() { return this.bytes.length; }
  done() { return new Uint8Array(this.bytes); }
}

/** Write streams (paths like "BodyText/Section0") into a compound file. */
export function buildCompoundFile(streams: Record<string, Uint8Array>): Uint8Array {
  interface Entry { name: string; type: number; children: Entry[]; data?: Uint8Array; id?: number; start?: number }
  const root: Entry = { name: 'Root Entry', type: 5, children: [] };
  for (const [path, data] of Object.entries(streams)) {
    const parts = path.split('/');
    let parent = root;
    for (const storage of parts.slice(0, -1)) {
      let next = parent.children.find((c) => c.name === storage);
      if (!next) parent.children.push((next = { name: storage, type: 1, children: [] }));
      parent = next;
    }
    parent.children.push({ name: parts[parts.length - 1], type: 2, children: [], data });
  }
  const entries: Entry[] = [];
  const number = (e: Entry) => { e.id = entries.length; entries.push(e); e.children.forEach(number); };
  number(root);

  const streamEntries = entries.filter((e) => e.type === 2);
  const dataSectors = streamEntries.map((e) => Math.max(1, Math.ceil(e.data!.length / SECTOR)));
  const dirSectors = Math.ceil((entries.length * 128) / SECTOR);
  let fatSectors = 1;
  while (fatSectors * 128 < fatSectors + dirSectors + dataSectors.reduce((a, b) => a + b, 0)) fatSectors++;

  const fat: number[] = [];
  for (let i = 0; i < fatSectors; i++) fat.push(FAT_SECTOR);
  const firstDir = fat.length;
  for (let i = 0; i < dirSectors; i++) fat.push(i === dirSectors - 1 ? END_OF_CHAIN : fat.length + 1);
  streamEntries.forEach((e, i) => {
    e.start = fat.length;
    for (let s = 0; s < dataSectors[i]; s++) fat.push(s === dataSectors[i] - 1 ? END_OF_CHAIN : fat.length + 1);
  });
  while (fat.length % 128) fat.push(NO_STREAM);

  const header = new Writer()
    .raw([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]).zeros(16)
    .u16(0x3e).u16(3).u16(0xfffe).u16(9).u16(6).zeros(6)
    .u32(0).u32(fatSectors).u32(firstDir).u32(0)
    .u32(0) // mini stream cutoff 0: every stream lives in regular sectors
    .u32(END_OF_CHAIN).u32(0).u32(END_OF_CHAIN).u32(0);
  for (let i = 0; i < 109; i++) header.u32(i < fatSectors ? i : NO_STREAM);

  const out = new Writer().raw(header.done());
  for (const v of fat) out.u32(v);

  const dir = new Writer();
  for (const e of entries) {
    const start = dir.length;
    dir.utf16(e.name).u16(0).pad(start + 64);
    dir.u16((e.name.length + 1) * 2).u8(e.type).u8(1);
    // Siblings as a right-leaning chain; a storage points at its first child.
    const siblings = entries.find((p) => p.children.includes(e))?.children ?? [];
    const next = siblings[siblings.indexOf(e) + 1];
    dir.u32(NO_STREAM).u32(next ? next.id! : NO_STREAM).u32(e.children[0]?.id ?? NO_STREAM);
    dir.zeros(16 + 4 + 16).u32(e.type === 2 ? e.start! : END_OF_CHAIN).u32(e.data?.length ?? 0).u32(0);
  }
  dir.pad(dirSectors * SECTOR);
  out.raw(dir.done());

  streamEntries.forEach((e, i) => {
    const sector = new Writer().raw(e.data!);
    sector.pad(dataSectors[i] * SECTOR);
    out.raw(sector.done());
  });
  return out.done();
}

// ---------------------------------------------------------------------------
// HWP records

export function record(tag: number, level: number, data: Uint8Array): Uint8Array {
  const w = new Writer();
  if (data.length >= 0xfff) w.u32(tag | (level << 10) | (0xfff << 20)).u32(data.length);
  else w.u32(tag | (level << 10) | (data.length << 20));
  return w.raw(data).done();
}

const concat = (parts: Uint8Array[]) => new Writer().raw(parts.flatMap((p) => Array.from(p))).done();

export interface CharShapeSpec {
  height?: number;
  bold?: boolean;
  italic?: boolean;
  strike?: boolean;
  /** Strikeout flag with the "3D" shape, which Hangul writes on plain text. */
  strike3d?: boolean;
}

export function charShape({ height = 1000, bold, italic, strike, strike3d }: CharShapeSpec = {}): Uint8Array {
  const props = ((italic ? 1 : 0) | (bold ? 2 : 0) | (strike || strike3d ? 1 << 18 : 0) | (strike3d ? 15 << 26 : 0)) >>> 0;
  return record(21, 0, new Writer().zeros(42).u32(height).u32(props).pad(72).done());
}

export function paraShape(outlineLevel?: number): Uint8Array {
  const props = outlineLevel === undefined ? 0 : (1 << 23) | (outlineLevel << 25);
  return record(25, 0, new Writer().u32(props).pad(54).done());
}

export function style(name: string, englishName: string): Uint8Array {
  return record(26, 0, new Writer().u16(name.length).utf16(name).u16(englishName.length).utf16(englishName).zeros(8).done());
}

export function binData(id: number, extension: string): Uint8Array {
  return record(18, 0, new Writer().u16(1).u16(id).u16(extension.length).utf16(extension).done());
}

/** One run of text: its char shape id and the code units it adds. */
export type Run = { shape: number; text: string } | { shape: number; control: 'tab' | 'lineBreak' | 'object' };

export interface ParagraphSpec {
  runs: Run[];
  paraShape?: number;
  style?: number;
  /** Records for each 'object' control, in order (CTRL_HEADER subtrees). */
  controls?: ((level: number) => Uint8Array)[];
}

export function paragraph(level: number, { runs, paraShape: shapeId = 0, style: styleId = 0, controls = [] }: ParagraphSpec): Uint8Array {
  const text = new Writer();
  const shapes = new Writer();
  let position = 0;
  let lastShape = -1;
  for (const run of runs) {
    if (run.shape !== lastShape) { shapes.u32(position).u32(run.shape); lastShape = run.shape; }
    if ('text' in run) { text.utf16(run.text); position += run.text.length; }
    else if (run.control === 'lineBreak') { text.u16(10); position += 1; }
    else {
      const code = run.control === 'tab' ? 9 : 11;
      text.u16(code).zeros(12).u16(code);
      position += 8;
    }
  }
  text.u16(13);
  const header = new Writer().u32(position + 1).u32(0).u16(shapeId).u8(styleId).pad(24).done();
  return concat([
    record(66, level, header),
    record(67, level + 1, text.done()),
    record(68, level + 1, shapes.done()),
    ...controls.map((c) => c(level + 1)),
  ]);
}

const controlId = (chid: string) => new Writer().u32(
  (chid.charCodeAt(0) << 24 | chid.charCodeAt(1) << 16 | chid.charCodeAt(2) << 8 | chid.charCodeAt(3)) >>> 0
);

export interface CellSpec { row: number; col: number; rowSpan?: number; colSpan?: number; paragraphs: ParagraphSpec[] }

/** A table control; pass a caption to add a paragraph list without a cell address. */
export function table(rows: number, cols: number, cells: CellSpec[], caption?: ParagraphSpec) {
  return (level: number) => concat([
    record(71, level, controlId('tbl ').zeros(40).done()),
    record(77, level + 1, new Writer().u32(0).u16(rows).u16(cols).zeros(10).done()),
    ...(caption ? [
      record(72, level + 1, new Writer().u16(1).u32(0).pad(8).u16(0xffff).u16(0xffff).pad(16).done()),
      paragraph(level + 1, caption),
    ] : []),
    ...cells.flatMap((cell) => [
      record(72, level + 1, new Writer().u16(cell.paragraphs.length).u32(0).u16(0)
        .u16(cell.col).u16(cell.row).u16(cell.colSpan ?? 1).u16(cell.rowSpan ?? 1).pad(34).done()),
      ...cell.paragraphs.map((p) => paragraph(level + 1, p)),
    ]),
  ]);
}

/** A drawing object holding a text box. */
export function textBox(paragraphs: ParagraphSpec[]) {
  return (level: number) => concat([
    record(71, level, controlId('gso ').zeros(40).done()),
    record(76, level + 1, new Writer().zeros(16).done()),
    record(72, level + 2, new Writer().u16(paragraphs.length).pad(16).done()),
    ...paragraphs.map((p) => paragraph(level + 2, p)),
  ]);
}

/** A drawing object showing bin item `binItemId` (1-based). */
export function picture(binItemId: number) {
  return (level: number) => concat([
    record(71, level, controlId('gso ').zeros(40).done()),
    record(76, level + 1, new Writer().zeros(16).done()),
    record(85, level + 2, new Writer().zeros(71).u16(binItemId).pad(80).done()),
  ]);
}

export interface HwpSpec {
  charShapes?: Uint8Array[];
  paraShapes?: Uint8Array[];
  styles?: Uint8Array[];
  binData?: { record: Uint8Array; stream: string; bytes: Uint8Array }[];
  sections: Uint8Array[][];
  compressed?: boolean;
  /** FileHeader property bits to add (2 = password, 4 = distribution). */
  extraFlags?: number;
}

export function buildHwp(spec: HwpSpec): Uint8Array {
  const compressed = spec.compressed ?? false;
  const pack = (data: Uint8Array) => (compressed ? local(deflateSync(data)) : data);
  const fileHeader = new Writer().raw(Array.from('HWP Document File', (c) => c.charCodeAt(0))).pad(32)
    .u32(0x05000500).u32((compressed ? 1 : 0) | (spec.extraFlags ?? 0)).pad(256).done();
  const docInfo = concat([
    ...(spec.charShapes ?? [charShape()]),
    ...(spec.paraShapes ?? [paraShape()]),
    ...(spec.styles ?? [style('바탕글', 'Normal')]),
    ...(spec.binData ?? []).map((b) => b.record),
  ]);
  const streams: Record<string, Uint8Array> = {
    FileHeader: fileHeader,
    DocInfo: pack(docInfo),
  };
  spec.sections.forEach((paragraphs, i) => {
    streams[`BodyText/Section${i}`] = pack(concat(paragraphs));
  });
  for (const b of spec.binData ?? []) streams[b.stream] = pack(b.bytes);
  return buildCompoundFile(streams);
}

export const text = (value: string, shape = 0): Run => ({ shape, text: value });
