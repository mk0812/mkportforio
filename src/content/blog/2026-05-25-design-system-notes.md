---
title: デザインシステムのメモ
date: 2026-05-25
description: このサイトで使っているトークンとコンポーネント設計の要点
tags: [design, css, vue]
draft: false
---

このポートフォリオでは、色・余白・タイポグラフィを CSS カスタムプロパティで一元管理しています。新しいセクションを追加するときも、既存トークンを参照することで見た目の一貫性を保てます。

## トークン設計

背景色は `--color-bg` から `--color-surface-elevated` まで段階的に定義し、ネオン系アクセントは `--neon-cyan` 〜 `--neon-magenta` のグラデーションで統一しています。spacing は `--space-xs` から `--space-3xl` まで modular scale で揃えています。

## コンポーネント

UI は `BaseButton` や `TagList` など小さな部品に分割し、ページ側は `SectionBlock` でラップする構成です。ブログも同じパターンに乗せ、一覧カードは `ProjectCard` に近い hover 表現を控えめに適用しました。

コードブロックのハイライト確認用に、Vue の script setup の例を載せておきます。

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useBlogPosts } from '@/composables/useBlogPosts'

const { posts, allTags } = useBlogPosts()
const count = computed(() => posts.length)
</script>
```

Shiki によるシンタックスハイライトが build 時に静的化されるため、記事ページでも追加のランタイムコストは最小限です。
