/**
 * Header/footer templating for printed documents.
 *
 * The header and footer slots accept `{title}`, `{date}`, `{page}` and
 * `{pages}` placeholders; the title also names the document, which is what the
 * browser offers as the filename when the user saves the print output as a PDF.
 */

/** Resolve template variables in a header/footer string. */
export function resolveTemplate(
  tpl: string,
  vars: { title: string; date: string; page: number; pages: number }
): string {
  return tpl
    .replace(/\{title\}/g, vars.title)
    .replace(/\{date\}/g, vars.date)
    .replace(/\{page\}/g, String(vars.page))
    .replace(/\{pages\}/g, String(vars.pages));
}

/** Extract the document title from the first H1 line in markdown content. */
export function extractTitle(markdown: string): string {
  return (
    markdown
      .split('\n')
      .find((l) => l.startsWith('# '))
      ?.replace(/^#\s+/, '') || 'Untitled'
  );
}

/**
 * Clean a title for display and for use as a suggested filename.
 *
 * - Strips markdown inline syntax (`**`, `__`, `` ` ``, …) left in the heading
 * - Removes characters most filesystems reject, so the browser's "Save as PDF"
 *   filename needs no further fixing
 * - Preserves CJK and other Unicode
 * - Falls back to `Untitled`, and caps length so the name stays reasonable
 */
export function cleanTitle(title: string): string {
  const cleaned = title
    // Strip common markdown inline syntax
    .replace(/[*_`~]+/g, '')
    // Remove filesystem-forbidden chars and control chars
    // eslint-disable-next-line no-control-regex
    .replace(/[\\/:*?"<>|\x00-\x1f]/g, '')
    // Collapse runs of whitespace to a single space
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80)
    .trim();

  return cleaned || 'Untitled';
}
