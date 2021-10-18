import { defineConfig } from 'vite';
import reactPlugin from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [reactPlugin()],
    build: {
        outDir: '../../dist/client',
        sourcemap: true,
        assetsDir: 'static',
        emptyOutDir: true,
    },
});
