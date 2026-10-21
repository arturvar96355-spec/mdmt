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

type Mode = 'hero' | 'assembly';

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

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

const GROUND = -1.4;

function Rig({ children, offsetX: baseX, mode }: { children: React.ReactNode; offsetX: number; mode: Mode }) {
  const g = useRef<THREE.Group>(null!);
  const o = useRef<THREE.Group>(null!);
  const spot1 = useRef<THREE.SpotLight>(null!);
  const spot2 = useRef<THREE.SpotLight>(null!);
  const warm = useRef<THREE.PointLight>(null!);
  const fill = useRef<THREE.PointLight>(null!);
  const { camera } = useThree();
  const tgt = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const pt = mode === 'assembly' ? sceneState.portal : 0;
    const k = Math.min(1, dt * 3);

    if (g.current) {
      g.current.rotation.y = mode === 'hero' ? -0.5 + Math.sin(t * 0.22) * 0.22 : -0.5 + pt * 0.5 + sceneState.explode * 0.12;
    }
    const offsetX = baseX * (1 - 0.45 * pt);
    if (o.current) o.current.position.set(offsetX, -0.7 * (1 - pt), 0);

    // параллакс камеры ±3°
    const rx = THREE.MathUtils.degToRad(3);
    const px = Math.sin(sceneState.px * rx) * 10;
    const tx = 4.4 * (1 - pt) + px + pt * 1.5;
    const ty = 0.9 + pt * 2.2 + sceneState.py * 0.4;
    const tz = 8.2 + pt * 8.5 + (mode === 'assembly' ? sceneState.explode * (1 - pt) * 2.4 : 0);
    camera.position.x += (tx - camera.position.x) * k;
    camera.position.y += (ty - camera.position.y) * k;
    camera.position.z += (tz - camera.position.z) * k;
    camera.lookAt(offsetX * 0.55, -0.35 + pt * 1.6, 0);

    spot1.current?.position.set(-5 + Math.sin(t * 0.45) * 2.2, 6.2, 3 + Math.cos(t * 0.3) * 1.5);
    spot2.current?.position.set(5 + Math.cos(t * 0.38) * 2, 5.5, 2.5 + Math.sin(t * 0.5) * 1.5);
    if (warm.current) warm.current.intensity = 6 + Math.sin(t * 1.3) * 1.2;
    if (fill.current) fill.current.intensity = pt * 260;
    spot1.current && (spot1.current.intensity = 420 + pt * 700);
    spot2.current && (spot2.current.intensity = 360 + pt * 600);
  });

  return (
    <>
      <primitive object={tgt} position={[0, 0, 0]} />
      <spotLight ref={spot1} angle={0.42} penumbra={0.9} intensity={420} color="#cfe0ff" target={tgt} distance={34} decay={2} />
      <spotLight ref={spot2} angle={0.4} penumbra={0.9} intensity={360} color="#ff9455" target={tgt} distance={34} decay={2} />
      <pointLight ref={fill} position={[1, 4, 10]} color="#dfe8ff" distance={40} decay={2} intensity={0} />
      <pointLight ref={warm} position={[0, -0.2, 4]} color="#ff6a13" distance={9} decay={2} />
      <group ref={o}>
        <group ref={g}>{children}</group>
      </group>
    </>
  );
}

function Driver({ auto }: { auto: boolean }) {
  useFrame((_, dt) => {
    if (auto && sceneState.assemble < 1) sceneState.assemble = Math.min(1, sceneState.assemble + dt / 4.4);
  });
  return null;
}

/** Проецирует 3D-якоря подписей в экранные координаты (подписи рисует DOM-слой, не drei/Html). */
const ANCHORS: Array<[number, number, number]> = [[1.0, 1.55, 1.5], [0.2, -1.5, 1.8], [3.4, 1.9, 1.2]];
function Projector({ target }: { target: React.RefObject<THREE.Group> }) {
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera, size }) => {
    if (!target.current) return;
    ANCHORS.forEach((a, i) => {
      v.set(...a);
      target.current.localToWorld(v);
      v.project(camera);
      sceneState.labels[i] = { x: (v.x * 0.5 + 0.5) * size.width, y: (-v.y * 0.5 + 0.5) * size.height };
    });
  });
  return null;
}

function Portal() {
  const root = useRef<THREE.Group>(null!);
  const parts = useRef<Array<THREE.Group | null>>([]);
  const led = useRef<THREE.MeshBasicMaterial>(null!);
  const s = series.find((x) => x.code === 'T52')!;
  const colG = useMemo(() => buildTruss({ section: 'square', scale: s.scale * 1.55, length: 3.8 }), [s]);
  const beamG = useMemo(() => buildTruss({ section: 'square', scale: s.scale * 1.55, length: 6.2 }), [s]);
  const driver = useMemo(() => () => 1, []);

  // конечные позиции и «откуда прилетают»
  const spec = useMemo(
    () => [
      { to: new THREE.Vector3(-2.75, GROUND + 0.05 + 1.9, 0), from: new THREE.Vector3(-5.5, 3.5, 2.5), rot: [0, 0, Math.PI / 2] as const },
      { to: new THREE.Vector3(2.75, GROUND + 0.05 + 1.9, 0), from: new THREE.Vector3(5.5, 3.5, 2.5), rot: [0, 0, Math.PI / 2] as const },
      { to: new THREE.Vector3(0, GROUND + 0.05 + 3.8 + 0.39, 0), from: new THREE.Vector3(0, 7.5, -1.5), rot: [0, 0, 0] as const },
    ],
    [],
  );

  useFrame(() => {
    const p = sceneState.portal;
    const vis = smooth(0.22, 0.4, p);
    root.current.visible = vis > 0.001;
    parts.current.forEach((g, i) => {
      if (!g) return;
      const delay = i === 2 ? 0.1 : 0;
      const e = smooth(0.25 + delay, 0.85 + delay * 0.5, p);
      g.position.lerpVectors(spec[i].from, spec[i].to, e);
      g.scale.setScalar(0.4 + 0.6 * e);
    });
    if (led.current) led.current.color.setRGB(1, 0.42, 0.07).multiplyScalar(smooth(0.85, 1, p) * 3);
  });

  return (
    <group ref={root} visible={false}>
      {[colG, colG, beamG].map((geo, i) => (
        <group key={i} ref={(el) => { parts.current[i] = el; }} rotation={spec[i].rot as unknown as THREE.Euler}>
          <TrussModel geometry={geo} driver={driver} flash={false} />
        </group>
      ))}
      {/* светодиодная линейка под ригелем */}
      <mesh position={[0, GROUND + 0.05 + 3.8 - 0.05, 0.42]}>
        <boxGeometry args={[5.2, 0.06, 0.06]} />
        <meshBasicMaterial ref={led} toneMapped={false} color="#000" />
      </mesh>
      {/* подиум */}
      <mesh position={[0, GROUND - 0.05, 0]} receiveShadow>
        <boxGeometry args={[8.6, 0.1, 4.4]} />
        <meshStandardMaterial color="#1a1e25" metalness={0.7} roughness={0.45} />
      </mesh>
    </group>
  );
}

function Content({ auto, mode }: { auto: boolean; mode: Mode }) {
  const { size } = useThree();
  const wide = size.width / size.height > 1.15;
  const hero = useRef<THREE.Group>(null!);
  const geometry = useMemo(() => {
    const s = series.find((x) => x.code === 'T52')!;
    return buildTruss({ section: 'square', scale: s.scale * 1.55, length: 5.2 });
  }, []);

  useFrame(() => {
    if (!hero.current || mode !== 'assembly') return;
    const f = 1 - smooth(0.0, 0.28, sceneState.portal);
    hero.current.scale.setScalar(Math.max(0.0001, f));
    hero.current.visible = f > 0.002;
  });

  return (
    <>
      {mode === 'hero' && <Driver auto={auto} />}
      <Rig offsetX={wide ? (mode === 'hero' ? 2.6 : 1.5) : 0} mode={mode}>
        <group ref={hero}>
          <TrussModel geometry={geometry} />
          {mode === 'assembly' && <Projector target={hero} />}
        </group>
        {mode === 'assembly' && <Portal />}
        <ContactShadows position={[0, GROUND + 0.01, 0]} opacity={0.65} scale={18} blur={2.6} far={4} color="#000" />
      </Rig>
      <Grid
        position={[0, GROUND, 0]}
        args={[40, 40]}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#22262d"
        sectionSize={2.5}
        sectionThickness={1}
        sectionColor="#5a3115"
        fadeDistance={24}
        fadeStrength={1.6}
        infiniteGrid
      />
    </>
  );
}

export default function StageScene({ auto = true, bloom = true, mode = 'hero' }: { auto?: boolean; bloom?: boolean; mode?: Mode }) {
  const dprRef = useRef<[number, number]>([1, 1.75]);
  useEffect(() => {
    const move = (e: PointerEvent) => {
      sceneState.px = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', move, { passive: true });
    if (mode === 'assembly') sceneState.assemble = 1;
    return () => window.removeEventListener('pointermove', move);
  }, [mode]);

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
        <Content auto={auto} mode={mode} />
        {bloom && (
          <EffectComposer multisampling={0}>
            <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.95} luminanceSmoothing={0.2} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
