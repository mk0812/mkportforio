<template>
  <div class="home-view">
    <HeroSection />
    <SectionBlock
      id="featured-projects"
      title="Featured Works"
      subtitle="代表的な作品（サンプルデータ）"
    >
      <ProjectGrid :items="featuredProjects" />
      <div class="home-view__more">
        <BaseButton to="/projects" variant="outline">すべての作品</BaseButton>
      </div>
    </SectionBlock>
    <AboutPreview />
    <SkillsSection />
    <ContactSection />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { projects } from '@/content/projects'
import HeroSection from '@/components/portfolio/HeroSection.vue'
import AboutPreview from '@/components/portfolio/AboutPreview.vue'
import SkillsSection from '@/components/portfolio/SkillsSection.vue'
import ContactSection from '@/components/portfolio/ContactSection.vue'
import ProjectGrid from '@/components/portfolio/ProjectGrid.vue'
import SectionBlock from '@/components/layout/SectionBlock.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const featuredProjects = computed(() =>
  projects.filter((p) => p.featured),
)
</script>

<style scoped>
.home-view__more {
  margin-top: var(--space-xl);
  text-align: center;
}
</style>
