import { siteConfig } from '@/config/site'
import type { SiteConfig } from '@/types'

export function useSiteConfig(): { site: SiteConfig } {
  return { site: siteConfig }
}
