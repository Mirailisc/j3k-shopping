import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import type { PluginOption } from 'vite'
import eslint from 'vite-plugin-eslint2'
import tsconfigPaths from 'vite-tsconfig-paths'

import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  process.env = { ...process.env, ...env }

  return {
    optimizeDeps: {
      include: [],
    },
    build: {
      commonjsOptions: {
        exclude: [],
        include: [/node_modules/],
      },
    },
    base: '/',
    plugins: [react(), eslint({ fix: true }) as PluginOption, tsconfigPaths(), tailwindcss()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api/v2': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 8000,
      proxy: {
        '/api/v2': {
          target: 'https://j3k-api.arius.cloud',
          changeOrigin: true,
          secure: true,
        },
      },
    },
  }
})
