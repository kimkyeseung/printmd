/**
 * Search keywords for the Chinese and Japanese versions of the landing pages.
 * The English and Korean lists live next to each page's metadata.
 */
export const CJK_KEYWORDS = {
  markdownToPdf: {
    zh: [
      'markdown转pdf', 'md转pdf', 'markdown pdf转换', 'markdown转换pdf', 'markdown转pdf在线',
      'markdown转pdf免费', 'markdown导出pdf', 'md文件转pdf', 'markdown转换器', 'readme转pdf',
      'github readme pdf', 'markdown打印', 'markdown pdf主题', 'markdown pdf样式', '在线markdown转换',
      'markdown to pdf', 'md to pdf',
    ],
    ja: [
      'markdown pdf 変換', 'md pdf 変換', 'マークダウン pdf 変換', 'markdown pdf 変換 オンライン',
      'markdown pdf 無料', 'markdown pdf 書き出し', 'md ファイル pdf', 'markdown 変換ツール', 'readme pdf',
      'github readme pdf', 'markdown 印刷', 'markdown pdf テーマ', 'markdown pdf スタイル', 'markdown to pdf', 'md to pdf',
    ],
  },
  markdownPrint: {
    zh: ['打印markdown', 'markdown打印', 'md文件打印', 'markdown打印工具', '在线打印markdown', '打印readme', 'markdown打印格式', 'print markdown'],
    ja: ['markdown 印刷', 'マークダウン 印刷', 'md ファイル 印刷', 'markdown 印刷ツール', 'markdown オンライン 印刷', 'readme 印刷', 'print markdown'],
  },
  markdownEditor: {
    zh: ['markdown编辑器', '在线markdown编辑器', '免费markdown编辑器', 'md编辑器', 'markdown实时预览', 'markdown预览', '网页markdown编辑器', 'markdown写作工具', 'markdown editor'],
    ja: ['markdown エディタ', 'マークダウン エディタ', 'オンライン markdown エディタ', '無料 markdown エディタ', 'md エディタ', 'markdown リアルタイムプレビュー', 'markdown プレビュー', 'markdown editor'],
  },
  hwpViewer: {
    zh: ['hwp查看器', 'hwp文件打开', 'hwp在线查看', 'hwp转pdf', 'hwpx查看器', '韩文hwp文件', 'mac打开hwp', 'hwp viewer'],
    ja: ['hwp ビューア', 'hwp ファイル 開く', 'hwp オンライン 閲覧', 'hwp pdf 変換', 'hwpx ビューア', 'ハングル hwp ファイル', 'mac hwp 開く', 'hwp viewer'],
  },
  hwpToMarkdown: {
    zh: ['hwp转markdown', 'hwpx转markdown', '韩文文档转markdown', 'hwp转换', 'hwp转文本', 'hwp给ai', 'hwp to markdown'],
    ja: ['hwp markdown 変換', 'hwpx markdown 変換', 'ハングル文書 markdown', 'hwp 変換', 'hwp テキスト化', 'hwp ai', 'hwp to markdown'],
  },
  chatgptToPdf: {
    zh: ['chatgpt转pdf', 'chatgpt对话保存pdf', 'chatgpt回答导出pdf', 'claude转pdf', 'gemini转pdf', 'ai回答保存pdf', 'chatgpt打印', 'chatgpt to pdf'],
    ja: ['chatgpt pdf 保存', 'chatgpt 会話 pdf', 'chatgpt 回答 pdf', 'claude pdf 保存', 'gemini pdf 保存', 'ai 回答 pdf', 'chatgpt 印刷', 'chatgpt to pdf'],
  },
  presets: {
    zh: ['markdown主题', 'markdown预设', 'pdf样式', 'markdown pdf主题', 'printmd预设', '自定义pdf样式', 'markdown theme preset'],
    ja: ['markdown テーマ', 'markdown プリセット', 'pdf スタイル', 'markdown pdf テーマ', 'printmd プリセット', 'pdf スタイル カスタマイズ', 'markdown theme preset'],
  },
} satisfies Record<string, { zh: string[]; ja: string[] }>;
