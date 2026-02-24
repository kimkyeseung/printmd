'use client';

import { ColorPicker } from './ColorPicker';
import { Slider } from './Slider';
import type { GlobalStyles } from '@/types/style';

interface GlobalStyleControlsProps {
  styles: GlobalStyles;
  onChange: (styles: Partial<GlobalStyles>) => void;
}

const FONT_OPTIONS = [
  { value: 'system-ui, -apple-system, sans-serif', label: 'System (Sans)' },
  { value: '"Noto Sans KR", system-ui, sans-serif', label: 'Noto Sans KR' },
  { value: 'Georgia, "Times New Roman", serif', label: 'Georgia (Serif)' },
  { value: '"Nanum Gothic", sans-serif', label: 'Nanum Gothic' },
  { value: '"Nanum Myeongjo", serif', label: 'Nanum Myeongjo' },
  { value: 'ui-monospace, SFMono-Regular, monospace', label: 'Monospace' },
];

export function GlobalStyleControls({ styles, onChange }: GlobalStyleControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Typography Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium border-b border-[var(--ui-border)] pb-2">Typography</h3>

        <Slider
          label="Font Size"
          value={styles.fontSize}
          onChange={(fontSize) => onChange({ fontSize })}
          min={12}
          max={24}
          unit="px"
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm text-[var(--ui-text-muted)]">Font Family</label>
          <select
            value={styles.fontFamily}
            onChange={(e) => onChange({ fontFamily: e.target.value })}
            className="rounded border border-[var(--ui-border)] bg-transparent px-2 py-1.5 text-sm"
          >
            {FONT_OPTIONS.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </div>

        <Slider
          label="Line Height"
          value={styles.lineHeight}
          onChange={(lineHeight) => onChange({ lineHeight })}
          min={1.2}
          max={2.5}
          step={0.1}
        />
      </div>

      {/* Colors Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium border-b border-[var(--ui-border)] pb-2">Colors</h3>

        <ColorPicker
          label="Text Color"
          value={styles.textColor}
          onChange={(textColor) => onChange({ textColor })}
        />

        <ColorPicker
          label="Background"
          value={styles.backgroundColor}
          onChange={(backgroundColor) => onChange({ backgroundColor })}
        />

        <ColorPicker
          label="Link Color"
          value={styles.linkColor}
          onChange={(linkColor) => onChange({ linkColor })}
        />

        <ColorPicker
          label="Code Background"
          value={styles.codeBackground}
          onChange={(codeBackground) => onChange({ codeBackground })}
        />
      </div>

      {/* Layout Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium border-b border-[var(--ui-border)] pb-2">Layout</h3>

        <Slider
          label="Max Width"
          value={styles.maxWidth}
          onChange={(maxWidth) => onChange({ maxWidth })}
          min={500}
          max={1200}
          step={50}
          unit="px"
        />

        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--ui-text-muted)]">Padding Top</label>
            <input
              type="number"
              value={styles.padding.top}
              onChange={(e) => onChange({ padding: { ...styles.padding, top: Number(e.target.value) } })}
              className="rounded border border-[var(--ui-border)] bg-transparent px-2 py-1 text-sm"
              min={0}
              max={100}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--ui-text-muted)]">Padding Bottom</label>
            <input
              type="number"
              value={styles.padding.bottom}
              onChange={(e) => onChange({ padding: { ...styles.padding, bottom: Number(e.target.value) } })}
              className="rounded border border-[var(--ui-border)] bg-transparent px-2 py-1 text-sm"
              min={0}
              max={100}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--ui-text-muted)]">Padding Left</label>
            <input
              type="number"
              value={styles.padding.left}
              onChange={(e) => onChange({ padding: { ...styles.padding, left: Number(e.target.value) } })}
              className="rounded border border-[var(--ui-border)] bg-transparent px-2 py-1 text-sm"
              min={0}
              max={100}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--ui-text-muted)]">Padding Right</label>
            <input
              type="number"
              value={styles.padding.right}
              onChange={(e) => onChange({ padding: { ...styles.padding, right: Number(e.target.value) } })}
              className="rounded border border-[var(--ui-border)] bg-transparent px-2 py-1 text-sm"
              min={0}
              max={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GlobalStyleControls;
