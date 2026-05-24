<template>
  <IconGithub v-if="name === 'github'" />
  <IconX v-else-if="name === 'x'" />
  <IconMail v-else-if="name === 'mail'" />
  <span v-else class="fallback" aria-hidden="true">{{ name.charAt(0).toUpperCase() }}</span>
</template>

<script setup lang="ts">
import IconGithub from './IconGithub.vue'
import IconX from './IconX.vue'
import IconMail from './IconMail.vue'

defineProps<{
  name: string
}>()
</script>

<style scoped>
.fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: 700;
}
</style>
