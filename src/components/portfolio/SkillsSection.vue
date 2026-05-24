<template>
  <SectionBlock id="skills" eyebrow="03 / Skills" title="得意な技術" subtitle="言語・フレームワーク・表現領域">
    <ul ref="listEl" class="skills">
      <li v-for="skill in profile.skills" :key="skill.name" class="skills__item">
        <div class="skills__head">
          <span class="skills__name">{{ skill.name }}</span>
          <span class="skills__level" :data-level="skill.level">
            {{ skillLevelLabel(skill.level) }}
          </span>
        </div>
        <div class="skills__bar" aria-hidden="true">
          <span
            class="skills__bar-fill"
            :style="{ '--skill-value': skillLevelValue(skill.level) }"
          />
        </div>
      </li>
    </ul>
    <p v-if="profile.interests.length" class="skills__interests">
      <span class="skills__interests-label">興味:</span>
      {{ profile.interests.join(' · ') }}
    </p>
  </SectionBlock>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { profile } from '@/content/profile'
import SectionBlock from '@/components/layout/SectionBlock.vue'
import { skillLevelLabel, skillLevelValue } from '@/utils/skillLevel'
import { useScrollReveal } from '@/composables/useScrollReveal'

const listEl = ref<HTMLElement | null>(null)
const { staggerReveal } = useScrollReveal()

onMounted(() => {
  if (!listEl.value) return
  const items = listEl.value.querySelectorAll<HTMLElement>('.skills__item')
  staggerReveal(items, 0.08, { y: 32 })
})
</script>

<style scoped>
.skills {
  display: grid;
  gap: var(--space-lg);
}

@media (min-width: 640px) {
  .skills {
    grid-template-columns: repeat(2, 1fr);
    column-gap: var(--space-xl);
  }
}

.skills__item {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.skills__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-md);
}

.skills__name {
  font-family: var(--font-sans);
  font-size: var(--fs-md);
  font-weight: 500;
  color: var(--color-text);
}

.skills__level {
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.skills__level[data-level='advanced'] {
  color: var(--neon-cyan);
}

.skills__level[data-level='intermediate'] {
  color: var(--neon-violet);
}

.skills__bar {
  position: relative;
  height: 4px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.skills__bar-fill {
  display: block;
  height: 100%;
  width: calc(var(--skill-value, 0.5) * 100%);
  background: var(--gradient-primary);
  border-radius: inherit;
  box-shadow: 0 0 12px rgba(139, 92, 246, 0.4);
  transform-origin: left;
  animation: skill-fill 1.2s var(--ease-out-expo) both;
}

@keyframes skill-fill {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

.skills__interests {
  margin-top: var(--space-xl);
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
  letter-spacing: 0.02em;
}

.skills__interests-label {
  font-family: var(--font-mono);
  color: var(--neon-cyan);
  margin-right: var(--space-xs);
  text-transform: uppercase;
  font-size: var(--fs-xs);
  letter-spacing: 0.12em;
}
</style>
