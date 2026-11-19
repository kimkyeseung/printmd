import type { GlobalStyles, ListStyles, HeadingStyles, ElementStyles, ElementStyle, EditableElement } from '@/types/style';
import { sanitizeCssValue, escapeCssString, sanitizeCssColor, sanitizeFontFamily } from '@/lib/sanitize/cssValue';

export function generateCssVariables(styles: GlobalStyles): Record<string, string> {
  return {
    '--printmd-font-size': `${styles.fontSize}px`,
    '--printmd-font-family': sanitizeFontFamily(styles.fontFamily),
    '--printmd-text-color': sanitizeCssColor(styles.textColor) || styles.textColor,
    '--printmd-bg-color': sanitizeCssColor(styles.backgroundColor) || styles.backgroundColor,
    '--printmd-line-height': String(styles.lineHeight),
    '--printmd-link-color': sanitizeCssColor(styles.linkColor) || styles.linkColor,
    '--printmd-code-bg': sanitizeCssColor(styles.codeBackground) || styles.codeBackground,
    '--printmd-max-width': `${styles.maxWidth}px`,
    '--printmd-padding-top': `${styles.padding.top}px`,
    '--printmd-padding-right': `${styles.padding.right}px`,
    '--printmd-padding-bottom': `${styles.padding.bottom}px`,
    '--printmd-padding-left': `${styles.padding.left}px`,
  };
}

export function generateListStylesCss(styles: ListStyles): string {
  const rules: string[] = [];

  if (styles.firstChild) {
    const { color, backgroundColor, fontWeight } = styles.firstChild;
    const props = [
      color && `color: ${sanitizeCssValue(color)}`,
      backgroundColor && `background-color: ${sanitizeCssValue(backgroundColor)}`,
      fontWeight && `font-weight: ${sanitizeCssValue(fontWeight)}`,
    ].filter(Boolean).join('; ');
    if (props) rules.push(`.preview-content li:first-child { ${props} }`);
  }

  if (styles.lastChild) {
    const { color, backgroundColor, fontWeight } = styles.lastChild;
    const props = [
      color && `color: ${sanitizeCssValue(color)}`,
      backgroundColor && `background-color: ${sanitizeCssValue(backgroundColor)}`,
      fontWeight && `font-weight: ${sanitizeCssValue(fontWeight)}`,
    ].filter(Boolean).join('; ');
    if (props) rules.push(`.preview-content li:last-child { ${props} }`);
  }

  if (styles.oddChild) {
    const { color, backgroundColor, fontWeight } = styles.oddChild;
    const props = [
      color && `color: ${sanitizeCssValue(color)}`,
      backgroundColor && `background-color: ${sanitizeCssValue(backgroundColor)}`,
      fontWeight && `font-weight: ${sanitizeCssValue(fontWeight)}`,
    ].filter(Boolean).join('; ');
    if (props) rules.push(`.preview-content li:nth-child(odd) { ${props} }`);
  }

  if (styles.evenChild) {
    const { color, backgroundColor, fontWeight } = styles.evenChild;
    const props = [
      color && `color: ${sanitizeCssValue(color)}`,
      backgroundColor && `background-color: ${sanitizeCssValue(backgroundColor)}`,
      fontWeight && `font-weight: ${sanitizeCssValue(fontWeight)}`,
    ].filter(Boolean).join('; ');
    if (props) rules.push(`.preview-content li:nth-child(even) { ${props} }`);
  }

  if (styles.prefix) {
    rules.push(`.preview-content li::before { content: "${escapeCssString(styles.prefix)} "; }`);
  }

  if (styles.suffix) {
    rules.push(`.preview-content li::after { content: " ${escapeCssString(styles.suffix)}"; }`);
  }

  return rules.join('\n');
}

export function generateHeadingStylesCss(styles: HeadingStyles): string {
  const rules: string[] = [];

  const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

  headings.forEach((h) => {
    const style = styles[h];
    if (!style) return;

    const props = [
      style.fontSize && `font-size: ${style.fontSize}px`,
      style.fontWeight && `font-weight: ${sanitizeCssValue(style.fontWeight)}`,
      style.color && `color: ${sanitizeCssValue(style.color)}`,
      style.marginTop !== undefined && `margin-top: ${style.marginTop}px`,
      style.marginBottom !== undefined && `margin-bottom: ${style.marginBottom}px`,
    ].filter(Boolean).join('; ');

    if (props) rules.push(`.preview-content ${h} { ${props} }`);
  });

  return rules.join('\n');
}

export const ELEMENT_SELECTORS: Record<EditableElement, string> = {
  page: '.preview-content',
  h1: '.preview-content h1',
  h2: '.preview-content h2',
  h3: '.preview-content h3',
  h4: '.preview-content h4',
  h5: '.preview-content h5',
  h6: '.preview-content h6',
  paragraph: '.preview-content p',
  bulletList: '.preview-content ul',
  orderedList: '.preview-content ol',
  todoList: '.preview-content .task-list',
  todoChecked: '.preview-content .task-list-item-checked',
  blockquote: '.preview-content blockquote',
  hr: '.preview-content hr',
  image: '.preview-content img',
  code: '.preview-content pre, .preview-content pre code',
  inlineCode: '.preview-content :not(pre) > code',
  // Same specificity as the base frontmatter rules in contentStyles; element
  // CSS is emitted after them, so these win.
  frontmatter: '.preview-content table.frontmatter',
  frontmatterKey: '.preview-content table.frontmatter th',
  table: '.preview-content table',
  tableHeader: '.preview-content table th',
  tableCell: '.preview-content table td',
  tableEvenRow: '.preview-content table tr:nth-child(even)',
  strong: '.preview-content strong',
};

/**
 * Narrower selectors for elements whose editor entry covers several DOM nodes.
 * A fenced block is `<pre><code>…</code></pre>` and that inner `<code>` is
 * inline: box properties on it are drawn once per wrapped line. So for `code`
 * (the block) margin, padding, background and border go on `<pre>` only, while
 * text properties keep the full selector so the inner `<code>` still gets
 * them (its base rule sets its own font and line-height).
 */
export const ELEMENT_BOX_SELECTORS: Partial<Record<EditableElement, { box: string; surface: string }>> = {
  code: {
    box: '.preview-content pre',
    surface: '.preview-content pre',
  },
};

export function generateElementStylesCss(styles: ElementStyles): string {
  const rules: string[] = [];

  (Object.entries(styles) as [EditableElement, ElementStyle | undefined][]).forEach(([element, style]) => {
    if (!style) return;
    const selector = ELEMENT_SELECTORS[element];
    if (!selector) return;

    // Build border-bottom as shorthand to avoid rendering artifacts from individual properties
    const hasBorderBottom = style.borderBottomStyle && style.borderBottomStyle !== 'none';
    const borderBottomShorthand = hasBorderBottom
      ? `border-bottom: ${style.borderBottomWidth ?? 1}px ${sanitizeCssValue(style.borderBottomStyle!)} ${style.borderBottomColor ? sanitizeCssValue(style.borderBottomColor) : 'currentColor'}`
      : style.borderBottomStyle === 'none' ? 'border-bottom: none' : undefined;

    const textProps = [
      style.color && `color: ${sanitizeCssValue(style.color)}`,
      style.fontFamily && `font-family: ${sanitizeFontFamily(style.fontFamily)}`,
      style.fontSize && `font-size: ${style.fontSize}px`,
      style.fontWeight && `font-weight: ${sanitizeCssValue(style.fontWeight)}`,
      style.textIndent !== undefined && `text-indent: ${style.textIndent}px`,
      style.imageWidth && `width: ${style.imageWidth}`,
      style.lineHeight !== undefined && `line-height: ${style.lineHeight}`,
    ];
    const boxProps = [
      style.marginTop !== undefined && `margin-top: ${style.marginTop}px`,
      style.marginBottom !== undefined && `margin-bottom: ${style.marginBottom}px`,
      style.paddingTop !== undefined && `padding-top: ${style.paddingTop}px`,
      style.paddingRight !== undefined && `padding-right: ${style.paddingRight}px`,
      style.paddingBottom !== undefined ? `padding-bottom: ${style.paddingBottom}px`
        : hasBorderBottom ? 'padding-bottom: 0.3em' : undefined,
      style.paddingLeft !== undefined && `padding-left: ${style.paddingLeft}px`,
    ];
    const surfaceProps = [
      style.backgroundColor && `background-color: ${sanitizeCssValue(style.backgroundColor)}`,
      borderBottomShorthand,
      style.borderWidth !== undefined && `border-width: ${style.borderWidth}px`,
      style.borderColor && `border-color: ${sanitizeCssValue(style.borderColor)}`,
      style.borderStyle && `border-style: ${sanitizeCssValue(style.borderStyle)}`,
      style.borderRadius !== undefined && `border-radius: ${style.borderRadius}px`,
    ];

    const join = (list: unknown[]) => list.filter(Boolean).join('; ');
    const split = ELEMENT_BOX_SELECTORS[element];
    if (split) {
      const text = join(textProps);
      const surface = join(surfaceProps);
      const box = join(boxProps);
      if (text) rules.push(`${selector} { ${text} }`);
      if (surface) rules.push(`${split.surface} { ${surface} }`);
      if (box) rules.push(`${split.box} { ${box} }`);
      return;
    }

    const props = join([...textProps, ...boxProps, ...surfaceProps]);
    if (props) rules.push(`${selector} { ${props} }`);
  });

  return rules.join('\n');
}
