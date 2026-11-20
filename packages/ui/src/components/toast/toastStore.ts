import { useSyncExternalStore } from "react";

export type ToastTone = "default" | "success" | "destructive";

export type ToastOptions = {
  title: string;
  description?: string;
  tone?: ToastTone;
};

export type ToastItem = ToastOptions & { id: number; open: boolean };

let toasts: ToastItem[] = [];
const listeners = new Set<() => void>();
let nextId: number = 1;
const snapshot: ToastItem[] = [];

function setToasts(next: ToastItem[]) {
  toasts = next;
  listeners.forEach((l) => l());
}

export function toast(options: ToastOptions): number {
  const id = nextId++;
  setToasts([...toasts, { ...options, id, open: true }]);
  return id;
}

export function dismissToast(id: number) {
  setToasts(toasts.map((t) => (t.id === id ? { ...t, open: false } : t)));
  setTimeout(() => setToasts(toasts.filter((t) => t.id !== id)), 1000);
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getToasts() {
  return toasts;
}

export function useToasts() {
  return useSyncExternalStore(subscribe, getToasts, getServerSnapshot);
}

export function getServerSnapshot() {
  return snapshot;
}
