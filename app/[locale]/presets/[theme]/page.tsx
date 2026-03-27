import type { Metadata } from 'next';
import Link from 'next/link';
import { locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { themePresets, themeElementStyles, presetKeys } from '@/lib/themes/presets';
import { THEME_NAMES, THEME_DESCRIPTIONS } from '@/types/theme';
import type { ThemePreset } from '@/types/style';

function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

function isValidTheme(theme: string): theme is ThemePreset {
  return presetKeys.includes(theme as ThemePreset);
}

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    presetKeys.map((theme) => ({ locale, theme }))
  );
}

const THEME_KEYWORDS_EN: Record<ThemePreset, string> = {
  default: 'default markdown theme,clean markdown style,white background markdown,standard markdown pdf',
  dark: 'dark mode markdown,dark theme pdf,dark markdown editor,dark background markdown',
  document: 'document style markdown,serif font markdown,formal document pdf,professional markdown',
  blog: 'blog style markdown,blog post pdf,readable markdown theme,blog markdown format',
  minimal: 'minimal markdown theme,minimalist pdf style,clean print markdown,simple markdown style',
  sepia: 'sepia markdown theme,vintage style pdf,warm tone markdown,retro document style',
  ocean: 'ocean theme markdown,blue dark theme pdf,sea color markdown,deep blue document',
  forest: 'forest theme markdown,green nature pdf,natural color markdown,green document style',
  sunset: 'sunset theme markdown,purple warm pdf,sunset color markdown,twilight document style',
  newspaper: 'newspaper style markdown,classic print pdf,serif newspaper markdown,traditional document',
  academic: 'academic paper markdown,research paper pdf,scholarly markdown theme,thesis style document',
  notebook: 'notebook style markdown,handwritten feel pdf,note-taking markdown,casual document style',
  terminal: 'terminal theme markdown,developer console pdf,monospace markdown,hacker style document',
  elegant: 'elegant markdown theme,luxury style pdf,gold accent markdown,premium document style',
  pastel: 'pastel theme markdown,soft color pdf,lavender markdown style,gentle document theme',
};

const THEME_KEYWORDS_KO: Record<ThemePreset, string> = {
  default: '기본 마크다운 테마,깔끔한 마크다운 스타일,흰색 배경 마크다운,표준 마크다운 PDF',
  dark: '다크 모드 마크다운,어두운 테마 PDF,다크 마크다운 에디터,어두운 배경 마크다운',
  document: '문서형 마크다운,세리프 폰트 마크다운,공식 문서 PDF,전문 마크다운',
  blog: '블로그 스타일 마크다운,블로그 글 PDF,가독성 높은 마크다운,블로그 마크다운 형식',
  minimal: '미니멀 마크다운 테마,미니멀리스트 PDF,깔끔한 인쇄 마크다운,심플 마크다운',
  sepia: '세피아 마크다운 테마,빈티지 스타일 PDF,따뜻한 톤 마크다운,레트로 문서 스타일',
  ocean: '오션 테마 마크다운,블루 다크 테마 PDF,바다색 마크다운,깊은 파랑 문서',
  forest: '포레스트 테마 마크다운,초록색 자연 PDF,자연 색상 마크다운,녹색 문서 스타일',
  sunset: '선셋 테마 마크다운,보라빛 노을 PDF,선셋 색상 마크다운,황혼 문서 스타일',
  newspaper: '신문 스타일 마크다운,클래식 인쇄 PDF,세리프 신문 마크다운,전통 문서 스타일',
  academic: '학술 논문 마크다운,연구 논문 PDF,학술 마크다운 테마,논문 스타일 문서',
  notebook: '노트북 스타일 마크다운,필기 느낌 PDF,노트 마크다운,캐주얼 문서 스타일',
  terminal: '터미널 테마 마크다운,개발자 콘솔 PDF,모노스페이스 마크다운,해커 스타일 문서',
  elegant: '엘레강트 마크다운 테마,고급 스타일 PDF,골드 포인트 마크다운,프리미엄 문서 스타일',
  pastel: '파스텔 테마 마크다운,부드러운 색상 PDF,라벤더 마크다운 스타일,부드러운 문서 테마',
};

const THEME_LONG_DESC_EN: Record<ThemePreset, string> = {
  default: 'A clean, versatile theme with a white background and dark text. Perfect for general-purpose documents, README files, and everyday Markdown.',
  dark: 'A modern dark theme with light text on a dark background. Ideal for developers, late-night reading, and presentations with a sleek look.',
  document: 'A formal document style using serif fonts and generous margins. Great for official reports, letters, and professional documentation.',
  blog: 'Optimized for readability with large fonts and wide line spacing. Perfect for blog posts, articles, and long-form content.',
  minimal: 'Stripped-down styling with minimal decoration. Designed for print-first output and distraction-free reading.',
  sepia: 'A warm, vintage-inspired theme with earthy tones. Evokes the feel of aged paper and classic books.',
  ocean: 'A deep blue theme inspired by the ocean depths. Cool cyan accents create a calm, immersive reading experience.',
  forest: 'A natural green theme that is easy on the eyes. Earthy greens and soft backgrounds create a refreshing feel.',
  sunset: 'A warm purple theme inspired by twilight skies. Orange accents on deep purple create a dramatic atmosphere.',
  newspaper: 'Classic newspaper typography with serif fonts and traditional layout. Double-rule borders add authentic print character.',
  academic: 'Designed for scholarly papers and research documents. Clean serif typography with structured, formal layout.',
  notebook: 'A casual notebook style with dashed borders and relaxed spacing. Feels like handwritten notes on lined paper.',
  terminal: 'A developer-focused theme with monospace fonts and green-on-black terminal aesthetics. Code-first design.',
  elegant: 'A sophisticated theme with gold accents and serif typography. Premium feel for special documents and invitations.',
  pastel: 'A soft, gentle theme with pastel lavender and pink tones. Friendly and approachable for creative content.',
};

const THEME_LONG_DESC_KO: Record<ThemePreset, string> = {
  default: '깔끔한 흰 배경에 검정 텍스트의 범용 테마입니다. 일반 문서, README 파일, 일상적인 마크다운에 적합합니다.',
  dark: '어두운 배경에 밝은 텍스트의 모던 다크 테마입니다. 개발자, 야간 독서, 세련된 프레젠테이션에 이상적입니다.',
  document: '세리프 폰트와 넉넉한 여백의 공식 문서 스타일입니다. 공식 보고서, 서한, 전문 문서에 적합합니다.',
  blog: '큰 글꼴과 넓은 행간으로 가독성을 최적화한 테마입니다. 블로그 글, 기사, 장문 콘텐츠에 적합합니다.',
  minimal: '최소한의 장식으로 인쇄 최적화된 스타일입니다. 방해 없는 깔끔한 읽기 경험을 제공합니다.',
  sepia: '따뜻한 톤의 빈티지 감성 테마입니다. 오래된 종이와 고전 도서의 느낌을 재현합니다.',
  ocean: '깊은 바다에서 영감 받은 블루 테마입니다. 시원한 시안 포인트로 차분한 독서 경험을 제공합니다.',
  forest: '눈이 편안한 자연 초록 테마입니다. 부드러운 녹색 톤으로 상쾌한 느낌을 줍니다.',
  sunset: '황혼의 하늘에서 영감 받은 보라빛 테마입니다. 깊은 보라 위 오렌지 포인트가 드라마틱한 분위기를 연출합니다.',
  newspaper: '세리프 활자와 전통 레이아웃의 클래식 신문 스타일입니다. 이중 테두리가 정통 인쇄 느낌을 더합니다.',
  academic: '학술 논문과 연구 문서에 최적화된 테마입니다. 깔끔한 세리프 타이포그래피와 정돈된 레이아웃을 제공합니다.',
  notebook: '점선 테두리와 여유로운 간격의 캐주얼 노트 스타일입니다. 줄 노트에 필기한 듯한 느낌을 줍니다.',
  terminal: '모노스페이스 폰트와 초록색 터미널 미학의 개발자 테마입니다. 코드 중심 디자인입니다.',
  elegant: '골드 포인트와 세리프 타이포그래피의 고급 테마입니다. 특별한 문서와 초대장에 어울리는 프리미엄 느낌입니다.',
  pastel: '파스텔 라벤더와 핑크 톤의 부드러운 테마입니다. 창의적인 콘텐츠에 친근하고 따뜻한 인상을 줍니다.',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; theme: string }>;
}): Promise<Metadata> {
  const { locale, theme } = await params;
  if (!isValidLocale(locale) || !isValidTheme(theme)) return {};

  const dict = await getDictionary(locale);
  const themeName = THEME_NAMES[theme];
  const themeDesc = locale === 'ko' ? THEME_LONG_DESC_KO[theme] : THEME_LONG_DESC_EN[theme];
  const keywords = locale === 'ko' ? THEME_KEYWORDS_KO[theme] : THEME_KEYWORDS_EN[theme];

  const title = locale === 'ko'
    ? `${themeName} 테마 - printmd 마크다운 PDF 테마`
    : `${themeName} Theme - printmd Markdown PDF Theme`;

  const description = locale === 'ko'
    ? `printmd ${themeName} 테마로 마크다운을 PDF로 변환하세요. ${themeDesc}`
    : `Convert Markdown to PDF with the printmd ${themeName} theme. ${themeDesc}`;

  return {
    title: `${title} | printmd`,
    description,
    keywords: `${keywords},printmd,markdown to pdf,markdown theme,${dict.meta.keywords?.split(',').slice(0, 5).join(',') ?? ''}`,
    openGraph: {
      title,
      description,
      url: `https://printmd.app/${locale}/presets/${theme}`,
      siteName: 'printmd',
      type: 'website',
    },
    alternates: {
      canonical: `https://printmd.app/${locale}/presets/${theme}`,
      languages: {
        ko: `https://printmd.app/ko/presets/${theme}`,
        en: `https://printmd.app/en/presets/${theme}`,
      },
    },
  };
}

function ColorSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="inline-block h-8 w-8 rounded-lg border border-gray-300 shadow-sm"
        style={{ backgroundColor: color }}
      />
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs font-mono text-gray-500">{color}</p>
      </div>
    </div>
  );
}

function ThemePreview({ theme }: { theme: ThemePreset }) {
  const styles = themePresets[theme];
  const elementStyles = themeElementStyles[theme];
  const h1Color = elementStyles?.h1?.color ?? styles.textColor;
  const strongColor = elementStyles?.strong?.color ?? styles.textColor;
  const h1BorderBottom = elementStyles?.h1?.borderBottomStyle !== 'none'
    ? `${elementStyles?.h1?.borderBottomWidth ?? 0}px ${elementStyles?.h1?.borderBottomStyle ?? 'none'} ${elementStyles?.h1?.borderBottomColor ?? 'transparent'}`
    : 'none';
  const hrColor = elementStyles?.hr?.backgroundColor ?? 'rgba(0,0,0,0.15)';

  return (
    <div
      className="rounded-xl border border-gray-200 shadow-lg overflow-hidden"
      style={{
        backgroundColor: styles.backgroundColor,
        color: styles.textColor,
        fontFamily: styles.fontFamily,
        fontSize: `${Math.min(styles.fontSize, 16)}px`,
        lineHeight: styles.lineHeight,
      }}
    >
      <div className="p-8 sm:p-10">
        <h2
          style={{
            fontSize: '1.75em',
            fontWeight: 700,
            marginBottom: 12,
            color: h1Color,
            paddingBottom: h1BorderBottom !== 'none' ? 8 : 0,
            borderBottom: h1BorderBottom,
          }}
        >
          Sample Document
        </h2>
        <p style={{ marginBottom: 16 }}>
          This is a preview of the <strong style={{ color: strongColor }}>{THEME_NAMES[theme]}</strong> theme.
          It demonstrates how your Markdown will look when converted to PDF with this preset applied.
        </p>
        <h3
          style={{
            fontSize: '1.25em',
            fontWeight: 600,
            marginBottom: 8,
            color: elementStyles?.h2?.color ?? styles.textColor,
          }}
        >
          Features
        </h3>
        <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
          <li style={{ marginBottom: 4 }}>Live preview with <strong style={{ color: strongColor }}>real-time</strong> updates</li>
          <li style={{ marginBottom: 4 }}>Custom font and color settings</li>
          <li style={{ marginBottom: 4 }}>One-click PDF export</li>
        </ul>
        <div
          style={{
            height: 2,
            backgroundColor: hrColor,
            marginTop: 16,
            marginBottom: 16,
            border: 'none',
          }}
        />
        <p style={{ marginBottom: 12 }}>
          Code blocks render with syntax highlighting:
        </p>
        <pre
          style={{
            backgroundColor: styles.codeBackground,
            padding: '12px 16px',
            borderRadius: elementStyles?.code?.borderRadius ?? 6,
            fontSize: '0.875em',
            overflow: 'auto',
            borderWidth: elementStyles?.code?.borderWidth,
            borderColor: elementStyles?.code?.borderColor,
            borderStyle: elementStyles?.code?.borderStyle,
          }}
        >
          <code>{`function greet(name) {\n  return \`Hello, \${name}!\`;\n}`}</code>
        </pre>
        <p style={{ marginTop: 16 }}>
          Links appear as:{' '}
          <span style={{ color: styles.linkColor, textDecoration: 'underline' }}>
            printmd.app
          </span>
        </p>
      </div>
    </div>
  );
}

function ColorPalette({ theme, locale }: { theme: ThemePreset; locale: Locale }) {
  const styles = themePresets[theme];
  const elementStyles = themeElementStyles[theme];

  const isKo = locale === 'ko';

  const globalColors: { color: string; label: string }[] = [
    { color: styles.backgroundColor, label: isKo ? '배경색' : 'Background' },
    { color: styles.textColor, label: isKo ? '텍스트 색상' : 'Text Color' },
    { color: styles.linkColor, label: isKo ? '링크 색상' : 'Link Color' },
    { color: styles.codeBackground, label: isKo ? '코드 배경' : 'Code Background' },
  ];

  const elementColors: { color: string; label: string }[] = [];

  if (elementStyles?.h1?.color) {
    elementColors.push({ color: elementStyles.h1.color, label: isKo ? 'H1 색상' : 'H1 Color' });
  }
  if (elementStyles?.h1?.borderBottomColor && elementStyles.h1.borderBottomStyle !== 'none') {
    elementColors.push({ color: elementStyles.h1.borderBottomColor, label: isKo ? 'H1 하단 테두리' : 'H1 Border' });
  }
  if (elementStyles?.strong?.color) {
    elementColors.push({ color: elementStyles.strong.color, label: isKo ? '강조 색상' : 'Strong Color' });
  }
  if (elementStyles?.hr?.backgroundColor) {
    elementColors.push({ color: elementStyles.hr.backgroundColor, label: isKo ? '구분선 색상' : 'HR Color' });
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        {isKo ? '색상 팔레트' : 'Color Palette'}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {globalColors.map(({ color, label }) => (
          <ColorSwatch key={label} color={color} label={label} />
        ))}
      </div>
      {elementColors.length > 0 && (
        <>
          <h4 className="text-sm font-medium text-gray-500 mb-4 mt-6">
            {isKo ? '요소별 색상' : 'Element Colors'}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {elementColors.map(({ color, label }) => (
              <ColorSwatch key={label} color={color} label={label} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ThemeDetails({ theme, locale }: { theme: ThemePreset; locale: Locale }) {
  const styles = themePresets[theme];
  const isKo = locale === 'ko';

  const details = [
    { label: isKo ? '폰트' : 'Font', value: styles.fontFamily.split(',')[0].replace(/"/g, '') },
    { label: isKo ? '글자 크기' : 'Font Size', value: `${styles.fontSize}px` },
    { label: isKo ? '행간' : 'Line Height', value: `${styles.lineHeight}` },
    { label: isKo ? '최대 너비' : 'Max Width', value: `${styles.maxWidth}px` },
    { label: isKo ? '여백' : 'Padding', value: `${styles.padding.top}px` },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {isKo ? '테마 상세' : 'Theme Details'}
      </h3>
      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {details.map(({ label, value }) => (
          <div key={label}>
            <dt className="text-sm text-gray-500">{label}</dt>
            <dd className="text-sm font-medium text-gray-900 mt-0.5">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default async function ThemePage({
  params,
}: {
  params: Promise<{ locale: string; theme: string }>;
}) {
  const { locale: localeParam, theme: themeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : 'en';
  const theme = isValidTheme(themeParam) ? themeParam : 'default';
  const dict = await getDictionary(locale);
  const t = dict.presets;

  const isKo = locale === 'ko';
  const themeName = THEME_NAMES[theme];
  const themeDesc = THEME_DESCRIPTIONS[theme];
  const longDesc = isKo ? THEME_LONG_DESC_KO[theme] : THEME_LONG_DESC_EN[theme];

  const themeIndex = presetKeys.indexOf(theme);
  const prevTheme = themeIndex > 0 ? presetKeys[themeIndex - 1] : null;
  const nextTheme = themeIndex < presetKeys.length - 1 ? presetKeys[themeIndex + 1] : null;

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `printmd ${themeName} Theme`,
    description: longDesc,
    url: `https://printmd.app/${locale}/presets/${theme}`,
    brand: {
      '@type': 'Brand',
      name: 'printmd',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    category: 'Markdown PDF Theme',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'printmd',
        item: `https://printmd.app/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t.title,
        item: `https://printmd.app/${locale}/presets`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: themeName,
        item: `https://printmd.app/${locale}/presets/${theme}`,
      },
    ],
  };

  return (
    <div className="h-screen overflow-y-auto bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([productJsonLd, breadcrumbJsonLd]) }}
      />

      <header className="border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link
              href={`/${locale}`}
              className="text-blue-600 hover:text-blue-700"
            >
              printmd
            </Link>
            <span>/</span>
            <Link
              href={`/${locale}/presets`}
              className="text-blue-600 hover:text-blue-700"
            >
              {t.title}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{themeName}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {themeName}
          </h1>
          <p className="mt-2 text-gray-600">{themeDesc}</p>
          <p className="mt-1 text-sm text-gray-500">{longDesc}</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Theme Preview */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {isKo ? '미리보기' : 'Preview'}
          </h2>
          <ThemePreview theme={theme} />
        </section>

        {/* Color Palette */}
        <section className="mb-12">
          <ColorPalette theme={theme} locale={locale} />
        </section>

        {/* Theme Details */}
        <section className="mb-12">
          <ThemeDetails theme={theme} locale={locale} />
        </section>

        {/* CTA */}
        <section className="mb-12 rounded-xl bg-gray-50 border border-gray-200 p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isKo
              ? `${themeName} 테마로 마크다운을 변환해보세요`
              : `Try the ${themeName} theme on your Markdown`}
          </h2>
          <p className="text-gray-600 mb-6">
            {isKo
              ? '무료로 사용할 수 있습니다. 가입이 필요 없습니다.'
              : 'Free to use. No signup required.'}
          </p>
          <Link
            href={`/${locale}`}
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {t.ctaButton}
          </Link>
        </section>

        {/* Navigation between themes */}
        <nav className="flex items-center justify-between border-t border-gray-200 pt-8">
          {prevTheme ? (
            <Link
              href={`/${locale}/presets/${prevTheme}`}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {isKo ? '← 이전' : '← Previous'}: {THEME_NAMES[prevTheme]}
            </Link>
          ) : (
            <span />
          )}
          {nextTheme ? (
            <Link
              href={`/${locale}/presets/${nextTheme}`}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {THEME_NAMES[nextTheme]} :{isKo ? ' 다음 →' : ' Next →'}
            </Link>
          ) : (
            <span />
          )}
        </nav>

        {/* All themes link */}
        <div className="mt-8 text-center">
          <Link
            href={`/${locale}/presets`}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {isKo ? '← 모든 테마 보기' : '← View all themes'}
          </Link>
        </div>
      </main>
    </div>
  );
}
