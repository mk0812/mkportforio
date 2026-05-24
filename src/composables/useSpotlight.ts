import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { prefersReducedMotion } from './usePrefersReducedMotion'

export function useSpotlight(target: Ref<HTMLElement | null>) {
  let rafId = 0
  let attached = false

  function onMove(event: PointerEvent): void {
    const el = target.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => {
      el.style.setProperty('--spotlight-x', `${x.toFixed(1)}%`)
      el.style.setProperty('--spotlight-y', `${y.toFixed(1)}%`)
      el.style.setProperty('--spotlight-opacity', '0.18')
    })
  }

  function onLeave(): void {
    cancelAnimationFrame(rafId)
    const el = target.value
    if (!el) return
    el.style.setProperty('--spotlight-opacity', '0')
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
