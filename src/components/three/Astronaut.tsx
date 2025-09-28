"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type Controls = {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
};

const KEYMAP: Record<string, keyof Controls> = {
  KeyW: "forward",
  ArrowUp: "forward",
  KeyS: "back",
  ArrowDown: "back",
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
  Space: "up",
  ShiftLeft: "down",
  ShiftRight: "down",
};

type Props = {
  onPositionChange?: (pos: THREE.Vector3) => void;
};

const Astronaut: React.FC<Props> = ({ onPositionChange }) => {
  const group = useRef<THREE.Group>(null);
  const velocity = useRef(new THREE.Vector3());
  const { camera } = useThree();

  const [controls, setControls] = useState<Controls>({
    forward: false,
    back: false,
    left: false,
    right: false,
    up: false,
    down: false,
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const k = KEYMAP[e.code];
      if (k) setControls((c) => ({ ...c, [k]: true }));
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const k = KEYMAP[e.code];
      if (k) setControls((c) => ({ ...c, [k]: false }));
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const materials = useMemo(() => {
    return {
      suit: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#9ca3af"),
        metalness: 0.3,
        roughness: 0.6,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#06b6d4"),
        roughness: 0.05,
        metalness: 0.2,
        transmission: 0.6,
        thickness: 0.6,
        emissive: new THREE.Color("#22d3ee"),
        emissiveIntensity: 0.2,
      }),
      accents: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#22d3ee"),
        emissive: new THREE.Color("#22d3ee"),
        emissiveIntensity: 0.6,
        metalness: 0.7,
        roughness: 0.3,
      }),
    };
  }, []);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;

    // Movement constants
    const accel = 25;
    const damping = 6;
    const turnSpeed = 2.2;
    const maxSpeed = 15;

    // Rotation (left/right turn)
    if (controls.left) g.rotation.y += turnSpeed * dt;
    if (controls.right) g.rotation.y -= turnSpeed * dt;

    // Local axes
    const forwardDir = new THREE.Vector3(0, 0, -1).applyQuaternion(g.quaternion);
    const upDir = new THREE.Vector3(0, 1, 0);

    // Acceleration
    const dv = new THREE.Vector3();
    if (controls.forward) dv.add(forwardDir);
    if (controls.back) dv.add(forwardDir.clone().multiplyScalar(-1));
    if (controls.up) dv.add(upDir);
    if (controls.down) dv.add(upDir.clone().multiplyScalar(-1));
    if (dv.lengthSq() > 0) {
      dv.normalize().multiplyScalar(accel * dt);
      velocity.current.add(dv);
    }

    // Clamp speed
    const speed = velocity.current.length();
    if (speed > maxSpeed) {
      velocity.current.normalize().multiplyScalar(maxSpeed);
    }

    // Apply damping
    const dampFactor = Math.exp(-damping * dt);
    velocity.current.multiplyScalar(dampFactor);

    // Integrate position
    g.position.addScaledVector(velocity.current, dt);

    // Animate a subtle bob
    g.rotation.z = Math.sin(performance.now() * 0.002) * 0.05;

    // Camera follow (third-person offset behind and above)
    const backOffset = 10;
    const upOffset = 4;
    const back = forwardDir.clone().multiplyScalar(-backOffset);
    const camPos = g.position.clone().add(back).add(new THREE.Vector3(0, upOffset, 0));
    camera.position.lerp(camPos, 0.12);
    camera.lookAt(g.position);

    onPositionChange?.(g.position);
  });

  return (
    <group ref={group} position={[0, 2, 20]}>
      {/* Body */}
      <mesh material={materials.suit} castShadow>
        <capsuleGeometry args={[0.7, 1.6, 8, 16]} />
      </mesh>
      {/* Helmet */}
      <mesh material={materials.glass} position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.85, 32, 32]} />
      </mesh>
      {/* Backpack */}
      <mesh material={materials.suit} position={[0, 0.3, 0.8]} castShadow>
        <boxGeometry args={[0.9, 1.2, 0.4]} />
      </mesh>
      {/* Neon accents */}
      <mesh material={materials.accents} position={[0.4, 0.2, 0.1]}>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
      </mesh>
      <mesh material={materials.accents} position={[-0.4, 0.2, 0.1]}>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
      </mesh>

      {/* Local headlight */}
      <pointLight color={"#22d3ee"} intensity={0.9} distance={12} position={[0, 1.2, 1.4]} />
    </group>
  );
};

export default Astronaut;