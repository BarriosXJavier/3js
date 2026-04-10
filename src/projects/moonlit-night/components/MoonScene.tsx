import { useRef } from "react";
import * as THREE from "three";
import Moon from "./Moon";
import Cloud from "./Cloud";
import Stars from "./Stars";
import Ground from "./Ground";
import { Canvas } from "@react-three/fiber";

export default function MoonScene() {
  const moonPosRef = useRef(new THREE.Vector3(0, -12, -60));

  return (
    <div className="w-full h-screen bg-slate-950">
      <Canvas camera={{ position: [0, 1, 15], fov: 50 }} shadows>
        {/* Dark night sky gradient */}
        <color attach="background" args={["#050510"]} />
        <fog attach="fog" args={["#0a0a18", 100, 500]} />

        <Stars />
        <Moon moonPosRef={moonPosRef} />
        <Ground />

        {/* Clouds behind mountains - z < -240 */}
        <Cloud
          startPos={[-15, 4, -250]}
          speed={0.3}
          scale={3.5}
          moonPosRef={moonPosRef}
        />
        <Cloud
          startPos={[-5, 3, -255]}
          speed={0.4}
          scale={3.0}
          moonPosRef={moonPosRef}
        />
        <Cloud
          startPos={[8, 2.5, -260]}
          speed={0.35}
          scale={3.8}
          moonPosRef={moonPosRef}
        />
        <Cloud
          startPos={[12, 4.5, -245]}
          speed={0.5}
          scale={2.8}
          moonPosRef={moonPosRef}
        />
        <Cloud
          startPos={[-8, 5, -258]}
          speed={0.45}
          scale={3.3}
          moonPosRef={moonPosRef}
        />
        <Cloud
          startPos={[3, 3.8, -262]}
          speed={0.25}
          scale={4.0}
          moonPosRef={moonPosRef}
        />
        <ambientLight intensity={0.03} />
      </Canvas>
    </div>
  );
}
