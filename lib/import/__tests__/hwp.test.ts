import { describe, it, expect } from 'vitest';
import { hwpToMarkdown, HwpError, isCompoundFile } from '../hwp';
import {
  binData,
  buildCompoundFile,
  buildHwp,
  charShape,
  paragraph,
  paraShape,
  picture,
  record,
  style,
  table,
  text,
  textBox,
  type HwpSpec,
} from './hwpFixture';

async function convert(spec: HwpSpec) {
  return (await hwpToMarkdown(buildHwp(spec))).markdown;
}

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);

describe('hwpToMarkdown', () => {
  it('reads paragraphs from every section in order', async () => {
    const md = await convert({
      sections: [
        [paragraph(0, { runs: [text('첫 구역')] })],
        [paragraph(0, { runs: [text('둘째 구역')] })],
      ],
    });
    expect(md).toBe('첫 구역\n\n둘째 구역\n');
  });

  it('reads compressed documents', async () => {
    const md = await convert({
      compressed: true,
      sections: [[paragraph(0, { runs: [text('압축된 문서')] })]],
    });
    expect(md).toBe('압축된 문서\n');
  });

  it('applies character shapes by position', async () => {
    const md = await convert({
      charShapes: [charShape(), charShape({ bold: true }), charShape({ italic: true }), charShape({ strike: true })],
      sections: [[paragraph(0, {
        runs: [text('보통 '), text('굵게', 1), text(' '), text('기울임', 2), text(' '), text('취소', 3)],
      })]],
    });
    expect(md.trim()).toBe('보통 **굵게** *기울임* ~~취소~~');
  });

  it('treats the strikeout flag with the 3D shape as plain text', async () => {
    const md = await convert({
      charShapes: [charShape({ strike3d: true })],
      sections: [[paragraph(0, { runs: [text('보통 글자')] })]],
    });
    expect(md).toBe('보통 글자\n');
  });

  it('maps outline styles, outline numbering and large fonts to headings', async () => {
    const md = await convert({
      charShapes: [charShape(), charShape({ height: 2000 })],
      paraShapes: [paraShape(), paraShape(1)],
      styles: [style('바탕글', 'Normal'), style('개요 1', 'Outline 1')],
      sections: [[
        paragraph(0, { runs: [text('큰 글씨 제목', 1)] }),
        paragraph(0, { runs: [text('개요 제목')], style: 1 }),
        paragraph(0, { runs: [text('번호 개요')], paraShape: 1 }),
        paragraph(0, { runs: [text('본문 문단이 여기에 이어집니다.')] }),
      ]],
    });
    expect(md).toContain('# 큰 글씨 제목\n');
    expect(md).toContain('# 개요 제목\n');
    expect(md).toContain('## 번호 개요\n');
  });

  it('turns tabs and line breaks into spaces and newlines', async () => {
    const md = await convert({
      sections: [[paragraph(0, {
        runs: [text('항목'), { shape: 0, control: 'tab' }, text('값'), { shape: 0, control: 'lineBreak' }, text('다음 줄')],
      })]],
    });
    expect(md.trim()).toBe('항목 값\n다음 줄');
  });

  it('converts tables, keeping merged cells in their top-left slot', async () => {
    const cell = (row: number, col: number, value: string, rowSpan = 1) =>
      ({ row, col, rowSpan, paragraphs: [{ runs: [text(value)] }] });
    const md = await convert({
      sections: [[paragraph(0, {
        runs: [text('표 앞'), { shape: 0, control: 'object' }],
        controls: [table(3, 2, [
          cell(0, 0, '구분'), cell(0, 1, '내용'),
          cell(1, 0, '병합', 2), cell(1, 1, '첫째'),
          cell(2, 1, '둘째'),
        ])],
      })]],
    });
    expect(md).toBe('표 앞\n\n| 구분 | 내용 |\n| --- | --- |\n| 병합 | 첫째 |\n|  | 둘째 |\n');
  });

  it('keeps a table caption as a paragraph instead of a cell', async () => {
    const md = await convert({
      sections: [[paragraph(0, {
        runs: [{ shape: 0, control: 'object' }],
        controls: [table(1, 2, [
          { row: 0, col: 0, paragraphs: [{ runs: [text('a')] }] },
          { row: 0, col: 1, paragraphs: [{ runs: [text('b')] }] },
        ], { runs: [text('표 1. 캡션')] })],
      })]],
    });
    expect(md).toContain('| a | b |');
    expect(md).toContain('표 1. 캡션');
  });

  it('ignores cell addresses outside the table instead of building a huge grid', async () => {
    const md = await convert({
      sections: [[paragraph(0, {
        runs: [{ shape: 0, control: 'object' }],
        controls: [table(1, 2, [
          { row: 0, col: 0, paragraphs: [{ runs: [text('정상')] }] },
          { row: 0, col: 1, paragraphs: [{ runs: [text('셀')] }] },
          { row: 60000, col: 60000, paragraphs: [{ runs: [text('엉뚱한 주소')] }] },
        ])],
      })]],
    });
    expect(md).toContain('| 정상 | 셀 |');
  });

  it('reads text inside text boxes', async () => {
    const md = await convert({
      sections: [[paragraph(0, {
        runs: [text('본문'), { shape: 0, control: 'object' }],
        controls: [textBox([{ runs: [text('글상자 안')] }])],
      })]],
    });
    expect(md).toBe('본문\n\n글상자 안\n');
  });

  it('embeds pictures from BinData, decompressing them with the document', async () => {
    const { markdown, skippedImages } = await hwpToMarkdown(buildHwp({
      compressed: true,
      binData: [{ record: binData(1, 'png'), stream: 'BinData/BIN0001.png', bytes: PNG }],
      sections: [[paragraph(0, {
        runs: [{ shape: 0, control: 'object' }],
        controls: [picture(1)],
      })]],
    }));
    expect(markdown).toContain('![](data:image/png;base64,iVBORw==)');
    expect(skippedImages).toBe(0);
  });

  it('counts a picture whose data is missing as skipped', async () => {
    const { skippedImages } = await hwpToMarkdown(buildHwp({
      sections: [[paragraph(0, { runs: [{ shape: 0, control: 'object' }], controls: [picture(3)] })]],
    }));
    expect(skippedImages).toBe(1);
  });
});

describe('hwpToMarkdown errors', () => {
  const codeOf = async (data: Uint8Array) => {
    try {
      await hwpToMarkdown(data);
    } catch (error) {
      expect(error).toBeInstanceOf(HwpError);
      return (error as HwpError).code;
    }
    throw new Error('expected a failure');
  };
  const simple: HwpSpec = { sections: [[paragraph(0, { runs: [text('x')] })]] };

  it('rejects files that are not compound files', async () => {
    expect(await codeOf(new TextEncoder().encode('# markdown'))).toBe('not-hwp');
  });

  it('recognises HWP 3.0 files', async () => {
    const old = new Uint8Array(600);
    old.set(Array.from('HWP Document File V3.00', (c) => c.charCodeAt(0)));
    expect(await codeOf(old)).toBe('old-version');
  });

  it('rejects compound files that are not HWP documents', async () => {
    expect(await codeOf(buildCompoundFile({ WordDocument: new Uint8Array(10) }))).toBe('not-hwp');
  });

  it('reports password-protected and distribution documents', async () => {
    expect(await codeOf(buildHwp({ ...simple, extraFlags: 2 }))).toBe('encrypted');
    expect(await codeOf(buildHwp({ ...simple, extraFlags: 4 }))).toBe('distribution');
  });

  it('reports truncated records as corrupt', async () => {
    const broken = record(66, 0, new Uint8Array(24)).subarray(0, 10);
    expect(await codeOf(buildHwp({ sections: [[broken]] }))).toBe('corrupt');
  });

  it('identifies compound files by signature', () => {
    expect(isCompoundFile(buildHwp(simple))).toBe(true);
    expect(isCompoundFile(new Uint8Array(512))).toBe(false);
  });
});
