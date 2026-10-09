import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '@petlanka/types': resolve(__dirname, '../../packages/types/src/index.ts'),
        },
    },
    server: {
        port: 5173,
    },
});
