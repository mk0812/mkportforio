<template>
  <div class="blog-index">
    <SectionBlock eyebrow="Index / Journal" title="Blog" subtitle="制作メモ・技術ノート・更新情報">
      <BlogTagFilter v-model="selectedTag" :tags="allTags" />
      <BlogList v-if="filteredPosts.length" :posts="filteredPosts" />
      <p v-else class="blog-index__empty">該当する記事がありません。</p>
    </SectionBlock>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SectionBlock from '@/components/layout/SectionBlock.vue'
import BlogList from '@/components/blog/BlogList.vue'
import BlogTagFilter from '@/components/blog/BlogTagFilter.vue'
import { useBlogPosts } from '@/composables/useBlogPosts'

const route = useRoute()
const router = useRouter()
const { posts, allTags } = useBlogPosts()

const selectedTag = computed({
  get(): string | null {
    const tag = route.query.tag
    return typeof tag === 'string' ? tag : null
  },
  set(value: string | null) {
    router.replace({
      path: '/blog',
      query: value ? { tag: value } : {},
    })
  },
})

const filteredPosts = computed(() => {
  if (!selectedTag.value) return posts.value
  return posts.value.filter((post) => post.tags.includes(selectedTag.value!))
})

watch(
  () => route.query.tag,
  (tag) => {
    if (typeof tag === 'string' && !allTags.value.includes(tag)) {
      router.replace({ path: '/blog' })
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.blog-index {
  padding-top: var(--space-2xl);
}

.blog-index__empty {
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--fs-md);
}
</style>
