import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2020',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: 'src/trafiklab-dynamic-travel-card.ts',
      output: {
        entryFileNames: 'trafiklab-dynamic-travel-card.js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  }
});
