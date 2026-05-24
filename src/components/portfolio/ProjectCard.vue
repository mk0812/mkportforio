<template>
  <article ref="cardEl" class="project-card">
    <a v-if="project.href" :href="project.href" class="project-card__hit" :aria-label="project.title" />
    <div class="project-card__media">
      <img
        v-if="project.image"
        :src="project.image"
        :alt="project.title"
        loading="lazy"
      />
      <div v-else class="project-card__placeholder" aria-hidden="true">
        <span class="project-card__placeholder-tag">{{ project.tags[0] ?? project.title.charAt(0) }}</span>
      </div>
      <div class="project-card__overlay" aria-hidden="true">
        <span class="project-card__cta">
          View case
          <IconArrowRight />
        </span>
      </div>
    </div>
    <div class="project-card__body">
      <div class="project-card__meta">
        <time v-if="project.year" :datetime="String(project.year)">{{ project.year }}</time>
        <span v-if="project.featured" class="project-card__badge">★ Featured</span>
      </div>
      <h3 class="project-card__title">{{ project.title }}</h3>
      <p class="project-card__description">{{ project.description }}</p>
      <TagList :tags="project.tags" />
      <div class="project-card__links" @click.stop>
        <a
          v-if="project.href"
          :href="project.href"
          class="project-card__link"
          target="_blank"
          rel="noopener noreferrer"
        >
          デモ ↗
        </a>
        <a
          v-if="project.repo"
          :href="project.repo"
          class="project-card__link"
          target="_blank"
          rel="noopener noreferrer"
        >
          リポジトリ ↗
        </a>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Project } from '@/types'
import TagList from '@/components/ui/TagList.vue'
import IconArrowRight from '@/components/ui/icons/IconArrowRight.vue'
import { useTilt } from '@/composables/useTilt'

defineProps<{
  project: Project
}>()

const cardEl = ref<HTMLElement | null>(null)
useTilt(cardEl, { max: 6 })
</script>

<style scoped>
.project-card {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-surface-elevated);
  border-radius: var(--radius-lg);
  overflow: hidden;
  isolation: isolate;
  transform:
    perspective(1000px)
    rotateX(var(--tilt-x, 0deg))
    rotateY(var(--tilt-y, 0deg))
    scale(var(--tilt-scale, 1));
  transform-style: preserve-3d;
  transition:
    transform var(--dur-base) var(--ease-out-expo),
    box-shadow var(--dur-base) var(--ease-out-expo);
  will-change: transform;
}

.project-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: var(--gradient-border);
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity var(--dur-base) var(--ease-out-expo);
  pointer-events: none;
  z-index: 3;
  animation: rotate-conic 6s linear infinite paused;
}

.project-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 1px solid var(--color-border);
  border-radius: inherit;
  pointer-events: none;
  z-index: 2;
  transition: opacity var(--dur-base) var(--ease-out-expo);
}

.project-card:hover {
  box-shadow: var(--shadow-glow);
}

.project-card:hover::before {
  opacity: 1;
  animation-play-state: running;
}

.project-card:hover::after {
  opacity: 0;
}

.project-card__hit {
  position: absolute;
  inset: 0;
  z-index: 4;
  text-indent: -9999px;
  overflow: hidden;
}

.project-card__media {
  position: relative;
  aspect-ratio: 16 / 9;
  background: var(--color-surface);
  overflow: hidden;
}

.project-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
  transition: transform 600ms var(--ease-out-expo);
}

.project-card:hover .project-card__media img {
  transform: scale(1.06);
}

.project-card__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 30% 30%, rgba(79, 123, 255, 0.4), transparent 60%),
    radial-gradient(circle at 75% 70%, rgba(236, 72, 153, 0.35), transparent 60%),
    var(--color-surface-hi);
}

.project-card__placeholder-tag {
  font-family: var(--font-mono);
  font-size: var(--fs-md);
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.1em;
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-full);
  backdrop-filter: blur(6px);
}

.project-card__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: var(--space-md);
  background: linear-gradient(180deg, transparent 40%, rgba(7, 8, 13, 0.85));
  opacity: 0;
  transition: opacity var(--dur-base) var(--ease-out-expo);
}

.project-card:hover .project-card__overlay {
  opacity: 1;
}

.project-card__cta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text);
  padding: 0.5rem 0.9rem;
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  color: #0a0c14;
  font-weight: 700;
}

.project-card__body {
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: var(--space-md);
  position: relative;
  z-index: 1;
}

.project-card__meta {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  font-family: var(--font-mono);
  letter-spacing: 0.08em;
}

.project-card__badge {
  color: var(--neon-magenta);
  text-shadow: 0 0 8px rgba(236, 72, 153, 0.5);
}

.project-card__title {
  font-family: var(--font-display);
  font-size: var(--fs-xl);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0;
  color: var(--color-text);
}

.project-card__description {
  flex: 1;
  margin: 0;
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
  line-height: 1.55;
}

.project-card__links {
  display: flex;
  gap: var(--space-lg);
  font-size: var(--fs-sm);
  position: relative;
  z-index: 5;
}

.project-card__link {
  color: var(--neon-violet);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.project-card__link:hover {
  color: var(--neon-magenta);
}

@media (max-width: 720px) {
  .project-card__title {
    font-size: var(--fs-lg);
  }
}
</style>
