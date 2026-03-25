'use client';

import { useEffect } from 'react';
import { useStyleStore } from '@/stores/styleStore';
import { decodePresetFromUrl } from '@/lib/share/presetUrl';
import { showToast } from '@/components/ui/Toast';

/**
 * On mount, check for ?style= URL parameter.
 * If found, decode and apply the shared preset, then clean the URL.
 */
export function useSharedPreset() {
  const updateGlobalStyles = useStyleStore((s) => s.updateGlobalStyles);
  const updateListStyles = useStyleStore((s) => s.updateListStyles);
  const updateHeadingStyles = useStyleStore((s) => s.updateHeadingStyles);
  const updateElementStyle = useStyleStore((s) => s.updateElementStyle);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const styleParam = params.get('style');

    if (!styleParam) return;

    const preset = decodePresetFromUrl(styleParam);
    if (!preset) {
      showToast('Failed to load shared style.', 'error');
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

    showToast('Shared style applied!', 'success');

    // Clean URL without reload
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, '', cleanUrl);
  }, [updateGlobalStyles, updateListStyles, updateHeadingStyles, updateElementStyle]);
}
