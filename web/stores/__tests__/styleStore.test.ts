import { describe, it, expect, beforeEach } from 'vitest';
import { useStyleStore } from '../styleStore';

describe('styleStore – custom theme', () => {
  beforeEach(() => {
    useStyleStore.getState().resetToDefault();
    // clear custom themes left from previous runs
    useStyleStore.setState({ customThemes: [] });
  });

  it('saveCustomTheme stores globalStyles + elementStyles', () => {
    // arrange – tweak styles
    useStyleStore.getState().updateGlobalStyles({ fontSize: 20 });
    useStyleStore.getState().updateElementStyle('h1', { color: '#ff0000', fontSize: 32 });

    // act
    useStyleStore.getState().saveCustomTheme('My Theme');

    // assert
    const saved = useStyleStore.getState().customThemes;
    expect(saved).toHaveLength(1);
    expect(saved[0].name).toBe('My Theme');
    expect(saved[0].globalStyles.fontSize).toBe(20);
    expect(saved[0].elementStyles?.h1?.color).toBe('#ff0000');
    expect(saved[0].elementStyles?.h1?.fontSize).toBe(32);
    expect(saved[0].id).toMatch(/^custom-/);
    expect(saved[0].createdAt).toBeTruthy();
  });

  it('loadCustomTheme restores globalStyles + elementStyles', () => {
    // arrange – save a custom theme
    useStyleStore.getState().updateGlobalStyles({ fontSize: 22, textColor: '#111' });
    useStyleStore.getState().updateElementStyle('paragraph', { marginTop: 10 });
    useStyleStore.getState().saveCustomTheme('Restore Test');

    const id = useStyleStore.getState().customThemes[0].id;

    // switch to something else
    useStyleStore.getState().resetToDefault();
    expect(useStyleStore.getState().globalStyles.fontSize).toBe(16);
    expect(useStyleStore.getState().elementStyles).toEqual({});

    // act
    useStyleStore.getState().loadCustomTheme(id);

    // assert
    expect(useStyleStore.getState().globalStyles.fontSize).toBe(22);
    expect(useStyleStore.getState().globalStyles.textColor).toBe('#111');
    expect(useStyleStore.getState().elementStyles.paragraph?.marginTop).toBe(10);
  });

  it('loadCustomTheme with no elementStyles resets to empty', () => {
    // manually push a legacy theme without elementStyles
    useStyleStore.setState({
      customThemes: [
        {
          id: 'legacy-1',
          name: 'Legacy',
          globalStyles: useStyleStore.getState().globalStyles,
          createdAt: new Date().toISOString(),
        },
      ],
    });

    // set some element styles first
    useStyleStore.getState().updateElementStyle('h2', { color: '#00f' });
    expect(useStyleStore.getState().elementStyles.h2).toBeTruthy();

    // act – load legacy theme
    useStyleStore.getState().loadCustomTheme('legacy-1');

    // assert – elementStyles should be cleared
    expect(useStyleStore.getState().elementStyles).toEqual({});
  });

  it('deleteCustomTheme removes the theme', () => {
    useStyleStore.getState().saveCustomTheme('To Delete');
    const id = useStyleStore.getState().customThemes[0].id;
    expect(useStyleStore.getState().customThemes).toHaveLength(1);

    useStyleStore.getState().deleteCustomTheme(id);
    expect(useStyleStore.getState().customThemes).toHaveLength(0);
  });

  it('multiple custom themes are independent', () => {
    useStyleStore.getState().updateGlobalStyles({ fontSize: 18 });
    useStyleStore.getState().saveCustomTheme('Theme A');

    useStyleStore.getState().updateGlobalStyles({ fontSize: 24 });
    useStyleStore.getState().saveCustomTheme('Theme B');

    const themes = useStyleStore.getState().customThemes;
    expect(themes).toHaveLength(2);
    expect(themes[0].globalStyles.fontSize).toBe(18);
    expect(themes[1].globalStyles.fontSize).toBe(24);
  });

  it('loadCustomTheme with invalid id does nothing', () => {
    const before = { ...useStyleStore.getState().globalStyles };
    useStyleStore.getState().loadCustomTheme('nonexistent');
    expect(useStyleStore.getState().globalStyles).toEqual(before);
  });
});
