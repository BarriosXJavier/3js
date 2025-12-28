import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Mesh } from "three";

interface CloudProps {
  startPos: [number, number, number];
}

export default function Cloud({ startPos }: CloudProps) {
  const meshRef = useRef<Mesh>(null);

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    
    const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
    grad.addColorStop(0, "rgba(200, 200, 220, 0.6)");
    grad.addColorStop(0.5, "rgba(180, 180, 200, 0.3)");
    grad.addColorStop(1, "rgba(160, 160, 180, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    
    meshRef.current.position.x += 0.4 * delta;

    if (meshRef.current.position.x > 20) {
      meshRef.current.position.x = -20;
    }
  });

  return (
    <mesh ref={meshRef} position={startPos}>
      <planeGeometry args={[10, 5]} />
      <meshBasicMaterial 
        map={texture} 
        transparent={true} 
        depthWrite={false}
        opacity={0.8}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}
