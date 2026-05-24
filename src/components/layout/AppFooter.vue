<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <span class="footer__mark" aria-hidden="true" />
        <div>
          <p class="footer__name">{{ site.name }}</p>
          <p class="footer__tagline">{{ site.tagline }}</p>
        </div>
      </div>

      <nav class="footer__nav" aria-label="フッターナビ">
        <RouterLink v-for="item in site.nav" :key="item.to" :to="item.to" class="footer__link">
          {{ item.label }}
        </RouterLink>
      </nav>

      <ul class="footer__social">
        <li v-for="link in site.social" :key="link.href">
          <a
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="footer__social-link"
            :aria-label="link.label"
          >
            <SocialIcon :name="link.icon" />
          </a>
        </li>
      </ul>
    </div>

    <div class="footer__base">
      <p class="footer__copy">&copy; {{ year }} {{ site.name }} — Built with Vue, Three.js & GSAP.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useSiteConfig } from '@/composables/useSiteConfig'
import SocialIcon from '@/components/ui/icons/SocialIcon.vue'

const { site } = useSiteConfig()
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  position: relative;
  margin-top: auto;
  padding-top: var(--space-2xl);
  background: linear-gradient(180deg, transparent, var(--color-bg-deep));
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: var(--gradient-primary);
  opacity: 0.55;
  mask: linear-gradient(90deg, transparent, #000 30%, #000 70%, transparent);
  -webkit-mask: linear-gradient(90deg, transparent, #000 30%, #000 70%, transparent);
}

.footer__inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-lg) var(--space-xl);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-xl);
  align-items: start;
}

@media (min-width: 720px) {
  .footer__inner {
    grid-template-columns: 1.4fr 1fr auto;
    gap: var(--space-2xl);
  }
}

.footer__brand {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
}

.footer__mark {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--gradient-primary);
  box-shadow: 0 0 24px rgba(139, 92, 246, 0.45);
}

.footer__name {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--fs-md);
  font-weight: 700;
  color: var(--color-text);
}

.footer__tagline {
  margin: 0;
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  font-family: var(--font-mono);
  letter-spacing: 0.08em;
}

.footer__nav {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.footer__link {
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
}

.footer__link:hover,
.footer__link.router-link-active {
  color: var(--color-text);
}

.footer__social {
  display: flex;
  gap: var(--space-sm);
}

.footer__social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  background: var(--glass-bg);
  transition:
    color var(--dur-base) var(--ease-out-expo),
    border-color var(--dur-base) var(--ease-out-expo),
    transform var(--dur-base) var(--ease-out-expo);
}

.footer__social-link:hover {
  color: var(--color-text);
  border-color: var(--neon-violet);
  transform: translateY(-2px);
}

.footer__base {
  border-top: 1px solid var(--color-border);
  padding: var(--space-md) var(--space-lg);
}

.footer__copy {
  max-width: var(--max-width);
  margin: 0 auto;
  font-size: var(--fs-xs);
  color: var(--color-text-dim);
  font-family: var(--font-mono);
  letter-spacing: 0.05em;
  text-align: center;
}
</style>
