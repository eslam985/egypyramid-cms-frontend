import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    server: {
        host: true,
        proxy: {
            '/api': {
                target: 'https://egypyramid-cms-backend.vercel.app', // رابط الباك إند الصريح
                changeOrigin: true,
            },
        },
    },
    plugins: [
        tailwindcss(),
        vue(),
        vueDevTools(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
})
