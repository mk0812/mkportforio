/**
 * 作品一覧。画像は public/projects/ に置く想定です。
 */
export const projects = [
  {
    id: 'sample-interactive',
    title: 'インタラクティブ作品（サンプル）',
    description:
      'マウスやスクロールに反応する表現のプレースホルダーです。実作品の説明・技術スタック・リンクに差し替えてください。',
    tags: ['p5.js', 'Canvas', 'Vue'],
    year: 2024,
    href: '#',
    repo: 'https://github.com/yourname/sample',
    image: null,
    featured: true,
  },
  {
    id: 'sample-web-app',
    title: 'Web アプリ（サンプル）',
    description:
      '業務・個人開発の代表案件を1件載せる想定のカードです。課題・役割・成果を2〜3文で書くと効果的です。',
    tags: ['Vue', 'Vite'],
    year: 2025,
    href: '#',
    repo: null,
    image: null,
    featured: true,
  },
  {
    id: 'sample-experiment',
    title: '実験プロトタイプ',
    description: '小さな試作やハッカソン作品など、サブカテゴリ向けの例です。',
    tags: ['Prototype'],
    year: 2023,
    href: null,
    repo: 'https://github.com/yourname/experiment',
    image: null,
    featured: false,
  },
]
