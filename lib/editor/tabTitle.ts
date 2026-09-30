import type { Tab } from '@/types/editor';
import { cleanTitle, extractTitle } from '@/lib/print/headerFooter';

/** Title a tab gets when nothing names it; see tabsStore's createTab. */
export const DEFAULT_TAB_TITLE = 'Untitled';

/**
 * The name to show for a tab.
 *
 * A tab opened from a file or a saved document keeps that name. A new draft
 * still carrying the placeholder title is named after its first H1, the same
 * heading the print header uses for {title}. Returns null when there is no
 * name at all, so the caller can show a localized placeholder.
 */
export function tabDisplayTitle(tab: Pick<Tab, 'title' | 'content' | 'documentId'>): string | null {
  if (tab.documentId !== null || tab.title !== DEFAULT_TAB_TITLE) return tab.title;
  const heading = extractTitle(tab.content, '');
  return heading ? cleanTitle(heading) : null;
}
