<template>
  <div ref="rootEl" class="timeline-wrap">
    <div class="timeline__line" aria-hidden="true">
      <div class="timeline__line-fill" />
    </div>
    <ol class="timeline">
      <li v-for="item in items" :key="item.id" class="timeline__item">
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
import { onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Experience } from '@/types'
import { prefersReducedMotion } from '@/composables/usePrefersReducedMotion'

defineProps<{
  items: Experience[]
}>()

const rootEl = ref<HTMLElement | null>(null)
const triggers: ScrollTrigger[] = []

onMounted(() => {
  if (prefersReducedMotion()) return
  const root = rootEl.value
  if (!root) return
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
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
}

.timeline__line-fill {
  position: absolute;
  inset: 0;
  background: var(--gradient-primary);
  transform-origin: top;
  transform: scaleY(0);
  border-radius: inherit;
  box-shadow: 0 0 12px rgba(139, 92, 246, 0.45);
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
    0 0 12px rgba(139, 92, 246, 0.45);
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
</style>
