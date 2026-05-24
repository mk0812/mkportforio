<template>
  <ul class="project-grid">
    <li v-for="project in items" :key="project.id">
      <ProjectCard :project="project" />
    </li>
  </ul>
</template>

<script setup>
import ProjectCard from './ProjectCard.vue'

defineProps({
  items: { type: Array, default: () => [] },
})
</script>

<style scoped>
.project-grid {
  display: grid;
  gap: var(--space-xl);
}

@media (min-width: 720px) {
  .project-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
