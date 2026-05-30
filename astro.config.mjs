// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import robotsTxt from 'astro-robots-txt';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://jayatamaborepile.com',
  output: 'server',
  adapter: vercel(),

  integrations: [robotsTxt()],

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: 'lightningcss',
    },
  },
});
