import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Load env files from the parent workspace folder (../.env).
  plugins: [react(), tailwindcss()],
})
