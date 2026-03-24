'use client';

import type { PrintSettings as PrintSettingsType, PaperSize, Orientation } from '@/types/print';

interface PrintSettingsProps {
  settings: PrintSettingsType;
  onChange: (settings: Partial<PrintSettingsType>) => void;
}

const PAPER_SIZES: { value: PaperSize; label: string }[] = [
  { value: 'A4', label: 'A4 (210 × 297 mm)' },
  { value: 'Letter', label: 'Letter (216 × 279 mm)' },
  { value: 'A3', label: 'A3 (297 × 420 mm)' },
];

const ORIENTATIONS: { value: Orientation; label: string }[] = [
  { value: 'portrait', label: 'Portrait' },
  { value: 'landscape', label: 'Landscape' },
];

export function PrintSettings({ settings, onChange }: PrintSettingsProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Paper Size */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Paper Size</label>
        <select
          value={settings.paperSize}
          onChange={(e) => onChange({ paperSize: e.target.value as PaperSize })}
          className="rounded border border-[var(--ui-border)] bg-[var(--background)] px-3 py-2 text-sm"
        >
          {PAPER_SIZES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Orientation */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Orientation</label>
        <div className="flex gap-2">
          {ORIENTATIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onChange({ orientation: value })}
              className={`flex-1 rounded border px-3 py-2 text-sm ${
                settings.orientation === value
                  ? 'border-[var(--printmd-link-color)] bg-[var(--ui-bg-hover)]'
                  : 'border-[var(--ui-border)] hover:bg-[var(--ui-bg-hover)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Margins */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Margins (mm)</label>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--ui-text-muted)]">Top</label>
            <input
              type="number"
              value={settings.margins.top}
              onChange={(e) => onChange({
                margins: { ...settings.margins, top: Number(e.target.value) }
              })}
              min={0}
              max={100}
              className="rounded border border-[var(--ui-border)] bg-[var(--background)] px-2 py-1.5 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--ui-text-muted)]">Bottom</label>
            <input
              type="number"
              value={settings.margins.bottom}
              onChange={(e) => onChange({
                margins: { ...settings.margins, bottom: Number(e.target.value) }
              })}
              min={0}
              max={100}
              className="rounded border border-[var(--ui-border)] bg-[var(--background)] px-2 py-1.5 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--ui-text-muted)]">Left</label>
            <input
              type="number"
              value={settings.margins.left}
              onChange={(e) => onChange({
                margins: { ...settings.margins, left: Number(e.target.value) }
              })}
              min={0}
              max={100}
              className="rounded border border-[var(--ui-border)] bg-[var(--background)] px-2 py-1.5 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--ui-text-muted)]">Right</label>
            <input
              type="number"
              value={settings.margins.right}
              onChange={(e) => onChange({
                margins: { ...settings.margins, right: Number(e.target.value) }
              })}
              min={0}
              max={100}
              className="rounded border border-[var(--ui-border)] bg-[var(--background)] px-2 py-1.5 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Include Background */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={settings.includeBackground}
          onChange={(e) => onChange({ includeBackground: e.target.checked })}
          className="rounded border-[var(--ui-border)]"
        />
        <span className="text-sm">Include background colors</span>
      </label>
    </div>
  );
}

export default PrintSettings;
