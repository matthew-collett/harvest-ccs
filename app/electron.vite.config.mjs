import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@/lib': resolve('src/main/lib'),
        '@shared': resolve('src/shared')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    assetsInclude: 'src/renderer/assets/**',
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@shared': resolve('src/shared'),
        '@/hooks': resolve('src/renderer/src/hooks'),
        '@/components': resolve('src/renderer/src/components'),
        '@/assets': resolve('src/renderer/src/assets'),
        '@/store': resolve('src/renderer/src/store'),
        '@/views': resolve('src/renderer/src/views'),
        '@/context': resolve('src/renderer/src/context'),
        '@/utils': resolve('src/renderer/src/utils')
      }
    },
    plugins: [react()]
  }
})
