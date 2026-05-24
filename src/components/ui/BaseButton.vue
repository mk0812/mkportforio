<template>
  <component
    :is="tag"
    :ref="setRef"
    :to="to"
    :href="href"
    :type="tag === 'button' ? type : undefined"
    class="btn"
    :class="[`btn--${variant}`, { 'btn--block': block, 'btn--magnetic': magnetic }]"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
  >
    <span class="btn__inner">
      <slot />
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import type { ButtonVariant } from '@/types'
import { useMagnetic } from '@/composables/useMagnetic'

const props = withDefaults(
  defineProps<{
    to?: RouteLocationRaw | null
    href?: string | null
    variant?: ButtonVariant
    type?: 'button' | 'submit' | 'reset'
    block?: boolean
    magnetic?: boolean
  }>(),
  {
    to: null,
    href: null,
    variant: 'primary',
    type: 'button',
    block: false,
    magnetic: false,
  },
)

const innerEl = ref<HTMLElement | null>(null)

function setRef(instance: unknown): void {
  if (!instance) {
    innerEl.value = null
    return
  }
  if (instance instanceof HTMLElement) {
    innerEl.value = instance
    return
  }
  if (typeof instance === 'object' && '$el' in instance) {
    const el = (instance as { $el: unknown }).$el
    if (el instanceof HTMLElement) innerEl.value = el
  }
}

const external = computed(() => Boolean(props.href))

const tag = computed(() => {
  if (props.to) return RouterLink
  if (props.href) return 'a'
  return 'button'
})

useMagnetic(innerEl, { radius: 90, strength: 0.28, enabled: props.magnetic })
</script>

<style scoped>
.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: 0.85rem 1.5rem;
  border-radius: var(--radius-full);
  font-family: var(--font-sans);
  font-size: var(--fs-sm);
  font-weight: 600;
  letter-spacing: 0.01em;
  border: 1px solid transparent;
  text-decoration: none;
  transition:
    transform var(--dur-base) var(--ease-out-expo),
    background var(--dur-base) var(--ease-out-expo),
    border-color var(--dur-base) var(--ease-out-expo),
    color var(--dur-base) var(--ease-out-expo),
    box-shadow var(--dur-base) var(--ease-out-expo);
  cursor: pointer;
  isolation: isolate;
}

.btn--magnetic {
  transform: translate3d(var(--mag-x, 0), var(--mag-y, 0), 0);
}

.btn__inner {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  position: relative;
  z-index: 1;
}

.btn--block {
  width: 100%;
}

/* Primary: gradient fill */
.btn--primary {
  color: #0a0c14;
  background: var(--gradient-primary);
  background-size: 200% 100%;
  background-position: 0% 0%;
  box-shadow: var(--shadow-md);
}

.btn--primary:hover {
  background-position: 100% 0%;
  box-shadow: var(--shadow-glow);
  text-decoration: none;
  color: #0a0c14;
}

.btn--primary:focus-visible {
  outline-offset: 4px;
}

/* Ghost: subtle text */
.btn--ghost {
  background: transparent;
  color: var(--color-text-muted);
  padding-inline: 0.75rem;
}

.btn--ghost:hover {
  color: var(--color-text);
  text-decoration: none;
}

/* Outline: glass border w/ gradient hover */
.btn--outline {
  background: var(--glass-bg);
  border-color: var(--color-border-strong);
  color: var(--color-text);
  backdrop-filter: blur(8px);
}

.btn--outline:hover {
  color: var(--color-text);
  text-decoration: none;
  background:
    linear-gradient(var(--color-bg), var(--color-bg)) padding-box,
    var(--gradient-primary) border-box;
  border: 1px solid transparent;
  box-shadow: var(--shadow-glow);
}
</style>
