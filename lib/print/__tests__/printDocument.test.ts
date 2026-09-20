import { describe, it, expect } from 'vitest';
import {
  buildPrintDocument,
  getPrintGeometry,
  resolvePrintColors,
  toMonochrome,
  HEADER_FOOTER_HEIGHT_MM,
  PRINT_ROOT_CLASS,
} from '../printDocument';
import type { GlobalStyles, ElementStyles } from '@/types/style';
import type { PrintSettings } from '@/types/print';

const globalStyles: GlobalStyles = {
  fontSize: 16,
  fontFamily: 'Georgia, serif',
  textColor: '#222222',
  backgroundColor: '#fffdf5',
  lineHeight: 1.6,
  linkColor: '#0070f3',
  codeBackground: '#eeeeee',
  maxWidth: 800,
  padding: { top: 40, right: 40, bottom: 40, left: 40 },
};

const settings: PrintSettings = {
  paperSize: 'A4',
  orientation: 'portrait',
  margins: { top: 20, right: 20, bottom: 20, left: 20 },
  includeBackground: true,
  header: { enabled: true, left: '{title}', center: '', right: '{date}' },
  footer: { enabled: true, left: '', center: '{page} / {pages}', right: '' },
};

const elementStyles: ElementStyles = {
  h1: {
    color: '#111111',
    fontSize: 32,
    marginTop: 48,
    borderBottomStyle: 'solid',
    borderBottomWidth: 2,
    borderBottomColor: '#0070f3',
  },
  h2: { borderBottomStyle: 'none' },
  blockquote: { backgroundColor: '#f0f0f0', paddingLeft: 24 },
  paragraph: { color: '#333333' },
};

function build(overrides: Partial<PrintSettings> = {}) {
  const merged = { ...settings, ...overrides };
  return buildPrintDocument({
    html: '<h1>Title</h1>',
    geometry: getPrintGeometry(merged),
    colors: resolvePrintColors(globalStyles, merged.includeBackground),
    styles: globalStyles,
    elementStyles,
    includeBackground: merged.includeBackground,
  });
}

describe('getPrintGeometry', () => {
  it('derives the content box from paper size and margins', () => {
    const geometry = getPrintGeometry(settings);
    expect(geometry.paperWidthMm).toBe(210);
    expect(geometry.paperHeightMm).toBe(297);
    expect(geometry.contentWidthMm).toBe(170);
  });

  it('reserves space for an enabled header and footer', () => {
    const geometry = getPrintGeometry(settings);
    // 297 - 20 - 20 - 5 - 5
    expect(geometry.pageContentHeightMm).toBe(247);
    expect(geometry.contentTopMm).toBe(20 + HEADER_FOOTER_HEIGHT_MM);
  });

  it('reclaims that space when header and footer are disabled', () => {
    const geometry = getPrintGeometry({
      ...settings,
      header: { ...settings.header, enabled: false },
      footer: { ...settings.footer, enabled: false },
    });
    expect(geometry.pageContentHeightMm).toBe(257);
    expect(geometry.contentTopMm).toBe(20);
  });

  it('swaps dimensions for landscape', () => {
    const geometry = getPrintGeometry({ ...settings, orientation: 'landscape' });
    expect(geometry.paperWidthMm).toBe(297);
    expect(geometry.paperHeightMm).toBe(210);
  });
});

describe('resolvePrintColors', () => {
  it('uses the theme palette when the background is included', () => {
    const colors = resolvePrintColors(globalStyles, true);
    expect(colors.background).toBe('#fffdf5');
    expect(colors.text).toBe('#222222');
    expect(colors.headerFooter).toBe('#222222');
  });

  it('falls back to black on white otherwise', () => {
    const colors = resolvePrintColors(globalStyles, false);
    expect(colors.background).toBe('#ffffff');
    expect(colors.text).toBe('#1a1a1a');
  });
});

describe('toMonochrome', () => {
  it('drops colour properties', () => {
    const result = toMonochrome(elementStyles);
    expect(result.h1?.color).toBeUndefined();
    expect(result.h1?.borderBottomColor).toBeUndefined();
    expect(result.blockquote?.backgroundColor).toBeUndefined();
  });

  it('keeps layout properties', () => {
    const result = toMonochrome(elementStyles);
    expect(result.h1?.fontSize).toBe(32);
    expect(result.h1?.marginTop).toBe(48);
    expect(result.h1?.borderBottomWidth).toBe(2);
    expect(result.h1?.borderBottomStyle).toBe('solid');
    expect(result.blockquote?.paddingLeft).toBe(24);
  });

  it('does not mutate the input', () => {
    toMonochrome(elementStyles);
    expect(elementStyles.h1?.color).toBe('#111111');
  });
});

describe('buildPrintDocument', () => {
  it('wraps the content in a single measurable root', () => {
    const doc = build();
    expect(doc).toContain(`<div class="${PRINT_ROOT_CLASS}">`);
    expect(doc).toContain('<div class="preview-content"><h1>Title</h1></div>');
  });

  it('applies the theme palette and typography to the root', () => {
    const doc = build();
    expect(doc).toContain('background-color: #fffdf5;');
    expect(doc).toContain('font-family: Georgia, serif;');
    expect(doc).toContain('font-size: 16px;');
  });

  it('keeps element layout when printing without the background', () => {
    const doc = build({ includeBackground: false });
    // Layout survives, so pagination matches the colour version.
    expect(doc).toContain('font-size: 32px');
    expect(doc).toContain('margin-top: 48px');
    expect(doc).toContain('padding-left: 24px');
  });

  it('drops element colours when printing without the background', () => {
    const doc = build({ includeBackground: false });
    expect(doc).not.toContain('#111111');
    expect(doc).not.toContain('#f0f0f0');
    expect(doc).not.toContain('#333333');
  });

  it('still honours a preset that turns a base border off', () => {
    const doc = build({ includeBackground: false });
    expect(doc).toContain('.preview-content h2 { border-bottom: none }');
  });

  it('falls back to currentColor for borders left without a colour', () => {
    const doc = build({ includeBackground: false });
    expect(doc).toContain('border-bottom: 2px solid currentColor');
  });

  it('appends extra CSS after the shared rules', () => {
    const doc = buildPrintDocument({
      html: '',
      geometry: getPrintGeometry(settings),
      colors: resolvePrintColors(globalStyles, true),
      styles: globalStyles,
      elementStyles: {},
      includeBackground: true,
      extraCss: '.print-page { color: red; }',
    });
    expect(doc.indexOf('.print-page { color: red; }')).toBeGreaterThan(
      doc.indexOf('.preview-content')
    );
  });
});
