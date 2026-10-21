import type { TrussGeometry, V3 } from './build';

/** изометрическая проекция для SVG-фолбэка и прелоадера */
export function isoProject(p: V3, rotY = 0.62, tilt = 0.5): [number, number] {
  const c = Math.cos(rotY), s = Math.sin(rotY);
  const x = p[0] * c - p[2] * s;
  const z = p[0] * s + p[2] * c;
  return [x, -(p[1] * Math.cos(tilt) - z * Math.sin(tilt) * 0.6)];
}

export function trussToSvg(g: TrussGeometry, w = 800, h = 360, rotY = 0.55) {
  const pts: Array<{ a: [number, number]; b: [number, number]; r: number; chord: boolean; t: number }> = [];
  const add = (segs: TrussGeometry['chords'], chord: boolean) =>
    segs.forEach((s) => pts.push({ a: isoProject(s.a, rotY), b: isoProject(s.b, rotY), r: s.r, chord, t: s.t }));
  add(g.chords, true);
  add(g.braces, false);
  const xs = pts.flatMap((p) => [p.a[0], p.b[0]]);
  const ys = pts.flatMap((p) => [p.a[1], p.b[1]]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const k = Math.min((w * 0.86) / (maxX - minX || 1), (h * 0.7) / (maxY - minY || 1));
  const ox = w / 2 - ((minX + maxX) / 2) * k;
  const oy = h / 2 - ((minY + maxY) / 2) * k;
  return pts.map((p) => ({
    x1: p.a[0] * k + ox, y1: p.a[1] * k + oy, x2: p.b[0] * k + ox, y2: p.b[1] * k + oy,
    w: Math.max(0.8, p.r * k * (p.chord ? 1.6 : 1.3)), chord: p.chord, t: p.t,
  }));
}
