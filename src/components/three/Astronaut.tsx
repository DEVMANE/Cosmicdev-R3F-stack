"use client";

import React, { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";

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

const MODEL_PATH = "/models/super_starfury.glb";

type Props = {
  onPositionChange?: (pos: THREE.Vector3) => void;
};

const Astronaut: React.FC<Props> = ({ onPositionChange }) => {
  const group = useRef<THREE.Group>(null);
  const velocity = useRef(new THREE.Vector3());
  const { camera } = useThree();

  const gltf = useGLTF(MODEL_PATH) as GLTF;
  const ship = React.useMemo(() => {
    const cloned = gltf.scene.clone(true);
    cloned.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
    return cloned;
  }, [gltf.scene]);

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

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;

    const accel = 250;
    const damping = 6;
    const turnSpeed = 2.2;
    const maxSpeed = 150;

    if (controls.left) g.rotation.y += turnSpeed * dt;
    if (controls.right) g.rotation.y -= turnSpeed * dt;

    const forwardDir = new THREE.Vector3(0, 0, -1).applyQuaternion(g.quaternion);
    const upDir = new THREE.Vector3(0, 1, 0);

    const dv = new THREE.Vector3();
    if (controls.forward) dv.add(forwardDir);
    if (controls.back) dv.add(forwardDir.clone().multiplyScalar(-1));
    if (controls.up) dv.add(upDir);
    if (controls.down) dv.add(upDir.clone().multiplyScalar(-1));
    if (dv.lengthSq() > 0) {
      dv.normalize().multiplyScalar(accel * dt);
      velocity.current.add(dv);
    }

    const speed = velocity.current.length();
    if (speed > maxSpeed) {
      velocity.current.normalize().multiplyScalar(maxSpeed);
    }

    const dampFactor = Math.exp(-damping * dt);
    velocity.current.multiplyScalar(dampFactor);

    g.position.addScaledVector(velocity.current, dt);

    g.rotation.z = Math.sin(performance.now() * 0.002) * 0.05;

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
      <primitive object={ship} scale={0.18} rotation={[0, Math.PI, 0]} />
      <pointLight color={"#22d3ee"} intensity={0.9} distance={12} position={[0, 1.2, 1.4]} />
    </group>
  );
};

useGLTF.preload(MODEL_PATH);

export default Astronaut;