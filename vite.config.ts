import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@headlessui/react', 'framer-motion', 'lucide-react'],
        },
      },
    },
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
  preview: {
    port: 4173,
    host: true
  }
});