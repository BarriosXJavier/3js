import { useMemo } from "react";
import * as THREE from "three";

export default function Ground() {
  const mountainGeometry = useMemo(() => {
    const width = 900;
    const depth = 100;
    const widthSegments = 320;
    const depthSegments = 128;

    const geometry = new THREE.PlaneGeometry(
      width,
      depth,
      widthSegments,
      depthSegments,
    );

    const positionAttr = geometry.attributes.position;

    for (let i = 0; i < positionAttr.count; i++) {
      const x = positionAttr.getX(i);
      const y = positionAttr.getY(i);

      // Sharp peaks with higher amplitude
      let height =
        Math.abs(Math.sin(x * 0.08)) * 20 +
        Math.abs(Math.cos(x * 0.06 + y * 0.03)) * 18;

      // Secondary ridges
      height += Math.abs(Math.sin(x * 0.18 + y * 0.12)) * 10;
      height += Math.abs(Math.cos(x * 0.15 - y * 0.2)) * 8;

      // Jagged peaks
      height += Math.abs(Math.sin(x * 0.5 + y * 0.4)) * 4;
      height += Math.abs(Math.cos(x * 0.6 - y * 0.5)) * 3;

      // Rocky detail
      const noise =
        Math.sin(x * 7.8 + y * 5.3) * Math.cos(x * 4.2 - y * 6.7) * 2;
      height += noise;

      // Valleys
      const valleyFactor = Math.sin(x * 0.04) * Math.cos(y * 0.05);
      height *= 0.7 + valleyFactor * 0.3;

      // Edge falloff
      const edgeX = Math.abs(x) / (width / 2);
      const edgeY = Math.abs(y) / (depth / 2);
      const edgeFalloff = Math.max(0, 1 - Math.pow(Math.max(edgeX, edgeY), 2));
      height *= edgeFalloff;

      positionAttr.setZ(i, height);
    }

    positionAttr.needsUpdate = true;
    geometry.computeVertexNormals();

    return geometry;
  }, []);

  const crackedGroundGeometry = useMemo(() => {
    const width = 800;
    const depth = 600;
    const widthSegments = 200;
    const depthSegments = 150;

    const geometry = new THREE.PlaneGeometry(
      width,
      depth,
      widthSegments,
      depthSegments,
    );

    const positionAttr = geometry.attributes.position;

    for (let i = 0; i < positionAttr.count; i++) {
      const x = positionAttr.getX(i);
      const y = positionAttr.getY(i);

      //  dried lake bed
      let height = Math.sin(x * 0.008) * 1.2 + Math.cos(y * 0.01) * 0.8;

      // Cracked plate sections - areas that have lifted/sunk
      height += Math.sin(x * 0.03) * Math.cos(y * 0.025) * 0.6;

      // Small bumps and irregularities
      height += Math.sin(x * 0.5 + y * 0.4) * 0.15;
      height += Math.cos(x * 0.7 - y * 0.6) * 0.12;

      positionAttr.setZ(i, height);
    }

    positionAttr.needsUpdate = true;
    geometry.computeVertexNormals();

    return geometry;
  }, []);

  const crackTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Base color - dried earth
    ctx.fillStyle = "#1a1a28";
    ctx.fillRect(0, 0, 2048, 2048);

    // Add texture variation with noise
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * 2048;
      const y = Math.random() * 2048;
      const brightness = Math.random() * 30 - 15;
      ctx.fillStyle = `rgba(26, 26, 40, ${Math.abs(brightness) / 100})`;
      ctx.fillRect(x, y, 2, 2);
    }

    // Draw main crack network - thicker, darker
    ctx.strokeStyle = "#08080f";
    ctx.lineWidth = 4;

    const drawCrack = (
      startX: number,
      startY: number,
      length: number,
      angle: number,
      depth: number,
    ) => {
      if (depth <= 0 || length < 10) return;

      const endX = startX + Math.cos(angle) * length;
      const endY = startY + Math.sin(angle) * length;

      // Add slight randomness to path
      const midX = (startX + endX) / 2 + (Math.random() - 0.5) * 20;
      const midY = (startY + endY) / 2 + (Math.random() - 0.5) * 20;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(midX, midY, endX, endY);
      ctx.stroke();

      // Draw crack shadows for depth
      ctx.strokeStyle = "#05050a";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX + 1, startY + 1);
      ctx.quadraticCurveTo(midX + 1, midY + 1, endX + 1, endY + 1);
      ctx.stroke();

      // Reset for next crack
      ctx.strokeStyle = "#08080f";
      ctx.lineWidth = 4;

      // Branch cracks
      if (Math.random() > 0.3) {
        const branchAngle = angle + ((Math.random() - 0.5) * Math.PI) / 2.5;
        drawCrack(
          endX,
          endY,
          length * (0.5 + Math.random() * 0.3),
          branchAngle,
          depth - 1,
        );
      }
      if (Math.random() > 0.5) {
        const branchAngle = angle - ((Math.random() - 0.5) * Math.PI) / 2.5;
        drawCrack(
          endX,
          endY,
          length * (0.4 + Math.random() * 0.3),
          branchAngle,
          depth - 1,
        );
      }
    };

    // Create major crack networks
    for (let i = 0; i < 60; i++) {
      const startX = Math.random() * 2048;
      const startY = Math.random() * 2048;
      const angle = Math.random() * Math.PI * 2;
      drawCrack(startX, startY, 120 + Math.random() * 200, angle, 5);
    }

    // Add fine detail cracks
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#0d0d18";
    for (let i = 0; i < 100; i++) {
      const startX = Math.random() * 2048;
      const startY = Math.random() * 2048;
      const length = 30 + Math.random() * 60;
      const angle = Math.random() * Math.PI * 2;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(
        startX + Math.cos(angle) * length,
        startY + Math.sin(angle) * length,
      );
      ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <group>
      {/* Cracked ground plane - dried lake bed */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -10, -100]}
        receiveShadow
      >
        <primitive object={crackedGroundGeometry} />
        <meshStandardMaterial
          map={crackTexture}
          color="#1a1a28"
          roughness={0.98}
          metalness={0.02}
          emissive="#0a0a12"
          emissiveIntensity={0.02}
          normalScale={new THREE.Vector2(0.3, 0.3)}
        />
      </mesh>

      {/* Main distant range - centered */}
      <mesh
        position={[0, -15, -240]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        castShadow
      >
        <primitive object={mountainGeometry} />
        <meshStandardMaterial
          color="#0b0b14"
          roughness={0.95}
          flatShading={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Left range */}
      <mesh
        position={[-200, -18, -230]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        castShadow
      >
        <primitive object={mountainGeometry} />
        <meshStandardMaterial
          color="#090911"
          roughness={0.97}
          flatShading={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Right range */}
      <mesh
        position={[200, -18, -230]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        castShadow
      >
        <primitive object={mountainGeometry} />
        <meshStandardMaterial
          color="#0a0a12"
          roughness={0.96}
          flatShading={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
