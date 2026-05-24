<template>
  <p class="eyebrow">
    <span v-if="dot" class="eyebrow__dot" aria-hidden="true" />
    <slot />
  </p>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    dot?: boolean
  }>(),
  { dot: true },
)
</script>

<style scoped>
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  margin: 0 0 var(--space-md);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--neon-cyan);
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
</style>
