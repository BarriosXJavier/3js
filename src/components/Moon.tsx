import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Mesh, PointLight, DirectionalLight } from "three";

interface MoonProps {
  moonPosRef?: React.RefObject<THREE.Vector3>;
}

export default function Moon({ moonPosRef }: MoonProps) {
  const meshRef = useRef<Mesh>(null);
  const pointLightRef = useRef<PointLight>(null);
  const directionalLightRef = useRef<DirectionalLight>(null);
  const glowRef = useRef<Mesh>(null);

  const initialY = -20;
  const initialZ = -280;

  useFrame((_state, delta) => {
    if (meshRef.current && meshRef.current.position.y < 30) {
      meshRef.current.position.y += 1.5 * delta;

      if (pointLightRef.current) {
        pointLightRef.current.position.y = meshRef.current.position.y;
      }
      if (glowRef.current) {
        glowRef.current.position.y = meshRef.current.position.y;
      }

      // Update directional light to follow moon
      if (directionalLightRef.current) {
        directionalLightRef.current.position.set(
          meshRef.current.position.x,
          meshRef.current.position.y,
          meshRef.current.position.z + 30, // Offset forward so light hits terrain
        );
      }

      if (moonPosRef) {
        moonPosRef.current.copy(meshRef.current.position);
      }
    }
  });

  return (
    <group>
      {/* Moon sphere */}
      <mesh ref={meshRef} position={[0, initialY, initialZ]} castShadow>
        <sphereGeometry args={[10, 64, 64]} />
        <meshStandardMaterial
          color="#e6e6e6"
          emissive="#fffcde"
          emissiveIntensity={0.5}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Moon glow */}
      <mesh ref={glowRef} position={[0, initialY, initialZ]}>
        <sphereGeometry args={[11.5, 32, 32]} />
        <meshBasicMaterial color="#fff8db" transparent opacity={0.05} />
      </mesh>

      {/* PointLight for nearby objects (clouds, etc) */}
      <pointLight
        ref={pointLightRef}
        position={[0, initialY, initialZ]}
        intensity={800}
        distance={150}
        color="#fff5e6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.005}
      />
      <directionalLight
        ref={directionalLightRef}
        position={[0, initialY + 30, initialZ + 30]}
        intensity={0.8}
        color="#fff5e6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-400} // Expanded from -200
        shadow-camera-right={400} // Expanded from 200
        shadow-camera-top={150} // Expanded from 100
        shadow-camera-bottom={-150} // Expanded from -100
        shadow-camera-near={0.5}
        shadow-camera-far={600} // Expanded from 500
      />
    </group>
  );
}
