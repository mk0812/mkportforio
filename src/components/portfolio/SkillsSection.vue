<template>
  <SectionBlock id="skills" title="Skills" subtitle="得意な技術・ツール">
    <ul class="skills">
      <li v-for="skill in profile.skills" :key="skill.name" class="skills__item">
        <span class="skills__name">{{ skill.name }}</span>
        <span class="skills__level" :data-level="skill.level">
          {{ skillLevelLabel(skill.level) }}
        </span>
      </li>
    </ul>
    <p v-if="profile.interests.length" class="skills__interests">
      <strong>興味:</strong>
      {{ profile.interests.join(' / ') }}
    </p>
  </SectionBlock>
</template>

<script setup lang="ts">
import { profile } from '@/content/profile'
import SectionBlock from '@/components/layout/SectionBlock.vue'
import { skillLevelLabel } from '@/utils/skillLevel'
</script>

<style scoped>
.skills {
  display: grid;
  gap: var(--space-md);
}

@media (min-width: 640px) {
  .skills {
    grid-template-columns: repeat(2, 1fr);
  }
}

.skills__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.skills__name {
  font-weight: 500;
}

.skills__level {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
}

.skills__interests {
  margin-top: var(--space-lg);
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.skills__interests strong {
  color: var(--color-text);
}
</style>
