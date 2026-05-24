<template>
  <component
    :is="tag"
    :href="href"
    :type="tag === 'button' ? type : undefined"
    class="btn"
    :class="[`btn--${variant}`, { 'btn--block': block }]"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
  >
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  to: { type: [String, Object], default: null },
  href: { type: String, default: null },
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'ghost', 'outline'].includes(v),
  },
  type: { type: String, default: 'button' },
  block: { type: Boolean, default: false },
})

const external = computed(() => Boolean(props.href))
const tag = computed(() => {
  if (props.to) return RouterLink
  if (props.href) return 'a'
  return 'button'
})
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: 0.65rem 1.25rem;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid transparent;
  text-decoration: none;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.btn--block {
  width: 100%;
}

.btn--primary {
  background: var(--color-accent);
  color: #0f1117;
}

.btn--primary:hover {
  filter: brightness(1.08);
  text-decoration: none;
}

.btn--ghost {
  background: transparent;
  color: var(--color-text-muted);
}

.btn--ghost:hover {
  color: var(--color-text);
  text-decoration: none;
}

.btn--outline {
  background: transparent;
  border-color: var(--color-border);
  color: var(--color-text);
}

.btn--outline:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  text-decoration: none;
}
</style>
