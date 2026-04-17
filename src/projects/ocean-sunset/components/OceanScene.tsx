import { useRef } from "react";
import { useFrame, extend, Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { WaveShaderMaterial } from "./wave-shader-material";
import * as THREE from "three";

extend({ WaveShaderMaterial });

function OceanMesh() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      (materialRef.current as any).uTime = clock.getElapsedTime();
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 10, 128, 128]} />
      {/* @ts-expect-error - custom shader material */}
      <waveShaderMaterial ref={materialRef} side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function OceanScene() {
  return (
    <Canvas camera={{ position: [0, 5, 5], fov: 45 }}>
      <OrbitControls makeDefault />
      <ambientLight intensity={0.5} />
      <OceanMesh />
    </Canvas>
  );
}
