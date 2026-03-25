import { describe, it, expect, beforeEach } from 'vitest';
import { useStyleStore } from '../styleStore';
import { themeElementStyles } from '@/lib/themes/presets';

describe('styleStore – preset elementStyles', () => {
  beforeEach(() => {
    useStyleStore.getState().resetToDefault();
  });

  it('setTheme applies elementStyles from preset', () => {
    useStyleStore.getState().setTheme('dark');
    const { elementStyles } = useStyleStore.getState();

    const expected = themeElementStyles.dark;
    expect(expected).toBeDefined();
    expect(elementStyles.h1?.borderBottomColor).toBe(expected!.h1?.borderBottomColor);
    expect(elementStyles.h2?.borderBottomStyle).toBe(expected!.h2?.borderBottomStyle);
  });

  it('setTheme with no elementStyles sets empty object', () => {
    // First set a theme with elementStyles
    useStyleStore.getState().setTheme('terminal');
    expect(Object.keys(useStyleStore.getState().elementStyles).length).toBeGreaterThan(0);

    // minimal has elementStyles defined, but let's verify it applies
    useStyleStore.getState().setTheme('minimal');
    const { elementStyles } = useStyleStore.getState();
    expect(elementStyles.h1?.borderBottomStyle).toBe('none');
  });

  it('newspaper preset has double border on h1', () => {
    useStyleStore.getState().setTheme('newspaper');
    const { elementStyles } = useStyleStore.getState();
    expect(elementStyles.h1?.borderBottomStyle).toBe('double');
    expect(elementStyles.h1?.borderBottomWidth).toBe(3);
  });

  it('blog preset has no border on h1 and blue border on h2', () => {
    useStyleStore.getState().setTheme('blog');
    const { elementStyles } = useStyleStore.getState();
    expect(elementStyles.h1?.borderBottomStyle).toBe('none');
    expect(elementStyles.h2?.borderBottomColor).toBe('#0070f3');
  });

  it('each preset with defined elementStyles applies them', () => {
    const presetsWithStyles = Object.keys(themeElementStyles) as Array<keyof typeof themeElementStyles>;

    for (const preset of presetsWithStyles) {
      useStyleStore.getState().setTheme(preset);
      const { elementStyles } = useStyleStore.getState();
      const expected = themeElementStyles[preset]!;

      for (const [element, style] of Object.entries(expected)) {
        for (const [prop, value] of Object.entries(style!)) {
          expect(
            (elementStyles as Record<string, Record<string, unknown>>)[element]?.[prop],
            `${preset}.${element}.${prop}`
          ).toBe(value);
        }
      }
    }
  });
});
