"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import Planet from "./Planet";
import Astronaut from "./Astronaut";
import InfoPanel from "@/components/overlay/InfoPanel";
import { sections } from "@/data/portfolio";
import type { SectionId } from "@/data/portfolio";

const Sun: React.FC = () => {
  const glow = new THREE.MeshBasicMaterial({ color: new THREE.Color("#fde047") });
  return (
    <group>
      <mesh>
        <sphereGeometry args={[4.5, 64, 64]} />
        <meshStandardMaterial
          color={"#f59e0b"}
          emissive={"#f59e0b"}
          emissiveIntensity={1.5}
          metalness={0.1}
          roughness={0.5}
        />
      </mesh>
      <mesh scale={1.3} material={glow}>
        <sphereGeometry args={[4.5, 32, 32]} />
      </mesh>
      <pointLight color={"#ffd27a"} intensity={2.3} distance={120} />
    </group>
  );
};

const Instructions: React.FC = () => (
  <div className="pointer-events-none absolute bottom-4 left-1/2 z-30 w-[92vw] max-w-xl -translate-x-1/2 rounded-lg border border-cyan-400/30 bg-black/40 px-4 py-2 text-center text-xs text-cyan-100 backdrop-blur-md shadow-[0_0_16px_rgba(34,211,238,0.25)]">
    <p>
      Explore the cosmic portfolio — WASD to move, Space to ascend, Shift to descend. Click a planet to open its section. Press Esc or click outside to close.
    </p>
  </div>
);

const PortfolioWorld: React.FC = () => {
  const [openId, setOpenId] = React.useState<SectionId | null>(null);

  // Arrange planets around the sun in a circle
  const planetDefs = React.useMemo(() => {
    const radiusBase = 22;
    const step = 14;
    const colorPalette = ["#67e8f9", "#a78bfa", "#34d399", "#f472b6", "#f59e0b"];
    return sections.map((s, i) => {
      const r = radiusBase + i * step;
      const angle = (i / sections.length) * Math.PI * 2 + Math.PI / 6;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = (i % 2 === 0 ? 1 : -1) * (2 + i); // slight vertical variance
      return {
        id: s.id,
        name: s.name,
        position: [x, y, z] as [number, number, number],
        radius: 2 + 0.5 * i,
        color: colorPalette[i % colorPalette.length],
      };
    });
  }, []);

  return (
    <div className="relative h-screen w-screen">
      <Canvas
        shadows
        camera={{ position: [0, 6, 26], fov: 55 }}
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color("#050510"), 1);
        }}
      >
        {/* Space background */}
        <Stars radius={300} depth={60} count={8000} factor={8} fade speed={0.6} />

        {/* Soft ambient */}
        <ambientLight intensity={0.15} />

        {/* Sun and center marker */}
        <Sun />
        <Html position={[0, 8, 0]} center>
          <div className="rounded-md border border-yellow-300/30 bg-black/40 px-3 py-1 text-xs text-yellow-200 backdrop-blur-sm">
            The Cosmic Dev
          </div>
        </Html>

        {/* Orbits (decorative) */}
        {planetDefs.map((p, idx) => (
          <mesh key={`orbit-${idx}`} rotation-x={Math.PI / 2} position={[0, 0, 0]}>
            <ringGeometry args={[Math.hypot(p.position[0], p.position[2]) - 0.05, Math.hypot(p.position[0], p.position[2]) + 0.05, 128]} />
            <meshBasicMaterial color={"#22d3ee"} opacity={0.15} transparent />
          </mesh>
        ))}

        {/* Planets */}
        {planetDefs.map((p) => (
          <Planet
            key={p.id}
            sectionId={p.id}
            name={p.name}
            position={p.position}
            radius={p.radius}
            color={p.color}
            onSelect={(id) => setOpenId(id as SectionId)}
          />
        ))}

        {/* Astronaut controller */}
        <Astronaut onPositionChange={() => {}} />
      </Canvas>

      {/* Overlays */}
      <Instructions />
      <InfoPanel openId={openId ?? undefined} onClose={() => setOpenId(null)} />

      {/* Title watermark */}
      <div className="pointer-events-none absolute top-4 left-1/2 z-30 -translate-x-1/2 text-center">
        <h1 className="text-lg sm:text-2xl font-bold tracking-wide text-cyan-200 drop-shadow-[0_0_12px_rgba(34,211,238,0.45)]">
          Pirapat Thananopparit — Cosmic Portfolio
        </h1>
      </div>
    </div>
  );
};

export default PortfolioWorld;