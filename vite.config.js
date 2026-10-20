import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' + HashRouter: funciona no GitHub Pages independentemente do nome do repositório
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          katex: ['katex'],
        },
      },
    },
  },
})
