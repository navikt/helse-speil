import path from 'path';
// @ts-ignore
import { defineConfig, splitVendorChunkPlugin } from 'vite';

import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react({
            include: '**/*.tsx',
        }),
        splitVendorChunkPlugin(),
    ],
    server: {
        hmr: true,
    },
    build: {
        outDir: '../../dist/client',
        sourcemap: true,
        assetsDir: 'static',
        emptyOutDir: true,
        commonjsOptions: {
            transformMixedEsModules: true,
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ['react', 'react-dom'],
                },
            },
        },
    },
    resolve: {
        alias: {
            '@io': path.resolve(__dirname, './io'),
            '@hooks': path.resolve(__dirname, './hooks'),
            '@state': path.resolve(__dirname, './state'),
            '@utils': path.resolve(__dirname, './utils'),
            '@components': path.resolve(__dirname, './components'),
        },
    },
});
