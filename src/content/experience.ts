import type { Experience } from '@/types'

export const experience = [
  {
    id: 'exp-1',
    period: '2024 — 現在',
    title: 'フロントエンド開発',
    organization: '会社名 / チーム名',
    description:
      '担当領域・使用技術・成果をここに記載します。箇条書きにすると読みやすくなります。',
    highlights: [
      'Vue を用いた管理画面の設計・実装',
      'デザインシステムのコンポーネント整備',
    ],
  },
  {
    id: 'exp-2',
    period: '2020 — 2023',
    title: '個人制作・学習',
    organization: 'Self',
    description: 'クリエイティブコーディングや OSS 活動など、副次的な経歴の例です。',
    highlights: ['p5.js によるビジュアル表現', 'ポートフォリオサイトの構築'],
  },
] satisfies Experience[]
