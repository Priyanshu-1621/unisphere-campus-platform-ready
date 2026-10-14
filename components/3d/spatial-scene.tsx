'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';

type BuildingSpec = {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
};

const campusBuildings: BuildingSpec[] = [
  { position: [-4.5, -0.5, -3], size: [1.8, 3.5, 1.8], color: '#1e3a5f', emissive: '#3b82f6', emissiveIntensity: 0.08 },
  { position: [-2.5, 0, -4.5], size: [2.2, 2.8, 2.2], color: '#1a2f4a', emissive: '#06b6d4', emissiveIntensity: 0.06 },
  { position: [0.5, -0.3, -5], size: [3, 4.2, 2.5], color: '#152840', emissive: '#0891b2', emissiveIntensity: 0.1 },
  { position: [3.5, 0.2, -3.5], size: [2, 3, 2], color: '#1d3556', emissive: '#2563eb', emissiveIntensity: 0.07 },
  { position: [5, -0.8, -5.5], size: [1.5, 2, 1.5], color: '#162d45', emissive: '#3b82f6', emissiveIntensity: 0.05 },
  { position: [-5.5, -1, -6], size: [1.2, 1.5, 1.2], color: '#142436', emissive: '#06b6d4', emissiveIntensity: 0.04 },
];

function CampusBuilding({ spec, index }: { spec: BuildingSpec; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y = spec.position[1] + Math.sin(t * 0.3 + index) * 0.04;
  });

  return (
    <mesh ref={meshRef} position={spec.position}>
      <boxGeometry args={spec.size} />
      <meshStandardMaterial
        color={spec.color}
        emissive={spec.emissive || '#000000'}
        emissiveIntensity={spec.emissiveIntensity || 0}
        roughness={0.7}
        metalness={0.3}
        transparent
        opacity={0.92}
      />
      {/* Edge wireframe for architectural feel */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(...spec.size)]} />
        <lineBasicMaterial color={spec.emissive || '#3b82f6'} transparent opacity={0.35} />
      </lineSegments>
    </mesh>
  );
}

function GroundPlane() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
      <planeGeometry args={[40, 40, 1, 1]} />
      <meshStandardMaterial
        color="#0a1628"
        roughness={0.9}
        metalness={0.1}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

function FloatingParticles({ count = 40 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = Math.random() * 8 - 2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.position.x = state.mouse.x * 0.3;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#3b82f6" transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

function GlowingOrb() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = 3.5 + Math.sin(t * 0.4) * 0.3;
    ref.current.position.x = Math.cos(t * 0.15) * 2;
  });

  return (
    <Float speed={1} rotationIntensity={0} floatIntensity={0.5}>
      <mesh ref={ref} position={[0, 3.5, -2]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

function CameraRig() {
  useFrame((state) => {
    const x = state.mouse.x * 0.4;
    const y = state.mouse.y * 0.2;
    state.camera.position.x += (x - state.camera.position.x) * 0.03;
    state.camera.position.y += (y + 1 - state.camera.position.y) * 0.03;
    state.camera.lookAt(0, 0, -3);
  });
  return null;
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 8, 3]} intensity={0.4} color="#3b82f6" />
      <pointLight position={[-5, 2, -3]} intensity={0.5} color="#06b6d4" />
      <pointLight position={[4, 3, -2]} intensity={0.3} color="#2563eb" />
      <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={0.3} color="#0891b2" />
      {campusBuildings.map((spec, i) => (
        <CampusBuilding key={i} spec={spec} index={i} />
      ))}
      <GroundPlane />
      <FloatingParticles count={40} />
      <GlowingOrb />
      <CameraRig />
      <Environment preset="night" />
    </>
  );
}

export function SpatialScene({ className = '' }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 1, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
