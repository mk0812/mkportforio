<template>
  <div class="blog-post-meta">
    <time class="blog-post-meta__date" :datetime="post.date">{{ formattedDate }}</time>
    <span class="blog-post-meta__reading">{{ post.readingTime }} min read</span>
    <TagList v-if="post.tags.length" :tags="post.tags" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Post } from '@/types/blog'
import TagList from '@/components/ui/TagList.vue'

const props = defineProps<{
  post: Pick<Post, 'date' | 'readingTime' | 'tags'>
}>()

const formattedDate = computed(() => {
  const [year, month, day] = props.post.date.split('-')
  return `${year}.${month}.${day}`
})
</script>

<style scoped>
.blog-post-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.blog-post-meta__date,
.blog-post-meta__reading {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  letter-spacing: 0.08em;
  color: var(--color-text-dim);
}

.blog-post-meta__reading {
  color: var(--color-text-muted);
}
</style>
