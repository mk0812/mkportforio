<template>
  <div class="projects-view">
    <header class="page-header">
      <SectionEyebrow>Index / All Works</SectionEyebrow>
      <h1 ref="titleEl" class="page-header__title">
        <span class="page-header__line">作品</span>
        <span class="page-header__line page-header__line--accent">アーカイブ.</span>
      </h1>
      <p class="page-header__lead">
        制作物・実験・OSS など。アイデアと技術が交差する場所のスナップショットです。
      </p>
    </header>
    <ProjectGrid :items="projects" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { projects } from '@/content/projects'
import ProjectGrid from '@/components/portfolio/ProjectGrid.vue'
import SectionEyebrow from '@/components/portfolio/SectionEyebrow.vue'
import { prefersReducedMotion } from '@/composables/usePrefersReducedMotion'

const titleEl = ref<HTMLElement | null>(null)

onMounted(() => {
  if (prefersReducedMotion()) return
  if (!titleEl.value) return
  const lines = titleEl.value.querySelectorAll<HTMLElement>('.page-header__line')
  gsap.from(lines, {
    y: 48,
    opacity: 0,
    duration: 0.95,
    stagger: 0.12,
    ease: 'expo.out',
  })
})
</script>

<style scoped>
.projects-view {
  padding-top: var(--space-2xl);
}

.page-header {
  margin-bottom: var(--space-3xl);
}

.page-header__title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 7vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 0.95;
  margin: 0 0 var(--space-md);
  display: flex;
  flex-direction: column;
}

.page-header__line--accent {
  background: var(--gradient-text);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.page-header__lead {
  color: var(--color-text-muted);
  max-width: 40rem;
  font-size: var(--fs-md);
}
</style>
