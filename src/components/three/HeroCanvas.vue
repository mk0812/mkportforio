<template>
  <div ref="rootEl" class="hero-canvas" aria-hidden="true">
    <canvas ref="canvasEl" class="hero-canvas__el" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { prefersReducedMotion } from '@/composables/usePrefersReducedMotion'

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

  // ── Core mesh: high-detail icosahedron with custom shader ──
  const geometry = new THREE.IcosahedronGeometry(1.0, 48)
  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uColorA: { value: new THREE.Color('#22d3ee') },
    uColorB: { value: new THREE.Color('#8b5cf6') },
    uColorC: { value: new THREE.Color('#ec4899') },
  }
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: false,
  })
  const mesh = new THREE.Mesh(geometry, material)
  // Anchor orb to the right side so it complements left-aligned hero copy
  mesh.position.set(1.6, -0.4, 0)
  scene.add(mesh)

  // ── Particle field ──
  const isLargeViewport = window.innerWidth * window.innerHeight > 1_500_000
  const particleCount = isLargeViewport ? 350 : 600
  const positions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    const r = 3 + Math.random() * 4
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi) * 0.5 - 2
  }
  const particleGeo = new THREE.BufferGeometry()
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
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

  // ── Postprocessing (bloom) — skip on reduced motion or massive viewport ──
  type ComposerLike = {
    render: () => void
    setSize: (w: number, h: number) => void
    passes: { dispose?: () => void }[]
  }
  let composer: ComposerLike | null = null
  if (!reduced && !isLargeViewport) {
    try {
      const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer.js')
      const { RenderPass } = await import('three/examples/jsm/postprocessing/RenderPass.js')
      const { UnrealBloomPass } = await import('three/examples/jsm/postprocessing/UnrealBloomPass.js')
      const c = new EffectComposer(renderer)
      c.addPass(new RenderPass(scene, camera))
      const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.55, 0.35, 0.45)
      c.addPass(bloom)
      composer = c as unknown as ComposerLike
    } catch {
      composer = null
    }
  }

  // ── Sizing ──
  function resize(): void {
    const w = root.clientWidth
    const h = root.clientHeight
    if (w === 0 || h === 0) return
    renderer.setSize(w, h, false)
    composer?.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    // Slide orb left on narrow viewports so it doesn't escape the canvas
    const aspect = w / h
    mesh.position.x = aspect < 1 ? 0 : Math.min(1.6, 0.8 + aspect * 0.45)
    mesh.position.y = aspect < 1 ? -0.4 : -0.35
  }
  resize()
  const resizeObs = new ResizeObserver(resize)
  resizeObs.observe(root)

  // ── Visibility / offscreen pausing ──
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

  // ── Mouse tracking ──
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
  function onPointerMove(event: PointerEvent): void {
    const rect = root.getBoundingClientRect()
    mouse.tx = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.ty = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true })

  // ── Render loop ──
  const clock = new THREE.Clock()
  let rafId = 0
  function tick(): void {
    rafId = requestAnimationFrame(tick)
    if (!inView || document.hidden) return
    mouse.x += (mouse.tx - mouse.x) * 0.06
    mouse.y += (mouse.ty - mouse.y) * 0.06
    const t = clock.getElapsedTime()
    uniforms.uTime.value = t
    uniforms.uMouse.value.set(mouse.x, mouse.y)
    mesh.rotation.y = t * 0.12 + mouse.x * 0.3
    mesh.rotation.x = mouse.y * 0.25
    particles.rotation.y = t * 0.02
    camera.position.x = mouse.x * 0.4
    camera.position.y = mouse.y * 0.3
    camera.lookAt(0, 0, 0)
    if (composer) composer.render()
    else renderer.render(scene, camera)
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
