import { onBeforeUnmount, onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from './usePrefersReducedMotion'

let installed = false

export function useLenis(): void {
  let lenis: { destroy: () => void; raf: (time: number) => void } | null = null
  let tickerCb: ((time: number) => void) | null = null

  onMounted(async () => {
    if (installed) return
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (prefersReducedMotion()) return

    const { default: Lenis } = await import('lenis')
    gsap.registerPlugin(ScrollTrigger)

    const instance = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    })

    instance.on('scroll', () => ScrollTrigger.update())

    tickerCb = (time: number) => {
      instance.raf(time * 1000)
    }
    gsap.ticker.add(tickerCb)
    gsap.ticker.lagSmoothing(0)

    lenis = instance
    installed = true
  })

  onBeforeUnmount(() => {
    if (tickerCb) {
      gsap.ticker.remove(tickerCb)
      tickerCb = null
    }
    if (lenis) {
      lenis.destroy()
      lenis = null
    }
    installed = false
  })
}
