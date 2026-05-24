<template>
  <div
    class="marquee"
    :class="{ 'marquee--slow': isHovered }"
    :aria-label="ariaLabel"
    role="group"
    @pointerenter="isHovered = true"
    @pointerleave="isHovered = false"
  >
    <div class="marquee__bg" aria-hidden="true">
      <div class="marquee__bg-track">
        <ul class="marquee__list marquee__list--ghost">
          <li v-for="(item, i) in items" :key="`bg-a-${i}`" class="marquee__item">
            <span class="marquee__text">{{ item }}</span>
            <span class="marquee__sep" aria-hidden="true" />
          </li>
        </ul>
        <ul class="marquee__list marquee__list--ghost" aria-hidden="true">
          <li v-for="(item, i) in items" :key="`bg-b-${i}`" class="marquee__item">
            <span class="marquee__text">{{ item }}</span>
            <span class="marquee__sep" aria-hidden="true" />
          </li>
        </ul>
      </div>
    </div>
    <div class="marquee__track">
      <ul class="marquee__list">
        <li v-for="(item, i) in items" :key="`a-${i}`" class="marquee__item">
          <span class="marquee__text">{{ item }}</span>
          <span class="marquee__sep" aria-hidden="true" />
        </li>
      </ul>
      <ul class="marquee__list" aria-hidden="true">
        <li v-for="(item, i) in items" :key="`b-${i}`" class="marquee__item">
          <span class="marquee__text">{{ item }}</span>
          <span class="marquee__sep" aria-hidden="true" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
  defineProps<{
    items: string[]
    ariaLabel?: string
  }>(),
  { ariaLabel: 'スキルマーキー' },
)

const isHovered = ref(false)
</script>

<style scoped>
@property --marquee-duration {
  syntax: '<time>';
  inherits: true;
  initial-value: 36s;
}

.marquee {
  --marquee-duration: 36s;
  --marquee-bg-duration: 72s;
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: var(--space-lg) 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.015);
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  transition: --marquee-duration 400ms var(--ease-out-expo);
}

.marquee--slow {
  --marquee-duration: 54s;
  --marquee-bg-duration: 108s;
}

.marquee__bg {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  opacity: 0.18;
  pointer-events: none;
}

.marquee__bg-track {
  display: flex;
  width: max-content;
  animation: marquee-reverse var(--marquee-bg-duration) linear infinite;
}

.marquee__track {
  position: relative;
  display: flex;
  width: max-content;
  animation: marquee var(--marquee-duration) linear infinite;
}

.marquee__list {
  display: flex;
  align-items: center;
  gap: var(--space-xl);
  padding-right: var(--space-xl);
}

.marquee__list--ghost .marquee__text {
  opacity: 0.55;
}

.marquee__item {
  display: flex;
  align-items: center;
  gap: var(--space-xl);
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.marquee__text {
  background: var(--gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.marquee__sep {
  display: inline-block;
  width: 2px;
  height: 1.25em;
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  opacity: 0.75;
  flex-shrink: 0;
}

@keyframes marquee-reverse {
  from {
    transform: translateX(-50%);
  }
  to {
    transform: translateX(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee__track,
  .marquee__bg-track {
    animation: none;
  }
}
</style>
