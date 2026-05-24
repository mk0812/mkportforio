<template>
  <a
    ref="el"
    :href="href"
    :target="target"
    :rel="rel"
    class="magnetic-anchor"
  >
    <slot />
  </a>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMagnetic } from '@/composables/useMagnetic'

withDefaults(
  defineProps<{
    href: string
    target?: string
    rel?: string
  }>(),
  {
    target: '_blank',
    rel: 'noopener noreferrer',
  },
)

const el = ref<HTMLElement | null>(null)
useMagnetic(el, { radius: 72, strength: 0.32 })
</script>

<style scoped>
.magnetic-anchor {
  display: inline-flex;
  transform: translate3d(var(--mag-x, 0), var(--mag-y, 0), 0);
}
</style>
