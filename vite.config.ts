import { defineConfig } from 'vite'
import reactSWC from '@vitejs/plugin-react-swc'; 
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [reactSWC()],
   resolve: {
    alias: {
      // You can define multiple aliases here
      // For '@/', it usually points to your 'src' directory
      '@': path.resolve(__dirname, './src'), // <--- Add this block
    },
  },
})
