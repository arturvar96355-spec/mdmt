import { buildTruss } from '@/lib/truss/build';
import { trussToSvg } from '@/lib/truss/iso';
import type { SectionKey } from '@/content/series';

const SETS: Array<{ s: SectionKey; l: number; r: number }> = [
  { s: 'square', l: 5, r: 0.5 },
  { s: 'triangle', l: 4, r: 0.9 },
  { s: 'rect', l: 5, r: 0.25 },
  { s: 'five', l: 4, r: 0.7 },
  { s: 'flat', l: 5, r: 0.45 },
  { s: 'arch', l: 5, r: 0.3 },
];

export function PlaceholderFilm({ i = 0, caption = '[фото проекта — от клиента]', className = '' }: { i?: number; caption?: string; className?: string }) {
  const set = SETS[i % SETS.length];
  const lines = trussToSvg(buildTruss({ section: set.s, scale: 1, length: set.l }), 640, 400, set.r);
  return (
    <div className={`group relative isolate overflow-hidden bg-carbon grain ${className}`}>
      <div className="bg-blueprint-fine absolute inset-0 -z-10 opacity-60" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_100%,rgb(255_106_19/0.0),transparent)] transition-[background] duration-700 group-hover:bg-[radial-gradient(70%_60%_at_50%_100%,rgb(255_106_19/0.28),transparent)]" aria-hidden />
      <svg viewBox="0 0 640 400" className="absolute inset-0 h-full w-full opacity-40 grayscale transition-[opacity,filter] duration-700 group-hover:opacity-90 group-hover:grayscale-0" aria-hidden>
        {lines.map((l, k) => (
          <line key={k} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.chord ? '#c9ced6' : '#7d8591'} strokeWidth={l.w} strokeLinecap="round" />
        ))}
      </svg>
      <span className="ph absolute bottom-3 left-3 bg-void/70 !text-[10px]">{caption}</span>
    </div>
  );
}
