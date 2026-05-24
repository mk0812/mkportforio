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

function getOrbScale(aspect: number): number {
  if (aspect >= 1.6) return 1.0
  if (aspect >= 1.0) return 0.85
  return 0.55
}

function getOrbPosition(aspect: number): [number, number, number] {
  if (aspect >= 1.0) {
    return [Math.min(1.6, 0.8 + aspect * 0.45), -0.35, 0]
  }
  return [0, -0.15, 0]
}

async function initScene(root: HTMLDivElement, canvas: HTMLCanvasElement): Promise<() => void> {
  const THREE = await import('three')
  const { vertexShader, fragmentShader } = await import('./shaders/orb.shaders')

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
  camera.position.z = 5.0

  const sharedMouse = new THREE.Vector2(0, 0)
  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: sharedMouse },
    uColorA: { value: new THREE.Color('#22d3ee') },
    uColorB: { value: new THREE.Color('#8b5cf6') },
    uColorC: { value: new THREE.Color('#ec4899') },
  }

  const geometry = new THREE.IcosahedronGeometry(1.0, 24)
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: false,
  })
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  function resize(): void {
    const w = root.clientWidth
    const h = root.clientHeight
    if (w === 0 || h === 0) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()

    const aspect = w / h
    const scale = getOrbScale(aspect)
    mesh.scale.setScalar(scale)
    const [x, y, z] = getOrbPosition(aspect)
    mesh.position.set(x, y, z)
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
      updateLoop()
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

  function onPointerLeave(): void {
    mouse.tx = 0
    mouse.ty = 0
  }

  if (!reduced) {
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    root.addEventListener('pointerleave', onPointerLeave, { passive: true })
  }

  const clock = new THREE.Clock()
  let rafId = 0
  let looping = false
  let autoRotY = 0

  function renderFrame(): void {
    if (!reduced) {
      mouse.x += (mouse.tx - mouse.x) * 0.06
      mouse.y += (mouse.ty - mouse.y) * 0.06
      sharedMouse.set(mouse.x, mouse.y)
    }

    const t = clock.getElapsedTime()
    uniforms.uTime.value = t

    if (!reduced) {
      autoRotY += 0.0015
      mesh.rotation.y = autoRotY + mouse.x * 0.2
      mesh.rotation.x = mouse.y * 0.18
    }

    renderer.render(scene, camera)
  }

  function tick(): void {
    if (!looping) return
    rafId = requestAnimationFrame(tick)
    if (!inView || document.hidden) return
    renderFrame()
  }

  function startLoop(): void {
    if (reduced || looping) return
    looping = true
    rafId = requestAnimationFrame(tick)
  }

  function stopLoop(): void {
    looping = false
    cancelAnimationFrame(rafId)
  }

  function updateLoop(): void {
    if (reduced) return
    if (inView && !document.hidden) {
      startLoop()
    } else {
      stopLoop()
    }
  }

  function onVisibilityChange(): void {
    updateLoop()
  }

  document.addEventListener('visibilitychange', onVisibilityChange)

  if (reduced) {
    renderer.render(scene, camera)
  } else {
    startLoop()
  }

  return () => {
    stopLoop()
    document.removeEventListener('visibilitychange', onVisibilityChange)
    window.removeEventListener('pointermove', onPointerMove)
    root.removeEventListener('pointerleave', onPointerLeave)
    resizeObs.disconnect()
    visObs.disconnect()
    geometry.dispose()
    material.dispose()
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
