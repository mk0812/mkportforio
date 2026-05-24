<template>
  <div class="about-view">
    <header class="page-header">
      <h1>{{ profile.headline }}</h1>
      <p class="about-view__location">{{ profile.location }}</p>
    </header>

    <SectionBlock title="自己紹介">
      <div class="about-view__summary">
        <p v-for="(paragraph, index) in profile.summary" :key="index">
          {{ paragraph }}
        </p>
      </div>
    </SectionBlock>

    <SkillsSection />

    <SectionBlock
      title="Experience"
      subtitle="職務・活動のタイムライン。経歴文のたたき台として使えます。"
    >
      <ExperienceTimeline :items="experience" />
    </SectionBlock>

    <ContactSection />
  </div>
</template>

<script setup>
import { profile, experience } from '@/content'
import SectionBlock from '@/components/layout/SectionBlock.vue'
import SkillsSection from '@/components/portfolio/SkillsSection.vue'
import ExperienceTimeline from '@/components/portfolio/ExperienceTimeline.vue'
import ContactSection from '@/components/portfolio/ContactSection.vue'
</script>

<style scoped>
.page-header {
  margin-bottom: var(--space-2xl);
}

.page-header h1 {
  font-size: clamp(2rem, 4vw, 2.5rem);
}

.about-view__location {
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: 0.9rem;
}

.about-view__summary p {
  color: var(--color-text-muted);
  max-width: 42rem;
}
</style>
