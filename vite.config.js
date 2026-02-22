import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/Fullstack_Frontend_part/",
  plugins: [react()],
})
