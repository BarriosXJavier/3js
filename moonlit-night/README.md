# Moonlit Night

An animated moonlit night scene with a rising moon, drifting clouds, and a starry sky built with React Three Fiber.

## Features

- Rising moon with emissive glow and point light
- Animated clouds drifting across the moon
- Procedurally generated star field (2000+ stars)
- Atmospheric fog effect
- Smooth animations with delta time

## Three.js Concepts

- React Three Fiber (@react-three/fiber)
- BufferGeometry for particle systems (stars)
- Point lights and emissive materials
- Canvas textures for procedural cloud generation
- Fog for atmospheric depth
- Delta time for consistent animations
- TypeScript integration

## Installation

```bash
bun install
```

## Development

```bash
bun run dev
```

Opens at http://localhost:5173

## Build

```bash
bun run build
```

## Project Structure

```
moonlit-night/
├── src/
│   ├── components/
│   │   ├── MoonScene.tsx    # Main scene setup
│   │   ├── Moon.tsx         # Moon mesh with light
│   │   ├── Cloud.tsx        # Cloud with canvas texture
│   │   └── Stars.tsx        # Star field particles
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── README.md
```

