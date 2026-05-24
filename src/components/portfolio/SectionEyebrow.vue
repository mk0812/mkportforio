<template>
  <div ref="rootEl" class="eyebrow-wrap" :class="{ 'is-visible': isVisible }">
    <p class="eyebrow">
      <span v-if="dot" class="eyebrow__dot" aria-hidden="true" />
      <template v-if="parsedIndex !== null">
        <span class="eyebrow__index">{{ displayIndex }}</span>
        <span class="eyebrow__sep" aria-hidden="true"> / </span>
        <span class="eyebrow__label">{{ parsedLabel }}</span>
      </template>
      <template v-else-if="text">
        {{ text }}
      </template>
      <template v-else>
        <slot />
      </template>
    </p>
    <span class="eyebrow__line" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { prefersReducedMotion } from '@/composables/usePrefersReducedMotion'

const EYEBROW_PATTERN = /^(\d+)\s*\/\s*(.+)$/

const props = withDefaults(
  defineProps<{
    text?: string
    dot?: boolean
  }>(),
  { text: undefined, dot: true },
)

const rootEl = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const displayIndex = ref(0)
let observer: IntersectionObserver | null = null
let rafId = 0

const parsed = computed(() => {
  const source = props.text?.trim() ?? ''
  const match = source.match(EYEBROW_PATTERN)
  if (!match) return { index: null, label: source }
  return { index: Number.parseInt(match[1]!, 10), label: match[2]!.trim() }
})

const parsedIndex = computed(() => parsed.value.index)
const parsedLabel = computed(() => parsed.value.label)

function runCountUp(target: number): void {
  if (prefersReducedMotion()) {
    displayIndex.value = target
    return
  }

  const start = performance.now()
  const duration = 400

  function tick(now: number): void {
    const progress = Math.min(1, (now - start) / duration)
    displayIndex.value = Math.round(target * progress)
    if (progress < 1) {
      rafId = requestAnimationFrame(tick)
    }
  }

  cancelAnimationFrame(rafId)
  displayIndex.value = 0
  rafId = requestAnimationFrame(tick)
}

function onVisible(): void {
  isVisible.value = true
  if (parsedIndex.value !== null) {
    runCountUp(parsedIndex.value)
  }
}

watch(parsedIndex, (index) => {
  if (index !== null && isVisible.value) {
    runCountUp(index)
  }
})

onMounted(() => {
  if (typeof window === 'undefined' || !rootEl.value) return

  if (prefersReducedMotion()) {
    isVisible.value = true
    if (parsedIndex.value !== null) {
      displayIndex.value = parsedIndex.value
    }
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          onVisible()
          observer?.disconnect()
          observer = null
          break
        }
      }
    },
    { threshold: 0.4 },
  )
  observer.observe(rootEl.value)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  observer?.disconnect()
  observer = null
})
</script>

<style scoped>
.eyebrow-wrap {
  display: inline-flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--neon-cyan);
}

.eyebrow__index {
  font-variant-numeric: tabular-nums;
  min-width: 1.5ch;
}

.eyebrow__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--neon-cyan);
  color: var(--neon-cyan);
  box-shadow: 0 0 12px currentColor;
  animation: pulse-glow 2.2s ease-in-out infinite;
}

.eyebrow__line {
  display: block;
  height: 1px;
  width: min(100%, 7.5rem);
  background: var(--gradient-primary);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 550ms var(--ease-out-expo);
}

.eyebrow-wrap.is-visible .eyebrow__line {
  transform: scaleX(1);
}

@media (prefers-reduced-motion: reduce) {
  .eyebrow__line {
    transition: none;
  }
}
</style>
