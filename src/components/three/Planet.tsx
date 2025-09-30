"use client";

import React, { useMemo, useState } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";

type Props = {
  sectionId: string;
  name: string;
  position: [number, number, number];
  radius?: number;
  color?: string;
  onSelect: (id: string) => void;
};

const Planet: React.FC<Props> = ({ sectionId, name, position, onSelect, radius = 2, color = "#6ee7b7" }) => {
  const [hovered, setHovered] = useState(false);

  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color,
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.2,
      metalness: 0.2,
      roughness: 0.6,
    });
    return m;
  }, [color]);

  return (
    <group position={position}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(sectionId);
        }}
        scale={hovered ? 1.15 : 1}
        castShadow
        receiveShadow
        material={material}
      >
        <sphereGeometry args={[radius, 48, 48]} />
      </mesh>
      {hovered && (
        <Html
          distanceFactor={10}
          position={[0, radius + 1.2, 0]}
          center
          style={{
            pointerEvents: "none",
          }}
        >
          <div
            className="rounded-md border border-cyan-400/40 bg-black/40 px-3 py-1 text-xs text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.35)]"
            style={{
              transform: "scale(7.5)",
              transition: "transform 0.15s ease-out",
            }}
          >
            {name}
          </div>
        </Html>
      )}
    </group>
  );
};

export default Planet;