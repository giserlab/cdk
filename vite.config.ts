import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: './',
  test: {
    outputFile: './tests/unit/report/index.html',
    testTimeout: 60 * 1000,
    globals: true,
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
    include: ['packages/**/*.spec.ts', 'packages/**/*.test.ts'],
    exclude: ['**/demo/**'],
    coverage: {
      reportsDirectory: './tests/unit/coverage',
      provider: 'istanbul',
      include: ['**/packages/**'],
      exclude: ['**/demo/**', 'packages/cdk', '**/dist/**', '**/scripts/**', '**/tests/**', '**/docs/html/**'],
    },
  },

  resolve: {
    alias: {},
  },
});
