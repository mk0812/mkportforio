<template>
  <div ref="rootEl" class="hero-canvas" aria-hidden="true">
    <canvas ref="canvasEl" class="hero-canvas__el" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { detectDeviceTier, type DeviceTierLevel } from '@/composables/useDeviceTier'
import { prefersReducedMotion } from '@/composables/usePrefersReducedMotion'
import { createPostShaderUniforms, postShader } from './post/post.shaders'

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

interface TierConfig {
  particleCount: number
  innerOrb: boolean
  icosaDetail: number
  postprocess: 'full' | 'bloom-vignette' | 'none'
  pixelRatioCap: number
  rafCapFps: number | null
}

function getTierConfig(tier: DeviceTierLevel): TierConfig {
  switch (tier) {
    case 'high':
      return {
        particleCount: 600,
        innerOrb: true,
        icosaDetail: 48,
        postprocess: 'none',
        pixelRatioCap: 2,
        rafCapFps: null,
      }
    case 'medium':
      return {
        particleCount: 350,
        innerOrb: true,
        icosaDetail: 36,
        postprocess: 'none',
        pixelRatioCap: 1.5,
        rafCapFps: null,
      }
    case 'low':
      return {
        particleCount: 0,
        innerOrb: false,
        icosaDetail: 24,
        postprocess: 'none',
        pixelRatioCap: 1,
        rafCapFps: 30,
      }
  }
}

function disposeComposer(composer: ComposerLike): void {
  for (const pass of composer.passes) pass.dispose?.()
}

async function initScene(root: HTMLDivElement, canvas: HTMLCanvasElement): Promise<() => void> {
  const THREE = await import('three')
  const { vertexShader, fragmentShader } = await import('./shaders/hero.shaders')

  const { tier } = detectDeviceTier()
  const config = getTierConfig(tier)
  const reduced = prefersReducedMotion()

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, config.pixelRatioCap))
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

  const geometry = new THREE.IcosahedronGeometry(1.0, config.icosaDetail)
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: false,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(1.6, -0.4, 0)
  scene.add(mesh)

  let innerGeometry: InstanceType<typeof THREE.IcosahedronGeometry> | null = null
  let innerMaterial: InstanceType<typeof THREE.ShaderMaterial> | null = null
  let innerMesh: InstanceType<typeof THREE.Mesh> | null = null
  let innerTimeUniform: { value: number } | null = null

  if (config.innerOrb) {
    innerGeometry = new THREE.IcosahedronGeometry(0.58, 32)
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
    innerMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: innerUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    })
    innerMesh = new THREE.Mesh(innerGeometry, innerMaterial)
    innerMesh.position.copy(mesh.position)
    scene.add(innerMesh)
    innerTimeUniform = innerUniforms.uTime
  }

  let particleGeo: InstanceType<typeof THREE.BufferGeometry> | null = null
  let particleMat: InstanceType<typeof THREE.ShaderMaterial> | null = null
  let particles: InstanceType<typeof THREE.Points> | null = null
  const particleMouse = new THREE.Vector3(0, 0, 0)

  if (config.particleCount > 0) {
    const { vertexShader: particleVert, fragmentShader: particleFrag } = await import(
      './shaders/particles.shaders'
    )
    const positions = new Float32Array(config.particleCount * 3)
    for (let i = 0; i < config.particleCount; i++) {
      const r = 3 + Math.random() * 4
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi) * 0.5 - 2
    }
    particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleMat = new THREE.ShaderMaterial({
      vertexShader: particleVert,
      fragmentShader: particleFrag,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: particleMouse },
        uCurlStrength: { value: 0.022 },
        uMagnetRadius: { value: 1.8 },
        uMagnetStrength: { value: 0.14 },
        uPointSize: { value: 5 },
        uReducedMotion: { value: reduced ? 1 : 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)
  }

  let composer: ComposerLike | null = null
  const postUniforms = createPostShaderUniforms()
  const localPostShader = {
    uniforms: postUniforms,
    vertexShader: postShader.vertexShader,
    fragmentShader: postShader.fragmentShader,
  }

  if (!reduced && config.postprocess !== 'none') {
    try {
      const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer.js')
      const { RenderPass } = await import('three/examples/jsm/postprocessing/RenderPass.js')
      const { UnrealBloomPass } = await import('three/examples/jsm/postprocessing/UnrealBloomPass.js')
      const { ShaderPass } = await import('three/examples/jsm/postprocessing/ShaderPass.js')
      const bloomSize = new THREE.Vector2(1, 1)
      const c = new EffectComposer(renderer)
      c.addPass(new RenderPass(scene, camera))
      c.addPass(new UnrealBloomPass(bloomSize, 0.14, 0.28, 0.88))
      const postPass = new ShaderPass(localPostShader)
      postPass.renderToScreen = true
      c.addPass(postPass)
      composer = c as unknown as ComposerLike

      if (config.postprocess === 'bloom-vignette') {
        postUniforms.uAberrationStrength.value = 0
        postUniforms.uGrainStrength.value = 0
      }
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
    innerMesh?.position.set(orbX, orbY, 0)
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

  const clock = new THREE.Clock()
  let rafId = 0
  const frameBudgetMs = config.rafCapFps ? 1000 / config.rafCapFps : 0
  let lastRenderTime = 0
  const frameTimes: number[] = []
  let lastFrameTimestamp = 0
  let fpsDipCount = 0

  function bypassComposer(): void {
    if (!composer) return
    disposeComposer(composer)
    composer = null
    if (import.meta.env.DEV) {
      console.warn('[HeroCanvas] FPS dip detected — postprocess bypassed')
    }
  }

  function tick(now: number): void {
    rafId = requestAnimationFrame(tick)

    if (!inView || document.hidden) return

    if (frameBudgetMs > 0 && now - lastRenderTime < frameBudgetMs) return
    lastRenderTime = now

    if (lastFrameTimestamp > 0) {
      const dt = now - lastFrameTimestamp
      frameTimes.push(dt)
      if (frameTimes.length > 60) frameTimes.shift()

      if (frameTimes.length === 60) {
        const avgMs = frameTimes.reduce((sum, t) => sum + t, 0) / 60
        const avgFps = 1000 / avgMs
        if (avgFps < 45) {
          if (fpsDipCount === 0 && composer) {
            fpsDipCount = 1
            bypassComposer()
          } else if (fpsDipCount >= 1) {
            fpsDipCount++
          }
        }
      }
    }
    lastFrameTimestamp = now

    mouse.x += (mouse.tx - mouse.x) * 0.06
    mouse.y += (mouse.ty - mouse.y) * 0.06
    const t = clock.getElapsedTime()

    uniforms.uTime.value = t
    if (innerTimeUniform) {
      innerTimeUniform.value = t
    }
    sharedMouse.set(mouse.x, mouse.y)

    const outerRotY = t * 0.12 + mouse.x * 0.3
    const outerRotX = mouse.y * 0.25
    mesh.rotation.y = outerRotY
    mesh.rotation.x = outerRotX
    if (innerMesh) {
      innerMesh.rotation.y = -outerRotY - 0.35
      innerMesh.rotation.x = -outerRotX * 0.85
    }

    if (particles && particleMat) {
      particles.rotation.y = t * 0.02
      particleMat.uniforms.uTime.value = t
      particleMouse.set(mouse.x * 2.8, mouse.y * 2.2, 0)
    }

    camera.position.x = mouse.x * 0.4
    camera.position.y = mouse.y * 0.3
    camera.lookAt(0, 0, 0)

    if (composer) {
      postUniforms.uTime.value = t
      if (config.postprocess === 'full') {
        postUniforms.uGrainStrength.value = 0.035
      }
      composer.render()
    } else {
      renderer.render(scene, camera)
    }
  }

  if (reduced) {
    renderer.render(scene, camera)
  } else {
    rafId = requestAnimationFrame(tick)
  }

  return () => {
    cancelAnimationFrame(rafId)
    window.removeEventListener('pointermove', onPointerMove)
    resizeObs.disconnect()
    visObs.disconnect()
    geometry.dispose()
    material.dispose()
    innerGeometry?.dispose()
    innerMaterial?.dispose()
    particleGeo?.dispose()
    particleMat?.dispose()
    if (composer) disposeComposer(composer)
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
