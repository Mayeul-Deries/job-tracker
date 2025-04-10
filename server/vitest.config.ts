// vitest.config.ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    maxConcurrency: 1,
    coverage: {
      reporter: ['html'],
    },
  },
});
