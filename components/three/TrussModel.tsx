'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Seg, TrussGeometry } from '@/lib/truss/build';
import { sceneState } from '@/lib/scene-state';

const ORANGE = new THREE.Color('#ff6a13');
const tmpM = new THREE.Matrix4();
const tmpQ = new THREE.Quaternion();
const tmpP = new THREE.Vector3();
const tmpS = new THREE.Vector3();
const tmpD = new THREE.Vector3();
const tmpO = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);
const tmpC = new THREE.Color();

const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

interface Props {
  geometry: TrussGeometry;
  /** если задан — вместо sceneState.assemble */
  assemble?: number;
  /** время (в единицах прогресса) вспышки сварки */
  flash?: boolean;
  explodeScale?: number;
  /** функция-драйвер сборки (конфигуратор): отключает sceneState */
  driver?: () => number;
}

function setSeg(mesh: THREE.InstancedMesh, i: number, s: Seg, local: number, off: THREE.Vector3) {
  const e = ease(local);
  const ax = s.a[0], ay = s.a[1], az = s.a[2];
  const bx = ax + (s.b[0] - ax) * e, by = ay + (s.b[1] - ay) * e, bz = az + (s.b[2] - az) * e;
  tmpD.set(bx - ax, by - ay, bz - az);
  const len = tmpD.length();
  if (len < 1e-6 || local <= 0) {
    tmpM.makeScale(0, 0, 0);
  } else {
    tmpD.divideScalar(len);
    tmpQ.setFromUnitVectors(UP, tmpD);
    tmpP.set((ax + bx) / 2 + off.x, (ay + by) / 2 + off.y, (az + bz) / 2 + off.z);
    const k = 0.4 + 0.6 * ease(local * 1.4);
    tmpS.set(s.r * k, len, s.r * k);
    tmpM.compose(tmpP, tmpQ, tmpS);
  }
  mesh.setMatrixAt(i, tmpM);
}

export function TrussModel({ geometry: g, assemble, flash = true, explodeScale = 1, driver }: Props) {
  const chordsRef = useRef<THREE.InstancedMesh>(null!);
  const bracesRef = useRef<THREE.InstancedMesh>(null!);
  const weldsRef = useRef<THREE.InstancedMesh>(null!);
  const endsRef = useRef<THREE.InstancedMesh>(null!);
  const last = useRef(-1);

  const cyl = useMemo(() => new THREE.CylinderGeometry(1, 1, 1, 12, 1, false), []);
  const sph = useMemo(() => new THREE.SphereGeometry(1, 10, 8), []);
  const discs = useMemo(() => new THREE.CylinderGeometry(1, 1, 1, 28, 1), []);

  useLayoutEffect(() => {
    last.current = -1;
  }, [g]);

  useFrame(() => {
    const prog = (driver ? driver() : (assemble ?? sceneState.assemble)) * 1.35;
    const exp = driver ? 0 : sceneState.explode;
    const key = prog * 1000 + exp * 100003 + 1;
    if (key === last.current) return;
    last.current = key;

    const win = 0.16;
    const spread = g.size * 2.2 * explodeScale;
    const offFor = (mid: THREE.Vector3, kind: number) => {
      if (exp <= 0) return tmpO.set(0, 0, 0);
      const dir = tmpO.set(mid.x * 0.7, mid.y, mid.z).normalize();
      const f = exp * spread * (kind === 1 ? 1.0 : 0.45);
      return tmpO.set(dir.x * f + mid.x * exp * 0.35, dir.y * f, dir.z * f);
    };

    const m = new THREE.Vector3();
    g.chords.forEach((s, i) => {
      m.set((s.a[0] + s.b[0]) / 2, (s.a[1] + s.b[1]) / 2, (s.a[2] + s.b[2]) / 2);
      setSeg(chordsRef.current, i, s, (prog - s.t) / win, offFor(m, 0));
    });
    g.braces.forEach((s, i) => {
      m.set((s.a[0] + s.b[0]) / 2, (s.a[1] + s.b[1]) / 2, (s.a[2] + s.b[2]) / 2);
      setSeg(bracesRef.current, i, s, (prog - s.t) / win, offFor(m, 1));
    });
    chordsRef.current.instanceMatrix.needsUpdate = true;
    bracesRef.current.instanceMatrix.needsUpdate = true;

    g.nodes.forEach((n, i) => {
      const done = prog - (n.t + win);
      let I = 0;
      if (flash && done > 0) I = Math.exp(-done / 0.022);
      
      m.set(n.p[0], n.p[1], n.p[2]);
      const o = offFor(m, 1);
      tmpP.set(n.p[0] + o.x, n.p[1] + o.y, n.p[2] + o.z);
      tmpS.setScalar(g.radius * (0.7 + I * 1.1));
      tmpM.compose(tmpP, tmpQ.identity(), I > 0.01 ? tmpS : tmpS.setScalar(0));
      weldsRef.current.setMatrixAt(i, tmpM);
      weldsRef.current.setColorAt(i, tmpC.copy(ORANGE).multiplyScalar(I * 4));
    });
    weldsRef.current.instanceMatrix.needsUpdate = true;
    if (weldsRef.current.instanceColor) weldsRef.current.instanceColor.needsUpdate = true;

    g.ends.forEach((e, i) => {
      const k = ease(prog / 0.12);
      const t = g.size * 0.16;
      tmpQ.setFromUnitVectors(UP, tmpD.set(...e.n).normalize());
      tmpP.set(e.c[0] + e.n[0] * t * 0.5, e.c[1] + e.n[1] * t * 0.5, e.c[2] + e.n[2] * t * 0.5);
      if (exp > 0) tmpP.x += Math.sign(e.c[0] || 1) * exp * g.size * 1.4;
      tmpS.set(e.r * k, t * k, e.r * k);
      tmpM.compose(tmpP, tmpQ, tmpS);
      endsRef.current.setMatrixAt(i, tmpM);
    });
    endsRef.current.instanceMatrix.needsUpdate = true;
  });

  const metal = (
    <meshStandardMaterial color="#c9ced6" metalness={1} roughness={0.3} envMapIntensity={1.15} />
  );

  return (
    <group>
      <instancedMesh ref={chordsRef} args={[cyl, undefined, g.chords.length]} frustumCulled={false}>
        {metal}
      </instancedMesh>
      <instancedMesh ref={bracesRef} args={[cyl, undefined, g.braces.length]} frustumCulled={false}>
        <meshStandardMaterial color="#b9bfc9" metalness={1} roughness={0.36} envMapIntensity={1.05} />
      </instancedMesh>
      <instancedMesh ref={endsRef} args={[discs, undefined, g.ends.length]} frustumCulled={false}>
        <meshStandardMaterial color="#9aa1ad" metalness={1} roughness={0.2} />
      </instancedMesh>
      <instancedMesh ref={weldsRef} args={[sph, undefined, g.nodes.length]} frustumCulled={false}>
        <meshBasicMaterial
          color="#ffffff"
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
        />
      </instancedMesh>
    </group>
  );
}
