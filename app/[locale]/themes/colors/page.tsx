import type { Metadata } from 'next';
import Link from 'next/link';
import { locales, type Locale } from '@/lib/i18n/config';
import { themePresets } from '@/lib/themes/presets';
import { themeElementStyles } from '@/lib/themes/presets';
import { COLOR_ROLES } from '@/lib/themes/colorRoles';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { SiteFooter } from '@/components/layout';

function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/* ------------------------------------------------------------------ */
/*  i18n strings                                                       */
/* ------------------------------------------------------------------ */

const t = {
  en: {
    title: 'Markdown Color Customization Guide',
    subtitle:
      'Learn how printmd uses 7 Color Roles to style your Markdown PDFs. Pick a preset, tweak each role, and export a beautifully branded document.',
    metaDescription:
      'Customize Markdown PDF colors with printmd. Understand the 7 color roles - Background, Text, Heading, Bold, Link, Code BG, Divider - and create branded PDFs effortlessly.',
    breadcrumbHome: 'printmd',
    breadcrumbThemes: 'Themes',
    breadcrumbColors: 'Color Customization',
    rolesHeading: 'The 7 Color Roles',
    rolesIntro:
      'Every printmd theme is built on 7 distinct color roles. Understanding them lets you create cohesive, professional documents with minimal effort.',
    presetsHeading: 'Color Roles Across Presets',
    presetsIntro:
      'See how the same 7 roles produce dramatically different results depending on the preset theme.',
    howItWorksHeading: 'How It Works',
    steps: [
      {
        name: 'Select a preset theme',
        text: 'Open the printmd editor and choose one of the built-in preset themes as your starting point.',
      },
      {
        name: 'Customize each color role',
        text: 'Use the style panel to adjust Background, Text, Heading, Bold, Link, Code BG, and Divider colors to match your brand.',
      },
      {
        name: 'Export to PDF',
        text: 'When you are satisfied, export your Markdown as a pixel-perfect PDF with your custom color palette applied.',
      },
    ],
    faqHeading: 'Frequently Asked Questions',
    faqs: [
      {
        q: 'Can I customize colors in printmd?',
        a: 'Yes. printmd lets you adjust all 7 color roles - Background, Text, Heading, Bold, Link, Code BG, and Divider - through the style panel. Changes are reflected in real-time and applied when you export to PDF.',
      },
      {
        q: 'What are Color Roles?',
        a: 'Color Roles are the 7 semantic color slots that define a theme in printmd: Background, Text, Heading, Bold, Link, Code BG, and Divider. Each role controls a specific part of your document, making it easy to create consistent styles.',
      },
      {
        q: 'Can I save custom color palettes?',
        a: 'Currently printmd stores your customizations in the browser. You can start from any preset theme, adjust the colors, and your changes persist across sessions. Shareable palette export is on the roadmap.',
      },
    ],
    ctaText: 'Ready to create your own color palette?',
    ctaButton: 'Open the Editor',
  },
  ko: {
    title: '마크다운 색상 커스터마이징 가이드',
    subtitle:
      'printmd가 7가지 Color Role로 마크다운 PDF를 스타일링하는 방법을 알아보세요. 프리셋을 선택하고, 각 역할을 조정하고, 브랜드에 맞는 문서를 내보내세요.',
    metaDescription:
      'printmd로 마크다운 PDF 색상을 커스터마이징하세요. 배경, 텍스트, 제목, 볼드, 링크, 코드 배경, 구분선 등 7가지 Color Role을 이해하고 브랜드 PDF를 손쉽게 만드세요.',
    breadcrumbHome: 'printmd',
    breadcrumbThemes: '테마',
    breadcrumbColors: '색상 커스터마이징',
    rolesHeading: '7가지 Color Role',
    rolesIntro:
      '모든 printmd 테마는 7가지 Color Role 위에 구축됩니다. 이를 이해하면 최소한의 노력으로 일관되고 전문적인 문서를 만들 수 있습니다.',
    presetsHeading: '프리셋별 Color Role 비교',
    presetsIntro:
      '동일한 7가지 역할이 프리셋 테마에 따라 어떻게 극적으로 다른 결과를 만드는지 확인하세요.',
    howItWorksHeading: '사용 방법',
    steps: [
      {
        name: '프리셋 테마 선택',
        text: 'printmd 에디터를 열고 내장 프리셋 테마 중 하나를 시작점으로 선택하세요.',
      },
      {
        name: '각 Color Role 커스터마이징',
        text: '스타일 패널에서 배경, 텍스트, 제목, 볼드, 링크, 코드 배경, 구분선 색상을 브랜드에 맞게 조정하세요.',
      },
      {
        name: 'PDF로 내보내기',
        text: '만족스러우면 커스텀 색상 팔레트가 적용된 완벽한 PDF로 마크다운을 내보내세요.',
      },
    ],
    faqHeading: '자주 묻는 질문',
    faqs: [
      {
        q: 'printmd에서 색상을 커스터마이징할 수 있나요?',
        a: '네. printmd에서는 스타일 패널을 통해 배경, 텍스트, 제목, 볼드, 링크, 코드 배경, 구분선 등 7가지 Color Role을 모두 조정할 수 있습니다. 변경사항은 실시간으로 반영되며 PDF 내보내기 시 적용됩니다.',
      },
      {
        q: 'Color Role이란 무엇인가요?',
        a: 'Color Role은 printmd 테마를 구성하는 7가지 의미론적 색상 슬롯입니다: 배경, 텍스트, 제목, 볼드, 링크, 코드 배경, 구분선. 각 역할이 문서의 특정 부분을 제어하므로 일관된 스타일을 쉽게 만들 수 있습니다.',
      },
      {
        q: '커스텀 색상 팔레트를 저장할 수 있나요?',
        a: '현재 printmd는 브라우저에 커스터마이징 내용을 저장합니다. 프리셋 테마에서 시작하여 색상을 조정하면 세션 간에도 변경사항이 유지됩니다. 팔레트 공유 기능은 로드맵에 포함되어 있습니다.',
      },
    ],
    ctaText: '나만의 색상 팔레트를 만들어 보시겠어요?',
    ctaButton: '에디터 열기',
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Role descriptions (en / ko)                                        */
/* ------------------------------------------------------------------ */

const ROLE_DESCRIPTIONS: Record<string, { en: string; ko: string }> = {
  Background: {
    en: 'The base canvas color for your entire document. Sets the overall tone - light for readability, dark for a modern feel.',
    ko: '문서 전체의 기본 캔버스 색상입니다. 전체적인 톤을 설정합니다 - 밝은 색은 가독성을, 어두운 색은 모던한 느낌을 줍니다.',
  },
  Text: {
    en: 'The primary body text color. Ensure sufficient contrast against the background for comfortable reading.',
    ko: '기본 본문 텍스트 색상입니다. 편안한 읽기를 위해 배경과 충분한 대비를 확보하세요.',
  },
  Heading: {
    en: 'Color for H1 through H6 headings. A distinct heading color helps readers scan your document structure.',
    ko: 'H1부터 H6까지의 제목 색상입니다. 독특한 제목 색상은 독자가 문서 구조를 쉽게 파악하게 돕습니다.',
  },
  Bold: {
    en: 'Color for bold / strong text. An accent color here draws attention to important terms and phrases.',
    ko: '볼드 / 강조 텍스트의 색상입니다. 여기에 강조 색상을 사용하면 중요한 용어와 구문에 주의를 끌 수 있습니다.',
  },
  Link: {
    en: 'Color for hyperlinks and accents. A vibrant link color signals clickable elements clearly.',
    ko: '하이퍼링크 및 강조 색상입니다. 선명한 링크 색상은 클릭 가능한 요소를 명확히 나타냅니다.',
  },
  'Code BG': {
    en: 'Background color for inline code and code blocks. A subtle tint distinguishes code from surrounding text.',
    ko: '인라인 코드 및 코드 블록의 배경 색상입니다. 은은한 색조가 코드를 주변 텍스트와 구별해 줍니다.',
  },
  Divider: {
    en: 'Color for horizontal rules (---). Dividers separate sections and provide visual breathing room.',
    ko: '수평선(---)의 색상입니다. 구분선은 섹션을 나누고 시각적 여백을 제공합니다.',
  },
};

/* ------------------------------------------------------------------ */
/*  Featured presets with their resolved 7 colors                      */
/* ------------------------------------------------------------------ */

type FeaturedPreset = {
  key: string;
  name: string;
  colors: { role: string; color: string }[];
};

function buildFeaturedPresets(): FeaturedPreset[] {
  const keys = ['default', 'dark', 'ocean', 'terminal'] as const;
  const names: Record<string, string> = {
    default: 'Default',
    dark: 'Dark',
    ocean: 'Ocean',
    terminal: 'Terminal',
  };

  return keys.map((key) => {
    const gs = themePresets[key];
    const es = themeElementStyles[key] ?? {};

    const resolve = (role: (typeof COLOR_ROLES)[number]): string => {
      if (role.source === 'global' && role.styleKey) {
        return gs[role.styleKey] as string;
      }
      if (role.source === 'element' && role.elementKey && role.elementProp) {
        const el = es[role.elementKey as keyof typeof es];
        if (el && role.elementProp in el) {
          return (el as Record<string, unknown>)[role.elementProp] as string;
        }
        if (role.elementKey === 'h1') return gs.textColor;
        if (role.elementKey === 'strong') return gs.textColor;
        if (role.elementKey === 'hr') return 'rgba(0,0,0,0.20)';
      }
      return '#000000';
    };

    return {
      key,
      name: names[key],
      colors: COLOR_ROLES.map((r) => ({ role: r.role, color: resolve(r) })),
    };
  });
}

const FEATURED_PRESETS = buildFeaturedPresets();

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const s = t[locale];

  return {
    title: `${s.title} - printmd`,
    description: s.metaDescription,
    keywords: [
      'markdown color customization',
      'markdown PDF custom colors',
      'color role',
      'printmd theme colors',
      'PDF color palette',
      'markdown style guide',
    ],
    openGraph: {
      title: `${s.title} | printmd`,
      description: s.metaDescription,
      url: `https://printmd.app/${locale}/themes/colors`,
      siteName: 'printmd',
      type: 'article',
    },
    alternates: {
      canonical: `https://printmd.app/${locale}/themes/colors`,
      languages: {
        ko: 'https://printmd.app/ko/themes/colors',
        en: 'https://printmd.app/en/themes/colors',
      },
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default async function ColorsGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : 'en';
  const dict = await getDictionary(locale);
  const s = t[locale];

  /* ---- Structured Data ------------------------------------------- */

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: s.breadcrumbHome,
        item: `https://printmd.app/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: s.breadcrumbThemes,
        item: `https://printmd.app/${locale}/themes`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: s.breadcrumbColors,
        item: `https://printmd.app/${locale}/themes/colors`,
      },
    ],
  };

  const howToLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: s.howItWorksHeading,
    description: s.subtitle,
    step: s.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: s.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  const jsonLd = [breadcrumbLd, howToLd, faqLd];

  /* ---- Render ---------------------------------------------------- */

  return (
    <div className="h-screen overflow-y-auto bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
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
              {s.breadcrumbThemes}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{s.breadcrumbColors}</span>
          </nav>
          <h1 className="mt-4 text-4xl font-bold text-gray-900">{s.title}</h1>
          <p className="mt-2 text-lg text-gray-600">{s.subtitle}</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* ── Section 1: The 7 Color Roles ────────────────────────── */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900">
            {s.rolesHeading}
          </h2>
          <p className="mt-2 text-gray-600">{s.rolesIntro}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {COLOR_ROLES.map((role) => {
              const desc = ROLE_DESCRIPTIONS[role.role]?.[locale] ?? role.desc;
              const defaultColor = FEATURED_PRESETS[0].colors.find(
                (c) => c.role === role.role
              )?.color;

              return (
                <div
                  key={role.role}
                  className="flex items-start gap-4 rounded-lg border border-gray-200 p-4"
                >
                  <span
                    className="mt-0.5 h-10 w-10 flex-shrink-0 rounded-lg border border-gray-300"
                    style={{ backgroundColor: defaultColor ?? '#cccccc' }}
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{role.role}</h3>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {role.source === 'global'
                        ? `globalStyles.${role.styleKey}`
                        : `${role.elementKey}.${role.elementProp}`}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">{desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Section 2: Presets comparison ────────────────────────── */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">
            {s.presetsHeading}
          </h2>
          <p className="mt-2 text-gray-600">{s.presetsIntro}</p>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 pr-4 text-left font-semibold text-gray-900">
                    Role
                  </th>
                  {FEATURED_PRESETS.map((preset) => (
                    <th
                      key={preset.key}
                      className="px-4 py-3 text-center font-semibold text-gray-900"
                    >
                      {preset.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COLOR_ROLES.map((role) => (
                  <tr
                    key={role.role}
                    className="border-b border-gray-100"
                  >
                    <td className="py-3 pr-4 font-medium text-gray-700">
                      {role.role}
                    </td>
                    {FEATURED_PRESETS.map((preset) => {
                      const match = preset.colors.find(
                        (c) => c.role === role.role
                      );
                      const color = match?.color ?? '#cccccc';
                      return (
                        <td key={preset.key} className="px-4 py-3">
                          <div className="flex flex-col items-center gap-1">
                            <span
                              className="h-8 w-8 rounded-md border border-gray-300"
                              style={{ backgroundColor: color }}
                              aria-label={`${preset.name} ${role.role}: ${color}`}
                            />
                            <span className="font-mono text-xs text-gray-400">
                              {color}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Section 3: How It Works ─────────────────────────────── */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">
            {s.howItWorksHeading}
          </h2>

          <ol className="mt-8 space-y-6">
            {s.steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">{step.name}</h3>
                  <p className="mt-1 text-gray-600">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Section 4: FAQ ──────────────────────────────────────── */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">
            {s.faqHeading}
          </h2>

          <dl className="mt-8 divide-y divide-gray-200">
            {s.faqs.map((faq, i) => (
              <div key={i} className="py-6">
                <dt className="text-base font-semibold text-gray-900">
                  {faq.q}
                </dt>
                <dd className="mt-2 text-gray-600">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <section className="mt-16 text-center">
          <p className="text-gray-600 mb-4">{s.ctaText}</p>
          <Link
            href={`/${locale}`}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {s.ctaButton}
          </Link>
        </section>
      </main>
      <SiteFooter locale={locale} dict={dict.footer} />
    </div>
  );
}
