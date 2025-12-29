import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

export default function ParticleGalaxy() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    
    // Scene setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x000510, 0.0008)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
    camera.position.set(0, 80, 180)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.5
    container.appendChild(renderer.domElement)

    // Post-processing for bloom effect
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    )
    composer.addPass(bloomPass)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 50
    controls.maxDistance = 500
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5

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
    }

    let geometry: THREE.BufferGeometry | null = null
    let material: THREE.ShaderMaterial | null = null
    let points: THREE.Points | null = null

    // Wave disturbances
    const waves: Array<{ position: THREE.Vector3; startTime: number }> = []
    const MAX_WAVES = 5

    const generateGalaxy = () => {
      if (points !== null) {
        geometry?.dispose()
        material?.dispose()
        scene.remove(points)
      }

      geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(parameters.count * 3)
      const colors = new Float32Array(parameters.count * 3)
      const scales = new Float32Array(parameters.count)

      const colorInside = new THREE.Color(parameters.insideColor)
      const colorOutside = new THREE.Color(parameters.outsideColor)

      for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3

        const radius = Math.random() * parameters.radius
        const spinAngle = radius * parameters.spin
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius * 0.3
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / parameters.radius)

        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b

        scales[i] = Math.random()
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))

      // Custom shader material with wave uniforms
      material = new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: parameters.size * renderer.getPixelRatio() },
          uWave1Pos: { value: new THREE.Vector3(99999, 99999, 99999) },
          uWave2Pos: { value: new THREE.Vector3(99999, 99999, 99999) },
          uWave3Pos: { value: new THREE.Vector3(99999, 99999, 99999) },
          uWave4Pos: { value: new THREE.Vector3(99999, 99999, 99999) },
          uWave5Pos: { value: new THREE.Vector3(99999, 99999, 99999) },
          uWave1Time: { value: 999 },
          uWave2Time: { value: 999 },
          uWave3Time: { value: 999 },
          uWave4Time: { value: 999 },
          uWave5Time: { value: 999 }
        },
        vertexShader: `
          uniform float uTime;
          uniform float uSize;
          uniform vec3 uWave1Pos;
          uniform vec3 uWave2Pos;
          uniform vec3 uWave3Pos;
          uniform vec3 uWave4Pos;
          uniform vec3 uWave5Pos;
          uniform float uWave1Time;
          uniform float uWave2Time;
          uniform float uWave3Time;
          uniform float uWave4Time;
          uniform float uWave5Time;
          attribute float aScale;
          varying vec3 vColor;
          varying float vBrightness;
          
          float calculateWave(vec3 pos, vec3 wavePos, float waveTime) {
            if (waveTime > 900.0) return 0.0;
            
            float dist = distance(pos.xz, wavePos.xz);
            float waveRadius = waveTime * 30.0;
            float waveFront = waveRadius - dist;
            
            float amplitude = exp(-waveTime * 0.8) * 15.0;
            float width = 20.0 + waveTime * 5.0;
            float envelope = exp(-pow(waveFront, 2.0) / (2.0 * width));
            
            float wave = sin(dist * 0.2 - waveTime * 4.0) * envelope * amplitude;
            
            return wave;
          }
          
          void main() {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            
            float totalWave = 0.0;
            totalWave += calculateWave(modelPosition.xyz, uWave1Pos, uWave1Time);
            totalWave += calculateWave(modelPosition.xyz, uWave2Pos, uWave2Time);
            totalWave += calculateWave(modelPosition.xyz, uWave3Pos, uWave3Time);
            totalWave += calculateWave(modelPosition.xyz, uWave4Pos, uWave4Time);
            totalWave += calculateWave(modelPosition.xyz, uWave5Pos, uWave5Time);
            
            modelPosition.y += totalWave;
            
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            
            gl_Position = projectedPosition;
            
            vBrightness = 1.0 + abs(totalWave) * 0.05;
            gl_PointSize = uSize * aScale * (1.0 / -viewPosition.z) * vBrightness;
            
            vColor = color;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vBrightness;
          
          void main() {
            float strength = distance(gl_PointCoord, vec2(0.5));
            strength = 1.0 - strength;
            strength = pow(strength, 3.0);
            
            vec3 color = mix(vec3(0.0), vColor * vBrightness, strength);
            gl_FragColor = vec4(color, strength);
          }
        `
      })

      points = new THREE.Points(geometry, material)
      scene.add(points)
    }

    generateGalaxy()

    // Enhanced star field with multiple layers
    const createStarField = (count: number, distance: number, size: number, color: number) => {
      const geometry = new THREE.BufferGeometry()
      const vertices = []
      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * distance
        const y = (Math.random() - 0.5) * distance
        const z = (Math.random() - 0.5) * distance
        vertices.push(x, y, z)
      }
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
      const material = new THREE.PointsMaterial({
        color: color,
        size: size,
        transparent: true,
        opacity: 0.8
      })
      return new THREE.Points(geometry, material)
    }

    const stars1 = createStarField(5000, 2000, 1.5, 0xffffff)
    const stars2 = createStarField(3000, 1500, 1.0, 0xaaccff)
    const stars3 = createStarField(2000, 1000, 0.7, 0xffddaa)
    scene.add(stars1, stars2, stars3)

    // Add a central bright core
    const coreGeometry = new THREE.SphereGeometry(8, 32, 32)
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa44,
      transparent: true,
      opacity: 0.6
    })
    const core = new THREE.Mesh(coreGeometry, coreMaterial)
    scene.add(core)

    // Add rotating light sources
    const light1 = new THREE.PointLight(0xff6030, 2, 200)
    light1.position.set(50, 0, 0)
    scene.add(light1)

    const light2 = new THREE.PointLight(0x1b3984, 2, 200)
    light2.position.set(-50, 0, 0)
    scene.add(light2)

    // Raycaster for click detection
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    // Handle click for wave creation
    const handleClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      raycaster.setFromCamera(mouse, camera)

      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
      const intersectionPoint = new THREE.Vector3()
      raycaster.ray.intersectPlane(plane, intersectionPoint)

      if (intersectionPoint) {
        waves.push({
          position: intersectionPoint.clone(),
          startTime: performance.now() / 1000
        })

        if (waves.length > MAX_WAVES) {
          waves.shift()
        }
      }
    }

    window.addEventListener('click', handleClick)

    // Animation
    const clock = new THREE.Clock()
    let animationId: number

    const animate = () => {
      animationId = requestAnimationFrame(animate)

      const elapsedTime = clock.getElapsedTime()

      // Update shader uniforms
      if (material?.uniforms) {
        material.uniforms.uTime.value = elapsedTime

        const posUniforms = ['uWave1Pos', 'uWave2Pos', 'uWave3Pos', 'uWave4Pos', 'uWave5Pos']
        const timeUniforms = ['uWave1Time', 'uWave2Time', 'uWave3Time', 'uWave4Time', 'uWave5Time']

        // Remove old waves (after 3 seconds)
        for (let i = waves.length - 1; i >= 0; i--) {
          const waveAge = elapsedTime - waves[i].startTime
          if (waveAge > 3.0) {
            waves.splice(i, 1)
          }
        }

        // Update shader with active waves
        for (let i = 0; i < MAX_WAVES; i++) {
          if (i < waves.length) {
            const wave = waves[i]
            const waveTime = elapsedTime - wave.startTime
            material.uniforms[posUniforms[i]].value.copy(wave.position)
            material.uniforms[timeUniforms[i]].value = waveTime
          } else {
            material.uniforms[posUniforms[i]].value.set(99999, 99999, 99999)
            material.uniforms[timeUniforms[i]].value = 999
          }
        }
      }

      // Rotate galaxy with slight wobble
      if (points) {
        points.rotation.y = elapsedTime * 0.03
        points.rotation.x = Math.sin(elapsedTime * 0.1) * 0.02
      }

      // Rotate core
      core.rotation.y = elapsedTime * 0.2
      core.rotation.x = elapsedTime * 0.15

      // Rotate lights
      light1.position.x = Math.cos(elapsedTime * 0.5) * 80
      light1.position.z = Math.sin(elapsedTime * 0.5) * 80
      light2.position.x = Math.cos(elapsedTime * 0.5 + Math.PI) * 80
      light2.position.z = Math.sin(elapsedTime * 0.5 + Math.PI) * 80

      // Animate star fields at different speeds
      stars1.rotation.y = elapsedTime * 0.005
      stars1.rotation.x = elapsedTime * 0.003
      stars2.rotation.y = -elapsedTime * 0.008
      stars2.rotation.x = elapsedTime * 0.004
      stars3.rotation.y = elapsedTime * 0.01

      controls.update()
      composer.render()
    }

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      composer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    window.addEventListener('resize', handleResize)

    // Keyboard controls
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        controls.autoRotate = !controls.autoRotate
      }
      if (e.key === 'r') {
        camera.position.set(0, 80, 180)
        controls.reset()
      }
    }

    window.addEventListener('keydown', handleKeydown)

    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', handleKeydown)
      
      geometry?.dispose()
      material?.dispose()
      coreGeometry.dispose()
      coreMaterial.dispose()
      stars1.geometry.dispose()
      ;(stars1.material as THREE.Material).dispose()
      stars2.geometry.dispose()
      ;(stars2.material as THREE.Material).dispose()
      stars3.geometry.dispose()
      ;(stars3.material as THREE.Material).dispose()
      renderer.dispose()
      composer.dispose()
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <Link
        to="/"
        className="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur-sm text-white rounded-lg hover:bg-slate-800/80 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>

      {/* Instructions Panel */}
      <div className="absolute top-20 left-4 text-white text-sm pointer-events-none bg-black/50 backdrop-blur-md p-4 rounded-lg">
        <h2 className="text-lg font-bold mb-2 text-[#ff6030]">Particle Galaxy</h2>
        <p className="font-bold mb-1">Controls:</p>
        <p className="opacity-90">Drag to rotate</p>
        <p className="opacity-90">Scroll to zoom</p>
        <p className="opacity-90">Space - Toggle auto-rotate</p>
        <p className="opacity-90">R - Reset camera</p>
        <p className="opacity-90">Click - Create ocean wave</p>
      </div>

      {/* Concepts Panel */}
      <div className="absolute bottom-4 right-4 text-white text-xs pointer-events-none bg-black/50 backdrop-blur-md p-4 rounded-lg max-w-xs">
        <h3 className="text-sm font-bold mb-2 text-[#1b3984]">Concepts:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li className="opacity-85">BufferGeometry (100k particles)</li>
          <li className="opacity-85">Custom Shaders (GLSL)</li>
          <li className="opacity-85">Post-processing (Bloom)</li>
          <li className="opacity-85">PointsMaterial & ShaderMaterial</li>
          <li className="opacity-85">OrbitControls</li>
          <li className="opacity-85">Multiple render passes</li>
          <li className="opacity-85">Dynamic lighting</li>
          <li className="opacity-85">Tone mapping</li>
          <li className="opacity-85">Raycasting interaction</li>
          <li className="opacity-85">Wave propagation physics</li>
        </ul>
      </div>

      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
