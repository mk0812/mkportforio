<template>
  <component
    :is="tag"
    :to="to"
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

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import type { ButtonVariant } from '@/types'

const props = withDefaults(
  defineProps<{
    to?: RouteLocationRaw | null
    href?: string | null
    variant?: ButtonVariant
    type?: 'button' | 'submit' | 'reset'
    block?: boolean
  }>(),
  {
    to: null,
    href: null,
    variant: 'primary',
    type: 'button',
    block: false,
  },
)

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
