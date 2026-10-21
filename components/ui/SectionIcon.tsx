import { PROFILES } from '@/lib/truss/build';
import type { SectionKey } from '@/content/series';

/** Мини-схема сечения: пояса — кружки, раскосы — линии. */
export function SectionIcon({ kind, size = 44, active = false }: { kind: SectionKey; size?: number; active?: boolean }) {
  const pts = PROFILES[kind];
  const c = size / 2;
  const k = size * 0.4;
  const xy = pts.map(([x, y]) => [c + x * k, c - y * k] as const);
  const stroke = active ? '#ff6a13' : '#c9ced6';
  const path = kind === 'arch'
    ? `M ${c - k} ${c + k * 0.5} Q ${c} ${c - k * 1.3} ${c + k} ${c + k * 0.5}`
    : xy.length === 2
      ? `M ${xy[0][0]} ${xy[0][1]} L ${xy[1][0]} ${xy[1][1]}`
      : `M ${xy.map((p) => p.join(' ')).join(' L ')} Z`;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden className="shrink-0">
      <path d={path} fill="none" stroke={stroke} strokeWidth="1" opacity="0.8" />
      {kind === 'arch'
        ? [-1, 0, 1].map((i) => <circle key={i} cx={c + i * k * 0.9} cy={c + (i === 0 ? -k * 0.55 : k * 0.3)} r={size * 0.06} fill={stroke} />)
        : xy.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={size * 0.07} fill={stroke} />)}
    </svg>
  );
}
