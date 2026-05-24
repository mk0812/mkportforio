<template>
  <div ref="rootEl" class="hero-canvas" aria-hidden="true">
    <canvas ref="canvasEl" class="hero-canvas__el" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { prefersReducedMotion } from '@/composables/usePrefersReducedMotion'
import { postShader } from './post/post.shaders'
import { curlNoise } from './utils/particleNoise'

const rootEl = ref<HTMLDivElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)

let disposeFn: (() => void) | null = null

onMounted(async () => {
  const root = rootEl.value
  const canvas = canvasEl.value
  if (!root || !canvas) return

  disposeFn = await initScene(root, canvas)
})

onBeforeUnmount(() => {
  disposeFn?.()
  disposeFn = null
})

interface ComposerPass {
  dispose?: () => void
}

interface ComposerLike {
  render: () => void
  setSize: (w: number, h: number) => void
  passes: ComposerPass[]
}

async function initScene(root: HTMLDivElement, canvas: HTMLCanvasElement): Promise<() => void> {
  const THREE = await import('three')
  const { vertexShader, fragmentShader } = await import('./shaders/hero.shaders')

  const reduced = prefersReducedMotion()

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
  camera.position.z = 4.2

  const sharedMouse = new THREE.Vector2(0, 0)
  const sharedColorA = new THREE.Color('#22d3ee')
  const sharedColorB = new THREE.Color('#8b5cf6')
  const sharedColorC = new THREE.Color('#ec4899')

  const uniforms = {
    uTime: { value: 0 },
    uTimeOffset: { value: 0 },
    uPhaseShift: { value: 0 },
    uMouse: { value: sharedMouse },
    uColorA: { value: sharedColorA },
    uColorB: { value: sharedColorB },
    uColorC: { value: sharedColorC },
    uOpacity: { value: 1 },
  }

  const geometry = new THREE.IcosahedronGeometry(1.0, 48)
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: false,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(1.6, -0.4, 0)
  scene.add(mesh)

  const innerGeometry = new THREE.IcosahedronGeometry(0.58, 32)
  const innerUniforms = {
    uTime: { value: 0 },
    uTimeOffset: { value: 1.85 },
    uPhaseShift: { value: 2.4 },
    uMouse: { value: sharedMouse },
    uColorA: { value: sharedColorA },
    uColorB: { value: sharedColorB },
    uColorC: { value: sharedColorC },
    uOpacity: { value: 0.38 },
  }
  const innerMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: innerUniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  })
  const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial)
  innerMesh.position.copy(mesh.position)
  scene.add(innerMesh)

  const isLargeViewport = window.innerWidth * window.innerHeight > 1_500_000
  const particleCount = isLargeViewport ? 350 : 600
  const basePositions = new Float32Array(particleCount * 3)
  const positions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    const r = 3 + Math.random() * 4
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const x = r * Math.sin(phi) * Math.cos(theta)
    const y = r * Math.sin(phi) * Math.sin(theta)
    const z = r * Math.cos(phi) * 0.5 - 2
    basePositions[i * 3] = x
    basePositions[i * 3 + 1] = y
    basePositions[i * 3 + 2] = z
    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
  }
  const particleGeo = new THREE.BufferGeometry()
  const positionAttr = new THREE.BufferAttribute(positions, 3)
  particleGeo.setAttribute('position', positionAttr)
  const particleMat = new THREE.PointsMaterial({
    size: 0.018,
    color: new THREE.Color('#9aa3ff'),
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const particles = new THREE.Points(particleGeo, particleMat)
  scene.add(particles)

  let composer: ComposerLike | null = null
  const postUniforms = postShader.uniforms
  if (!reduced && !isLargeViewport) {
    try {
      const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer.js')
      const { RenderPass } = await import('three/examples/jsm/postprocessing/RenderPass.js')
      const { UnrealBloomPass } = await import('three/examples/jsm/postprocessing/UnrealBloomPass.js')
      const { ShaderPass } = await import('three/examples/jsm/postprocessing/ShaderPass.js')
      const c = new EffectComposer(renderer)
      c.addPass(new RenderPass(scene, camera))
      const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.55, 0.35, 0.45)
      c.addPass(bloom)
      const postPass = new ShaderPass(postShader)
      postPass.renderToScreen = true
      c.addPass(postPass)
      composer = c as unknown as ComposerLike
    } catch {
      composer = null
    }
  }

  function resize(): void {
    const w = root.clientWidth
    const h = root.clientHeight
    if (w === 0 || h === 0) return
    renderer.setSize(w, h, false)
    composer?.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    const aspect = w / h
    const orbX = aspect < 1 ? 0 : Math.min(1.6, 0.8 + aspect * 0.45)
    const orbY = aspect < 1 ? -0.4 : -0.35
    mesh.position.set(orbX, orbY, 0)
    innerMesh.position.set(orbX, orbY, 0)
  }
  resize()
  const resizeObs = new ResizeObserver(resize)
  resizeObs.observe(root)

  let inView = true
  const visObs = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        inView = entry.isIntersecting
      }
    },
    { threshold: 0 },
  )
  visObs.observe(root)

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
  function onPointerMove(event: PointerEvent): void {
    const rect = root.getBoundingClientRect()
    mouse.tx = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.ty = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true })

  const magnetRadius = 1.8
  const magnetStrength = 0.14
  const curlStrength = 0.022

  const clock = new THREE.Clock()
  let rafId = 0
  function tick(): void {
    rafId = requestAnimationFrame(tick)
    if (!inView || document.hidden) return

    mouse.x += (mouse.tx - mouse.x) * 0.06
    mouse.y += (mouse.ty - mouse.y) * 0.06
    const t = clock.getElapsedTime()

    uniforms.uTime.value = t
    innerUniforms.uTime.value = t
    sharedMouse.set(mouse.x, mouse.y)

    const outerRotY = t * 0.12 + mouse.x * 0.3
    const outerRotX = mouse.y * 0.25
    mesh.rotation.y = outerRotY
    mesh.rotation.x = outerRotX
    innerMesh.rotation.y = -outerRotY - 0.35
    innerMesh.rotation.x = -outerRotX * 0.85

    particles.rotation.y = t * 0.02

    const mouseWorldX = mouse.x * 2.8
    const mouseWorldY = mouse.y * 2.2
    for (let i = 0; i < particleCount; i++) {
      const bi = i * 3
      const bx = basePositions[bi] ?? 0
      const by = basePositions[bi + 1] ?? 0
      const bz = basePositions[bi + 2] ?? 0

      const [cx, cy, cz] = curlNoise(bx * 0.35, by * 0.35, bz * 0.35, t * 0.18)
      let px = bx + cx * curlStrength
      let py = by + cy * curlStrength
      let pz = bz + cz * curlStrength

      if (!reduced) {
        const dx = mouseWorldX - px
        const dy = mouseWorldY - py
        const dist = Math.hypot(dx, dy)
        if (dist < magnetRadius && dist > 0.001) {
          const pull = (1 - dist / magnetRadius) * magnetStrength
          px += (dx / dist) * pull
          py += (dy / dist) * pull
        }
      }

      positions[bi] = px
      positions[bi + 1] = py
      positions[bi + 2] = pz
    }
    positionAttr.needsUpdate = true

    camera.position.x = mouse.x * 0.4
    camera.position.y = mouse.y * 0.3
    camera.lookAt(0, 0, 0)

    if (composer) {
      postUniforms.uTime.value = t
      postUniforms.uGrainStrength.value = reduced ? 0 : 0.035
      composer.render()
    } else {
      renderer.render(scene, camera)
    }
  }

  if (reduced) {
    renderer.render(scene, camera)
  } else {
    tick()
  }

  return () => {
    cancelAnimationFrame(rafId)
    window.removeEventListener('pointermove', onPointerMove)
    resizeObs.disconnect()
    visObs.disconnect()
    geometry.dispose()
    material.dispose()
    innerGeometry.dispose()
    innerMaterial.dispose()
    particleGeo.dispose()
    particleMat.dispose()
    if (composer) {
      for (const pass of composer.passes) pass.dispose?.()
    }
    renderer.dispose()
  }
}
</script>

<style scoped>
.hero-canvas {
  position: absolute;
  inset: 0;
  z-index: var(--z-canvas);
  pointer-events: none;
  overflow: hidden;
}

.hero-canvas__el {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
