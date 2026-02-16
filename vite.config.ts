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
      manifest: {
        start_url: '/',
        scope: '/',
        display: 'standalone',
        name: 'Digital Notebook',
        short_name: 'Notebook',
        description: 'A notetaking and task traking application',
        icons: [
          {
            src: '/favicon-png.png',
            sizes: '512x512',
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
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
})
