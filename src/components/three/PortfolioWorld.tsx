"use client";

import React from "react";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import Planet from "./Planet";
import Astronaut from "./Astronaut";
import InfoPanel from "@/components/overlay/InfoPanel";
import LinkedInModal from "@/components/overlay/LinkedInModal";
import { sections } from "@/data/portfolio";
import type { SectionId } from "@/data/portfolio";

const Sun: React.FC<{ onActivate: () => void }> = ({ onActivate }) => {
  const [hovered, setHovered] = React.useState(false);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onActivate();
  };

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(false);
    document.body.style.cursor = "";
  };

  return (
    <group
      scale={hovered ? 1.08 : 1}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <mesh>
        <sphereGeometry args={[4.5, 64, 64]} />
        <meshStandardMaterial
          color={"#f59e0b"}
          emissive={"#f59e0b"}
          emissiveIntensity={hovered ? 2.2 : 1.5}
          metalness={0.1}
          roughness={0.5}
        />
      </mesh>
      <mesh scale={1.3}>
        <sphereGeometry args={[4.5, 32, 32]} />
        <meshBasicMaterial color={"#fde047"} transparent opacity={hovered ? 0.9 : 0.7} />
      </mesh>
      <pointLight color={"#ffd27a"} intensity={2.3} distance={120} />
    </group>
  );
};

const Instructions: React.FC = () => (
  <div className="pointer-events-none absolute bottom-4 left-1/2 z-30 w-[92vw] max-w-xl -translate-x-1/2 rounded-lg border border-cyan-400/60 bg-black/40 px-4 py-2 text-center text-xs text-cyan-100 backdrop-blur-md shadow-[0_0_22px_rgba(34,211,238,0.45)]">
    <p>
      WASD to cruise, Space to ascend, Shift to descend. Click a planet to explore, and tap the sun or badge to view the LinkedIn profile.
    </p>
  </div>
);

const PortfolioWorld: React.FC = () => {
  const [openId, setOpenId] = React.useState<SectionId | null>(null);
  const [linkedInOpen, setLinkedInOpen] = React.useState(false);

  const planetDefs = React.useMemo(() => {
    const radiusBase = 22;
    const step = 14;
    const colorPalette = ["#67e8f9", "#a78bfa", "#34d399", "#f472b6", "#f59e0b"];
    return sections.map((s, i) => {
      const r = radiusBase + i * step;
      const angle = (i / sections.length) * Math.PI * 2 + Math.PI / 6;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = (i % 2 === 0 ? 1 : -1) * (2 + i);
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
        <Stars radius={300} depth={60} count={8000} factor={8} fade speed={0.6} />
        <ambientLight intensity={0.15} />

        <Sun onActivate={() => setLinkedInOpen(true)} />

        <Html position={[0, 8, 0]} center style={{ pointerEvents: "auto" }}>
          <button
            type="button"
            onClick={() => setLinkedInOpen(true)}
            className="rounded-full border border-cyan-400/70 bg-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-50 shadow-[0_0_22px_rgba(34,211,238,0.6)] transition hover:scale-105 hover:text-cyan-100"
          >
            The Cosmic Dev
          </button>
        </Html>

        {planetDefs.map((p, idx) => (
          <mesh key={`orbit-${idx}`} rotation-x={Math.PI / 2} position={[0, 0, 0]}>
            <ringGeometry
              args={[
                Math.hypot(p.position[0], p.position[2]) - 0.05,
                Math.hypot(p.position[0], p.position[2]) + 0.05,
                128,
              ]}
            />
            <meshBasicMaterial color={"#22d3ee"} opacity={0.2} transparent />
          </mesh>
        ))}

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

        <Astronaut onPositionChange={() => {}} />
      </Canvas>

      <Instructions />
      <InfoPanel openId={openId ?? undefined} onClose={() => setOpenId(null)} />
      <LinkedInModal open={linkedInOpen} onClose={() => setLinkedInOpen(false)} />

      <div className="pointer-events-none absolute top-4 left-1/2 z-30 -translate-x-1/2 text-center">
        <h1 className="text-lg font-bold tracking-wide text-cyan-100 drop-shadow-[0_0_20px_rgba(34,211,238,0.7)] sm:text-2xl">
          Pirapat Thananopparit — Cosmic Portfolio
        </h1>
      </div>
    </div>
  );
};

export default PortfolioWorld;