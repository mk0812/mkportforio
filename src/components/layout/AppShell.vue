<template>
  <div class="app-shell">
    <AppHeader />
    <main id="main-content" class="app-shell__main">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import { useLenis } from '@/composables/useLenis'

useLenis()
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-shell__main {
  flex: 1;
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-lg) var(--space-3xl);
}

@media (min-width: 960px) {
  .app-shell__main {
    padding-inline: var(--space-2xl);
  }
}
</style>
