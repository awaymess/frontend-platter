import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': path.join(dirname, 'src'),
    },
  },
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          globals: true,
          environment: 'node',
          include: ['src/**/*.{test,spec}.ts', 'src/**/*.{test,spec}.tsx'],
          exclude: ['node_modules/**', '.next/**', 'storybook-static/**'],
        },
      },
    ],
  },
});
