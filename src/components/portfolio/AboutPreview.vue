<template>
  <SectionBlock
    id="about-preview"
    eyebrow="02 / About"
    title="作ること、考えること。"
    subtitle="興味の交差点で動く小さなクリエイティブテクノロジスト"
  >
    <div ref="bodyEl" class="about-preview">
      <p v-for="(paragraph, index) in previewParagraphs" :key="index" class="about-preview__para">
        {{ paragraph }}
      </p>
      <BaseButton to="/about" variant="outline" magnetic>
        プロフィールを読む
        <IconArrowRight />
      </BaseButton>
    </div>
  </SectionBlock>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { profile } from '@/content/profile'
import SectionBlock from '@/components/layout/SectionBlock.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import IconArrowRight from '@/components/ui/icons/IconArrowRight.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'

const previewParagraphs = computed(() => profile.summary.slice(0, 2))

const bodyEl = ref<HTMLElement | null>(null)
const { staggerReveal } = useScrollReveal()

onMounted(() => {
  if (!bodyEl.value) return
  const paras = bodyEl.value.querySelectorAll<HTMLElement>('.about-preview__para')
  staggerReveal(paras, 0.12, { y: 32 })
})
</script>

<style scoped>
.about-preview {
  max-width: var(--max-width-readable);
}

.about-preview__para {
  font-size: var(--fs-md);
  line-height: 1.7;
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.about-preview__para:first-of-type {
  font-size: var(--fs-lg);
  color: var(--color-text);
}

.about-preview__para:last-of-type {
  color: var(--color-text-muted);
  margin-bottom: var(--space-xl);
}
</style>
