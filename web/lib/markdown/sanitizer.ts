import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr',
  'ul', 'ol', 'li',
  'blockquote', 'pre', 'code',
  'a', 'img',
  'strong', 'em', 'del', 's', 'u',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'div', 'span',
  'sup', 'sub',
  'input', // for checkboxes
];

const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title',
  'class', 'id',
  'target', 'rel',
  'type', 'checked', 'disabled', // for checkboxes
  'width', 'height',
];

export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') {
    // Server-side: return as-is (will be sanitized on client)
    return html;
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  });
}

export function createSafeHtml(markdown: string, parser: (md: string) => string): string {
  const html = parser(markdown);
  return sanitizeHtml(html);
}
