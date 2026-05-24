import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'unplugin-vue-markdown/vite'
import MarkdownItShiki from '@shikijs/markdown-it'

export default defineConfig({
  base: '/mkportforio/',
  plugins: [
    vue({ include: [/\.vue$/, /\.md$/] }),
    Markdown({
      headEnabled: false,
      frontmatter: true,
      excerpt: true,
      wrapperClasses: 'prose',
      async markdownSetup(md) {
        const shikiPlugin = await MarkdownItShiki({
          themes: { dark: 'vesper', light: 'vesper' },
          defaultColor: 'dark',
        })
        md.use(shikiPlugin as unknown as Parameters<typeof md.use>[0])

        const defaultHeadingOpen = md.renderer.rules.heading_open
        md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
          const token = tokens[idx]
          if (token.tag === 'h2' || token.tag === 'h3') {
            const inlineToken = tokens[idx + 1]
            if (inlineToken?.type === 'inline' && inlineToken.content) {
              const slug = inlineToken.content
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w\u3000-\u9fff-]/g, '')
              if (slug) token.attrSet('id', slug)
            }
          }
          return defaultHeadingOpen
            ? defaultHeadingOpen(tokens, idx, options, env, self)
            : self.renderToken(tokens, idx, options)
        }

        const defaultImageRender = md.renderer.rules.image
        md.renderer.rules.image = (tokens, idx, options, env, self) => {
          const token = tokens[idx]
          const attrIndex = token.attrIndex('loading')
          if (attrIndex < 0) {
            token.attrPush(['loading', 'lazy'])
          } else if (token.attrs) {
            token.attrs[attrIndex][1] = 'lazy'
          }
          return defaultImageRender
            ? defaultImageRender(tokens, idx, options, env, self)
            : self.renderToken(tokens, idx, options)
        }
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/shiki') || id.includes('@shikijs')) {
            return 'shiki'
          }
        },
      },
    },
  },
})
