'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFileOpener } from '@/hooks/useFileOpener';
import { useUIStore } from '@/stores';
import type { Locale } from '@/lib/i18n/config';

export interface HangulFileOpenerStrings {
  open: string;
  dropHint: string;
  opening: string;
}

/**
 * Open an HWP/HWPX file straight from a landing page: convert it, open it in
 * a new editor tab, and go to the editor showing the document. Errors are
 * reported with the same toasts as the editor's own file opening.
 */
export function HangulFileOpener({ locale, t }: { locale: Locale; t: HangulFileOpenerStrings }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const { openFile } = useFileOpener();
  const router = useRouter();

  const open = async (file: File | undefined) => {
    if (!file || busy) return;
    setBusy(true);
    const opened = await openFile(file);
    if (!opened) {
      setBusy(false);
      return;
    }
    // Viewing is the point here: phones get the rendered document rather
    // than the Markdown source, and desktop shows both side by side.
    const { viewMode, setViewMode } = useUIStore.getState();
    if (window.matchMedia('(max-width: 768px)').matches) setViewMode('preview');
    else if (viewMode === 'editor') setViewMode('split');
    router.push(`/${locale}`);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        void open(e.dataTransfer.files[0]);
      }}
      className={`mx-auto mt-10 max-w-xl rounded-2xl border-2 border-dashed px-6 py-8 transition ${
        dragging ? 'border-blue-500 bg-blue-50' : 'border-blue-200 bg-white/70'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".hwp,.hwpx"
        className="hidden"
        aria-label={t.open}
        onChange={(e) => {
          void open(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70"
      >
        {busy ? t.opening : t.open}
      </button>
      <p className="mt-4 text-sm text-gray-500">{t.dropHint}</p>
    </div>
  );
}
