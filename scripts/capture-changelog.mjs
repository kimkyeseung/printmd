/**
 * Capture the screenshots shown on the changelog page.
 *
 *   npm run dev                       # in another terminal
 *   node scripts/capture-changelog.mjs [--base http://localhost:3000] [--date 2026-11-20]
 *
 * Writes public/changelog/<date>/<locale>-<shot>.png for each locale. Uses a
 * fresh browser profile, so your own documents and styles are untouched, and
 * the system Microsoft Edge (or Chrome with --browser chrome), so no
 * Playwright browser download is needed.
 */
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]]] : acc), []),
);
const BASE = args.base ?? 'http://localhost:3000';
const DATE = args.date ?? '2026-11-20';
const CHANNEL = args.browser === 'chrome' ? 'chrome' : 'msedge';
const OUT = path.join('public', 'changelog', DATE);

const SAMPLE = {
  ko: [
    '---',
    'name: code-review-prompt',
    'description: 변경된 코드를 읽고 버그·보안·성능 문제를 우선순위대로 정리하는 메타 프롬프트',
    'tags: [prompt, review]',
    'version: 1.2',
    '---',
    '',
    '## 사용 예시',
    '',
    '```ts',
    '// 리뷰할 파일을 모아 프롬프트를 만든다',
    'export async function buildPrompt(files: string[]): Promise<string> {',
    '  const sources = await Promise.all(files.map(read));',
    '  return `다음 코드를 리뷰해 주세요:\\n${sources.join("\\n")}`;',
    '}',
    '```',
    '',
  ].join('\n'),
  en: [
    '---',
    'name: code-review-prompt',
    'description: A meta prompt that reads changed code and lists bugs, security and performance issues by priority',
    'tags: [prompt, review]',
    'version: 1.2',
    '---',
    '',
    '## Usage',
    '',
    '```ts',
    '// Collect the files to review and build the prompt',
    'export async function buildPrompt(files: string[]): Promise<string> {',
    '  const sources = await Promise.all(files.map(read));',
    '  return `Please review this code:\\n${sources.join("\\n")}`;',
    '}',
    '```',
    '',
  ].join('\n'),
};

const LABELS = {
  ko: { style: '스타일 설정', frontmatter: '문서 정보', keys: '키' },
  en: { style: 'Style settings', frontmatter: 'Front Matter', keys: 'Keys' },
};

/** Union of element boxes, padded, as a screenshot clip. */
async function clipOf(page, selectors, pad = 16) {
  const boxes = [];
  for (const s of selectors) {
    const b = await page.locator(s).first().boundingBox();
    if (b) boxes.push(b);
  }
  const x = Math.min(...boxes.map((b) => b.x)) - pad;
  const y = Math.min(...boxes.map((b) => b.y)) - pad;
  const r = Math.max(...boxes.map((b) => b.x + b.width)) + pad;
  const btm = Math.max(...boxes.map((b) => b.y + b.height)) + pad;
  return { x: Math.max(0, x), y: Math.max(0, y), width: r - Math.max(0, x), height: btm - Math.max(0, y) };
}

async function capture(browser, locale) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 820 },
    deviceScaleFactor: 2,
    colorScheme: 'light',
    locale: locale === 'ko' ? 'ko-KR' : 'en-US',
  });
  await context.addInitScript(() => {
    localStorage.setItem('printmd-extension-banner-dismissed', '1');
  });
  const page = await context.newPage();
  // Ads are placeholders in dev, and Next shows a dev badge; keep both out of the shots.
  const hideAds = () => page.addStyleTag({ content: '[class*="728px"],[class*="160px"]{visibility:hidden!important} nextjs-portal{display:none!important}' });

  await page.goto(`${BASE}/${locale}`, { waitUntil: 'networkidle' });
  await hideAds();

  // Replace the sample document with ours.
  const editor = page.locator('.cm-content');
  await editor.click();
  await page.keyboard.press('Control+A');
  await page.evaluate((text) => document.execCommand('insertText', false, text), SAMPLE[locale]);
  await page.locator('#view-tab-preview').click();
  await page.locator('.preview-content table.frontmatter').waitFor();

  const pre = page.locator('.preview-content pre').first();
  const shotArea = ['.preview-content table.frontmatter', '.preview-content pre'];

  // 1. Front matter card + highlighted code block with its hover toolbar.
  await pre.hover();
  await page.locator('.code-block-toolbar').waitFor();
  await page.screenshot({ path: path.join(OUT, `${locale}-code-and-frontmatter.png`), clip: await clipOf(page, shotArea, 24) });

  // 2. Same block in the Dracula theme, picked from the toolbar.
  await page.locator('.code-block-toolbar select').nth(1).selectOption('dracula');
  await pre.hover();
  await page.locator('.code-block-toolbar').waitFor();
  await page.screenshot({ path: path.join(OUT, `${locale}-code-theme.png`), clip: await clipOf(page, ['.preview-content pre'], 24) });
  await page.locator('.code-block-toolbar select').nth(1).selectOption('auto');

  // 3. Style panel: front matter keys and values as separate groups. A taller
  //    window so both groups fit.
  await page.setViewportSize({ width: 1280, height: 1180 });
  await page.mouse.move(5, 5);
  await page.getByRole('button', { name: LABELS[locale].style, exact: true }).click();
  const panel = page.locator('aside[aria-labelledby="style-panel-title"]:visible');
  await panel.getByRole('button', { name: LABELS[locale].frontmatter, exact: true }).click();
  // Put the 키 group at the top of the panel so 키 and 값 are both in view.
  await panel.getByRole('button', { name: LABELS[locale].keys, exact: true })
    .evaluate((el) => el.closest('.rounded-lg')?.scrollIntoView({ block: 'start' }));
  const panelBox = await page.locator('aside[aria-labelledby="style-panel-title"]:visible').boundingBox();
  // From the preview pane's left edge, so its "Preview" label isn't cut.
  const previewBox = await page.locator('.preview-container').boundingBox();
  const left = Math.max(0, previewBox.x);
  await page.screenshot({
    path: path.join(OUT, `${locale}-style-panel.png`),
    clip: { x: left, y: panelBox.y, width: panelBox.x + panelBox.width - left, height: panelBox.height },
  });

  await context.close();
}

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ channel: CHANNEL });
try {
  for (const locale of ['ko', 'en']) {
    await capture(browser, locale);
    console.log(`captured ${locale}`);
  }
} finally {
  await browser.close();
}
