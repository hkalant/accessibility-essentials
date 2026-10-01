import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// One HTML file per page so every lesson is its own deep-linkable URL (and Moodle iframe target).
export const pages = {
  index: 'index.html',
  'lesson-1': 'lesson-1.html',
  'lesson-2': 'lesson-2.html',
  'lesson-3': 'lesson-3.html',
  'lesson-4': 'lesson-4.html',
  'lesson-5': 'lesson-5.html',
  'lesson-6': 'lesson-6.html',
  glossary: 'glossary.html',
  progress: 'progress.html',
  'home-print': 'home-print.html',
};

export default defineConfig({
  // Relative asset URLs, so the build works from any folder on any static host.
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(Object.entries(pages).map(([k, f]) => [k, resolve(import.meta.dirname, f)])),
    },
  },
});
