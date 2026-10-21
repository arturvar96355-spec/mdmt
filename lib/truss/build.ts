import type { SectionKey } from '@/content/series';

export type V3 = [number, number, number];
export interface Seg { a: V3; b: V3; r: number; /** 0..1 — момент появления при сборке */ t: number }
export interface TrussGeometry {
  chords: Seg[];
  braces: Seg[];
  nodes: Array<{ p: V3; t: number }>;
  /** торцевые соединители: центр, нормаль, радиус */
  ends: Array<{ c: V3; n: V3; r: number }>;
  length: number;
  size: number;
  radius: number;
}

const PROFILES: Record<SectionKey, Array<[number, number]>> = {
  flat: [[0, -0.5], [0, 0.5]],
  triangle: [[-0.5, -0.43], [0.5, -0.43], [0, 0.43]],
  square: [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]],
  rect: [[-0.8, -0.42], [0.8, -0.42], [0.8, 0.42], [-0.8, 0.42]],
  trapezoid: [[-0.62, -0.5], [0.62, -0.5], [0.42, 0.5], [-0.42, 0.5]],
  five: [0, 1, 2, 3, 4].map((i) => {
    const a = (i / 5) * Math.PI * 2 + Math.PI / 2;
    return [Math.cos(a) * 0.55, Math.sin(a) * 0.55] as [number, number];
  }),
  arch: [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]],
};

/** пары соседних поясов, между которыми идёт раскос */
function faces(key: SectionKey, n: number): Array<[number, number]> {
  if (n === 2) return [[0, 1]];
  return Array.from({ length: n }, (_, i) => [i, (i + 1) % n] as [number, number]);
}

export interface BuildOpts { section: SectionKey; scale: number; length: number }

export function buildTruss({ section, scale, length }: BuildOpts): TrussGeometry {
  const size = 0.5 * scale;
  const prof = PROFILES[section];
  const n = prof.length;
  const pitch = size * 0.95;
  const steps = Math.max(2, Math.round(length / pitch));
  const dx = length / steps;
  const arch = section === 'arch';
  const sub = arch ? 3 : 1;
  const radius = Math.max(0.018, size * 0.05);
  const braceR = radius * 0.46;

  // изгиб вдоль дуги
  const sweep = Math.min(Math.PI * 0.95, Math.max(0.9, length / 3.2));
  const R = length / sweep;
  const map = (x: number, y: number, z: number): V3 => {
    if (!arch) return [x - length / 2, y, z];
    const th = (x / length - 0.5) * sweep;
    const rr = R + y;
    return [Math.sin(th) * rr, Math.cos(th) * rr - R * Math.cos(sweep / 2) - size * 0.5, z];
  };
  const P = (x: number, i: number): V3 => map(x, prof[i][1] * size, prof[i][0] * size);

  const chords: Seg[] = [];
  const braces: Seg[] = [];
  const nodes: TrussGeometry['nodes'] = [];

  for (let i = 0; i < n; i++) {
    const total = steps * sub;
    for (let k = 0; k < total; k++) {
      const x0 = (k / total) * length;
      const x1 = ((k + 1) / total) * length;
      chords.push({ a: P(x0, i), b: P(x1, i), r: radius, t: (i / n) * 0.18 + (k / total) * 0.32 });
    }
  }

  const fs = faces(section, n);
  const totalBraces = fs.length * steps;
  let bi = 0;
  fs.forEach(([a, b], fi) => {
    for (let k = 0; k < steps; k++) {
      const up = (k + fi) % 2 === 0;
      const x0 = k * dx;
      const x1 = (k + 1) * dx;
      const t = 0.5 + (bi / totalBraces) * 0.5;
      braces.push({ a: P(x0, up ? a : b), b: P(x1, up ? b : a), r: braceR, t });
      nodes.push({ p: P(x1, up ? b : a), t });
      bi++;
    }
  });

  const ends: TrussGeometry['ends'] = [];
  const tan = (a: V3, b: V3): V3 => {
    const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const l = Math.hypot(...d) || 1;
    return [d[0] / l, d[1] / l, d[2] / l];
  };
  const eps = length * 0.002;
  for (let i = 0; i < n; i++) {
    ends.push({ c: P(0, i), n: tan(P(eps, i), P(0, i)), r: radius * 1.75 });
    ends.push({ c: P(length, i), n: tan(P(length - eps, i), P(length, i)), r: radius * 1.75 });
  }

  return { chords, braces, nodes, ends, length, size, radius };
}

export const DEFAULT_LENGTH = 3;
