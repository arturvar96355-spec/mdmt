'use client';

import { useSyncExternalStore } from 'react';
import type { SectionKey } from '@/content/series';

export interface ConfigState {
  series: string;
  section: SectionKey;
  length: number;
  view: 'iso' | 'front' | 'top';
}

let state: ConfigState = { series: 'T52', section: 'square', length: 3, view: 'iso' };
const subs = new Set<() => void>();

export const configStore = {
  get: () => state,
  set(patch: Partial<ConfigState>) {
    state = { ...state, ...patch };
    subs.forEach((f) => f());
  },
  subscribe(f: () => void) {
    subs.add(f);
    return () => subs.delete(f);
  },
};

export const useConfig = () => useSyncExternalStore(configStore.subscribe, configStore.get, configStore.get);

export function openConfigurator(patch: Partial<ConfigState>) {
  configStore.set(patch);
  document.getElementById('configurator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
