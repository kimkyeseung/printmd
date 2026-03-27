'use client';

import { useRef, useState } from 'react';
import { useStyleStore } from '@/stores';
import { sanitizeFontName } from '@/lib/sanitize/cssValue';
import { FONT_OPTIONS as DEFAULT_FONTS } from '@/lib/fonts/constants';
import { showToast } from '@/components/ui/Toast';
import { useClientDictionary } from '@/hooks/useClientLocale';

export function FontManager() {
  const t = useClientDictionary().stylePanel;
  const customFonts = useStyleStore((state) => state.customFonts);
  const addCustomFont = useStyleStore((state) => state.addCustomFont);
  const removeCustomFont = useStyleStore((state) => state.removeCustomFont);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const name = sanitizeFontName(file.name.replace(/\.(woff2?|ttf|otf)$/i, ''));

    if (customFonts.some((f) => f.name === name)) {
      showToast(t.fontToast.alreadyRegistered.replace('{{name}}', name), 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      addCustomFont({ name, url });
      showToast(t.fontToast.added.replace('{{name}}', name), 'success');
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (fontName: string) => {
    if (confirmDeleteName === fontName) {
      const el = document.getElementById(`custom-font-${fontName}`);
      if (el) el.remove();
      removeCustomFont(fontName);
      setConfirmDeleteName(null);
      showToast(t.fontToast.removed.replace('{{name}}', fontName), 'success');
    } else {
      setConfirmDeleteName(fontName);
      setTimeout(() => setConfirmDeleteName(null), 3000);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Default fonts */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium border-b border-[var(--ui-border)] pb-2">{t.defaultFonts}</h3>
        <div className="flex flex-col gap-1">
          {DEFAULT_FONTS.map((font) => (
            <div
              key={font.value}
              className="flex items-center gap-2 rounded px-2 py-2 border border-[var(--ui-border)]"
            >
              <span className="text-sm flex-1" style={{ fontFamily: font.value }}>
                {font.label}
              </span>
              <span
                className="text-sm text-[var(--ui-text-muted)]"
                style={{ fontFamily: font.value }}
              >
                가나다 ABC 123
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom fonts */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium border-b border-[var(--ui-border)] pb-2">{t.customFonts}</h3>
        {customFonts.length === 0 ? (
          <p className="text-sm text-[var(--ui-text-muted)] py-2">{t.noCustomFonts}</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {customFonts.map((font) => (
              <div
                key={font.name}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 border border-[var(--ui-border)] bg-[var(--ui-bg-hover)]/30"
              >
                <span className="text-sm flex-1 font-medium" style={{ fontFamily: font.name }}>
                  {font.name}
                </span>
                <span
                  className="text-sm text-[var(--ui-text-muted)]"
                  style={{ fontFamily: font.name }}
                >
                  가나다 ABC
                </span>
                <button
                  onClick={() => handleDelete(font.name)}
                  className={`shrink-0 rounded px-2 py-1 text-xs ${
                    confirmDeleteName === font.name
                      ? 'bg-red-50 text-red-600 border border-red-300'
                      : 'text-[var(--ui-text-muted)] hover:bg-[var(--ui-bg-hover)] hover:text-red-500'
                  }`}
                  aria-label={`${t.delete} ${font.name}`}
                >
                  {confirmDeleteName === font.name ? t.confirmDelete : t.delete}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".woff,.woff2,.ttf,.otf"
            onChange={handleFileUpload}
            className="hidden"
            id="font-upload"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[var(--ui-border)] px-3 py-3 text-sm text-[var(--ui-text-muted)] hover:bg-[var(--ui-bg-hover)] transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t.uploadFont}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FontManager;
