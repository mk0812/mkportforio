import type { SkillLevel } from '@/types'

const LABELS: Record<SkillLevel, string> = {
  beginner: '入門',
  intermediate: '中級',
  advanced: '上級',
}

export function skillLevelLabel(level: SkillLevel): string {
  return LABELS[level]
}
