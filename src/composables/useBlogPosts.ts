import { computed } from 'vue'
import { parsePostFrontmatter, type Post } from '@/types/blog'

const componentModules = import.meta.glob<{ default: import('vue').Component }>(
  '@/content/blog/*.md',
)
const rawModules = import.meta.glob<string>('@/content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const DATE_PREFIX_RE = /^\d{4}-\d{2}-\d{2}-(.+)\.md$/

function extractSlug(path: string): string {
  const filename = path.split('/').pop() ?? path
  const match = filename.match(DATE_PREFIX_RE)
  if (match?.[1]) return match[1]
  return filename.replace(/\.md$/, '')
}

function parseRawMarkdown(raw: string): { frontmatter: Record<string, unknown>; body: string } | null {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return null
  return {
    frontmatter: parseYamlFrontmatter(match[1]),
    body: match[2],
  }
}

function parseYamlFrontmatter(yaml: string): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const line of yaml.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const colonIndex = trimmed.indexOf(':')
    if (colonIndex === -1) continue

    const key = trimmed.slice(0, colonIndex).trim()
    let value: unknown = trimmed.slice(colonIndex + 1).trim()

    if (value === 'true') {
      result[key] = true
      continue
    }
    if (value === 'false') {
      result[key] = false
      continue
    }

    if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
      result[key] = value
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
      continue
    }

    if (
      typeof value === 'string' &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1)
    }

    result[key] = value
  }

  return result
}

function extractExcerpt(body: string): string | undefined {
  const paragraph = body
    .split(/\n\n+/)
    .map((block) => block.trim())
    .find((block) => block.length > 0 && !block.startsWith('#'))

  return paragraph
}

function estimateReadingTime(text: string): number {
  const cleaned = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*`[\]()!-]/g, ' ')
    .trim()

  const cjkCount = (cleaned.match(/[\u3000-\u9fff\uf900-\ufaff]/g) ?? []).length
  const latinWords = cleaned
    .replace(/[\u3000-\u9fff\uf900-\ufaff]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length

  const minutes = cjkCount >= latinWords ? cjkCount / 800 : latinWords / 400
  return Math.max(1, Math.ceil(minutes))
}

function buildPosts(): Post[] {
  const posts: Post[] = []

  for (const [path, raw] of Object.entries(rawModules)) {
    if (typeof raw !== 'string') continue

    const parsed = parseRawMarkdown(raw)
    if (!parsed) continue

    const frontmatter = parsePostFrontmatter(parsed.frontmatter)
    if (!frontmatter || frontmatter.draft) continue

    const loader = componentModules[path]
    if (!loader) continue

    posts.push({
      ...frontmatter,
      slug: extractSlug(path),
      readingTime: estimateReadingTime(parsed.body),
      excerpt: extractExcerpt(parsed.body),
      loader,
    })
  }

  return posts.sort((a, b) => b.date.localeCompare(a.date))
}

const allPosts = buildPosts()

export function useBlogPosts() {
  const posts = computed(() => allPosts)

  const allTags = computed(() => {
    const tags = new Set<string>()
    for (const post of allPosts) {
      for (const tag of post.tags) tags.add(tag)
    }
    return [...tags].sort((a, b) => a.localeCompare(b))
  })

  function getPostBySlug(slug: string): Post | undefined {
    return allPosts.find((post) => post.slug === slug)
  }

  function getAdjacentPosts(slug: string): {
    prev: Post | null
    next: Post | null
  } {
    const index = allPosts.findIndex((post) => post.slug === slug)
    if (index === -1) return { prev: null, next: null }

    return {
      prev: allPosts[index + 1] ?? null,
      next: allPosts[index - 1] ?? null,
    }
  }

  return {
    posts,
    allTags,
    getPostBySlug,
    getAdjacentPosts,
  }
}
