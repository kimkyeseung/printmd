'use client';

import type { ThemePreset } from '@/types/style';
import { THEME_NAMES, THEME_DESCRIPTIONS } from '@/types/theme';

interface ThemeSelectorProps {
  currentTheme: ThemePreset;
  onSelect: (theme: ThemePreset) => void;
}

const themes: ThemePreset[] = ['default', 'dark', 'document', 'blog', 'minimal'];

export function ThemeSelector({ currentTheme, onSelect }: ThemeSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Theme Preset</label>
      <div className="grid grid-cols-1 gap-2">
        {themes.map((theme) => (
          <button
            key={theme}
            onClick={() => onSelect(theme)}
            className={`flex flex-col items-start rounded-lg border p-3 text-left transition-colors ${
              currentTheme === theme
                ? 'border-[var(--printmd-link-color)] bg-[var(--ui-bg-hover)]'
                : 'border-[var(--ui-border)] hover:border-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-hover)]'
            }`}
          >
            <span className="text-sm font-medium">{THEME_NAMES[theme]}</span>
            <span className="text-xs text-[var(--ui-text-muted)]">
              {THEME_DESCRIPTIONS[theme]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ThemeSelector;
