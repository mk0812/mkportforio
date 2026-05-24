<template>
  <component :is="tag" class="gradient-text-el" :class="{ 'is-animated': animate }">
    <slot />
  </component>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    tag?: string
    animate?: boolean
  }>(),
  { tag: 'span', animate: false },
)
</script>

<style scoped>
.gradient-text-el {
  background: var(--gradient-text);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.gradient-text-el.is-animated {
  animation: gradient-shift 8s var(--ease-in-out-quart) infinite;
}
</style>
