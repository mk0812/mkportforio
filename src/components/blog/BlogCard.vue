<template>
  <article ref="cardEl" class="blog-card">
    <RouterLink :to="`/blog/${post.slug}`" class="blog-card__hit" :aria-label="post.title" />
    <div class="blog-card__spotlight" aria-hidden="true" />
    <div class="blog-card__body">
      <div class="blog-card__meta">
        <time :datetime="post.date">{{ formattedDate }}</time>
        <span class="blog-card__reading">{{ post.readingTime }} min read</span>
      </div>
      <h2 class="blog-card__title">{{ post.title }}</h2>
      <p class="blog-card__description">{{ post.description }}</p>
      <TagList v-if="post.tags.length" :tags="post.tags" interactive />
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Post } from '@/types/blog'
import TagList from '@/components/ui/TagList.vue'
import { useTilt } from '@/composables/useTilt'
import { useSpotlight } from '@/composables/useSpotlight'

const props = defineProps<{
  post: Post
}>()

const cardEl = ref<HTMLElement | null>(null)

const formattedDate = computed(() => {
  const [year, month, day] = props.post.date.split('-')
  return `${year}.${month}.${day}`
})

useTilt(cardEl, { max: 4 })
useSpotlight(cardEl)
</script>

<style scoped>
.blog-card {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-surface-elevated);
  border-radius: var(--radius-lg);
  overflow: hidden;
  isolation: isolate;
  border: 1px solid var(--color-border);
  transform:
    perspective(1000px)
    rotateX(var(--tilt-x, 0deg))
    rotateY(var(--tilt-y, 0deg))
    scale(var(--tilt-scale, 1));
  transform-style: preserve-3d;
  transition:
    transform var(--dur-base) var(--ease-out-expo),
    box-shadow var(--dur-base) var(--ease-out-expo),
    border-color var(--dur-base) var(--ease-out-expo);
}

.blog-card:hover {
  border-color: var(--color-border-strong);
  box-shadow: var(--shadow-glow);
}

.blog-card__hit {
  position: absolute;
  inset: 0;
  z-index: 2;
  text-indent: -9999px;
  overflow: hidden;
}

.blog-card__spotlight {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%),
    rgba(255, 255, 255, 0.12),
    transparent 55%
  );
  opacity: var(--spotlight-opacity, 0);
  transition: opacity var(--dur-base) var(--ease-out-expo);
  pointer-events: none;
  z-index: 1;
}

.blog-card__body {
  position: relative;
  z-index: 1;
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  flex: 1;
}

.blog-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  letter-spacing: 0.08em;
}

.blog-card__reading {
  color: var(--color-text-muted);
}

.blog-card__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--fs-xl);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text);
  line-height: 1.2;
}

.blog-card__description {
  flex: 1;
  margin: 0;
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
  line-height: 1.55;
}

@media (max-width: 720px) {
  .blog-card__title {
    font-size: var(--fs-lg);
  }
}
</style>
