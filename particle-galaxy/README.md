# Particle Galaxy

An animated spiral galaxy visualization with 100,000+ particles, custom shaders, and bloom post-processing effects.

![Particle Galaxy](./assets/screenshots/galaxy.png)

## Features

- 100k particle spiral galaxy with 6 arms
- Custom GLSL shaders for particle rendering
- Post-processing bloom effects
- Multi-layered star field
- Dynamic point lights
- Interactive camera controls

## Three.js Concepts

- BufferGeometry with large particle counts
- Custom ShaderMaterial (vertex & fragment shaders)
- Post-processing pipeline (EffectComposer)
- UnrealBloomPass
- OrbitControls with auto-rotate
- Point lights and tone mapping
- Efficient particle systems

## Installation

```bash
bun install
```

## Development

```bash
bun run dev
```

Opens at http://localhost:5173

## Controls

- Drag to rotate camera
- Scroll to zoom
- Space - Toggle auto-rotate
- R - Reset camera position

## Build

```bash
bun run build
```
