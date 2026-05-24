<template>
  <section class="hero" aria-labelledby="hero-heading">
    <HeroCanvas />
    <div class="hero__overlay" aria-hidden="true" />
    <div class="hero__content">
      <SectionEyebrow>
        <span class="hero__eyebrow-text">{{ site.tagline }} / {{ site.name }}</span>
      </SectionEyebrow>

      <h1 id="hero-heading" class="hero__title">
        <span ref="titleLine1" class="hero__title-line">Creative</span>
        <span ref="titleLine2" class="hero__title-line hero__title-line--accent">Developer.</span>
      </h1>

      <p class="hero__description">{{ site.description }}</p>

      <div class="hero__actions">
        <BaseButton to="/projects" variant="primary" magnetic>
          作品を見る
          <IconArrowRight />
        </BaseButton>
        <BaseButton to="/about" variant="outline" magnetic>プロフィール</BaseButton>
      </div>

      <ul v-if="profile.roles.length" class="hero__roles">
        <li
          v-for="(role, i) in profile.roles"
          :key="role"
          class="hero__role"
          :style="{ animationDelay: `${i * 0.3}s` }"
        >
          {{ role }}
        </li>
      </ul>

      <div class="hero__scroll-hint" aria-hidden="true">
        <span class="hero__scroll-text">SCROLL</span>
        <span class="hero__scroll-line" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { useSiteConfig } from '@/composables/useSiteConfig'
import { profile } from '@/content/profile'
import { useTextReveal } from '@/composables/useTextReveal'
import { prefersReducedMotion } from '@/composables/usePrefersReducedMotion'
import BaseButton from '@/components/ui/BaseButton.vue'
import SectionEyebrow from './SectionEyebrow.vue'
import HeroCanvas from '@/components/three/HeroCanvas.vue'
import IconArrowRight from '@/components/ui/icons/IconArrowRight.vue'

const { site } = useSiteConfig()

const titleLine1 = ref<HTMLElement | null>(null)
const titleLine2 = ref<HTMLElement | null>(null)

useTextReveal(titleLine1, { delay: 0.15, stagger: 0.03 })

onMounted(() => {
  if (prefersReducedMotion()) return
  if (!titleLine2.value) return
  gsap.from(titleLine2.value, {
    y: 48,
    opacity: 0,
    duration: 1,
    delay: 0.55,
    ease: 'expo.out',
  })
})
</script>

<style scoped>
.hero {
  position: relative;
  min-height: clamp(560px, 92svh, 920px);
  margin: 0 calc(50% - 50vw) var(--space-3xl);
  padding: var(--space-4xl) var(--space-lg) var(--space-2xl);
  display: flex;
  align-items: center;
  overflow: hidden;
  isolation: isolate;
}

.hero__overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(110deg, var(--color-bg) 0%, rgba(7, 8, 13, 0.6) 35%, transparent 65%),
    linear-gradient(180deg, transparent 55%, var(--color-bg) 100%);
  pointer-events: none;
}

.hero__content {
  position: relative;
  z-index: var(--z-content);
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
}

.hero__eyebrow-text {
  font-feature-settings: 'tnum';
}

.hero__title {
  font-family: var(--font-display);
  font-size: var(--fs-display);
  font-weight: 900;
  line-height: 0.88;
  letter-spacing: -0.045em;
  margin: 0 0 var(--space-lg);
  display: flex;
  flex-direction: column;
}

.hero__title-line {
  display: inline-block;
  color: var(--color-text);
}

.hero__title-line--accent {
  background: var(--gradient-text);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: gradient-shift 9s var(--ease-in-out-quart) infinite;
}

.hero__description {
  font-size: var(--fs-md);
  color: var(--color-text-muted);
  max-width: 36rem;
  margin: 0 0 var(--space-xl);
  line-height: 1.65;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-bottom: var(--space-2xl);
}

.hero__roles {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-bottom: var(--space-2xl);
}

.hero__role {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  animation: float 6s ease-in-out infinite;
}

.hero__scroll-hint {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  margin-top: var(--space-lg);
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  color: var(--color-text-dim);
}

.hero__scroll-line {
  width: 1px;
  height: 36px;
  background: linear-gradient(to bottom, var(--neon-violet), transparent);
  animation: scroll-hint 2.4s ease-in-out infinite;
}

@media (max-width: 720px) {
  .hero {
    min-height: 80svh;
    padding-top: var(--space-3xl);
  }

  .hero__role:nth-child(n + 4) {
    display: none;
  }
}
</style>
