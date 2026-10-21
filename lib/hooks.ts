'use client';

import { useEffect, useState } from 'react';

export function useMedia(query: string, initial = false) {
  const [m, setM] = useState(initial);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return m;
}

export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)');

export function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}
