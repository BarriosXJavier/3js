import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh, PointLight } from "three";

export default function Moon() {
  const meshRef = useRef<Mesh>(null);
  const lightRef = useRef<PointLight>(null);

  useFrame((_state, delta) => {
    if (meshRef.current && meshRef.current.position.y < 5) {
      meshRef.current.position.y += 0.5 * delta;
      if (lightRef.current) {
        lightRef.current.position.y = meshRef.current.position.y;
      }
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={[0, -8, -10]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial 
          color="#ffffd0" 
          emissive="#ffffe0"
          emissiveIntensity={1}
        />
      </mesh>
      <pointLight 
        ref={lightRef}
        position={[0, -8, -10]}
        intensity={200} 
        distance={100} 
        color="#ffffd0" 
        castShadow
      />
    </group>
  );
}
