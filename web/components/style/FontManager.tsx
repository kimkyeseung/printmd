'use client';

import { useRef, useEffect } from 'react';
import { useStyleStore } from '@/stores';

const DEFAULT_FONTS = [
  { value: 'system-ui, -apple-system, sans-serif', label: 'System (Sans)' },
  { value: '"Noto Sans KR", system-ui, sans-serif', label: 'Noto Sans KR' },
  { value: 'Georgia, "Times New Roman", serif', label: 'Georgia (Serif)' },
  { value: '"Nanum Gothic", sans-serif', label: 'Nanum Gothic' },
  { value: '"Nanum Myeongjo", serif', label: 'Nanum Myeongjo' },
  { value: 'ui-monospace, SFMono-Regular, monospace', label: 'Monospace' },
];

export function FontManager() {
  const customFonts = useStyleStore((state) => state.customFonts);
  const addCustomFont = useStyleStore((state) => state.addCustomFont);
  const removeCustomFont = useStyleStore((state) => state.removeCustomFont);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Register custom fonts as @font-face on mount and when customFonts changes
  useEffect(() => {
    customFonts.forEach((font) => {
      const existing = document.getElementById(`custom-font-${font.name}`);
      if (existing) return;

      const style = document.createElement('style');
      style.id = `custom-font-${font.name}`;
      style.textContent = `
        @font-face {
          font-family: '${font.name}';
          src: url('${font.url}');
          font-display: swap;
        }
      `;
      document.head.appendChild(style);
    });
  }, [customFonts]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const name = file.name.replace(/\.(woff2?|ttf|otf)$/i, '');

    // Check for duplicate names
    if (customFonts.some((f) => f.name === name)) {
      alert(`"${name}" 폰트가 이미 등록되어 있습니다.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      addCustomFont({ name, url });
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Default fonts */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium border-b border-[var(--ui-border)] pb-2">기본 폰트</h3>
        <div className="flex flex-col gap-1">
          {DEFAULT_FONTS.map((font) => (
            <div
              key={font.value}
              className="flex items-center gap-2 rounded px-2 py-1.5 border border-[var(--ui-border)]"
            >
              <span className="text-sm flex-1" style={{ fontFamily: font.value }}>
                {font.label}
              </span>
              <span
                className="text-xs text-[var(--ui-text-muted)]"
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
        <h3 className="text-sm font-medium border-b border-[var(--ui-border)] pb-2">커스텀 폰트</h3>
        {customFonts.length === 0 ? (
          <p className="text-xs text-[var(--ui-text-muted)]">등록된 커스텀 폰트가 없습니다.</p>
        ) : (
          <div className="flex flex-col gap-1">
            {customFonts.map((font) => (
              <div
                key={font.name}
                className="flex items-center gap-2 rounded px-2 py-1.5 border border-[var(--ui-border)]"
              >
                <span className="text-sm flex-1" style={{ fontFamily: font.name }}>
                  {font.name}
                </span>
                <span
                  className="text-xs text-[var(--ui-text-muted)]"
                  style={{ fontFamily: font.name }}
                >
                  가나다 ABC
                </span>
                <button
                  onClick={() => {
                    // Remove @font-face style element
                    const el = document.getElementById(`custom-font-${font.name}`);
                    if (el) el.remove();
                    removeCustomFont(font.name);
                  }}
                  className="rounded p-0.5 text-[var(--ui-text-muted)] hover:bg-[var(--ui-bg-hover)] hover:text-red-500"
                  aria-label={`${font.name} 삭제`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
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
            className="w-full rounded border border-dashed border-[var(--ui-border)] px-3 py-2 text-sm text-[var(--ui-text-muted)] hover:bg-[var(--ui-bg-hover)]"
          >
            + 폰트 업로드 (.woff, .woff2, .ttf, .otf)
          </button>
        </div>
      </div>
    </div>
  );
}

export default FontManager;
