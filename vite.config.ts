/// <reference types="vitest/config" />
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_NAME = 'Japan-App'

export default defineConfig({
  base: `/${REPO_NAME}/`,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icons/*.png'],
      manifest: {
        name: 'Japanisch Lern-App',
        short_name: 'JAPP',
        description: 'Lerne Hiragana, Katakana, Kanji und Vokabeln',
        theme_color: '#235390',
        background_color: '#f0f4f8',
        display: 'standalone',
        orientation: 'portrait',
        scope: `/${REPO_NAME}/`,
        start_url: `/${REPO_NAME}/`,
        icons: [
          { src: `/${REPO_NAME}/icons/icon-192.png`, sizes: '192x192', type: 'image/png' },
          { src: `/${REPO_NAME}/icons/icon-512.png`, sizes: '512x512', type: 'image/png' },
          { src: `/${REPO_NAME}/icons/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\./,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
    }),
  ],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
