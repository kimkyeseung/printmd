import { describe, it, expect } from 'vitest';
import { zipSync, strToU8 as nodeStrToU8 } from 'fflate';
import { hwpxToMarkdown, HwpxError } from '../hwpx';

// TextEncoder hands back a Uint8Array from Node's realm, which fflate's
// zipSync (running against jsdom's globals) mistakes for a folder.
const strToU8 = (text: string) => Uint8Array.from(nodeStrToU8(text));

const NS =
  'xmlns:hp="http://www.hancom.co.kr/hwpml/2011/paragraph" ' +
  'xmlns:hs="http://www.hancom.co.kr/hwpml/2011/section" ' +
  'xmlns:hh="http://www.hancom.co.kr/hwpml/2011/head" ' +
  'xmlns:hc="http://www.hancom.co.kr/hwpml/2011/core" ' +
  'xmlns:opf="http://www.idpf.org/2007/opf/"';

// charPr 0: 10pt body, 1: 10pt bold, 2: 20pt (size-only heading), 3: 10pt italic
const HEADER = `<?xml version="1.0" encoding="UTF-8"?>
<hh:head ${NS}><hh:refList>
  <hh:charProperties>
    <hh:charPr id="0" height="1000"><hh:strikeout shape="NONE"/></hh:charPr>
    <hh:charPr id="1" height="1000"><hh:bold/></hh:charPr>
    <hh:charPr id="2" height="2000"><hh:bold/></hh:charPr>
    <hh:charPr id="3" height="1000"><hh:italic/></hh:charPr>
  </hh:charProperties>
  <hh:paraProperties>
    <hh:paraPr id="0"><hh:heading type="NONE" idRef="0" level="0"/></hh:paraPr>
    <hh:paraPr id="1"><hh:heading type="OUTLINE" idRef="0" level="1"/></hh:paraPr>
  </hh:paraProperties>
  <hh:styles>
    <hh:style id="0" type="PARA" name="바탕글" engName="Normal"/>
    <hh:style id="2" type="PARA" name="개요 1" engName="Outline 1"/>
  </hh:styles>
</hh:refList></hh:head>`;

function p(runs: string, attrs = 'paraPrIDRef="0" styleIDRef="0"') {
  return `<hp:p ${attrs}>${runs}</hp:p>`;
}

function run(text: string, charPr = 0) {
  return `<hp:run charPrIDRef="${charPr}"><hp:t>${text}</hp:t></hp:run>`;
}

function cell(row: number, col: number, content: string, span = [1, 1]) {
  return `<hp:tc><hp:subList>${content}</hp:subList>` +
    `<hp:cellAddr colAddr="${col}" rowAddr="${row}"/>` +
    `<hp:cellSpan colSpan="${span[0]}" rowSpan="${span[1]}"/></hp:tc>`;
}

function table(rows: string[]) {
  return `<hp:run charPrIDRef="0"><hp:tbl>${rows.map((r) => `<hp:tr>${r}</hp:tr>`).join('')}</hp:tbl></hp:run>`;
}

function hwpx(body: string, extra: Record<string, Uint8Array> = {}, manifest = '') {
  const section = `<?xml version="1.0" encoding="UTF-8"?><hs:sec ${NS}>${body}</hs:sec>`;
  const hpf = `<?xml version="1.0" encoding="UTF-8"?><opf:package ${NS}>
    <opf:manifest>
      <opf:item id="header" href="Contents/header.xml" media-type="application/xml"/>
      <opf:item id="section0" href="Contents/section0.xml" media-type="application/xml"/>
      ${manifest}
    </opf:manifest>
    <opf:spine><opf:itemref idref="header"/><opf:itemref idref="section0"/></opf:spine>
  </opf:package>`;
  return zipSync({
    mimetype: strToU8('application/hwp+zip'),
    'Contents/content.hpf': strToU8(hpf),
    'Contents/header.xml': strToU8(HEADER),
    'Contents/section0.xml': strToU8(section),
    ...extra,
  });
}

async function convert(body: string) {
  return (await hwpxToMarkdown(hwpx(body))).markdown;
}

describe('hwpxToMarkdown', () => {
  it('converts plain paragraphs', async () => {
    const md = await convert(p(run('첫 문단')) + p(run('둘째 문단')));
    expect(md).toBe('첫 문단\n\n둘째 문단\n');
  });

  it('keeps bold and italic runs', async () => {
    const md = await convert(p(run('보통 ') + run('굵게', 1) + run(' 그리고 ') + run('기울임', 3)));
    expect(md.trim()).toBe('보통 **굵게** 그리고 *기울임*');
  });

  it('merges adjacent bold runs into a single emphasis span', async () => {
    const md = await convert(p(run('하나', 1) + run('둘', 1)));
    expect(md.trim()).toBe('**하나둘**');
  });

  it('maps outline styles and outline paragraph properties to headings', async () => {
    const md = await convert(
      p(run('개요 제목'), 'paraPrIDRef="0" styleIDRef="2"') +
      p(run('둘째 수준'), 'paraPrIDRef="1" styleIDRef="0"') +
      p(run('본문'))
    );
    expect(md).toContain('# 개요 제목');
    expect(md).toContain('## 둘째 수준');
  });

  it('does not turn large-font sentences or dates into headings', async () => {
    const md = await convert(p(run('다음과 같이 공고합니다.', 2)) + p(run('2026. 1. 2.', 2)) + p(run('본문 내용')));
    expect(md).toBe('**다음과 같이 공고합니다.**\n\n**2026. 1. 2.**\n\n본문 내용\n');
  });

  it('treats a short paragraph in a much larger font as a heading', async () => {
    const md = await convert(p(run('큰 제목', 2)) + p(run('본문 내용이 이어집니다.')));
    expect(md.startsWith('# 큰 제목\n')).toBe(true);
  });

  it('turns line breaks into Markdown line breaks and trims indentation', async () => {
    const md = await convert(p('<hp:run charPrIDRef="0"><hp:t>    들여쓴 줄<hp:lineBreak/>  다음 줄</hp:t></hp:run>'));
    expect(md.trim()).toBe('들여쓴 줄\n다음 줄');
  });

  it('keeps numbered lines and dates from becoming ordered lists', async () => {
    const md = await convert(p(run('2026. 1. 2.')) + p(run('1) 첫째 항목')));
    expect(md).toBe('2026\\. 1. 2.\n\n1\\) 첫째 항목\n');
  });

  it('escapes Markdown syntax in document text', async () => {
    const md = await convert(p(run('# 샵 * 별 &lt;태그&gt;')));
    expect(md.trim()).toBe('\\# 샵 \\* 별 \\<태그\\>');
  });

  it('drops Private Use Area placeholders and symbols', async () => {
    const md = await convert(p(run('\uF000 - 항목')) + p(run('\u{F02B1} 자금지원방식')));
    expect(md).toBe('- 항목\n\n자금지원방식\n');
  });

  it('converts tables to GFM, placing merged cells in their top-left slot', async () => {
    const md = await convert(p(table([
      cell(0, 0, p(run('구분'))) + cell(0, 1, p(run('내용'))),
      cell(1, 0, p(run('병합')), [1, 2]) + cell(1, 1, p(run('첫째'))),
      cell(2, 1, p(run('둘째|파이프'))),
    ])));
    expect(md).toContain('| 구분 | 내용 |\n| --- | --- |\n| 병합 | 첫째 |\n|  | 둘째\\|파이프 |');
  });

  it('joins paragraphs inside a cell with <br>', async () => {
    const md = await convert(p(table([
      cell(0, 0, p(run('위')) + p(run('아래'))) + cell(0, 1, p(run('옆'))),
      cell(1, 0, p(run('a'))) + cell(1, 1, p(run('b'))),
    ])));
    expect(md).toContain('| 위<br>아래 | 옆 |');
  });

  it('unwraps a single-cell layout table into ordinary blocks', async () => {
    const md = await convert(p(table([cell(0, 0, p(run('상자 안 글')))])));
    expect(md.trim()).toBe('상자 안 글');
  });

  it('turns a one-row banner table with spacer cells into a heading', async () => {
    const md = await convert(p(table([
      cell(0, 0, p(run('1', 1))) + cell(0, 1, p('')) + cell(0, 2, p(run('사업 개요'))) + cell(0, 3, p('')),
      cell(1, 0, p('')) + cell(1, 1, p('')) + cell(1, 2, p('')) + cell(1, 3, p('')),
    ])));
    expect(md.trim()).toBe('## 1. 사업 개요');
  });

  it('reads text boxes, including ones grouped with other shapes', async () => {
    const box = (content: string) =>
      `<hp:rect><hp:drawText><hp:subList>${p(run(content))}</hp:subList></hp:drawText></hp:rect>`;
    const md = await convert(p(
      run('본문') + `<hp:run charPrIDRef="0">${box('글상자')}<hp:container>${box('묶인 글상자')}</hp:container></hp:run>`
    ));
    expect(md).toBe('본문\n\n글상자\n\n묶인 글상자\n');
  });

  it('embeds displayable images as data URIs', async () => {
    const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);
    const pic = '<hp:run charPrIDRef="0"><hp:pic><hc:img binaryItemIDRef="image1"/></hp:pic></hp:run>';
    const file = hwpx(p(pic), { 'BinData/image1.png': png },
      '<opf:item id="image1" href="BinData/image1.png" media-type="image/png"/>');
    const { markdown, skippedImages } = await hwpxToMarkdown(file);
    expect(markdown).toContain('![](data:image/png;base64,iVBORw==)');
    expect(skippedImages).toBe(0);
  });

  it('normalises "image/jpg" and converts other formats through the callback', async () => {
    const pics = ['image1', 'image2']
      .map((id) => `<hp:run charPrIDRef="0"><hp:pic><hc:img binaryItemIDRef="${id}"/></hp:pic></hp:run>`)
      .join('');
    const file = hwpx(p(pics), {
      'BinData/image1.jpg': new Uint8Array([1]),
      'BinData/image2.bmp': new Uint8Array([2]),
    },
    '<opf:item id="image1" href="BinData/image1.jpg" media-type="image/jpg"/>' +
    '<opf:item id="image2" href="BinData/image2.bmp" media-type="image/bmp"/>');

    const { markdown } = await hwpxToMarkdown(file, {
      convertImage: async (_bytes, type) => (type === 'image/bmp' ? 'data:image/png;base64,Qk0=' : null),
    });
    expect(markdown).toContain('data:image/jpeg;base64,');
    expect(markdown).toContain('data:image/png;base64,Qk0=');
  });

  it('skips images that would exceed the size budget', async () => {
    const pic = '<hp:run charPrIDRef="0"><hp:pic><hc:img binaryItemIDRef="image1"/></hp:pic></hp:run>';
    const file = hwpx(p(pic), { 'BinData/image1.png': new Uint8Array(100) },
      '<opf:item id="image1" href="BinData/image1.png" media-type="image/png"/>');
    const { markdown, skippedImages } = await hwpxToMarkdown(file, { maxImageChars: 10 });
    expect(markdown).not.toContain('data:');
    expect(skippedImages).toBe(1);
  });

  it('rejects files that are not HWPX archives', async () => {
    await expect(hwpxToMarkdown(strToU8('# just markdown'))).rejects.toBeInstanceOf(HwpxError);
    const otherZip = zipSync({ mimetype: strToU8('application/epub+zip') });
    await expect(hwpxToMarkdown(otherZip)).rejects.toBeInstanceOf(HwpxError);
  });
});
