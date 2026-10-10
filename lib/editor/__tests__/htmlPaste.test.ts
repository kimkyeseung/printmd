import { describe, it, expect } from 'vitest';
import { htmlToMarkdown, shouldConvertHtml } from '../htmlPaste';

describe('shouldConvertHtml', () => {
  it('converts HTML that carries structure', () => {
    expect(shouldConvertHtml('<h2>제목</h2><ul><li>항목</li></ul>', '제목\n항목')).toBe(true);
  });

  it('keeps plain text when there is no HTML', () => {
    expect(shouldConvertHtml('', '# 제목')).toBe(false);
  });

  it('keeps plain text for styled-only HTML such as code editor pastes', () => {
    const vscode = '<div style="color: #d4d4d4;"><div><span style="color: #569cd6;">const</span> x = 1;</div></div>';
    expect(shouldConvertHtml(vscode, 'const x = 1;')).toBe(false);
  });

  it('keeps plain text that is already Markdown source', () => {
    expect(shouldConvertHtml('<p><strong>a</strong></p>', '# 제목\n\n**a**')).toBe(false);
    expect(shouldConvertHtml('<pre><code>x</code></pre>', '```js\nx\n```')).toBe(false);
    expect(shouldConvertHtml('<table><tr><td>a</td></tr></table>', '| a |\n| --- |')).toBe(false);
  });

  it('still converts when prose merely starts lines with numbers or dashes', () => {
    expect(shouldConvertHtml('<ol><li>첫째</li></ol>', '1. 첫째')).toBe(true);
  });
});

describe('htmlToMarkdown', () => {
  it('keeps headings, emphasis, lists and links', () => {
    const md = htmlToMarkdown(
      '<h2>요약</h2><p><strong>굵게</strong>와 <em>기울임</em>, <a href="https://printmd.app">링크</a></p>' +
      '<ul><li>하나</li><li>둘</li></ul><ol><li>첫째</li><li>둘째</li></ol>'
    );
    expect(md).toContain('## 요약');
    expect(md).toContain('**굵게**와 *기울임*, [링크](https://printmd.app)');
    expect(md).toContain('- 하나\n- 둘');
    expect(md).toContain('1. 첫째\n2. 둘째');
  });

  it('indents nested lists under their parent item', () => {
    const md = htmlToMarkdown('<ul><li>부모<ul><li>자식</li></ul></li><li>다음</li></ul>');
    expect(md).toBe('- 부모\n  - 자식\n- 다음');
  });

  it('turns ChatGPT-style code blocks with headers and copy buttons into fences', () => {
    const md = htmlToMarkdown(
      '<pre><div><div class="flex">python</div><button>Copy code</button></div>' +
      '<div><code class="language-python">print("hi")\nx = 1\n</code></div></pre>'
    );
    expect(md).toBe('```python\nprint("hi")\nx = 1\n```');
  });

  it('uses a longer fence when the code itself contains backticks', () => {
    const md = htmlToMarkdown('<pre><code>a ``` b</code></pre>');
    expect(md).toBe('````\na ``` b\n````');
  });

  it('converts tables with a header row', () => {
    const md = htmlToMarkdown(
      '<table><thead><tr><th>이름</th><th>값</th></tr></thead><tbody><tr><td>a</td><td>1</td></tr></tbody></table>'
    );
    expect(md).toContain('| 이름 | 값 |');
    expect(md).toContain('| a | 1 |');
  });

  it('restores LaTeX from KaTeX output', () => {
    const katex = (tex: string) =>
      `<span class="katex"><span class="katex-mathml"><math><semantics><mrow></mrow>` +
      `<annotation encoding="application/x-tex">${tex}</annotation></semantics></math></span>` +
      `<span class="katex-html" aria-hidden="true">rendered</span></span>`;
    const md = htmlToMarkdown(
      `<p>넓이는 ${katex('\\pi r^2')} 입니다.</p><span class="katex-display">${katex('E = mc^2')}</span>`
    );
    expect(md).toContain('넓이는 $\\pi r^2$ 입니다.');
    expect(md).toContain('$$\nE = mc^2\n$$');
    expect(md).not.toContain('rendered');
  });

  it('drops buttons and icons', () => {
    const md = htmlToMarkdown('<p>본문<button>복사</button><svg><path d="M0"/></svg></p>');
    expect(md).toBe('본문');
  });
});
