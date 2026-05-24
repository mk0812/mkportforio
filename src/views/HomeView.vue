<template>
  <div class="home-view">
    <HeroSection />

    <SectionBlock
      id="featured-projects"
      eyebrow="01 / Selected Works"
      title="近年の主な作品"
      subtitle="作品の一部をピックアップしています。一覧から詳細を見られます。"
    >
      <ProjectGrid :items="featuredProjects" />
      <div class="home-view__more">
        <BaseButton to="/projects" variant="outline" magnetic>
          すべての作品を見る
          <IconArrowRight />
        </BaseButton>
      </div>
    </SectionBlock>

    <MarqueeStrip :items="marqueeItems" aria-label="Skills & Interests" />

    <AboutPreview />
    <SkillsSection />
    <ContactSection />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { projects } from '@/content/projects'
import { profile } from '@/content/profile'
import HeroSection from '@/components/portfolio/HeroSection.vue'
import AboutPreview from '@/components/portfolio/AboutPreview.vue'
import SkillsSection from '@/components/portfolio/SkillsSection.vue'
import ContactSection from '@/components/portfolio/ContactSection.vue'
import ProjectGrid from '@/components/portfolio/ProjectGrid.vue'
import MarqueeStrip from '@/components/portfolio/MarqueeStrip.vue'
import SectionBlock from '@/components/layout/SectionBlock.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import IconArrowRight from '@/components/ui/icons/IconArrowRight.vue'

const featuredProjects = computed(() => projects.filter((p) => p.featured))

const marqueeItems = computed(() => [
  ...profile.skills.map((s) => s.name),
  ...profile.interests,
])
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
}

.home-view__more {
  margin-top: var(--space-xl);
  text-align: center;
}
</style>
