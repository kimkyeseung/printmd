'use client';

import { useEffect } from 'react';
import { useStyleStore } from '@/stores/styleStore';
import { decodePresetFromUrl } from '@/lib/share/presetUrl';
import { showToast } from '@/components/ui/Toast';
import { useAppStrings } from '@/lib/i18n/appStrings';

/**
 * On mount, check for ?style= URL parameter.
 * If found, decode and apply the shared preset, then clean the URL.
 */
export function useSharedPreset() {
  const updateGlobalStyles = useStyleStore((s) => s.updateGlobalStyles);
  const updateListStyles = useStyleStore((s) => s.updateListStyles);
  const updateHeadingStyles = useStyleStore((s) => s.updateHeadingStyles);
  const updateElementStyle = useStyleStore((s) => s.updateElementStyle);
  const text = useAppStrings();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const styleParam = params.get('style');

    if (!styleParam) return;

    const preset = decodePresetFromUrl(styleParam);
    if (!preset) {
      showToast(text.toast.sharedStyleFailed, 'error');
      return;
    }

    if (preset.globalStyles) {
      updateGlobalStyles(preset.globalStyles);
    }

    if (preset.listStyles && Object.keys(preset.listStyles).length > 0) {
      updateListStyles(preset.listStyles);
    }

    if (preset.headingStyles && Object.keys(preset.headingStyles).length > 0) {
      updateHeadingStyles(preset.headingStyles);
    }

    if (preset.elementStyles) {
      for (const [element, style] of Object.entries(preset.elementStyles)) {
        if (style) {
          updateElementStyle(element as Parameters<typeof updateElementStyle>[0], style);
        }
      }
    }

    showToast(text.toast.sharedStyleApplied, 'success');

    // Clean URL without reload
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, '', cleanUrl);
  }, [updateGlobalStyles, updateListStyles, updateHeadingStyles, updateElementStyle, text]);
}
