import { useMemo } from 'react';
import { parseMarkdown } from '@/lib/markdown/parser';
import { sanitizeHtml } from '@/lib/markdown/sanitizer';

export function usePreview(markdown: string) {
  const html = useMemo(() => {
    if (!markdown) return '';
    const parsed = parseMarkdown(markdown);
    return sanitizeHtml(parsed);
  }, [markdown]);

  return { html };
}
