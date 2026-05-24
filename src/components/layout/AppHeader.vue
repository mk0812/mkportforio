<template>
  <header class="header" :class="{ 'header--scrolled': scrolled }">
    <div class="header__inner">
      <RouterLink to="/" class="header__brand" @click="closeMenu">
        <span class="header__brand-mark" aria-hidden="true" />
        <span class="header__brand-text">
          <span class="header__name">{{ site.name }}</span>
          <span class="header__label">{{ site.title }}</span>
        </span>
      </RouterLink>

      <button
        type="button"
        class="header__toggle"
        :aria-expanded="menuOpen"
        aria-controls="site-nav"
        @click="menuOpen = !menuOpen"
      >
        <span class="sr-only">メニュー</span>
        <span class="header__toggle-bar" :class="{ 'is-open': menuOpen }" />
        <span class="header__toggle-bar" :class="{ 'is-open': menuOpen }" />
        <span class="header__toggle-bar" :class="{ 'is-open': menuOpen }" />
      </button>

      <nav
        id="site-nav"
        class="header__nav"
        :class="{ 'header__nav--open': menuOpen }"
      >
        <RouterLink
          v-for="(item, i) in site.nav"
          :key="item.to"
          :to="item.to"
          class="header__link"
          :style="{ '--i': i }"
          @click="closeMenu"
        >
          <span class="header__link-text">{{ item.label }}</span>
        </RouterLink>
      </nav>
    </div>
    <div class="header__progress" :style="{ transform: `scaleX(${progress})` }" aria-hidden="true" />
  </header>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useSiteConfig } from '@/composables/useSiteConfig'

const { site } = useSiteConfig()
const menuOpen = ref(false)
const scrolled = ref(false)
const progress = ref(0)
let rafId = 0

function closeMenu(): void {
  menuOpen.value = false
}

function update(): void {
  rafId = 0
  const y = window.scrollY
  scrolled.value = y > 8
  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? Math.min(1, y / max) : 0
}

function onScroll(): void {
  if (rafId) return
  rafId = requestAnimationFrame(update)
}

onMounted(() => {
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: var(--z-header);
  height: var(--header-height);
  background: transparent;
  transition:
    background var(--dur-base) var(--ease-out-expo),
    backdrop-filter var(--dur-base) var(--ease-out-expo),
    border-color var(--dur-base) var(--ease-out-expo);
  border-bottom: 1px solid transparent;
}

.header--scrolled {
  background: var(--glass-bg-strong);
  backdrop-filter: var(--glass-blur);
  border-bottom-color: var(--color-border);
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
  align-items: center;
  gap: var(--space-sm);
  text-decoration: none;
  color: inherit;
  line-height: 1.2;
}

.header__brand:hover {
  text-decoration: none;
  color: inherit;
}

.header__brand-mark {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--gradient-primary);
  box-shadow: 0 0 12px rgba(139, 92, 246, 0.5);
}

.header__brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.header__name {
  font-weight: 600;
  font-size: var(--fs-sm);
  background: var(--gradient-text);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transition: background-position var(--dur-slow) var(--ease-out-expo);
  background-position: 0% 0%;
}

.header__brand:hover .header__name {
  background-position: 100% 0%;
}

.header__label {
  font-size: 0.7rem;
  color: var(--color-text-dim);
  font-family: var(--font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.header__nav {
  display: flex;
  gap: var(--space-lg);
}

.header__link {
  position: relative;
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
  text-decoration: none;
  padding: 0.4rem 0;
}

.header__link-text {
  position: relative;
}

.header__link-text::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 1px;
  background: var(--gradient-primary);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--dur-base) var(--ease-out-expo);
}

.header__link:hover,
.header__link.router-link-active {
  color: var(--color-text);
  text-decoration: none;
}

.header__link:hover .header__link-text::after,
.header__link.router-link-active .header__link-text::after {
  transform: scaleX(1);
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
  transition:
    transform var(--dur-base) var(--ease-out-expo),
    opacity var(--dur-base) var(--ease-out-expo);
}

.header__toggle-bar.is-open:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.header__toggle-bar.is-open:nth-child(2) {
  opacity: 0;
}

.header__toggle-bar.is-open:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.header__progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: var(--gradient-primary);
  transform-origin: left center;
  transform: scaleX(0);
  pointer-events: none;
  box-shadow: 0 0 8px rgba(139, 92, 246, 0.5);
}

@media (max-width: 640px) {
  .header__toggle {
    display: flex;
  }

  .header__nav {
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    align-items: flex-start;
    padding: var(--space-2xl) var(--space-xl);
    gap: var(--space-lg);
    background: var(--glass-bg-strong);
    backdrop-filter: var(--glass-blur);
    transform: translateY(-12px);
    opacity: 0;
    pointer-events: none;
    transition:
      transform var(--dur-base) var(--ease-out-expo),
      opacity var(--dur-base) var(--ease-out-expo);
  }

  .header__nav--open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .header__link {
    font-family: var(--font-display);
    font-size: var(--fs-2xl);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-text);
  }
}
</style>
