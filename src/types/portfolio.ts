export type SkillLevel = 'beginner' | 'intermediate' | 'advanced'

export type ButtonVariant = 'primary' | 'ghost' | 'outline'

export interface SocialLink {
  label: string
  href: string
  icon: string
}

export interface NavItem {
  label: string
  to: string
}

export interface SiteConfig {
  name: string
  title: string
  tagline: string
  description: string
  locale: string
  url: string
  email: string
  social: SocialLink[]
  nav: NavItem[]
}

export interface Skill {
  name: string
  level: SkillLevel
  category?: string
}

export interface Profile {
  headline: string
  summary: string[]
  location: string
  roles: string[]
  skills: Skill[]
  interests: string[]
}

export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  year: number
  href: string | null
  repo: string | null
  image: string | null
  featured: boolean
}

export interface Experience {
  id: string
  period: string
  title: string
  organization: string
  description: string
  highlights: string[]
}
