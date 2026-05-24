<template>
  <div class="blog-list">
    <BlogCard v-for="post in posts" :key="post.slug" :post="post" />
  </div>
</template>

<script setup lang="ts">
import type { Post } from '@/types/blog'
import BlogCard from '@/components/blog/BlogCard.vue'

defineProps<{
  posts: Post[]
}>()
</script>

<style scoped>
.blog-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
  gap: var(--space-lg);
}
</style>
