<template>
  <div class="blog-tag-filter" role="group" aria-label="タグで絞り込み">
    <button
      type="button"
      class="blog-tag-filter__btn"
      :class="{ 'is-active': !modelValue }"
      @click="selectTag(null)"
    >
      すべて
    </button>
    <button
      v-for="tag in tags"
      :key="tag"
      type="button"
      class="blog-tag-filter__btn"
      :class="{ 'is-active': modelValue === tag }"
      @click="selectTag(tag)"
    >
      #{{ tag }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  tags: string[]
  modelValue: string | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

function selectTag(tag: string | null): void {
  emit('update:modelValue', tag === props.modelValue ? null : tag)
}
</script>

<style scoped>
.blog-tag-filter {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
}

.blog-tag-filter__btn {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  letter-spacing: 0.06em;
  padding: 0.45rem 0.9rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.03);
  color: var(--color-text-muted);
  transition:
    color var(--dur-base) var(--ease-out-expo),
    border-color var(--dur-base) var(--ease-out-expo),
    background var(--dur-base) var(--ease-out-expo);
}

.blog-tag-filter__btn:hover {
  color: var(--color-text);
  border-color: var(--color-border-strong);
}

.blog-tag-filter__btn.is-active {
  color: var(--color-text);
  background: rgba(139, 92, 246, 0.14);
  border-color: rgba(139, 92, 246, 0.45);
}
</style>
