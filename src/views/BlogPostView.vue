<template>
  <article v-if="post" class="blog-post">
    <header class="blog-post__header">
      <BlogPostMeta :post="post" />
      <h1 ref="titleEl" class="blog-post__title">{{ post.title }}</h1>
      <p class="blog-post__description">{{ post.description }}</p>
    </header>

    <div ref="contentEl" class="blog-post__content">
      <component :is="PostContent" v-if="PostContent" />
    </div>

    <footer class="blog-post__footer">
      <nav v-if="prev || next" class="blog-post__nav" aria-label="前後の記事">
        <RouterLink v-if="prev" :to="`/blog/${prev.slug}`" class="blog-post__nav-link">
          <span class="blog-post__nav-label">← 前の記事</span>
          <span class="blog-post__nav-title">{{ prev.title }}</span>
        </RouterLink>
        <span v-else class="blog-post__nav-spacer" />
        <RouterLink v-if="next" :to="`/blog/${next.slug}`" class="blog-post__nav-link blog-post__nav-link--next">
          <span class="blog-post__nav-label">次の記事 →</span>
          <span class="blog-post__nav-title">{{ next.title }}</span>
        </RouterLink>
      </nav>
      <BaseButton to="/blog" variant="outline">すべての記事を見る</BaseButton>
    </footer>
  </article>
</template>

<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  onMounted,
  ref,
  watch,
  type Component,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BlogPostMeta from '@/components/blog/BlogPostMeta.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useBlogPosts } from '@/composables/useBlogPosts'
import { useTextReveal } from '@/composables/useTextReveal'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { prefersReducedMotion } from '@/composables/usePrefersReducedMotion'

const route = useRoute()
const router = useRouter()
const { getPostBySlug, getAdjacentPosts } = useBlogPosts()

const titleEl = ref<HTMLElement | null>(null)
const contentEl = ref<HTMLElement | null>(null)

useTextReveal(titleEl, { delay: 0.05 })

const slug = computed(() => route.params.slug as string)
const post = computed(() => getPostBySlug(slug.value))
const adjacent = computed(() => getAdjacentPosts(slug.value))
const prev = computed(() => adjacent.value.prev)
const next = computed(() => adjacent.value.next)

const PostContent = computed(() => {
  if (!post.value) return null
  return defineAsyncComponent(
    post.value.loader as () => Promise<{ default: Component }>,
  )
})

const { staggerReveal } = useScrollReveal()

function updateDocumentTitle(): void {
  if (!post.value) return
  const base = import.meta.env.VITE_SITE_TITLE ?? 'Portfolio'
  document.title = `${post.value.title} | ${base}`
}

function revealContentHeadings(): void {
  if (!contentEl.value || prefersReducedMotion()) return
  const headings = contentEl.value.querySelectorAll<HTMLElement>('h2, h3')
  if (headings.length) staggerReveal(headings, 0.08, { y: 24 })
}

watch(
  post,
  (value) => {
    if (!value) {
      router.replace({ path: '/blog' })
      return
    }
    updateDocumentTitle()
  },
  { immediate: true },
)

onMounted(() => {
  revealContentHeadings()
})

watch(PostContent, () => {
  requestAnimationFrame(revealContentHeadings)
})
</script>

<style scoped>
.blog-post {
  padding-top: var(--space-2xl);
  max-width: var(--max-width-readable);
}

.blog-post__header {
  margin-bottom: var(--space-2xl);
}

.blog-post__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin: 0 0 var(--space-md);
  color: var(--color-text);
}

.blog-post__description {
  margin: 0;
  font-size: var(--fs-lg);
  color: var(--color-text-muted);
  line-height: 1.65;
}

.blog-post__content {
  margin-bottom: var(--space-3xl);
}

.blog-post__footer {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--color-border);
}

.blog-post__nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.blog-post__nav-spacer {
  display: block;
}

.blog-post__nav-link {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface-elevated);
  text-decoration: none;
  transition:
    border-color var(--dur-base) var(--ease-out-expo),
    background var(--dur-base) var(--ease-out-expo);
}

.blog-post__nav-link:hover {
  border-color: var(--color-border-strong);
  background: var(--color-surface-hi);
  text-decoration: none;
}

.blog-post__nav-link--next {
  text-align: right;
}

.blog-post__nav-label {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  letter-spacing: 0.06em;
}

.blog-post__nav-title {
  font-size: var(--fs-sm);
  color: var(--color-text);
  line-height: 1.4;
}

@media (max-width: 640px) {
  .blog-post__nav {
    grid-template-columns: 1fr;
  }

  .blog-post__nav-link--next {
    text-align: left;
  }
}
</style>
