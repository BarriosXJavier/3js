import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Group, MeshStandardMaterial } from "three";

interface CloudProps {
  startPos: [number, number, number];
  speed?: number;
  scale?: number;
  moonPosRef?: React.RefObject<THREE.Vector3>;
}

export default function Cloud({ startPos, speed = 0.3, scale = 1, moonPosRef }: CloudProps) {
  const groupRef = useRef<Group>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);
  
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;  
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    
    ctx.clearRect(0, 0, 1024, 512);
    
    const addCloudPuff = (x: number, y: number, r: number, opacity: number) => {
      const grad = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
      grad.addColorStop(0, `rgba(240, 240, 250, ${opacity})`);
      grad.addColorStop(0.4, `rgba(220, 220, 235, ${opacity * 0.6})`);
      grad.addColorStop(0.7, `rgba(200, 200, 220, ${opacity * 0.3})`);
      grad.addColorStop(1, "rgba(180, 180, 200, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);
    };
    
    // More puffs for fuller clouds
    addCloudPuff(400, 256, 200, 0.55);
    addCloudPuff(560, 280, 180, 0.5);
    addCloudPuff(640, 220, 160, 0.45);
    addCloudPuff(300, 300, 150, 0.4);
    addCloudPuff(480, 200, 140, 0.38);
    addCloudPuff(200, 280, 120, 0.35);
    
    return new THREE.CanvasTexture(canvas);
  }, []);
  
  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    
    groupRef.current.position.x += speed * delta;
    if (groupRef.current.position.x > 25) {
      groupRef.current.position.x = -25;
    }
    
    if (materialRef.current && moonPosRef && moonPosRef.current) {
      const cloudPos = groupRef.current.position;
      const moonPos = moonPosRef.current;
      const dx = cloudPos.x - moonPos.x;
      const dy = cloudPos.y - moonPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 8) {  // Increased from 4 for larger clouds
         const intensity = 1 - (dist / 8);
         materialRef.current.emissiveIntensity = 0.05 + (intensity * 0.5);
         materialRef.current.opacity = 0.6 + (intensity * 0.2);
      } else {
         materialRef.current.emissiveIntensity = 0.05;
         materialRef.current.opacity = 0.6;
      }
    }
  });
  
  return (
    <group ref={groupRef} position={startPos} scale={scale}>
      <mesh receiveShadow>
        <planeGeometry args={[60, 30]} />
        <meshStandardMaterial 
          ref={materialRef}
          map={texture} 
          transparent={true} 
          depthWrite={false}
          opacity={0.6}
          emissive="#ffffff"
          emissiveIntensity={0.05}
          roughness={1.0}
          metalness={0.0}
        />
      </mesh>
    </group>
  );
}
