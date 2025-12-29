import { useMemo } from "react";

export default function Stars() {
  const starField = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 300 + Math.random() * 200; // Increased radius to be far background
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi); // Removed offset, centered on scene but far away
      
      // Make some stars brighter (20% chance for bright star)
      const brightness = Math.random() < 0.2 ? 1.0 : 0.6 + Math.random() * 0.5;
      colors[i3] = brightness;
      colors[i3 + 1] = brightness;
      colors[i3 + 2] = brightness;  
      
      sizes[i] = Math.random() * 1.5 + 0.5;
    }
    
    return { positions, sizes, colors };
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[starField.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[starField.sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[starField.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors={true}
        transparent
        opacity={0.9}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
}
