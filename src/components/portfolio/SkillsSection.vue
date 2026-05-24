<template>
  <SectionBlock id="skills" eyebrow="03 / Skills" title="得意な技術" subtitle="言語・フレームワーク・表現領域">
    <div ref="listEl" class="skills">
      <section
        v-for="group in skillGroups"
        :key="group.category"
        class="skills__group"
      >
        <SectionEyebrow
          v-if="hasMultipleCategories"
          :text="group.category"
          :dot="false"
          class="skills__category"
        />
        <ul class="skills__list">
          <li
            v-for="skill in group.skills"
            :key="skill.name"
            class="skills__item"
            :class="{ 'is-filled': filledSkills.has(skill.name) }"
            :data-skill="skill.name"
          >
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
      </section>
    </div>
    <p v-if="profile.interests.length" class="skills__interests">
      <span class="skills__interests-label">興味:</span>
      {{ profile.interests.join(' · ') }}
    </p>
  </SectionBlock>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { profile } from '@/content/profile'
import type { Skill } from '@/types'
import SectionBlock from '@/components/layout/SectionBlock.vue'
import SectionEyebrow from '@/components/portfolio/SectionEyebrow.vue'
import { skillLevelLabel, skillLevelValue } from '@/utils/skillLevel'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { prefersReducedMotion } from '@/composables/usePrefersReducedMotion'

interface SkillGroup {
  category: string
  skills: Skill[]
}

const listEl = ref<HTMLElement | null>(null)
const filledSkills = ref<Set<string>>(new Set())
const { staggerReveal } = useScrollReveal()
let fillObserver: IntersectionObserver | null = null

const skillGroups = computed<SkillGroup[]>(() => {
  const groups = new Map<string, Skill[]>()

  for (const skill of profile.skills) {
    const category = skill.category ?? 'Skills'
    const existing = groups.get(category)
    if (existing) {
      existing.push(skill)
    } else {
      groups.set(category, [skill])
    }
  }

  return Array.from(groups.entries()).map(([category, skills]) => ({
    category,
    skills,
  }))
})

const hasMultipleCategories = computed(() => skillGroups.value.length > 1)

function markFilled(name: string): void {
  if (filledSkills.value.has(name)) return
  filledSkills.value = new Set([...filledSkills.value, name])
}

function setupFillObserver(): void {
  if (!listEl.value) return

  const reduced = prefersReducedMotion()
  const items = listEl.value.querySelectorAll<HTMLElement>('.skills__item')

  if (reduced) {
    for (const item of items) {
      const name = item.dataset.skill
      if (name) markFilled(name)
    }
    return
  }

  fillObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const name = (entry.target as HTMLElement).dataset.skill
        if (name) markFilled(name)
        fillObserver?.unobserve(entry.target)
      }
    },
    { threshold: 0.35 },
  )

  for (const item of items) {
    fillObserver.observe(item)
  }
}

onMounted(() => {
  if (!listEl.value) return
  const items = listEl.value.querySelectorAll<HTMLElement>('.skills__item')
  staggerReveal(items, 0.08, { y: 32 })
  setupFillObserver()
})

onBeforeUnmount(() => {
  fillObserver?.disconnect()
  fillObserver = null
})
</script>

<style scoped>
.skills {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.skills__group + .skills__group {
  margin-top: var(--space-md);
}

.skills__category {
  margin-bottom: var(--space-md);
}

.skills__category :deep(.eyebrow) {
  color: var(--color-text-dim);
  letter-spacing: 0.14em;
}

.skills__category :deep(.eyebrow__line) {
  max-width: 4rem;
  opacity: 0.65;
}

.skills__list {
  display: grid;
  gap: var(--space-lg);
}

@media (min-width: 640px) {
  .skills__list {
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
  transform: scaleX(0);
  transform-origin: left center;
  box-shadow: none;
  transition: transform var(--dur-md) var(--ease-out-expo);
}

.skills__item.is-filled .skills__bar-fill {
  transform: scaleX(1);
  box-shadow: 0 0 12px var(--neon-glow);
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

@media (prefers-reduced-motion: reduce) {
  .skills__bar-fill {
    transition: none;
  }
}
</style>
