<template>
  <ul class="tags">
    <li v-for="tag in tags" :key="tag" class="tags__item">{{ tag }}</li>
  </ul>
</template>

<script setup>
defineProps({
  tags: { type: Array, default: () => [] },
})
</script>

<style scoped>
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.tags__item {
  font-size: 0.75rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-family: var(--font-mono);
}
</style>
