<template>
  <div ref="rootEl" class="timeline-wrap">
    <div class="timeline__line" aria-hidden="true">
      <div class="timeline__line-fill" />
    </div>
    <ol class="timeline">
      <li
        v-for="(item, index) in items"
        :key="item.id"
        :ref="(el) => setItemRef(el, index)"
        class="timeline__item"
        :class="{ 'is-active': activeIndex === index }"
      >
        <div class="timeline__marker" aria-hidden="true">
          <span class="timeline__marker-dot" />
        </div>
        <div class="timeline__content">
          <time class="timeline__period">{{ item.period }}</time>
          <h3 class="timeline__title">{{ item.title }}</h3>
          <p class="timeline__org">{{ item.organization }}</p>
          <p class="timeline__description">{{ item.description }}</p>
          <ul v-if="item.highlights.length" class="timeline__highlights">
            <li v-for="(point, i) in item.highlights" :key="i">{{ point }}</li>
          </ul>
        </div>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, type ComponentPublicInstance } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Experience } from '@/types'
import { prefersReducedMotion } from '@/composables/usePrefersReducedMotion'

defineProps<{
  items: Experience[]
}>()

const rootEl = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const itemEls = ref<(HTMLElement | null)[]>([])
const triggers: ScrollTrigger[] = []
let activeObserver: IntersectionObserver | null = null
const visibleRatios = new Map<number, number>()

function setItemRef(
  el: Element | ComponentPublicInstance | null,
  index: number,
): void {
  if (el instanceof HTMLElement) {
    itemEls.value[index] = el
    return
  }
  itemEls.value[index] = null
}

function setupActiveObserver(): void {
  const reduced = prefersReducedMotion()
  activeObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const index = itemEls.value.findIndex((item) => item === entry.target)
        if (index === -1) continue
        visibleRatios.set(index, entry.intersectionRatio)
      }

      let bestIndex = activeIndex.value
      let bestRatio = 0
      for (const [index, ratio] of visibleRatios) {
        if (ratio > bestRatio) {
          bestRatio = ratio
          bestIndex = index
        }
      }

      if (bestRatio > 0) {
        activeIndex.value = bestIndex
      }
    },
    {
      root: null,
      threshold: reduced ? [0, 0.5, 1] : [0, 0.25, 0.5, 0.75, 1],
      rootMargin: '-20% 0px -35% 0px',
    },
  )

  for (const item of itemEls.value) {
    if (item) activeObserver.observe(item)
  }
}

onMounted(() => {
  const root = rootEl.value
  if (!root) return

  setupActiveObserver()

  if (prefersReducedMotion()) return
  gsap.registerPlugin(ScrollTrigger)

  const fill = root.querySelector<HTMLElement>('.timeline__line-fill')
  if (fill) {
    const tween = gsap.fromTo(
      fill,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top 75%',
          end: 'bottom 65%',
          scrub: 0.6,
        },
      },
    )
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
  }

  const items = root.querySelectorAll<HTMLElement>('.timeline__item')
  items.forEach((item) => {
    const t = gsap.from(item, {
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: 'expo.out',
      scrollTrigger: { trigger: item, start: 'top 80%', once: true },
    })
    if (t.scrollTrigger) triggers.push(t.scrollTrigger)
  })
})

onBeforeUnmount(() => {
  activeObserver?.disconnect()
  activeObserver = null
  visibleRatios.clear()
  for (const t of triggers) t.kill()
  triggers.length = 0
})
</script>

<style scoped>
.timeline-wrap {
  position: relative;
  padding-left: var(--space-2xl);
}

.timeline__line {
  position: absolute;
  left: var(--space-md);
  top: 0.5rem;
  bottom: 0.5rem;
  width: 2px;
  background: linear-gradient(
    to bottom,
    var(--neon-cyan) 0%,
    var(--neon-violet) 50%,
    var(--neon-magenta) 100%
  );
  border-radius: var(--radius-sm);
  opacity: 0.35;
}

.timeline__line-fill {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    var(--neon-cyan) 0%,
    var(--neon-violet) 50%,
    var(--neon-magenta) 100%
  );
  transform-origin: top;
  transform: scaleY(0);
  border-radius: inherit;
  box-shadow: 0 0 12px var(--neon-glow);
}

.timeline {
  position: relative;
  padding: 0;
  list-style: none;
  margin: 0;
}

.timeline__item {
  position: relative;
  padding-bottom: var(--space-2xl);
  filter: saturate(0.6);
  transition: filter var(--dur-base) var(--ease-out-expo);
}

.timeline__item.is-active {
  filter: saturate(1);
}

.timeline__item:last-child {
  padding-bottom: 0;
}

.timeline__marker {
  position: absolute;
  left: calc(-1 * var(--space-2xl) + var(--space-md) - 6px);
  top: 0.5rem;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline__marker-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-bg);
  border: 2px solid var(--neon-violet);
  box-shadow:
    0 0 0 4px rgba(139, 92, 246, 0.15),
    0 0 16px var(--neon-glow);
  transition:
    width var(--dur-base) var(--ease-out-expo),
    height var(--dur-base) var(--ease-out-expo),
    box-shadow var(--dur-base) var(--ease-out-expo);
}

.timeline__item.is-active .timeline__marker-dot {
  width: 14px;
  height: 14px;
  box-shadow:
    0 0 0 4px rgba(139, 92, 246, 0.25),
    0 0 24px var(--neon-glow),
    0 0 40px rgba(236, 72, 153, 0.35);
}

.timeline__content {
  padding: var(--space-lg);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface-elevated);
  transition:
    transform var(--dur-base) var(--ease-out-expo),
    box-shadow var(--dur-base) var(--ease-out-expo);
}

.timeline__content:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.timeline__period {
  display: block;
  font-size: var(--fs-xs);
  font-family: var(--font-mono);
  color: var(--neon-cyan);
  letter-spacing: 0.1em;
  margin-bottom: var(--space-xs);
  text-transform: uppercase;
}

.timeline__title {
  font-family: var(--font-display);
  font-size: var(--fs-lg);
  font-weight: 700;
  letter-spacing: -0.015em;
  margin: 0 0 var(--space-2xs);
  color: var(--color-text);
}

.timeline__org {
  margin: 0 0 var(--space-md);
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
}

.timeline__description {
  margin-bottom: var(--space-md);
  color: var(--color-text-muted);
}

.timeline__highlights {
  padding-left: 0;
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
  display: grid;
  gap: var(--space-2xs);
}

.timeline__highlights li {
  position: relative;
  padding-left: 1.25rem;
}

.timeline__highlights li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.6em;
  width: 6px;
  height: 1px;
  background: var(--neon-violet);
}

@media (prefers-reduced-motion: reduce) {
  .timeline__item,
  .timeline__marker-dot,
  .timeline__content {
    transition: none;
  }
}
</style>
