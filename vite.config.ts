import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import reactSWC from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [reactSWC(), tailwindcss()],
  resolve: {
    alias: {
      // You can define multiple aliases here
      // For '@/', it usually points to your 'src' directory
      '@': path.resolve(__dirname, './src'), // <--- Add this block
    },
  },
})
