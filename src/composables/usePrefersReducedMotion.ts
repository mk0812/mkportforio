import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

const MEDIA = '(prefers-reduced-motion: reduce)'

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia(MEDIA).matches
}

export function usePrefersReducedMotion(): Ref<boolean> {
  const isReduced = ref(prefersReducedMotion())

  let mql: MediaQueryList | null = null
  const handler = (event: MediaQueryListEvent) => {
    isReduced.value = event.matches
  }

  onMounted(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    mql = window.matchMedia(MEDIA)
    isReduced.value = mql.matches
    mql.addEventListener('change', handler)
  })

  onBeforeUnmount(() => {
    mql?.removeEventListener('change', handler)
  })

  return isReduced
}
