<template>
  <div class="marquee" :aria-label="ariaLabel" role="group">
    <div class="marquee__track">
      <ul class="marquee__list">
        <li v-for="(item, i) in items" :key="`a-${i}`" class="marquee__item">
          <span class="marquee__text">{{ item }}</span>
          <span class="marquee__sep" aria-hidden="true">/</span>
        </li>
      </ul>
      <ul class="marquee__list" aria-hidden="true">
        <li v-for="(item, i) in items" :key="`b-${i}`" class="marquee__item">
          <span class="marquee__text">{{ item }}</span>
          <span class="marquee__sep" aria-hidden="true">/</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    items: string[]
    ariaLabel?: string
  }>(),
  { ariaLabel: 'スキルマーキー' },
)
</script>

<style scoped>
.marquee {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: var(--space-lg) 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.015);
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
}

.marquee__track {
  display: flex;
  width: max-content;
  animation: marquee 36s linear infinite;
}

.marquee:hover .marquee__track {
  animation-play-state: paused;
}

.marquee__list {
  display: flex;
  align-items: center;
  gap: var(--space-xl);
  padding-right: var(--space-xl);
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
  color: var(--neon-violet);
  font-family: var(--font-mono);
  font-size: 1.25rem;
  opacity: 0.6;
}
</style>
