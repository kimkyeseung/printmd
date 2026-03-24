'use client';

import { useEffect, useCallback, useSyncExternalStore } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

// Simple external store for toasts (no extra dependency needed)
let toasts: Toast[] = [];
let nextId = 0;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function showToast(message: string, type: ToastType = 'info') {
  const id = nextId++;
  toasts = [...toasts, { id, message, type }];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 3000);
}

function useToasts() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => toasts,
    () => [] as Toast[],
  );
}

const iconMap: Record<ToastType, string> = {
  success: 'M5 13l4 4L19 7',
  error: 'M6 18L18 6M6 6l12 12',
  info: 'M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z',
};

const colorMap: Record<ToastType, string> = {
  success: 'text-green-600',
  error: 'text-red-600',
  info: 'text-blue-600',
};

export function ToastContainer() {
  const items = useToasts();

  if (items.length === 0) return null;

  return (
    <div className="absolute bottom-16 left-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {items.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  return (
    <div
      style={{ animation: 'toast-enter 0.2s ease-out' }}
      className="pointer-events-auto flex items-center gap-2 rounded-lg border border-[var(--ui-border)] bg-[var(--background)] px-3 py-2.5 text-sm shadow-md"
      role="status"
      aria-live="polite"
    >
      <svg
        className={`h-4 w-4 shrink-0 ${colorMap[toast.type]}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconMap[toast.type]} />
      </svg>
      <span>{toast.message}</span>
    </div>
  );
}
