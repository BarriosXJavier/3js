import { useMemo, useRef } from "react";
import * as THREE from "three";
import Moon from "./Moon";
import Cloud from "./Cloud";
import Stars from "./Stars";
import Ground from "./Ground";
import { Canvas } from "@react-three/fiber";

export default function MoonScene() {
  const moonPosRef = useRef(new THREE.Vector3(0, -15, -60));
  const horizonClouds = useMemo(() => {
    const clouds: Array<{
      startPos: [number, number, number];
      scale: number;
      speed: number;
      seed: number;
    }> = [];

    let x = -195;
    let seed = 1;

    while (x < 190) {
      const clusterNoise = Math.sin(seed * 0.91) * 0.5 + 0.5;
      const gapNoise = Math.cos(seed * 1.37) * 0.5 + 0.5;
      const scale = 1.9 + clusterNoise * 2.8;
      const y = 2 + Math.sin(seed * 1.12) * 1.4 + gapNoise * 2.3;
      const z = -250 - (Math.cos(seed * 0.78) * 0.5 + 0.5) * 90;
      const speed = 0.16 + gapNoise * 0.22;

      clouds.push({
        startPos: [x, y, z],
        scale,
        speed,
        seed,
      });

      const baseGap = 12 + gapNoise * 24;
      const extraGap = seed % 5 === 0 ? 24 + clusterNoise * 18 : 0;
      x += scale * 8 + baseGap + extraGap;
      seed += 1;
    }

    return clouds;
  }, []);

  return (
    <div className="w-full h-screen bg-slate-950">
      <Canvas camera={{ position: [0, 1, 15], fov: 50 }} shadows>
        {/* Dark night sky gradient */}
        <color attach="background" args={["#050510"]} />
        <fog attach="fog" args={["#0a0a18", 100, 500]} />

        <Stars />
        <Moon moonPosRef={moonPosRef} />
        <Ground />

        {/* Horizon clouds behind the mountain silhouette */}
        <ambientLight intensity={0.03} />
        {horizonClouds.map((cloud) => (
          <Cloud
            key={cloud.seed}
            startPos={cloud.startPos}
            speed={cloud.speed}
            scale={cloud.scale}
            seed={cloud.seed}
            wrapRange={[-220, 220]}
            moonPosRef={moonPosRef}
          />
        ))}
      </Canvas>
    </div>
  );
}
