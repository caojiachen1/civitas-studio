import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

function makeSkyTexture(): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createLinearGradient(0, 0, 0, 512)
  gradient.addColorStop(0, '#2a2a2a')
  gradient.addColorStop(0.42, '#242424')
  gradient.addColorStop(0.7, '#1f1f1f')
  gradient.addColorStop(1, '#1b1b1b')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 32, 512)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function makeGroundTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#2b2b2b'
  ctx.fillRect(0, 0, 512, 512)
  let seed = 1234567
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
  for (let i = 0; i < 2600; i++) {
    const x = rand() * 512
    const y = rand() * 512
    const v = Math.floor(rand() * 24) - 12
    ctx.fillStyle = `rgba(${52 + v},${52 + v},${52 + v},${0.16 + rand() * 0.2})`
    ctx.beginPath()
    ctx.ellipse(x, y, 2 + rand() * 8, 1 + rand() * 4, rand() * 3.14, 0, Math.PI * 2)
    ctx.fill()
  }
  for (let i = 0; i < 1200; i++) {
    const x = rand() * 512
    const y = rand() * 512
    ctx.strokeStyle = `rgba(${58 + rand() * 24},${58 + rand() * 24},${58 + rand() * 24},${0.12 + rand() * 0.12})`
    ctx.lineWidth = 0.7
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + (rand() - 0.5) * 3, y - 2 - rand() * 4)
    ctx.stroke()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(90, 90)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

function makeGrid(): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(700, 700)
  geometry.rotateX(-Math.PI / 2)
  const uniforms = {
    uCenter: { value: new THREE.Vector2(0, 0) },
  }
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms,
    vertexShader: /* glsl */ `
      varying vec3 vWorld;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorld = world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec2 uCenter;
      varying vec3 vWorld;
      float gridLine(vec2 coord, float cell) {
        vec2 c = coord / cell;
        vec2 g = abs(fract(c - 0.5) - 0.5) / fwidth(c);
        return 1.0 - min(min(g.x, g.y), 1.0);
      }
      void main() {
        vec2 c = vWorld.xz;
        float minor = gridLine(c, 1.0) * 0.11;
        float major = gridLine(c, 5.0) * 0.24;
        float dTarget = distance(c, uCenter);
        float fade = 1.0 - smoothstep(24.0, 95.0, dTarget);
        float camFade = 1.0 - smoothstep(100.0, 260.0, distance(c, cameraPosition.xz));
        float alpha = (minor + major) * fade * camFade;
        if (alpha < 0.004) discard;
        vec3 color = mix(vec3(0.62), vec3(0.86), step(0.2, major));
        gl_FragColor = vec4(color, alpha);
      }
    `,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.y = 0.006
  mesh.renderOrder = 1
  mesh.frustumCulled = false
  mesh.userData.gridUniforms = uniforms
  return mesh
}

export interface EnvironmentRig {
  grid: THREE.Mesh
  sun: THREE.DirectionalLight
  sunTarget: THREE.Object3D
  update(target: THREE.Vector3): void
}

export function setupEnvironment(scene: THREE.Scene, renderer: THREE.WebGLRenderer): EnvironmentRig {
  scene.background = makeSkyTexture()
  scene.fog = new THREE.Fog('#202020', 70, 280)

  const pmrem = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const env = pmrem.fromScene(room, 0.04).texture
  scene.environment = env
  scene.environmentIntensity = 0.5
  room.dispose?.()
  pmrem.dispose()

  const hemi = new THREE.HemisphereLight('#b8b8b8', '#262626', 1.2)
  scene.add(hemi)

  const sun = new THREE.DirectionalLight('#ffffff', 2.35)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.camera.left = -42
  sun.shadow.camera.right = 42
  sun.shadow.camera.top = 42
  sun.shadow.camera.bottom = -42
  sun.shadow.camera.near = 1
  sun.shadow.camera.far = 190
  sun.shadow.bias = -0.0004
  sun.shadow.normalBias = 0.045
  const sunTarget = new THREE.Object3D()
  sun.target = sunTarget
  scene.add(sun)
  scene.add(sunTarget)

  const fill = new THREE.DirectionalLight('#b0b0b0', 0.6)
  fill.position.set(-30, 24, -20)
  scene.add(fill)

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(700, 700),
    new THREE.MeshStandardMaterial({
      map: makeGroundTexture(),
      color: '#ffffff',
      roughness: 0.98,
      metalness: 0,
    }),
  )
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -0.015
  ground.receiveShadow = true
  ground.name = 'ground'
  scene.add(ground)

  const grid = makeGrid()
  scene.add(grid)

  const update = (target: THREE.Vector3) => {
    const uniforms = grid.userData.gridUniforms as { uCenter: { value: THREE.Vector2 } }
    uniforms.uCenter.value.set(target.x, target.z)
    sun.position.set(target.x + 46, target.y + 58, target.z + 28)
    sunTarget.position.set(target.x, target.y, target.z)
    sunTarget.updateMatrixWorld()
    fill.position.set(target.x - 35, target.y + 30, target.z - 24)
  }
  update(new THREE.Vector3(0, 0, 0))

  return { grid, sun, sunTarget, update }
}
