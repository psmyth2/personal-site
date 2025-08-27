// astro.config.ts
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import playformInline from '@playform/inline'
import remarkMath from 'remark-math'
import remarkDirective from 'remark-directive'
import rehypeKatex from 'rehype-katex'
import remarkEmbeddedMedia from './src/plugins/remark-embedded-media.mjs'
import remarkReadingTime from './src/plugins/remark-reading-time.mjs'
import rehypeCleanup from './src/plugins/rehype-cleanup.mjs'
import rehypeImageProcessor from './src/plugins/rehype-image-processor.mjs'
import rehypeCopyCode from './src/plugins/rehype-copy-code.mjs'
import remarkTOC from './src/plugins/remark-toc.mjs'
import * as path from 'node:path'
import { imageConfig } from './src/utils/image-config' // <-- re-add this

export default defineConfig({
  // adapter removed
  site: 'https://www.smythgeospatial.com',
  output: 'static',

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: imageConfig
    }
  },

  markdown: {
    shikiConfig: { theme: 'css-variables', wrap: false },
    remarkPlugins: [remarkMath, remarkDirective, remarkEmbeddedMedia, remarkReadingTime, remarkTOC],
    rehypePlugins: [rehypeKatex, rehypeCleanup, rehypeImageProcessor, rehypeCopyCode]
  },

  integrations: [
    playformInline({ Exclude: [(file: string) => file.toLowerCase().includes('katex')] }),
    mdx(),
    sitemap()
  ],

  vite: {
    resolve: { alias: { '@': path.resolve('./src') } },
    // dev-only proxy to avoid SSR endpoints in production
    server: process.env.PROXY_TARGET
      ? {
          proxy: {
            '/api': {
              target: process.env.PROXY_TARGET,
              changeOrigin: true,
              secure: false,
              rewrite: (p) => p.replace(/^\/api/, '')
            }
          }
        }
      : undefined
  },

  devToolbar: { enabled: false }
})
