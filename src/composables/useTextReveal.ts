import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import gsap from 'gsap'
import { prefersReducedMotion } from './usePrefersReducedMotion'

export interface TextRevealOptions {
  delay?: number
  duration?: number
  stagger?: number
}

function splitTextIntoChars(el: HTMLElement): HTMLSpanElement[] {
  const original = el.textContent ?? ''
  if (!original) return []

  const lines = original.split('\n')
  el.textContent = ''
  const chars: HTMLSpanElement[] = []

  lines.forEach((line, lineIndex) => {
    const words = line.split(' ')
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span')
      wordSpan.className = 'char-word'
      wordSpan.style.display = 'inline-block'
      wordSpan.style.whiteSpace = 'nowrap'

      for (const ch of word) {
        const wrapper = document.createElement('span')
        wrapper.className = 'char-wrap'
        wrapper.style.display = 'inline-block'
        wrapper.style.overflow = 'hidden'
        wrapper.style.verticalAlign = 'bottom'

        const inner = document.createElement('span')
        inner.className = 'char'
        inner.style.display = 'inline-block'
        inner.textContent = ch

        wrapper.appendChild(inner)
        wordSpan.appendChild(wrapper)
        chars.push(inner)
      }

      el.appendChild(wordSpan)

      if (wordIndex < words.length - 1) {
        el.appendChild(document.createTextNode(' '))
      }
    })

    if (lineIndex < lines.length - 1) {
      el.appendChild(document.createElement('br'))
    }
  })

  return chars
}

export function useTextReveal(target: Ref<HTMLElement | null>, opts: TextRevealOptions = {}) {
  let chars: HTMLSpanElement[] = []
  let originalText = ''

  onMounted(() => {
    const el = target.value
    if (!el) return
    originalText = el.textContent ?? ''

    if (prefersReducedMotion()) return

    chars = splitTextIntoChars(el)
    if (chars.length === 0) return

    gsap.from(chars, {
      yPercent: 110,
      opacity: 0,
      duration: opts.duration ?? 0.9,
      delay: opts.delay ?? 0.1,
      stagger: opts.stagger ?? 0.025,
      ease: 'expo.out',
    })
  })

  onBeforeUnmount(() => {
    const el = target.value
    if (el && originalText) {
      el.textContent = originalText
    }
    chars = []
  })
}
