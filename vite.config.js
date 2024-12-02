import { defineConfig } from 'vite';
import prismjs from 'vite-plugin-prismjs';

export default defineConfig({
  base: '/enflujo-pantallas-pixeles/',
  server: {
    port: 3000,
  },
  publicDir: 'estaticos',
  build: {
    outDir: 'publico',
    assetsDir: 'estaticos',
    sourcemap: true,
  },
  plugins: [
    prismjs({
      languages: ['cpp'],
      theme: 'tomorrow',
      css: true,
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
});
