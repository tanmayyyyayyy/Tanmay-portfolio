import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineConfig({
  base: '/Tanmay-portfolio/',
  plugins: [react()],
  define: {
    __HAS_SKY_VIDEO__: JSON.stringify(existsSync(resolve('public/sky.mp4'))),
    __HAS_SKY_POSTER__: JSON.stringify(existsSync(resolve('public/sky.jpg'))),
  },
})
