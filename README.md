# 3js

Collection of my Three.js projects for learning and experimentation.

## Folder Structure

```
3js/
├── README.md                    # This file - index of all projects
├── particle-galaxy/             # Project 1: Particle systems & shaders
├── geometric-shapes/            # Future: Basic geometries & materials
├── animated-scenes/             # Future: Animation & transformations
├── lighting-shadows/            # Future: Lights & shadow mapping
├── textures-materials/          # Future: Texture loading & PBR
├── raycasting-interaction/      # Future: Mouse interaction & picking
├── physics-simulation/          # Future: Physics integration
└── advanced-rendering/          # Future: Advanced techniques
```

## Recommended Project Organization

Each project should follow this structure:

```
project-name/
├── index.html              # Entry point
├── main.js                 # Main Three.js code
├── package.json            # Dependencies
├── README.md               # Project documentation
├── assets/                 # Optional: textures, models, fonts
│   ├── textures/
│   ├── models/
│   └── fonts/
└── src/                    # Optional: for larger projects
    ├── scene.js
    ├── camera.js
    ├── lights.js
    └── utils/
```

## Projects

### 1. Particle Galaxy

![Particle Galaxy](./particle-galaxy/assets/screenshots/galaxy.png)

**Concepts:** BufferGeometry, Custom Shaders, Post-processing, Bloom effects  
**Status:** Complete  

## My pathway/concepts:

1. **Basics**: Geometries, materials, lights, camera
2. **Particles**: Point systems, BufferGeometry
3. **Shaders**: GLSL, vertex/fragment shaders
4. **Animation**: Transforms, keyframes, tweening
5. **Interaction**: Raycasting, mouse events
6. **Post-processing**: Effects, render passes
7. **Performance**: Instancing, LOD, optimization
8. **Advanced**: Custom materials, physics, procedural generation

## Running Projects

Each project uses Vite for development:

```bash
cd project-name
bun install
bun run dev
```

## Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)
- [Three.js Journey](https://threejs-journey.com/)
- [WebGL Fundamentals](https://webglfundamentals.org/)
