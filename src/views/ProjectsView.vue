<template>
  <div class="projects-view">
    <header class="page-header">
      <h1>作品</h1>
      <p>制作物・実験・OSS など。`src/content/projects.ts` で管理します。</p>
    </header>
    <ProjectGrid :items="projects" />
  </div>
</template>

<script setup lang="ts">
import { projects } from '@/content/projects'
import ProjectGrid from '@/components/portfolio/ProjectGrid.vue'
</script>

<style scoped>
.page-header {
  margin-bottom: var(--space-2xl);
}

.page-header h1 {
  font-size: clamp(2rem, 4vw, 2.5rem);
}

.page-header p {
  color: var(--color-text-muted);
  max-width: 40rem;
}
</style>
