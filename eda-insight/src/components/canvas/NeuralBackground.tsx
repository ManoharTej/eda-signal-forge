"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useRef, useMemo, useState } from "react";
import * as THREE from "three";

function WaveParticles() {
  const ref = useRef<THREE.Points>(null!);
  const [hovered, setHovered] = useState(false);
  
  // Create 3,000 points in 3D space
  const count = 3000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;     // X axis
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15; // Y axis
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10; // Z axis
    }
    return pos;
  }, []);

  // This runs 60 times per second to animate the "wave"
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.05;
    ref.current.rotation.x = Math.sin(t * 0.3) * 0.1;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#3b82f6" // Electric Blue
        size={0.012}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function NeuralBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#020617]">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <WaveParticles />
      </Canvas>
    </div>
  );
}