'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei';
import { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';

function FloatingStructure({
  position,
  scale = 1,
  color,
  speed = 1,
}: {
  position: [number, number, number];
  scale?: number;
  color: string;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15 * speed;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 * speed;
  });

  return (
    <Float speed={1.5 * speed} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={color}
          distort={0.3}
          speed={1.5}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>
    </Float>
  );
}

function Particles({ count = 80 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      pointsRef.current.rotation.x = state.mouse.y * 0.05;
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
      <pointsMaterial size={0.04} color="#3b82f6" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <pointLight position={[-5, -3, -5]} intensity={0.4} color="#06b6d4" />
      <FloatingStructure position={[-3, 1, -2]} scale={1.2} color="#3b82f6" speed={0.8} />
      <FloatingStructure position={[3, -1, -3]} scale={0.9} color="#06b6d4" speed={1.2} />
      <FloatingStructure position={[0, 2, -4]} scale={0.6} color="#0891b2" speed={1} />
      <FloatingStructure position={[2.5, 1.5, -2]} scale={0.4} color="#2563eb" speed={1.4} />
      <Particles count={60} />
      <Environment preset="city" />
    </>
  );
}

export function SpatialScene({ className = '' }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
