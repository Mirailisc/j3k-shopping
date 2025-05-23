import { configDefaults, defineConfig } from 'vitest/config'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
    },
    exclude: [...configDefaults.exclude],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
