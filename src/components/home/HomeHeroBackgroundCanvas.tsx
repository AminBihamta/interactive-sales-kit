"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 180;
const GYRO_SENSITIVITY = 18;
const POINTER_PARALLAX = 0.3;
const GYRO_PARALLAX = 1.1;
const PARALLAX_LERP = 0.07;
const MAX_PARALLAX = 1.6;

function bubbleDepthFactor(z: number) {
  return 0.5 + ((z + 2) / 4) * 1.0;
}

type ParallaxInput = {
  x: number;
  y: number;
  pointerTx: number;
  pointerTy: number;
  gyroTx: number;
  gyroTy: number;
};

function useParallaxInput() {
  const input = useRef<ParallaxInput>({
    x: 0,
    y: 0,
    pointerTx: 0,
    pointerTy: 0,
    gyroTx: 0,
    gyroTy: 0,
  });
  const orientationEnabled = useRef(false);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      input.current.pointerTx = (e.clientX / window.innerWidth) * 2 - 1;
      input.current.pointerTy = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      input.current.gyroTx = THREE.MathUtils.clamp(
        e.gamma / GYRO_SENSITIVITY,
        -1,
        1,
      );
      input.current.gyroTy = THREE.MathUtils.clamp(
        (e.beta - 45) / GYRO_SENSITIVITY,
        -1,
        1,
      );
    };

    const enableOrientation = async () => {
      if (orientationEnabled.current) return;
      const OrientationEvent = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
        requestPermission?: () => Promise<PermissionState>;
      };
      if (typeof OrientationEvent.requestPermission === "function") {
        try {
          const state = await OrientationEvent.requestPermission();
          if (state !== "granted") return;
        } catch {
          return;
        }
      }
      window.addEventListener("deviceorientation", handleOrientation, {
        passive: true,
      });
      orientationEnabled.current = true;
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("touchstart", enableOrientation, {
      once: true,
      passive: true,
    });
    window.addEventListener("click", enableOrientation, { once: true });

    if (
      typeof (DeviceOrientationEvent as typeof DeviceOrientationEvent & {
        requestPermission?: () => Promise<PermissionState>;
      }).requestPermission !== "function"
    ) {
      window.addEventListener("deviceorientation", handleOrientation, {
        passive: true,
      });
      orientationEnabled.current = true;
    }

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("touchstart", enableOrientation);
      window.removeEventListener("click", enableOrientation);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return input;
}

function Particles({ input }: { input: ReturnType<typeof useParallaxInput> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const seeds = useMemo(() => {
    return Array.from({ length: COUNT }, () => ({
      x: (Math.random() - 0.5) * 8,
      y: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 4,
      speed: 0.2 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const white = new THREE.Color("#ffffff");
    const blue = new THREE.Color("#4E738A");
    for (let i = 0; i < COUNT; i++) {
      mesh.setColorAt(i, i % 3 === 0 ? blue : white);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, []);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;

    const targetX = THREE.MathUtils.clamp(
      input.current.pointerTx * POINTER_PARALLAX +
        input.current.gyroTx * GYRO_PARALLAX,
      -MAX_PARALLAX,
      MAX_PARALLAX,
    );
    const targetY = THREE.MathUtils.clamp(
      input.current.pointerTy * POINTER_PARALLAX +
        input.current.gyroTy * GYRO_PARALLAX,
      -MAX_PARALLAX,
      MAX_PARALLAX,
    );

    input.current.x = THREE.MathUtils.lerp(
      input.current.x,
      targetX,
      PARALLAX_LERP,
    );
    input.current.y = THREE.MathUtils.lerp(
      input.current.y,
      targetY,
      PARALLAX_LERP,
    );

    for (let i = 0; i < COUNT; i++) {
      const s = seeds[i];
      const depth = bubbleDepthFactor(s.z);
      dummy.position.set(
        s.x + input.current.x * depth,
        s.y +
          Math.sin(t * s.speed + s.phase) * 0.15 +
          input.current.y * depth,
        s.z,
      );
      dummy.scale.setScalar(0.025 + (i % 5) * 0.008);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial transparent opacity={0.12} toneMapped={false} />
    </instancedMesh>
  );
}

function Scene() {
  const input = useParallaxInput();
  return (
    <>
      <ambientLight intensity={0.5} />
      <Particles input={input} />
    </>
  );
}

export default function HomeHeroBackgroundCanvas() {
  return (
    <Canvas
      className="!h-full !w-full"
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true }}
    >
      <Scene />
    </Canvas>
  );
}
