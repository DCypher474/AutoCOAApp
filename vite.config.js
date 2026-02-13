import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const scriptUrl = env.VITE_SHEETS_SCRIPT_URL || ''
  let scriptPath = ''
  try {
    if (scriptUrl) scriptPath = new URL(scriptUrl).pathname
  } catch (_) {}

  return {
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png'],
      manifest: {
        name: 'AutoCOA App',
        short_name: 'AutoCOA',
        description: 'Progressive Web App',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      }
    })
  ],
  server: {
    proxy: scriptPath
      ? {
          '/api/sheets': {
            target: 'https://script.google.com',
            changeOrigin: true,
            secure: true,
            rewrite: () => scriptPath,
          },
        }
      : {},
  },
  }
})
