'use client';

import { useMemo } from 'react';
import { getContentStyles } from '@/lib/markdown/contentStyles';
import { generateElementStylesCss } from '@/lib/themes';
import { useStyleStore } from '@/stores';
import type { GlobalStyles } from '@/types/style';

interface ContentStylesProps {
  styles: GlobalStyles;
}

/**
 * Base and per-element styles for rendered markdown on screen.
 *
 * Uses the same `getContentStyles` the print pipeline writes into its iframe,
 * so the editor preview, the slide view and the exported PDF all render from
 * one stylesheet. Base rules come first so per-element overrides win, matching
 * the order in `buildPrintDocument`.
 */
export function ContentStyles({ styles }: ContentStylesProps) {
  const elementStyles = useStyleStore((state) => state.elementStyles);

  const baseCss = useMemo(
    () =>
      getContentStyles({
        linkColor: styles.linkColor,
        codeBackground: styles.codeBackground,
        textColor: styles.textColor,
      }),
    [styles.linkColor, styles.codeBackground, styles.textColor]
  );

  const elementCss = useMemo(
    () => generateElementStylesCss(elementStyles),
    [elementStyles]
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: baseCss }} />
      {elementCss ? <style dangerouslySetInnerHTML={{ __html: elementCss }} /> : null}
    </>
  );
}

export default ContentStyles;
