'use client';

import { Rotate3d } from 'lucide-react';

/** Запускает 3D-сцену hero на телефонах (по умолчанию там показана лёгкая схема). */
export function Rotate3dButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event('mdmt:3d'))}
      className="mono flex min-h-12 items-center gap-2 border border-signal/60 px-4 text-[12px] uppercase tracking-[0.14em] text-signal md:hidden"
    >
      <Rotate3d className="size-4" aria-hidden /> Покрутить в 3D
    </button>
  );
}
