import type { Skill } from '@/types'

/**
 * スキルデータ - カテゴリ別に整理
 * 新しいスキルを追加する場合は、該当カテゴリに追加するだけでOK
 */

// Development スキル
export const developmentSkills = [
  { name: 'JavaScript / TypeScript', level: 'advanced', category: 'Development' },
  { name: 'Vue / React', level: 'advanced', category: 'Development' },
  { name: 'Node.js', level: 'intermediate', category: 'Development' },
  { name: 'Vite / Webpack', level: 'intermediate', category: 'Development' },
] satisfies Skill[]

// Creative スキル
export const creativeSkills = [
  { name: 'Creative Coding (p5.js, Canvas)', level: 'intermediate', category: 'Creative' },
  { name: 'Three.js / WebGL', level: 'intermediate', category: 'Creative' },
  { name: 'GSAP / Animation', level: 'advanced', category: 'Creative' },
  { name: 'GLSL Shaders', level: 'beginner', category: 'Creative' },
] satisfies Skill[]

// Design スキル
export const designSkills = [
  { name: 'UI Design', level: 'intermediate', category: 'Design' },
  { name: 'Figma', level: 'intermediate', category: 'Design' },
  { name: 'Design Systems', level: 'intermediate', category: 'Design' },
] satisfies Skill[]

// Tools スキル
export const toolsSkills = [
  { name: 'Git / GitHub', level: 'advanced', category: 'Tools' },
  { name: 'Docker', level: 'beginner', category: 'Tools' },
  { name: 'CI/CD', level: 'intermediate', category: 'Tools' },
] satisfies Skill[]

/**
 * 全スキルを統合
 * カテゴリごとに配列を追加するだけで自動的に統合される
 */
export const allSkills = [
  ...developmentSkills,
  ...creativeSkills,
  ...designSkills,
  ...toolsSkills,
] satisfies Skill[]

/**
 * カテゴリ別にスキルを取得
 */
export const skillsByCategory = {
  Development: developmentSkills,
  Creative: creativeSkills,
  Design: designSkills,
  Tools: toolsSkills,
} as const
