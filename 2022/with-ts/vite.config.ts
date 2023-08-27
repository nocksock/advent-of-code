/// <reference types="vitest" />
import { resolve } from 'pathe'
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    includeSource: [
      '*.ts',
    ],
  },
  define: {
    'import.meta.vitest': false,
  },
  build: {
    lib: {
      formats: ['es'],
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'index',
    },
  },
})
