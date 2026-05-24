import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { prefersReducedMotion } from './usePrefersReducedMotion'

export interface TiltOptions {
  max?: number
  perspective?: number
}

export function useTilt(target: Ref<HTMLElement | null>, options: TiltOptions = {}) {
  const max = options.max ?? 8
  let rafId = 0
  let attached = false

  function reset(): void {
    const el = target.value
    if (!el) return
    el.style.setProperty('--tilt-x', '0deg')
    el.style.setProperty('--tilt-y', '0deg')
    el.style.setProperty('--tilt-scale', '1')
  }

  function onMove(event: PointerEvent): void {
    const el = target.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => {
      el.style.setProperty('--tilt-x', `${(-y * max).toFixed(2)}deg`)
      el.style.setProperty('--tilt-y', `${(x * max).toFixed(2)}deg`)
      el.style.setProperty('--tilt-scale', '1.02')
    })
  }

  function onLeave(): void {
    cancelAnimationFrame(rafId)
    reset()
  }

  onMounted(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (prefersReducedMotion()) return
    const el = target.value
    if (!el) return
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    attached = true
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(rafId)
    const el = target.value
    if (el && attached) {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  })
}
