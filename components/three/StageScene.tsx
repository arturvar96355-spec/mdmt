'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Grid, Lightformer, PerformanceMonitor } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import { buildTruss } from '@/lib/truss/build';
import { series } from '@/content/series';
import { sceneState } from '@/lib/scene-state';
import { TrussModel } from './TrussModel';

function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={['#050608']} />
      <Lightformer form="rect" intensity={3.2} color="#dfe8ff" position={[0, 6, 2]} scale={[12, 1.2, 1]} rotation-x={Math.PI / 2} />
      <Lightformer form="rect" intensity={2.2} color="#bcd0ff" position={[-7, 2, 2]} scale={[1.2, 6, 1]} rotation-y={Math.PI / 2} />
      <Lightformer form="rect" intensity={2.4} color="#ff8a3d" position={[7, 1.5, -3]} scale={[1.4, 5, 1]} rotation-y={-Math.PI / 2} />
      <Lightformer form="rect" intensity={1.4} color="#ffffff" position={[0, 1, -8]} scale={[14, 0.6, 1]} />
      <Lightformer form="circle" intensity={1.2} color="#ffb787" position={[3, -1, 6]} scale={3} />
    </Environment>
  );
}

function Rig({ children, offsetX }: { children: React.ReactNode; offsetX: number }) {
  const g = useRef<THREE.Group>(null!);
  const spot1 = useRef<THREE.SpotLight>(null!);
  const spot2 = useRef<THREE.SpotLight>(null!);
  const warm = useRef<THREE.PointLight>(null!);
  const { camera } = useThree();
  const tgt = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (g.current) {
      const targetY = -0.5 + Math.sin(t * 0.22) * 0.22 + sceneState.spin;
      g.current.rotation.y = targetY;
    }
    // параллакс камеры ±3°
    const rx = THREE.MathUtils.degToRad(3);
    const cx = 4.4 + Math.sin(sceneState.px * rx) * 10;
    const cy = 0.9 + sceneState.py * 0.4;
    camera.position.x += (cx - camera.position.x) * Math.min(1, dt * 3);
    camera.position.y += (cy - camera.position.y) * Math.min(1, dt * 3);
    camera.position.z = 8.2;
    camera.lookAt(offsetX * 0.55, -0.35, 0);

    if (spot1.current) {
      spot1.current.position.set(-5 + Math.sin(t * 0.45) * 2.2, 6.2, 3 + Math.cos(t * 0.3) * 1.5);
    }
    if (spot2.current) {
      spot2.current.position.set(5 + Math.cos(t * 0.38) * 2, 5.5, 2.5 + Math.sin(t * 0.5) * 1.5);
    }
    if (warm.current) warm.current.intensity = 6 + Math.sin(t * 1.3) * 1.2;
  });

  return (
    <>
      <primitive object={tgt} position={[0, 0, 0]} />
      <spotLight ref={spot1} angle={0.42} penumbra={0.9} intensity={420} color="#cfe0ff" target={tgt} distance={30} decay={2} />
      <spotLight ref={spot2} angle={0.4} penumbra={0.9} intensity={360} color="#ff9455" target={tgt} distance={30} decay={2} />
      <pointLight ref={warm} position={[0, -0.2, 4]} color="#ff6a13" distance={9} decay={2} />
      <group position={[offsetX, -0.7, 0]}>
        <group ref={g}>{children}</group>
      </group>
    </>
  );
}

function Driver({ auto }: { auto: boolean }) {
  useFrame((_, dt) => {
    if (auto && sceneState.assemble < 1) {
      sceneState.assemble = Math.min(1, sceneState.assemble + dt / 4.4);
    }
  });
  return null;
}

function Content({ auto }: { auto: boolean }) {
  const { size } = useThree();
  const wide = size.width / size.height > 1.15;
  const geometry = useMemo(() => {
    const s = series.find((x) => x.code === 'T52')!;
    return buildTruss({ section: 'square', scale: s.scale * 1.55, length: 5.2 });
  }, []);
  return (
    <>
      <Driver auto={auto} />
      <Rig offsetX={wide ? 2.6 : 0}>
        <TrussModel geometry={geometry} />
        <group position={[0, -1.4, 0]}>
          <ContactShadows position={[0, 0, 0]} opacity={0.65} scale={16} blur={2.6} far={4} color="#000" />
        </group>
      </Rig>
      <Grid
        position={[0, -1.4, 0]}
        args={[40, 40]}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#22262d"
        sectionSize={2.5}
        sectionThickness={1}
        sectionColor="#5a3115"
        fadeDistance={22}
        fadeStrength={1.6}
        infiniteGrid
      />
    </>
  );
}

export default function StageScene({ auto = true, bloom = true }: { auto?: boolean; bloom?: boolean }) {
  const dprRef = useRef<[number, number]>([1, 1.75]);
  useEffect(() => {
    const move = (e: PointerEvent) => {
      sceneState.px = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  return (
    <Canvas
      dpr={dprRef.current}
      camera={{ position: [4.4, 0.9, 8.2], fov: 32, near: 0.1, far: 80 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.setClearColor(0x000000, 0);
      }}
    >
      <PerformanceMonitor onDecline={() => { dprRef.current = [1, 1]; }} />
      <Suspense fallback={null}>
        <Studio />
        <Content auto={auto} />
        {bloom && (
          <EffectComposer multisampling={0}>
            <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.95} luminanceSmoothing={0.2} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
