'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { buildTruss } from '@/lib/truss/build';
import { series } from '@/content/series';
import type { ConfigState } from '@/lib/config-store';
import { TrussModel } from './TrussModel';

const VIEWS: Record<ConfigState['view'], THREE.Vector3> = {
  iso: new THREE.Vector3(3.4, 2.0, 4.6),
  front: new THREE.Vector3(0.001, 0.3, 7),
  top: new THREE.Vector3(0.001, 7.4, 0.8),
};

function Inner({ cfg, touch }: { cfg: ConfigState; touch: boolean }) {
  const s = series.find((x) => x.code === cfg.series)!;
  const geometry = useMemo(() => buildTruss({ section: cfg.section, scale: s.scale, length: cfg.length }), [cfg.section, cfg.length, s.scale]);
  const progress = useRef(0);
  const { invalidate, camera } = useThree();
  const controls = useRef<any>(null);
  const target = useRef(VIEWS[cfg.view].clone());

  useEffect(() => {
    progress.current = 0.2;
    invalidate();
  }, [geometry, invalidate]);

  useEffect(() => {
    target.current.copy(VIEWS[cfg.view]);
    invalidate();
  }, [cfg.view, invalidate]);

  useFrame((_, dt) => {
    let more = false;
    if (progress.current < 1) {
      progress.current = Math.min(1, progress.current + dt / 0.7);
      more = true;
    }
    const d = camera.position.distanceTo(target.current);
    if (d > 0.02) {
      camera.position.lerp(target.current, Math.min(1, dt * 5));
      controls.current?.update();
      more = true;
    }
    if (more) invalidate();
  });

  return (
    <>
      <spotLight position={[-5, 6, 3]} angle={0.6} penumbra={0.9} intensity={380} color="#cfe0ff" distance={30} decay={2} />
      <spotLight position={[5, 5, 2]} angle={0.6} penumbra={0.9} intensity={300} color="#ff9455" distance={30} decay={2} />
      <pointLight position={[0, 1, 5]} intensity={30} color="#ffffff" distance={14} decay={2} />
      <TrussModel geometry={geometry} driver={() => progress.current} />
      <ContactShadows position={[0, -1.1, 0]} opacity={0.6} scale={14} blur={2.4} far={3} />
      <OrbitControls
        ref={controls}
        enablePan={false}
        enableZoom={!touch}
        enableDamping
        minDistance={3}
        maxDistance={14}
        minPolarAngle={0.01}
        maxPolarAngle={Math.PI * 0.62}
        onChange={() => invalidate()}
      />
    </>
  );
}

export default function ConfigCanvas({ cfg, touch }: { cfg: ConfigState; touch: boolean }) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ position: VIEWS.iso.toArray(), fov: 30, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: 'pan-y' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.setClearColor(0x000000, 0);
      }}
    >
      <Suspense fallback={null}>
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={6} color="#dfe8ff" position={[0, 6, 2]} scale={[12, 1.4, 1]} rotation-x={Math.PI / 2} />
          <Lightformer form="rect" intensity={4} color="#bcd0ff" position={[-7, 2, 2]} scale={[1.2, 6, 1]} rotation-y={Math.PI / 2} />
          <Lightformer form="rect" intensity={4.5} color="#ff8a3d" position={[7, 1.5, -3]} scale={[1.4, 5, 1]} rotation-y={-Math.PI / 2} />
          <Lightformer form="rect" intensity={3} color="#fff" position={[0, 1, -8]} scale={[14, 0.6, 1]} />
        </Environment>
        <Inner cfg={cfg} touch={touch} />
      </Suspense>
    </Canvas>
  );
}
