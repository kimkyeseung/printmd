/**
 * Capture the screenshots shown on the changelog page.
 *
 *   npm run dev                       # in another terminal
 *   node scripts/capture-changelog.mjs [--base http://localhost:3000] [--date 2026-11-23]
 *
 * Writes public/changelog/<date>/<locale>-<shot>.png for each locale, using the
 * scenes registered for that date in SCENES. Uses a
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
const DATE = args.date ?? '2026-11-23';
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

async function capture20(browser, locale) {
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

const OUTLINE_SAMPLE = {
  ko: [
    '# 2026년 4분기 서비스 운영 보고서',
    '',
    '## 요약',
    '',
    '4분기에는 신규 가입이 늘고 장애 시간이 크게 줄었습니다. 아래에 지표, 주요 작업, 다음 분기 계획을 정리합니다.',
    '',
    '## 핵심 지표',
    '',
    '### 사용자',
    '',
    '월간 활성 사용자는 지난 분기보다 18% 늘었습니다. 재방문율도 꾸준히 올라 처음으로 40%를 넘었습니다.',
    '',
    '### 안정성',
    '',
    '가용성은 99.97%로 목표를 넘겼습니다. 장애는 두 건 있었고, 모두 30분 안에 복구했습니다.',
    '',
    '### 성능',
    '',
    '첫 화면 표시 시간은 평균 1.2초로 0.4초 줄었습니다. 이미지 압축과 캐시 정책 정리가 효과를 냈습니다.',
    '',
    '## 주요 작업',
    '',
    '### 결제 개편',
    '',
    '결제 단계를 다섯 단계에서 세 단계로 줄였습니다. 결제 이탈률은 9%포인트 내려갔습니다.',
    '',
    '### 검색 개선',
    '',
    '오타가 있어도 결과가 나오도록 검색을 바꿨습니다. 검색 후 클릭 비율이 눈에 띄게 올랐습니다.',
    '',
    '## 다음 분기 계획',
    '',
    '- 모바일 앱 알림 개편',
    '- 관리자 화면 권한 세분화',
    '- 데이터 백업 주기 단축',
    '',
    '## 부록',
    '',
    '세부 수치와 측정 방법은 별도 문서에 정리했습니다.',
    '',
  ].join('\n'),
  en: [
    '# Q4 2026 Service Operations Report',
    '',
    '## Summary',
    '',
    'Sign-ups grew this quarter and downtime dropped sharply. Below are the metrics, the main work, and the plan for next quarter.',
    '',
    '## Key metrics',
    '',
    '### Users',
    '',
    'Monthly active users rose 18% over last quarter. Returning visitors kept climbing and passed 40% for the first time.',
    '',
    '### Reliability',
    '',
    'Availability reached 99.97%, beating the target. There were two incidents, both resolved within 30 minutes.',
    '',
    '### Performance',
    '',
    'Time to first render averaged 1.2 seconds, 0.4 seconds faster. Image compression and a tidier cache policy paid off.',
    '',
    '## Main work',
    '',
    '### Checkout redesign',
    '',
    'Checkout went from five steps to three. Drop-off at checkout fell by 9 percentage points.',
    '',
    '### Better search',
    '',
    'Search now finds results despite typos. Click-through after searching rose noticeably.',
    '',
    '## Next quarter',
    '',
    '- Rework mobile app notifications',
    '- Finer-grained admin permissions',
    '- More frequent data backups',
    '',
    '## Appendix',
    '',
    'Detailed figures and how they were measured are in a separate document.',
    '',
  ].join('\n'),
};

const OUTLINE_LABEL = { ko: '목차', en: 'Outline' };

async function capture23(browser, locale) {
  const context = await browser.newContext({
    viewport: { width: 1680, height: 860 },
    deviceScaleFactor: 2,
    colorScheme: 'light',
    locale: locale === 'ko' ? 'ko-KR' : 'en-US',
  });
  await context.addInitScript(() => {
    localStorage.setItem('printmd-extension-banner-dismissed', '1');
  });
  const page = await context.newPage();
  const hideAds = () => page.addStyleTag({ content: '[class*="728px"],[class*="160px"],[class*="90px"]{visibility:hidden!important} nextjs-portal{display:none!important}' });

  // 1. Preview outline: the floating card beside a report, mid-way through.
  await page.goto(`${BASE}/${locale}`, { waitUntil: 'networkidle' });
  await hideAds();
  const editor = page.locator('.cm-content');
  await editor.click();
  await page.keyboard.press('Control+A');
  await page.evaluate((text) => document.execCommand('insertText', false, text), OUTLINE_SAMPLE[locale]);
  await page.locator('#view-tab-preview').click();
  const outlineButton = page.locator('button[aria-pressed]', { hasText: OUTLINE_LABEL[locale] });
  await outlineButton.click();
  const card = page.locator(`nav[aria-label="${OUTLINE_LABEL[locale]}"]`);
  await card.waitFor();
  // Scroll so a sub-section is current, then let the highlight settle.
  await page.evaluate(() => {
    const c = document.querySelector('.preview-container');
    const h = [...document.querySelectorAll('.preview-content h3')][2];
    c.scrollTop = h.getBoundingClientRect().top - c.getBoundingClientRect().top + c.scrollTop - 16;
  });
  await page.waitForTimeout(400);
  await page.mouse.move(5, 5);
  const area = await page.locator('.preview-container').boundingBox();
  const toolbar = await outlineButton.boundingBox();
  const top = toolbar.y - 10;
  await page.screenshot({
    path: path.join(OUT, `${locale}-preview-outline.png`),
    clip: { x: area.x, y: top, width: area.width, height: Math.min(area.y + area.height, 700) - top },
  });

  // 2. Blog post: the table of contents that follows down the page.
  await page.goto(`${BASE}/${locale}/blog/markdown-basics`, { waitUntil: 'networkidle' });
  await hideAds();
  await page.evaluate(() => {
    const c = document.querySelector('.h-screen.overflow-y-auto');
    const h = [...document.querySelectorAll('article h2')][1];
    c.scrollTop = h.getBoundingClientRect().top - c.getBoundingClientRect().top + c.scrollTop - 40;
  });
  await page.waitForTimeout(400);
  const row = await page.locator('main').first().boundingBox();
  const aside = await page.locator('aside nav').first().boundingBox();
  const x = row.x - 16;
  await page.screenshot({
    path: path.join(OUT, `${locale}-blog-toc.png`),
    clip: { x, y: 0, width: aside.x + aside.width + 24 - x, height: 640 },
  });

  await context.close();
}

const SCENES = { '2026-11-20': capture20, '2026-11-23': capture23 };
const capture = SCENES[DATE];
if (!capture) throw new Error(`No scenes for ${DATE}. Add them to SCENES.`);

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
