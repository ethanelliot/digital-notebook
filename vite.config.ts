import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import reactSWC from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    reactSWC(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        start_url: '/',
        scope: '/',
        display: 'standalone',
        name: 'Digital Notebook',
        short_name: 'DigitalNotebook',
        description: 'A notetaking and task traking application',
        icons: [
          {
            src: '/favicon.ico',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
