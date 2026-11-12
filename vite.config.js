import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' keeps the built site working from any folder (GitHub Pages, local file server).
export default defineConfig({
  plugins: [react()],
  base: './',
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
  },
});
