import type { SkillLevel } from '@/types'

const LABELS: Record<SkillLevel, string> = {
  beginner: '入門',
  intermediate: '中級',
  advanced: '上級',
}

const VALUES: Record<SkillLevel, number> = {
  beginner: 0.33,
  intermediate: 0.66,
  advanced: 1,
}

export function skillLevelLabel(level: SkillLevel): string {
  return LABELS[level]
}

export function skillLevelValue(level: SkillLevel): number {
  return VALUES[level]
}
