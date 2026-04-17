import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

export const WaveShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorShallow: new THREE.Color("#00b4d8"),
    uColorDeep: new THREE.Color("#03045e"),
    uWaveHeight: 0.3,
    uWaveSpeed: 0.5,
  },

  // Vertex shader
  /*glsl*/ `

  uniform float uTime;
  uniform float uWaveHeight;
  uniform float uWaveSpeed;

  varying float vElevation;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation =
        sin(modelPosition.x * 2.0 + uTime * uWaveSpeed) * 0.5 +
        sin(modelPosition.z * 1.5 + uTime * uWaveSpeed * 0.8) * 0.5 +
        sin((modelPosition.x + modelPosition.z) * 1.0 + uTime * uWaveSpeed * 1.2) * 0.3;

      elevation *= uWaveHeight;
      modelPosition.y += elevation;
      vElevation = elevation;

      gl_Position = projectionMatrix * viewMatrix * modelPosition;
  }
`,

  // fragment shader
  /*glsl*/ `
   uniform vec3 uColorShallow;
    uniform vec3 uColorDeep;

    varying float vElevation;

    void main() {
      // Map elevation to [0,1] for color mixing
      float t = (vElevation + 0.3) / 0.6;
      vec3 color = mix(uColorDeep, uColorShallow, clamp(t, 0.0, 1.0));
      gl_FragColor = vec4(color, 1.0);
    }
`,
);

declare module "@react-three/fiber" {
  interface ThreeElements {
    waveShaderMaterial: typeof WaveShaderMaterial;
  }
}
