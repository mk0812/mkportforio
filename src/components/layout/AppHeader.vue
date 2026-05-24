<template>
  <header class="header">
    <div class="header__inner">
      <RouterLink to="/" class="header__brand">
        <span class="header__name">{{ site.name }}</span>
        <span class="header__label">{{ site.title }}</span>
      </RouterLink>

      <button
        type="button"
        class="header__toggle"
        :aria-expanded="menuOpen"
        aria-controls="site-nav"
        @click="menuOpen = !menuOpen"
      >
        <span class="sr-only">メニュー</span>
        <span class="header__toggle-bar" />
        <span class="header__toggle-bar" />
        <span class="header__toggle-bar" />
      </button>

      <nav
        id="site-nav"
        class="header__nav"
        :class="{ 'header__nav--open': menuOpen }"
      >
        <RouterLink
          v-for="item in site.nav"
          :key="item.to"
          :to="item.to"
          class="header__link"
          @click="menuOpen = false"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSiteConfig } from '@/composables/useSiteConfig'

const { site } = useSiteConfig()
const menuOpen = ref(false)
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--header-height);
  background: rgba(15, 17, 23, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
}

.header__inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-lg);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg);
}

.header__brand {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  line-height: 1.2;
}

.header__brand:hover {
  text-decoration: none;
}

.header__name {
  font-weight: 600;
  font-size: 1rem;
}

.header__label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.header__nav {
  display: flex;
  gap: var(--space-lg);
}

.header__link {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  text-decoration: none;
}

.header__link:hover,
.header__link.router-link-active {
  color: var(--color-text);
  text-decoration: none;
}

.header__toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: var(--space-sm);
  background: transparent;
  border: none;
  color: var(--color-text);
}

.header__toggle-bar {
  display: block;
  width: 22px;
  height: 2px;
  background: currentColor;
  border-radius: 1px;
}

@media (max-width: 640px) {
  .header__toggle {
    display: flex;
  }

  .header__nav {
    position: absolute;
    top: var(--header-height);
    left: 0;
    right: 0;
    flex-direction: column;
    padding: var(--space-lg);
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    display: none;
  }

  .header__nav--open {
    display: flex;
  }
}
</style>
