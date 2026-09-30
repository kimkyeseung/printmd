'use client';

import { Fragment, useId } from 'react';
import type { HeaderFooterConfig } from '@/types/print';
import { useAppStrings } from '@/lib/i18n/appStrings';

interface HeaderFooterProps {
  header: HeaderFooterConfig;
  footer: HeaderFooterConfig;
  onHeaderChange: (header: Partial<HeaderFooterConfig>) => void;
  onFooterChange: (footer: Partial<HeaderFooterConfig>) => void;
}

const VARIABLES = [
  { value: '{title}', key: 'varTitle' },
  { value: '{date}', key: 'varDate' },
  { value: '{page}', key: 'varPage' },
  { value: '{pages}', key: 'varPages' },
] as const;

const SLOTS = [
  { key: 'left', placeholder: '{title}' },
  { key: 'center', placeholder: '' },
  { key: 'right', placeholder: '{date}' },
] as const;

function PositionInputs({
  config,
  onChange,
  label,
}: {
  config: HeaderFooterConfig;
  onChange: (config: Partial<HeaderFooterConfig>) => void;
  label: string;
}) {
  const t = useAppStrings().print;
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => onChange({ enabled: e.target.checked })}
            className="rounded border-[var(--ui-border)]"
          />
          <span className="text-xs text-[var(--ui-text-muted)]">{t.enable}</span>
        </label>
      </div>

      {config.enabled && (
        // One row per slot: three side-by-side columns left ~85px per input,
        // too narrow for values like "{page} / {pages}".
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1.5">
          {SLOTS.map(({ key, placeholder }) => (
            <Fragment key={key}>
              <label htmlFor={`${id}-${key}`} className="text-xs text-[var(--ui-text-muted)]">
                {t[key]}
              </label>
              <input
                id={`${id}-${key}`}
                type="text"
                value={config[key]}
                onChange={(e) => onChange({ [key]: e.target.value })}
                placeholder={placeholder}
                className="min-w-0 rounded border border-[var(--ui-border)] bg-[var(--background)] px-2 py-1 text-xs font-mono"
              />
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

export function HeaderFooter({
  header,
  footer,
  onHeaderChange,
  onFooterChange,
}: HeaderFooterProps) {
  const t = useAppStrings().print;
  return (
    <div className="flex flex-col gap-4">
      <PositionInputs
        config={header}
        onChange={onHeaderChange}
        label={t.header}
      />

      <PositionInputs
        config={footer}
        onChange={onFooterChange}
        label={t.footer}
      />

      {/* Variables hint */}
      <div className="rounded bg-[var(--ui-bg-secondary)] p-2">
        <p className="text-xs text-[var(--ui-text-muted)] mb-1">{t.variables}</p>
        <div className="flex flex-wrap gap-1">
          {VARIABLES.map(({ value, key }) => (
            <span
              key={value}
              className="inline-block rounded bg-[var(--ui-bg-hover)] px-1.5 py-0.5 text-xs font-mono"
              title={t[key]}
            >
              {value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeaderFooter;
