<template>
  <section :id="id" class="section" :aria-labelledby="titleId">
    <header v-if="title || $slots.header || eyebrow" class="section__header">
      <slot name="header">
        <SectionEyebrow v-if="eyebrow">{{ eyebrow }}</SectionEyebrow>
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
import SectionEyebrow from '@/components/portfolio/SectionEyebrow.vue'

const props = withDefaults(
  defineProps<{
    id?: string
    title?: string
    subtitle?: string
    eyebrow?: string
  }>(),
  {
    id: undefined,
    title: '',
    subtitle: '',
    eyebrow: '',
  },
)

const titleId = computed(() =>
  props.id ? `${props.id}-heading` : undefined,
)
</script>

<style scoped>
.section {
  margin-bottom: var(--space-3xl);
  position: relative;
}

.section__header {
  margin-bottom: var(--space-xl);
  max-width: var(--max-width-readable);
}

.section__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.5vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.05;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0 0 var(--space-md);
}

.section__subtitle {
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--fs-md);
}
</style>
