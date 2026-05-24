<template>
  <section :id="id" class="section" :aria-labelledby="titleId">
    <header v-if="title || $slots.header" class="section__header">
      <slot name="header">
        <h2 :id="titleId" class="section__title">{{ title }}</h2>
        <p v-if="subtitle" class="section__subtitle">{{ subtitle }}</p>
      </slot>
    </header>
    <div class="section__body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    id?: string
    title?: string
    subtitle?: string
  }>(),
  {
    id: undefined,
    title: '',
    subtitle: '',
  },
)

const titleId = computed(() =>
  props.id ? `${props.id}-heading` : undefined,
)
</script>

<style scoped>
.section {
  margin-bottom: var(--space-2xl);
}

.section__header {
  margin-bottom: var(--space-xl);
}

.section__title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 600;
}

.section__subtitle {
  margin: var(--space-sm) 0 0;
  color: var(--color-text-muted);
  max-width: 42rem;
}
</style>
