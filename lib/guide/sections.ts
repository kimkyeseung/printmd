import type { Locale } from '@/lib/i18n/config';

/** One syntax section on /[locale]/guide. `id` is the anchor and stays the same in every locale. */
export interface GuideSection {
  id: string;
  /** Label in the table of contents. */
  toc: string;
  title: string;
  description: string;
  syntax: string;
}

const CODE_SAMPLE = (inline: string, block: string) => `${inline}: \`const x = 1;\`

${block}:
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

\`\`\`python
def hello():
    print("Hello, World!")
\`\`\``;

const RULES = `---
***
___`;

export const GUIDE_SECTIONS: Record<Locale, GuideSection[]> = {
  ko: [
    {
      id: 'headings',
      toc: '제목',
      title: '제목 (Headings)',
      description: '# 기호로 제목을 만들 수 있습니다. 1~6단계까지 지원합니다.',
      syntax: `# 제목 1
## 제목 2
### 제목 3
#### 제목 4
##### 제목 5
###### 제목 6`,
    },
    {
      id: 'emphasis',
      toc: '강조',
      title: '강조 (Emphasis)',
      description: '텍스트를 굵게, 기울임, 취소선으로 표시할 수 있습니다.',
      syntax: `**굵은 텍스트** 또는 __굵은 텍스트__
*기울임 텍스트* 또는 _기울임 텍스트_
~~취소선 텍스트~~
***굵은 기울임***`,
    },
    {
      id: 'lists',
      toc: '목록',
      title: '목록 (Lists)',
      description: '순서 없는 목록과 순서 있는 목록을 만들 수 있습니다.',
      syntax: `순서 없는 목록:
- 항목 1
- 항목 2
  - 중첩 항목
  - 중첩 항목
- 항목 3

순서 있는 목록:
1. 첫 번째
2. 두 번째
3. 세 번째`,
    },
    {
      id: 'links',
      toc: '링크',
      title: '링크 (Links)',
      description: '텍스트에 링크를 추가할 수 있습니다.',
      syntax: `[링크 텍스트](https://example.com)
[제목 있는 링크](https://example.com "링크 제목")

URL 자동 링크:
https://example.com`,
    },
    {
      id: 'images',
      toc: '이미지',
      title: '이미지 (Images)',
      description: '이미지를 삽입할 수 있습니다.',
      syntax: `![대체 텍스트](이미지URL)
![대체 텍스트](이미지URL "이미지 제목")`,
    },
    {
      id: 'code',
      toc: '코드',
      title: '코드 (Code)',
      description: '인라인 코드와 코드 블록을 작성할 수 있습니다.',
      syntax: CODE_SAMPLE('인라인 코드', '코드 블록'),
    },
    {
      id: 'blockquotes',
      toc: '인용문',
      title: '인용문 (Blockquotes)',
      description: '> 기호로 인용문을 만들 수 있습니다.',
      syntax: `> 이것은 인용문입니다.
>
> 여러 줄도 가능합니다.

> 중첩 인용문
>> 더 깊은 인용문`,
    },
    {
      id: 'tables',
      toc: '테이블',
      title: '테이블 (Tables)',
      description: '파이프(|)와 하이픈(-)으로 테이블을 만들 수 있습니다.',
      syntax: `| 제목 1 | 제목 2 | 제목 3 |
|--------|--------|--------|
| 셀 1   | 셀 2   | 셀 3   |
| 셀 4   | 셀 5   | 셀 6   |

정렬:
| 왼쪽 | 가운데 | 오른쪽 |
|:-----|:------:|-------:|
| L    |   C    |      R |`,
    },
    {
      id: 'horizontal-rules',
      toc: '수평선',
      title: '수평선 (Horizontal Rules)',
      description: '세 개 이상의 하이픈, 별표, 밑줄로 수평선을 만들 수 있습니다.',
      syntax: RULES,
    },
  ],
  en: [
    {
      id: 'headings',
      toc: 'Headings',
      title: 'Headings',
      description: 'Start a line with # to make a heading. Six levels are supported.',
      syntax: `# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6`,
    },
    {
      id: 'emphasis',
      toc: 'Emphasis',
      title: 'Emphasis',
      description: 'Make text bold, italic or struck through.',
      syntax: `**bold text** or __bold text__
*italic text* or _italic text_
~~strikethrough~~
***bold and italic***`,
    },
    {
      id: 'lists',
      toc: 'Lists',
      title: 'Lists',
      description: 'Write bulleted and numbered lists.',
      syntax: `Bulleted list:
- Item 1
- Item 2
  - Nested item
  - Nested item
- Item 3

Numbered list:
1. First
2. Second
3. Third`,
    },
    {
      id: 'links',
      toc: 'Links',
      title: 'Links',
      description: 'Turn text into a link.',
      syntax: `[link text](https://example.com)
[link with a title](https://example.com "Link title")

Automatic URL links:
https://example.com`,
    },
    {
      id: 'images',
      toc: 'Images',
      title: 'Images',
      description: 'Insert an image.',
      syntax: `![alt text](image-url)
![alt text](image-url "Image title")`,
    },
    {
      id: 'code',
      toc: 'Code',
      title: 'Code',
      description: 'Write inline code and code blocks.',
      syntax: CODE_SAMPLE('Inline code', 'Code block'),
    },
    {
      id: 'blockquotes',
      toc: 'Blockquotes',
      title: 'Blockquotes',
      description: 'Start a line with > to quote it.',
      syntax: `> This is a quote.
>
> It can span several lines.

> Nested quote
>> A deeper quote`,
    },
    {
      id: 'tables',
      toc: 'Tables',
      title: 'Tables',
      description: 'Build tables with pipes (|) and hyphens (-).',
      syntax: `| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

Alignment:
| Left | Center | Right |
|:-----|:------:|------:|
| L    |   C    |     R |`,
    },
    {
      id: 'horizontal-rules',
      toc: 'Horizontal rules',
      title: 'Horizontal Rules',
      description: 'Three or more hyphens, asterisks or underscores make a horizontal rule.',
      syntax: RULES,
    },
  ],
  zh: [
    {
      id: 'headings',
      toc: '标题',
      title: '标题（Headings）',
      description: '在行首加上 # 即可创建标题，支持 1 到 6 级。',
      syntax: `# 标题 1
## 标题 2
### 标题 3
#### 标题 4
##### 标题 5
###### 标题 6`,
    },
    {
      id: 'emphasis',
      toc: '强调',
      title: '强调（Emphasis）',
      description: '可以把文字设为粗体、斜体或删除线。',
      syntax: `**粗体文字** 或 __粗体文字__
*斜体文字* 或 _斜体文字_
~~删除线文字~~
***粗斜体***`,
    },
    {
      id: 'lists',
      toc: '列表',
      title: '列表（Lists）',
      description: '可以创建无序列表和有序列表。',
      syntax: `无序列表：
- 项目 1
- 项目 2
  - 嵌套项目
  - 嵌套项目
- 项目 3

有序列表：
1. 第一项
2. 第二项
3. 第三项`,
    },
    {
      id: 'links',
      toc: '链接',
      title: '链接（Links）',
      description: '可以给文字加上链接。',
      syntax: `[链接文字](https://example.com)
[带标题的链接](https://example.com "链接标题")

自动识别网址：
https://example.com`,
    },
    {
      id: 'images',
      toc: '图片',
      title: '图片（Images）',
      description: '可以插入图片。',
      syntax: `![替代文字](图片URL)
![替代文字](图片URL "图片标题")`,
    },
    {
      id: 'code',
      toc: '代码',
      title: '代码（Code）',
      description: '可以写行内代码和代码块。',
      syntax: CODE_SAMPLE('行内代码', '代码块'),
    },
    {
      id: 'blockquotes',
      toc: '引用',
      title: '引用（Blockquotes）',
      description: '在行首加上 > 即可创建引用。',
      syntax: `> 这是一段引用。
>
> 也可以写多行。

> 嵌套引用
>> 更深一层的引用`,
    },
    {
      id: 'tables',
      toc: '表格',
      title: '表格（Tables）',
      description: '用竖线（|）和连字符（-）创建表格。',
      syntax: `| 标题 1 | 标题 2 | 标题 3 |
|--------|--------|--------|
| 单元格 1 | 单元格 2 | 单元格 3 |
| 单元格 4 | 单元格 5 | 单元格 6 |

对齐：
| 左对齐 | 居中 | 右对齐 |
|:-------|:----:|-------:|
| L      |  C   |      R |`,
    },
    {
      id: 'horizontal-rules',
      toc: '分隔线',
      title: '分隔线（Horizontal Rules）',
      description: '连续三个或以上的连字符、星号或下划线可以创建分隔线。',
      syntax: RULES,
    },
  ],
  ja: [
    {
      id: 'headings',
      toc: '見出し',
      title: '見出し（Headings）',
      description: '行頭に # を付けると見出しになります。1〜6 レベルまで使えます。',
      syntax: `# 見出し 1
## 見出し 2
### 見出し 3
#### 見出し 4
##### 見出し 5
###### 見出し 6`,
    },
    {
      id: 'emphasis',
      toc: '強調',
      title: '強調（Emphasis）',
      description: '文字を太字、斜体、取り消し線にできます。',
      syntax: `**太字のテキスト** または __太字のテキスト__
*斜体のテキスト* または _斜体のテキスト_
~~取り消し線のテキスト~~
***太字の斜体***`,
    },
    {
      id: 'lists',
      toc: 'リスト',
      title: 'リスト（Lists）',
      description: '箇条書きと番号付きリストを作れます。',
      syntax: `箇条書き：
- 項目 1
- 項目 2
  - 入れ子の項目
  - 入れ子の項目
- 項目 3

番号付きリスト：
1. 1 つ目
2. 2 つ目
3. 3 つ目`,
    },
    {
      id: 'links',
      toc: 'リンク',
      title: 'リンク（Links）',
      description: '文字にリンクを付けられます。',
      syntax: `[リンクテキスト](https://example.com)
[タイトル付きリンク](https://example.com "リンクのタイトル")

URL の自動リンク：
https://example.com`,
    },
    {
      id: 'images',
      toc: '画像',
      title: '画像（Images）',
      description: '画像を挿入できます。',
      syntax: `![代替テキスト](画像URL)
![代替テキスト](画像URL "画像のタイトル")`,
    },
    {
      id: 'code',
      toc: 'コード',
      title: 'コード（Code）',
      description: 'インラインコードとコードブロックを書けます。',
      syntax: CODE_SAMPLE('インラインコード', 'コードブロック'),
    },
    {
      id: 'blockquotes',
      toc: '引用',
      title: '引用（Blockquotes）',
      description: '行頭に > を付けると引用になります。',
      syntax: `> これは引用です。
>
> 複数行にもできます。

> 入れ子の引用
>> さらに深い引用`,
    },
    {
      id: 'tables',
      toc: '表',
      title: '表（Tables）',
      description: 'パイプ（|）とハイフン（-）で表を作れます。',
      syntax: `| 見出し 1 | 見出し 2 | 見出し 3 |
|----------|----------|----------|
| セル 1   | セル 2   | セル 3   |
| セル 4   | セル 5   | セル 6   |

揃え：
| 左揃え | 中央 | 右揃え |
|:-------|:----:|-------:|
| L      |  C   |      R |`,
    },
    {
      id: 'horizontal-rules',
      toc: '区切り線',
      title: '区切り線（Horizontal Rules）',
      description: 'ハイフン、アスタリスク、アンダースコアを 3 つ以上並べると区切り線になります。',
      syntax: RULES,
    },
  ],
};
