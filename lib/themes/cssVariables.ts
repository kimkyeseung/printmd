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
  code: '.preview-content pre, .preview-content code',
  table: '.preview-content table',
};

export function generateElementStylesCss(styles: ElementStyles): string {
  const rules: string[] = [];

  (Object.entries(styles) as [EditableElement, ElementStyle | undefined][]).forEach(([element, style]) => {
    if (!style) return;
    const selector = ELEMENT_SELECTORS[element];
    if (!selector) return;

    const props = [
      style.color && `color: ${sanitizeCssValue(style.color)}`,
      style.fontFamily && `font-family: ${sanitizeFontFamily(style.fontFamily)}`,
      style.fontSize && `font-size: ${style.fontSize}px`,
      style.fontWeight && `font-weight: ${sanitizeCssValue(style.fontWeight)}`,
      style.backgroundColor && `background-color: ${sanitizeCssValue(style.backgroundColor)}`,
      style.marginTop !== undefined && `margin-top: ${style.marginTop}px`,
      style.marginBottom !== undefined && `margin-bottom: ${style.marginBottom}px`,
      style.paddingTop !== undefined && `padding-top: ${style.paddingTop}px`,
      style.paddingRight !== undefined && `padding-right: ${style.paddingRight}px`,
      style.paddingBottom !== undefined && `padding-bottom: ${style.paddingBottom}px`,
      style.paddingLeft !== undefined && `padding-left: ${style.paddingLeft}px`,
      style.textIndent !== undefined && `text-indent: ${style.textIndent}px`,
      style.borderBottomWidth !== undefined && `border-bottom-width: ${style.borderBottomWidth}px`,
      style.borderBottomColor && `border-bottom-color: ${sanitizeCssValue(style.borderBottomColor)}`,
      style.borderBottomStyle && `border-bottom-style: ${sanitizeCssValue(style.borderBottomStyle)}`,
    ].filter(Boolean).join('; ');

    if (props) rules.push(`${selector} { ${props} }`);
  });

  return rules.join('\n');
}
