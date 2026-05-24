<template>
  <ol class="timeline">
    <li v-for="item in items" :key="item.id" class="timeline__item">
      <div class="timeline__marker" aria-hidden="true" />
      <div class="timeline__content">
        <time class="timeline__period">{{ item.period }}</time>
        <h3 class="timeline__title">{{ item.title }}</h3>
        <p class="timeline__org">{{ item.organization }}</p>
        <p class="timeline__description">{{ item.description }}</p>
        <ul v-if="item.highlights?.length" class="timeline__highlights">
          <li v-for="(point, i) in item.highlights" :key="i">{{ point }}</li>
        </ul>
      </div>
    </li>
  </ol>
</template>

<script setup>
defineProps({
  items: { type: Array, default: () => [] },
})
</script>

<style scoped>
.timeline {
  position: relative;
  padding-left: var(--space-lg);
  border-left: 2px solid var(--color-border);
}

.timeline__item {
  position: relative;
  padding-bottom: var(--space-xl);
}

.timeline__item:last-child {
  padding-bottom: 0;
}

.timeline__marker {
  position: absolute;
  left: calc(-1 * var(--space-lg) - 5px);
  top: 0.35rem;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 0 4px var(--color-accent-soft);
}

.timeline__period {
  display: block;
  font-size: 0.8rem;
  font-family: var(--font-mono);
  color: var(--color-accent);
  margin-bottom: var(--space-sm);
}

.timeline__title {
  font-size: 1.1rem;
  margin-bottom: var(--space-xs);
}

.timeline__org {
  margin: 0 0 var(--space-md);
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.timeline__description {
  margin-bottom: var(--space-md);
  color: var(--color-text-muted);
}

.timeline__highlights {
  list-style: disc;
  padding-left: 1.25rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.timeline__highlights li {
  margin-bottom: var(--space-xs);
}
</style>
