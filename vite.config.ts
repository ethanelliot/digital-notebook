import { defineConfig } from 'vite'
import reactSWC from '@vitejs/plugin-react-swc'; 

// https://vite.dev/config/
export default defineConfig({
  plugins: [reactSWC()],
})
