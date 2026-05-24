<template>
  <div class="about-view">
    <header class="page-header">
      <SectionEyebrow>{{ profile.location }}</SectionEyebrow>
      <h1 ref="titleEl" class="page-header__title">
        <span class="page-header__line page-header__line--accent">{{ profile.headline }}</span>
      </h1>
    </header>

    <SectionBlock eyebrow="01 / Bio" title="自己紹介">
      <div ref="summaryEl" class="about-view__summary">
        <p v-for="(paragraph, index) in profile.summary" :key="index" class="about-view__para">
          {{ paragraph }}
        </p>
      </div>
    </SectionBlock>

    <SkillsSection />

    <SectionBlock
      eyebrow="04 / Experience"
      title="経歴とハイライト"
      subtitle="これまで取り組んできた仕事・プロジェクトのタイムライン"
    >
      <ExperienceTimeline :items="experience" />
    </SectionBlock>

    <ContactSection />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { profile, experience } from '@/content'
import SectionBlock from '@/components/layout/SectionBlock.vue'
import SectionEyebrow from '@/components/portfolio/SectionEyebrow.vue'
import SkillsSection from '@/components/portfolio/SkillsSection.vue'
import ExperienceTimeline from '@/components/portfolio/ExperienceTimeline.vue'
import ContactSection from '@/components/portfolio/ContactSection.vue'
import { prefersReducedMotion } from '@/composables/usePrefersReducedMotion'
import { useScrollReveal } from '@/composables/useScrollReveal'

const titleEl = ref<HTMLElement | null>(null)
const summaryEl = ref<HTMLElement | null>(null)

const { staggerReveal } = useScrollReveal()

onMounted(() => {
  if (titleEl.value && !prefersReducedMotion()) {
    const lines = titleEl.value.querySelectorAll<HTMLElement>('.page-header__line')
    gsap.from(lines, {
      y: 40,
      opacity: 0,
      duration: 0.95,
      stagger: 0.12,
      ease: 'expo.out',
    })
  }
  if (summaryEl.value) {
    const paras = summaryEl.value.querySelectorAll<HTMLElement>('.about-view__para')
    staggerReveal(paras, 0.1, { y: 32 })
  }
})
</script>

<style scoped>
.about-view {
  padding-top: var(--space-2xl);
}

.page-header {
  margin-bottom: var(--space-3xl);
  max-width: var(--max-width-readable);
}

.page-header__title {
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 6.5vw, 4rem);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1;
  margin: 0;
}

.page-header__line--accent {
  background: var(--gradient-text);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.about-view__summary {
  max-width: var(--max-width-readable);
}

.about-view__para {
  color: var(--color-text);
  font-size: var(--fs-md);
  line-height: 1.75;
  margin-bottom: var(--space-md);
}

.about-view__para:first-of-type {
  font-size: var(--fs-lg);
}

.about-view__para:not(:first-of-type) {
  color: var(--color-text-muted);
}
</style>
