import type { SiteConfig } from '@/types'

export const siteConfig = {
  name: 'Your Name',
  title: 'Portfolio',
  tagline: 'フロントエンド / クリエイティブコーディング',
  description:
    '作品・スキル・経歴をまとめた個人ポートフォリオサイトです。',
  locale: 'ja',
  url: 'https://example.com',
  email: 'hello@example.com',
  social: [
    { label: 'GitHub', href: 'https://github.com/yourname', icon: 'github' },
    { label: 'X', href: 'https://x.com/yourname', icon: 'x' },
  ],
  nav: [
    { label: 'ホーム', to: '/' },
    { label: '作品', to: '/projects' },
    { label: 'プロフィール', to: '/about' },
  ],
} satisfies SiteConfig
