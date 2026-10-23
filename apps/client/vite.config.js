import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '@petlanka/types': resolve(__dirname, '../../packages/types/src/index.ts'),
            '@petlanka/i18n': resolve(__dirname, '../../packages/i18n/src/index.ts'),
        },
    },
    server: {
        port: 5173,
    },
});
