"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { MathUtils } from "three";

interface HeroDepthCanvasProps {
  active: boolean;
  onDegrade: () => void;
}

function ArchitecturalAperture({ active }: { active: boolean }) {
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!active || !groupRef.current) return;
    const progress = MathUtils.clamp(
      window.scrollY / Math.max(window.innerHeight, 1),
      0,
      1,
    );
    groupRef.current.rotation.y = MathUtils.damp(
      groupRef.current.rotation.y,
      progress * -0.055,
      4,
      delta,
    );
    groupRef.current.rotation.x = MathUtils.damp(
      groupRef.current.rotation.x,
      state.pointer.y * 0.018,
      4,
      delta,
    );
  });

  const gold = "#d8be82";

  return (
    <group ref={groupRef} rotation={[0, -0.02, 0]}>
      <mesh position={[-1.16, 0.08, 0.12]} scale={[0.018, 2.1, 0.018]}>
        <boxGeometry />
        <meshBasicMaterial
          color={gold}
          opacity={0.42}
          transparent
          toneMapped={false}
        />
      </mesh>
      <mesh position={[-0.34, 1.12, -0.08]} scale={[1.65, 0.018, 0.018]}>
        <boxGeometry />
        <meshBasicMaterial
          color={gold}
          opacity={0.26}
          transparent
          toneMapped={false}
        />
      </mesh>
      <mesh position={[1.04, -0.2, 0.24]} scale={[0.012, 1.55, 0.012]}>
        <boxGeometry />
        <meshBasicMaterial
          color={gold}
          opacity={0.2}
          transparent
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0.44, -0.98, 0.04]} scale={[1.2, 0.012, 0.012]}>
        <boxGeometry />
        <meshBasicMaterial
          color={gold}
          opacity={0.32}
          transparent
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export function HeroDepthCanvas({ active, onDegrade }: HeroDepthCanvasProps) {
  return (
    <div className="adaptive-hero-media__canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 40 }}
        dpr={[1, 1.5]}
        frameloop={active ? "always" : "never"}
        fallback={null}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
        }}
      >
        <PerformanceMonitor
          flipflops={2}
          onDecline={onDegrade}
          bounds={(refreshRate) => (refreshRate > 90 ? [45, 90] : [35, 60])}
        />
        <ArchitecturalAperture active={active} />
      </Canvas>
    </div>
  );
}
