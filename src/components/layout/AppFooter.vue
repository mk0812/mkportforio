<template>
  <footer class="footer">
    <div class="footer__inner">
      <p class="footer__copy">
        &copy; {{ year }} {{ site.name }}
      </p>
      <ul class="footer__social">
        <li v-for="link in site.social" :key="link.href">
          <a :href="link.href" target="_blank" rel="noopener noreferrer">
            {{ link.label }}
          </a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script setup>
import { useSiteConfig } from '@/composables/useSiteConfig.js'

const { site } = useSiteConfig()
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  border-top: 1px solid var(--color-border);
  margin-top: auto;
}

.footer__inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-lg);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.footer__copy {
  margin: 0;
}

.footer__social {
  display: flex;
  gap: var(--space-lg);
}

.footer__social a {
  color: var(--color-text-muted);
}

.footer__social a:hover {
  color: var(--color-accent);
}
</style>
