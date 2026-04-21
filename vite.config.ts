import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // 接口：浏览器只访问 5173，由 Vite 转发到后端，避免跨端口 Cookie/CORS
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // 静态上传文件：与接口同源走 5173，再转发到 4000（需与后端返回的 /uploads/... 一致）
      'public/uploads': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
