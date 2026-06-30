import type { Profile } from '@/types'
import { allSkills } from './skills'

export const profile = {
  headline: 'はじめまして',
  summary: [
    'ここに自己紹介を書きます。どんなことを作っているか、何に興味があるかを短くまとめると読み手に伝わりやすくなります。',
    '2段落目には、得意分野や今取り組んでいることなど、差し替えやすいプレースホルダーとして使ってください。',
  ],
  location: 'Tokyo, Japan',
  roles: ['Developer', 'Designer'],
  skills: allSkills,
  interests: ['インタラクティブ表現', 'OSS', '技術記事'],
} satisfies Profile
