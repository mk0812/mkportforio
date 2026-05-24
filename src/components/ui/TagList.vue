<template>
  <ul class="tags" :class="{ 'tags--interactive': interactive }">
    <li
      v-for="(tag, i) in tags"
      :key="tag"
      class="tags__item"
      :class="{ 'is-accent': i < accentCount }"
    >
      {{ tag }}
    </li>
  </ul>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    tags: string[]
    accentCount?: number
    interactive?: boolean
  }>(),
  { accentCount: 2, interactive: false },
)
</script>

<style scoped>
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.tags__item {
  font-size: var(--fs-xs);
  padding: 0.3rem 0.7rem;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.04);
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  letter-spacing: 0.04em;
  border: 1px solid var(--color-border);
  transition:
    color var(--dur-base) var(--ease-out-expo),
    border-color var(--dur-base) var(--ease-out-expo),
    background var(--dur-base) var(--ease-out-expo);
}

.tags__item.is-accent {
  background: rgba(139, 92, 246, 0.12);
  border-color: rgba(139, 92, 246, 0.45);
  color: #cbb5ff;
}

.tags--interactive .tags__item:hover {
  color: var(--color-text);
}

.tags--interactive .tags__item:nth-child(4n + 1):hover {
  background: rgba(34, 211, 238, 0.14);
  border-color: rgba(34, 211, 238, 0.45);
}

.tags--interactive .tags__item:nth-child(4n + 2):hover {
  background: rgba(79, 123, 255, 0.14);
  border-color: rgba(79, 123, 255, 0.45);
}

.tags--interactive .tags__item:nth-child(4n + 3):hover {
  background: rgba(139, 92, 246, 0.14);
  border-color: rgba(139, 92, 246, 0.45);
}

.tags--interactive .tags__item:nth-child(4n):hover {
  background: rgba(236, 72, 153, 0.14);
  border-color: rgba(236, 72, 153, 0.45);
}
</style>
