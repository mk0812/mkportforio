<template>
  <SectionBlock
    id="about-preview"
    title="About"
    subtitle="自己紹介の要約。詳細はプロフィールページへ。"
  >
    <div class="about-preview">
      <p v-for="(paragraph, index) in previewParagraphs" :key="index">
        {{ paragraph }}
      </p>
      <BaseButton to="/about" variant="ghost">続きを読む →</BaseButton>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { profile } from '@/content/profile'
import SectionBlock from '@/components/layout/SectionBlock.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const previewParagraphs = computed(() => profile.summary.slice(0, 2))
</script>

<style scoped>
.about-preview p:last-of-type {
  margin-bottom: var(--space-lg);
}
</style>
