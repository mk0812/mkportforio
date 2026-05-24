<template>
  <section id="contact" class="contact" aria-labelledby="contact-heading">
    <SectionEyebrow>05 / Contact</SectionEyebrow>
    <h2 id="contact-heading" ref="headingEl" class="contact__heading">
      <span class="contact__heading-line">Let's build</span>
      <span class="contact__heading-line contact__heading-line--accent">something together.</span>
    </h2>
    <p class="contact__lead">
      お仕事のご相談・ご質問は、メールまたは SNS からお気軽にどうぞ。
    </p>
    <div class="contact__cta">
      <BaseButton :href="`mailto:${site.email}`" variant="primary" magnetic>
        <IconMail />
        {{ site.email }}
      </BaseButton>
    </div>
    <ul class="contact__social">
      <li v-for="link in site.social" :key="link.href">
        <a
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="contact__social-link"
        >
          <SocialIcon :name="link.icon" />
          <span>{{ link.label }}</span>
        </a>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useSiteConfig } from '@/composables/useSiteConfig'
import BaseButton from '@/components/ui/BaseButton.vue'
import SectionEyebrow from './SectionEyebrow.vue'
import SocialIcon from '@/components/ui/icons/SocialIcon.vue'
import IconMail from '@/components/ui/icons/IconMail.vue'
import { prefersReducedMotion } from '@/composables/usePrefersReducedMotion'

const { site } = useSiteConfig()
const headingEl = ref<HTMLElement | null>(null)

onMounted(() => {
  if (prefersReducedMotion()) return
  if (!headingEl.value) return
  gsap.registerPlugin(ScrollTrigger)
  const lines = headingEl.value.querySelectorAll<HTMLElement>('.contact__heading-line')
  gsap.from(lines, {
    y: 60,
    opacity: 0,
    duration: 1,
    stagger: 0.12,
    ease: 'expo.out',
    scrollTrigger: { trigger: headingEl.value, start: 'top 80%', once: true },
  })
})
</script>

<style scoped>
.contact {
  margin-bottom: var(--space-3xl);
}

.contact__heading {
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 5.5vw, 4rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.04;
  margin: 0 0 var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: 0.05em;
}

.contact__heading-line {
  display: block;
}

.contact__heading-line--accent {
  background: var(--gradient-text);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.contact__lead {
  color: var(--color-text-muted);
  max-width: 38rem;
  font-size: var(--fs-md);
  margin-bottom: var(--space-xl);
}

.contact__cta {
  margin-bottom: var(--space-xl);
}

.contact__social {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.contact__social-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: 0.5rem 0.9rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
  background: var(--glass-bg);
  transition:
    color var(--dur-base) var(--ease-out-expo),
    border-color var(--dur-base) var(--ease-out-expo),
    background var(--dur-base) var(--ease-out-expo);
}

.contact__social-link:hover {
  color: var(--color-text);
  border-color: var(--neon-violet);
  background: rgba(139, 92, 246, 0.08);
}
</style>
