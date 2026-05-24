import { onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from './usePrefersReducedMotion'

let registered = false

function ensureRegistered(): void {
  if (registered) return
  gsap.registerPlugin(ScrollTrigger)
  registered = true
}

export interface RevealOptions {
  y?: number
  delay?: number
  duration?: number
  start?: string
  stagger?: number
}

type Target = Element | Element[] | NodeListOf<Element>

function toElementArray(target: Target): Element[] {
  if (target instanceof Element) return [target]
  return Array.from(target)
}

export function useScrollReveal() {
  ensureRegistered()
  const triggers: ScrollTrigger[] = []

  function revealOnScroll(target: Target, opts: RevealOptions = {}): void {
    const els = toElementArray(target)
    if (els.length === 0) return

    if (prefersReducedMotion()) {
      gsap.set(els, { opacity: 1, y: 0, clearProps: 'all' })
      return
    }

    const tween = gsap.from(els, {
      y: opts.y ?? 48,
      opacity: 0,
      duration: opts.duration ?? 0.9,
      ease: 'expo.out',
      delay: opts.delay ?? 0,
      stagger: opts.stagger ?? 0,
      scrollTrigger: {
        trigger: els[0]!,
        start: opts.start ?? 'top 85%',
        once: true,
      },
    })

    const st = tween.scrollTrigger
    if (st) triggers.push(st)
  }

  function staggerReveal(target: Target, stagger = 0.08, opts: RevealOptions = {}): void {
    revealOnScroll(target, { ...opts, stagger, start: opts.start ?? 'top 80%' })
  }

  onBeforeUnmount(() => {
    for (const t of triggers) t.kill()
    triggers.length = 0
  })

  return { revealOnScroll, staggerReveal }
}
