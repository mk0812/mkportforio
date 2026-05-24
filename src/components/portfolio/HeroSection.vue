<template>
  <section class="hero" aria-labelledby="hero-heading">
    <p class="hero__eyebrow">{{ site.tagline }}</p>
    <h1 id="hero-heading" class="hero__title">{{ site.name }}</h1>
    <p class="hero__description">{{ site.description }}</p>
    <div class="hero__actions">
      <BaseButton to="/projects">作品を見る</BaseButton>
      <BaseButton to="/about" variant="outline">プロフィール</BaseButton>
    </div>
    <ul v-if="profile.roles.length" class="hero__roles">
      <li v-for="role in profile.roles" :key="role">{{ role }}</li>
    </ul>
  </section>
</template>

<script setup>
import { useSiteConfig } from '@/composables/useSiteConfig.js'
import { profile } from '@/content/profile.js'
import BaseButton from '@/components/ui/BaseButton.vue'

const { site } = useSiteConfig()
</script>

<style scoped>
.hero {
  padding: var(--space-xl) 0 var(--space-2xl);
}

.hero__eyebrow {
  font-size: 0.9rem;
  color: var(--color-accent);
  margin-bottom: var(--space-sm);
  font-family: var(--font-mono);
}

.hero__title {
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: var(--space-md);
}

.hero__description {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  max-width: 36rem;
  margin-bottom: var(--space-xl);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.hero__roles {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.hero__roles li {
  font-size: 0.8rem;
  padding: 0.35rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
}
</style>
