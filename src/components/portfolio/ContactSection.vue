<template>
  <SectionBlock
    id="contact"
    title="Contact"
    subtitle="お問い合わせ・ご連絡先"
  >
    <div class="contact">
      <p>
        お仕事のご相談やご質問は、メールまたは SNS からお気軽にどうぞ。
      </p>
      <BaseButton :href="`mailto:${site.email}`">{{ site.email }}</BaseButton>
      <ul class="contact__social">
        <li v-for="link in site.social" :key="link.href">
          <a :href="link.href" target="_blank" rel="noopener noreferrer">
            {{ link.label }}
          </a>
        </li>
      </ul>
    </div>
  </SectionBlock>
</template>

<script setup>
import { useSiteConfig } from '@/composables/useSiteConfig.js'
import SectionBlock from '@/components/layout/SectionBlock.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const { site } = useSiteConfig()
</script>

<style scoped>
.contact p {
  color: var(--color-text-muted);
  max-width: 32rem;
}

.contact__social {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-lg);
  margin-top: var(--space-lg);
}

.contact__social a {
  font-size: 0.9rem;
}
</style>
