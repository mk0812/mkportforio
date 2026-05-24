<template>
  <ul ref="gridEl" class="project-grid">
    <li
      v-for="project in items"
      :key="project.id"
      class="project-grid__cell"
      :class="{ 'is-featured': project.featured }"
    >
      <ProjectCard :project="project" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Project } from '@/types'
import ProjectCard from './ProjectCard.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'

defineProps<{
  items: Project[]
}>()

const gridEl = ref<HTMLElement | null>(null)
const { staggerReveal } = useScrollReveal()

onMounted(() => {
  if (!gridEl.value) return
  const cells = gridEl.value.querySelectorAll<HTMLElement>('.project-grid__cell')
  staggerReveal(cells, 0.09, { y: 56 })
})
</script>

<style scoped>
.project-grid {
  display: grid;
  gap: var(--space-xl);
  grid-template-columns: 1fr;
}

@media (min-width: 720px) {
  .project-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .project-grid__cell.is-featured {
    grid-column: span 2;
  }
}
</style>
