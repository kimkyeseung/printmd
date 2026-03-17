'use client';

import { memo } from 'react';

export const DragDropOverlay = memo(function DragDropOverlay() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-blue-500/20 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="파일 드롭 영역"
    >
      <div className="rounded-2xl border-4 border-dashed border-blue-500 bg-white/90 p-8 text-center shadow-2xl sm:p-12">
        <svg
          className="mx-auto h-12 w-12 text-blue-500 sm:h-16 sm:w-16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="mt-4 text-lg font-semibold text-gray-700 sm:text-xl">
          마크다운 파일을 여기에 놓으세요
        </p>
        <p className="mt-2 text-xs text-gray-500 sm:text-sm">
          .md, .markdown, .txt 파일 지원
        </p>
      </div>
    </div>
  );
});
