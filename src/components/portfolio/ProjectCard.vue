<template>
  <article class="project-card">
    <div class="project-card__media">
      <img
        v-if="project.image"
        :src="project.image"
        :alt="project.title"
        loading="lazy"
      />
      <div v-else class="project-card__placeholder" aria-hidden="true">
        <span>{{ project.title.charAt(0) }}</span>
      </div>
    </div>
    <div class="project-card__body">
      <div class="project-card__meta">
        <time v-if="project.year" :datetime="String(project.year)">{{ project.year }}</time>
        <span v-if="project.featured" class="project-card__badge">Featured</span>
      </div>
      <h3 class="project-card__title">
        <a v-if="project.href" :href="project.href">{{ project.title }}</a>
        <span v-else>{{ project.title }}</span>
      </h3>
      <p class="project-card__description">{{ project.description }}</p>
      <TagList :tags="project.tags" />
      <div class="project-card__links">
        <a
          v-if="project.href"
          :href="project.href"
          class="project-card__link"
        >
          デモ
        </a>
        <a
          v-if="project.repo"
          :href="project.repo"
          target="_blank"
          rel="noopener noreferrer"
          class="project-card__link"
        >
          リポジトリ
        </a>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Project } from '@/types'
import TagList from '@/components/ui/TagList.vue'

defineProps<{
  project: Project
}>()
</script>

<style scoped>
.project-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: border-color 0.15s, transform 0.15s;
}

.project-card:hover {
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

.project-card__media {
  aspect-ratio: 16 / 9;
  background: var(--color-surface-elevated);
}

.project-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-card__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-border);
}

.project-card__body {
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: var(--space-md);
}

.project-card__meta {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: 0.8rem;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
}

.project-card__badge {
  color: var(--color-accent);
}

.project-card__title {
  font-size: 1.15rem;
  margin: 0;
}

.project-card__title a {
  color: inherit;
  text-decoration: none;
}

.project-card__title a:hover {
  color: var(--color-accent);
}

.project-card__description {
  flex: 1;
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.project-card__links {
  display: flex;
  gap: var(--space-lg);
  font-size: 0.85rem;
}

.project-card__link {
  color: var(--color-accent);
}
</style>
