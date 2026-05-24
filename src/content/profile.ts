import type { Profile } from '@/types'

export const profile = {
  headline: 'はじめまして',
  summary: [
    'ここに自己紹介を書きます。どんなことを作っているか、何に興味があるかを短くまとめると読み手に伝わりやすくなります。',
    '2段落目には、得意分野や今取り組んでいることなど、差し替えやすいプレースホルダーとして使ってください。',
  ],
  location: 'Tokyo, Japan',
  roles: ['Developer', 'Designer'],
  skills: [
    { name: 'JavaScript / TypeScript', level: 'advanced', category: 'Development' },
    { name: 'Vue / React', level: 'advanced', category: 'Development' },
    { name: 'Creative Coding (p5.js, Canvas)', level: 'intermediate', category: 'Creative' },
    { name: 'UI Design', level: 'intermediate', category: 'Design' },
  ],
  interests: ['インタラクティブ表現', 'OSS', '技術記事'],
} satisfies Profile
