import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { prefersReducedMotion } from './usePrefersReducedMotion'

export interface MagneticOptions {
  radius?: number
  strength?: number
  enabled?: boolean
}

export function useMagnetic(target: Ref<HTMLElement | null>, options: MagneticOptions = {}) {
  const radius = options.radius ?? 80
  const strength = options.strength ?? 0.35
  const enabled = options.enabled ?? true
  let rafId = 0
  let attached = false

  function reset(): void {
    const el = target.value
    if (!el) return
    el.style.setProperty('--mag-x', '0px')
    el.style.setProperty('--mag-y', '0px')
  }

  function onMove(event: PointerEvent): void {
    const el = target.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = event.clientX - cx
    const dy = event.clientY - cy
    const dist = Math.hypot(dx, dy)
    if (dist > radius * 2) {
      reset()
      return
    }
    cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => {
      el.style.setProperty('--mag-x', `${(dx * strength).toFixed(2)}px`)
      el.style.setProperty('--mag-y', `${(dy * strength).toFixed(2)}px`)
    })
  }

  function onLeave(): void {
    cancelAnimationFrame(rafId)
    reset()
  }

  onMounted(() => {
    if (!enabled) return
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (prefersReducedMotion()) return
    const el = target.value
    if (!el) return
    window.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave)
    attached = true
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(rafId)
    if (!attached) return
    window.removeEventListener('pointermove', onMove)
    const el = target.value
    if (el) el.removeEventListener('pointerleave', onLeave)
  })
}
