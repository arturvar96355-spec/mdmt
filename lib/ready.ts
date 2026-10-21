'use client';

import { useSyncExternalStore } from 'react';

let ready = false;
const subs = new Set<() => void>();
export const setReady = () => { if (!ready) { ready = true; subs.forEach((f) => f()); } };
export const useReady = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => ready, () => false);
