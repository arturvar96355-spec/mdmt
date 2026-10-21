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

let glCache: boolean | null = null;

/** Проверка WebGL: один раз за сессию, контекст сразу освобождается. */
export function hasWebGL() {
  if (glCache !== null) return glCache;
  try {
    const c = document.createElement('canvas');
    const g = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null;
    glCache = !!g;
    g?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    glCache = false;
  }
  return glCache;
}
