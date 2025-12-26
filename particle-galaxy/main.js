import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Scene setup
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000510, 0.0008);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 80, 180);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;
document.body.appendChild(renderer.domElement);

// Post-processing for bloom effect
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5, // strength
    0.4, // radius
    0.85 // threshold
);
composer.addPass(bloomPass);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 50;
controls.maxDistance = 500;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// Galaxy parameters
const parameters = {
    count: 100000,
    size: 2.5,
    radius: 120,
    branches: 6,
    spin: 1.2,
    randomness: 0.6,
    randomnessPower: 3,
    insideColor: '#ff6030',
    outsideColor: '#1b3984'
};

let geometry = null;
let material = null;
let points = null;

const generateGalaxy = () => {
    if (points !== null) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
    }

    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);
    const scales = new Float32Array(parameters.count);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius * 0.3;
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / parameters.radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;

        scales[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

    // Custom shader material
    material = new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        uniforms: {
            uTime: { value: 0 },
            uSize: { value: parameters.size * renderer.getPixelRatio() }
        },
        vertexShader: `
            uniform float uTime;
            uniform float uSize;
            attribute float aScale;
            varying vec3 vColor;
            
            void main() {
                vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                vec4 viewPosition = viewMatrix * modelPosition;
                vec4 projectedPosition = projectionMatrix * viewPosition;
                
                gl_Position = projectedPosition;
                gl_PointSize = uSize * aScale * (1.0 / -viewPosition.z);
                
                vColor = color;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            
            void main() {
                float strength = distance(gl_PointCoord, vec2(0.5));
                strength = 1.0 - strength;
                strength = pow(strength, 3.0);
                
                vec3 color = mix(vec3(0.0), vColor, strength);
                gl_FragColor = vec4(color, strength);
            }
        `
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);
};

generateGalaxy();

// Enhanced star field with multiple layers
const createStarField = (count, distance, size, color) => {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * distance;
        const y = (Math.random() - 0.5) * distance;
        const z = (Math.random() - 0.5) * distance;
        vertices.push(x, y, z);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ 
        color: color, 
        size: size,
        transparent: true,
        opacity: 0.8
    });
    return new THREE.Points(geometry, material);
};

const stars1 = createStarField(5000, 2000, 1.5, 0xffffff);
const stars2 = createStarField(3000, 1500, 1.0, 0xaaccff);
const stars3 = createStarField(2000, 1000, 0.7, 0xffddaa);
scene.add(stars1, stars2, stars3);

// Add a central bright core
const coreGeometry = new THREE.SphereGeometry(8, 32, 32);
const coreMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffaa44,
    transparent: true,
    opacity: 0.6
});
const core = new THREE.Mesh(coreGeometry, coreMaterial);
scene.add(core);

// Add rotating light sources
const light1 = new THREE.PointLight(0xff6030, 2, 200);
light1.position.set(50, 0, 0);
scene.add(light1);

const light2 = new THREE.PointLight(0x1b3984, 2, 200);
light2.position.set(-50, 0, 0);
scene.add(light2);

// Animation
const clock = new THREE.Clock();

const animate = () => {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    
    // Update shader uniform
    if (material.uniforms) {
        material.uniforms.uTime.value = elapsedTime;
    }
    
    // Rotate galaxy with slight wobble
    if (points) {
        points.rotation.y = elapsedTime * 0.03;
        points.rotation.x = Math.sin(elapsedTime * 0.1) * 0.02;
    }
    
    // Rotate core
    core.rotation.y = elapsedTime * 0.2;
    core.rotation.x = elapsedTime * 0.15;
    
    // Rotate lights
    light1.position.x = Math.cos(elapsedTime * 0.5) * 80;
    light1.position.z = Math.sin(elapsedTime * 0.5) * 80;
    light2.position.x = Math.cos(elapsedTime * 0.5 + Math.PI) * 80;
    light2.position.z = Math.sin(elapsedTime * 0.5 + Math.PI) * 80;
    
    // Animate star fields at different speeds
    stars1.rotation.y = elapsedTime * 0.005;
    stars1.rotation.x = elapsedTime * 0.003;
    stars2.rotation.y = -elapsedTime * 0.008;
    stars2.rotation.x = elapsedTime * 0.004;
    stars3.rotation.y = elapsedTime * 0.01;
    
    controls.update();
    composer.render();
};

// Handle resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Keyboard controls
window.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        controls.autoRotate = !controls.autoRotate;
    }
    if (e.key === 'r') {
        camera.position.set(0, 80, 180);
        controls.reset();
    }
});

animate();
