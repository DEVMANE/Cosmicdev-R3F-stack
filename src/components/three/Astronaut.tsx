"use client";

import React, { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
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

const MODEL_PATH = "/models/super_starfury.glb";

type Props = {
  onPositionChange?: (pos: THREE.Vector3) => void;
  virtualControls?: {
    forward: boolean;
    back: boolean;
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
  };
};

const Astronaut: React.FC<Props> = ({ onPositionChange, virtualControls }) => {
  const group = useRef<THREE.Group>(null);
  const velocity = useRef(new THREE.Vector3());
  const { camera, gl } = useThree();

  const gltf = useGLTF(MODEL_PATH) as any;
  const ship = React.useMemo(() => {
    const cloned = gltf.scene.clone(true);
    cloned.traverse((obj: any) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
    return cloned;
  }, [gltf.scene]);

  const [keyboardControls, setKeyboardControls] = useState<Controls>({
    forward: false,
    back: false,
    left: false,
    right: false,
    up: false,
    down: false,
  });
  
  // Combine all control sources
  const controls = {
    forward: keyboardControls.forward || (virtualControls?.forward ?? false),
    back: keyboardControls.back || (virtualControls?.back ?? false),
    left: keyboardControls.left || (virtualControls?.left ?? false),
    right: keyboardControls.right || (virtualControls?.right ?? false),
    up: keyboardControls.up || (virtualControls?.up ?? false),
    down: keyboardControls.down || (virtualControls?.down ?? false),
  };

  // Camera orbit/zoom state (right-click to orbit, wheel to zoom)
  const camCtrl = useRef({
    orbiting: false,
    lastX: 0,
    lastY: 0,
    theta: 0, // azimuth around Y
    phi: 1.05, // polar from Y+, ~60deg
    dist: 12, // base distance from ship
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const k = KEYMAP[e.code];
      if (k) setKeyboardControls((c: Controls) => ({ ...c, [k]: true }));
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const k = KEYMAP[e.code];
      if (k) setKeyboardControls((c: Controls) => ({ ...c, [k]: false }));
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    const handleGamepadConnected = (event: Event) => {
      const e = event as GamepadEvent;
      console.log(`Gamepad ${e.gamepad.index} connected!`);
    };

    const handleGamepadDisconnected = (event: Event) => {
      const e = event as GamepadEvent;
      console.log(`Gamepad ${e.gamepad.index} disconnected.`);
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    let previousButtons: boolean[][] = [];
    let previousAxes: number[][] = [];

    const pollGamepads = () => {
      const gamepads = navigator.getGamepads();
      for (let i = 0; i < gamepads.length; i++) {
        const gamepad = gamepads[i];
        if (gamepad) {
          if (!previousButtons[i]) previousButtons[i] = [];
          if (!previousAxes[i]) previousAxes[i] = [];
          gamepad.buttons.forEach((button, buttonIndex) => {
            const wasPressed = previousButtons[i][buttonIndex] || false;
            if (button.pressed && !wasPressed) {
              // Map buttons to controls
              if (buttonIndex === 0) setKeyboardControls(c => ({ ...c, forward: true }));
              else if (buttonIndex === 1) setKeyboardControls(c => ({ ...c, back: true }));
              else if (buttonIndex === 2) setKeyboardControls(c => ({ ...c, left: true }));
              else if (buttonIndex === 3) setKeyboardControls(c => ({ ...c, right: true }));
              else if (buttonIndex === 4) setKeyboardControls(c => ({ ...c, up: true }));
              else if (buttonIndex === 5) setKeyboardControls(c => ({ ...c, down: true }));
            } else if (!button.pressed && wasPressed) {
              if (buttonIndex === 0) setKeyboardControls(c => ({ ...c, forward: false }));
              else if (buttonIndex === 1) setKeyboardControls(c => ({ ...c, back: false }));
              else if (buttonIndex === 2) setKeyboardControls(c => ({ ...c, left: false }));
              else if (buttonIndex === 3) setKeyboardControls(c => ({ ...c, right: false }));
              else if (buttonIndex === 4) setKeyboardControls(c => ({ ...c, up: false }));
              else if (buttonIndex === 5) setKeyboardControls(c => ({ ...c, down: false }));
            }
            previousButtons[i][buttonIndex] = button.pressed;
          });
          gamepad.axes.forEach((axis, axisIndex) => {
            const prev = previousAxes[i][axisIndex] || 0;
            if (Math.abs(axis - prev) > 0.1) {
              // Map axes to controls
              if (axisIndex === 0) { // left stick X
                if (axis < -0.5) setKeyboardControls(c => ({ ...c, left: true, right: false }));
                else if (axis > 0.5) setKeyboardControls(c => ({ ...c, right: true, left: false }));
                else setKeyboardControls(c => ({ ...c, left: false, right: false }));
              } else if (axisIndex === 1) { // left stick Y
                if (axis < -0.5) setKeyboardControls(c => ({ ...c, forward: true, back: false }));
                else if (axis > 0.5) setKeyboardControls(c => ({ ...c, back: true, forward: false }));
                else setKeyboardControls(c => ({ ...c, forward: false, back: false }));
              } else if (axisIndex === 2) { // right stick X for rotation
                // For rotation, perhaps adjust turn
                // But since controls are boolean, maybe map to left/right
                if (axis < -0.5) setKeyboardControls(c => ({ ...c, left: true }));
                else if (axis > 0.5) setKeyboardControls(c => ({ ...c, right: true }));
                else setKeyboardControls(c => ({ ...c, left: false, right: false }));
              } else if (axisIndex === 3) { // right stick Y for up/down
                if (axis < -0.5) setKeyboardControls(c => ({ ...c, up: true, down: false }));
                else if (axis > 0.5) setKeyboardControls(c => ({ ...c, down: true, up: false }));
                else setKeyboardControls(c => ({ ...c, up: false, down: false }));
              }
            }
            previousAxes[i][axisIndex] = axis;
          });
        }
      }
    };

    // Use different polling intervals for desktop and mobile
    const isMobile = window.innerWidth < 768;
    const pollInterval = isMobile ? 200 : 100; // Poll less frequently on mobile to save battery
    const interval = setInterval(pollGamepads, pollInterval);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const el = gl.domElement;

    const onContextMenu = (e: MouseEvent) => {
      // prevent browser context menu on right click within the canvas
      e.preventDefault();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button === 2) {
        // right mouse button
        camCtrl.current.orbiting = true;
        camCtrl.current.lastX = e.clientX;
        camCtrl.current.lastY = e.clientY;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!camCtrl.current.orbiting) return;
      const dx = e.clientX - camCtrl.current.lastX;
      const dy = e.clientY - camCtrl.current.lastY;
      camCtrl.current.lastX = e.clientX;
      camCtrl.current.lastY = e.clientY;

      const ROT_SPEED = 0.005;
      camCtrl.current.theta -= dx * ROT_SPEED;
      camCtrl.current.phi = THREE.MathUtils.clamp(
        camCtrl.current.phi - dy * ROT_SPEED,
        0.1,
        Math.PI - 0.1
      );
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.button === 2) {
        camCtrl.current.orbiting = false;
      }
    };

    const onWheel = (e: WheelEvent) => {
      // zoom in/out around the spaceship
      e.preventDefault();
      const delta = Math.sign(e.deltaY);
      const speed = 1.0;
      camCtrl.current.dist = THREE.MathUtils.clamp(
        camCtrl.current.dist + delta * speed,
        4,
        40
      );
    };

    el.addEventListener("contextmenu", onContextMenu);
    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("contextmenu", onContextMenu);
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      // cast to EventListener to satisfy TS on cleanup
      el.removeEventListener("wheel", onWheel as unknown as EventListener);
    };
  }, [gl]);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;

    // movement controls
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

    // subtle wobble
    g.rotation.z = Math.sin(performance.now() * 0.002) * 0.05;

    // camera control
    const s = camCtrl.current;

    if (s.orbiting) {
      // orbit camera around ship using spherical coordinates
      const offset = new THREE.Vector3().setFromSphericalCoords(s.dist, s.phi, s.theta);
      const camPos = g.position.clone().add(offset);
      camera.position.lerp(camPos, 0.12);
      camera.lookAt(g.position);
    } else {
      // chase camera behind ship with zoom-aware distance
      const dist = s.dist;
      const upOffset = Math.max(2, dist * 0.35);
      const backOffset = Math.max(4, dist);

      const back = forwardDir.clone().multiplyScalar(-backOffset);
      const camPos = g.position.clone().add(back).add(new THREE.Vector3(0, upOffset, 0));
      camera.position.lerp(camPos, 0.12);
      camera.lookAt(g.position);

      // keep spherical aligned with current camera so orbit starts from current view
      const dir = camPos.clone().sub(g.position);
      const spherical = new THREE.Spherical().setFromVector3(dir);
      s.theta = spherical.theta;
      s.phi = THREE.MathUtils.clamp(spherical.phi, 0.1, Math.PI - 0.1);
    }

    onPositionChange?.(g.position);
  });

  return (
    <group ref={group} position={[0,15, 100]}>
      <primitive object={ship} scale={0.0025} rotation={[0, Math.PI, 0]} />
      {/* local glow on the ship */}
      <pointLight castShadow color={"#22d3ee"} intensity={2.4} distance={28} position={[0, 1.2, 1.4]} />
      {/* additional fill lights to brighten the ship */}
      <pointLight color={"#a5f3fc"} intensity={3.5} distance={102} position={[0, 0.6, -1.2]} />
      <hemisphereLight color={"#b3e1ff"} groundColor={"#0b1220"} intensity={0.5} />
    </group>
  );
};

useGLTF.preload(MODEL_PATH);

export default Astronaut;