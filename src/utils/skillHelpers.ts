import type { Skill, SkillLevel } from '@/types'

/**
 * スキル作成用のヘルパー関数
 * よりシンプルにスキルを定義できる
 */

/**
 * スキルを簡潔に作成するヘルパー
 * @example
 * createSkill('Vue 3', 'advanced', 'Development')
 */
export function createSkill(
  name: string,
  level: SkillLevel,
  category: string
): Skill {
  return { name, level, category }
}

/**
 * 複数のスキルを一括作成（同じカテゴリ・レベル）
 * @example
 * createSkills(['Vue', 'React'], 'advanced', 'Development')
 */
export function createSkills(
  names: string[],
  level: SkillLevel,
  category: string
): Skill[] {
  return names.map((name) => createSkill(name, level, category))
}

/**
 * カテゴリ別にスキルをフィルタリング
 */
export function filterSkillsByCategory(
  skills: Skill[],
  category: string
): Skill[] {
  return skills.filter((skill) => skill.category === category)
}

/**
 * レベル別にスキルをフィルタリング
 */
export function filterSkillsByLevel(
  skills: Skill[],
  level: SkillLevel
): Skill[] {
  return skills.filter((skill) => skill.level === level)
}

/**
 * スキルを名前でソート（昇順）
 */
export function sortSkillsByName(skills: Skill[]): Skill[] {
  return [...skills].sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * スキルをレベルでソート（高→低）
 */
export function sortSkillsByLevel(skills: Skill[]): Skill[] {
  const levelOrder: Record<SkillLevel, number> = {
    advanced: 3,
    intermediate: 2,
    beginner: 1,
  }
  return [...skills].sort((a, b) => levelOrder[b.level] - levelOrder[a.level])
}

/**
 * カテゴリの一覧を取得（重複なし）
 */
export function getUniqueCategories(skills: Skill[]): string[] {
  const categories = skills
    .map((skill) => skill.category)
    .filter((c): c is string => c !== undefined)
  return Array.from(new Set(categories)).sort()
}

/**
 * スキル統計を取得
 */
export function getSkillStats(skills: Skill[]) {
  return {
    total: skills.length,
    byLevel: {
      advanced: filterSkillsByLevel(skills, 'advanced').length,
      intermediate: filterSkillsByLevel(skills, 'intermediate').length,
      beginner: filterSkillsByLevel(skills, 'beginner').length,
    },
    categories: getUniqueCategories(skills),
  }
}
