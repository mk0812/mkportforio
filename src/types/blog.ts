export interface PostFrontmatter {
  title: string
  date: string
  description: string
  tags: string[]
  draft: boolean
}

export type Post = PostFrontmatter & {
  slug: string
  readingTime: number
  excerpt?: string
  loader: () => Promise<{ default: import('vue').Component }>
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function parsePostFrontmatter(raw: unknown): PostFrontmatter | null {
  if (!raw || typeof raw !== 'object') return null

  const fm = raw as Record<string, unknown>
  if (typeof fm.title !== 'string') return null
  if (typeof fm.date !== 'string' || !DATE_RE.test(fm.date)) return null
  if (typeof fm.description !== 'string') return null

  const tags = Array.isArray(fm.tags)
    ? fm.tags.filter((tag): tag is string => typeof tag === 'string')
    : []

  const draft = typeof fm.draft === 'boolean' ? fm.draft : false

  return {
    title: fm.title,
    date: fm.date,
    description: fm.description,
    tags,
    draft,
  }
}
