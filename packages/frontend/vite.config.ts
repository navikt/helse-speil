import path from 'path';
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
            external: ['./nais.ts'],
            output: {
                manualChunks(id: string) {
                    if (id.includes('react-router-dom') || id.includes('remix-run') || id.includes('react-router')) {
                        return '@react-router';
                    }
                    if (id.includes('recoil')) {
                        return '@recoil';
                    }
                    if (id.includes('framer-motion')) {
                        return '@framer-motion';
                    }
                    if (id.includes('graphql')) {
                        return '@graphql';
                    }
                    if (
                        id.includes('navikt') ||
                        id.includes('date-fns') ||
                        id.includes('react-modal') ||
                        id.includes('react-day-picker') ||
                        id.includes('tabbable') ||
                        id.includes('floating-ui')
                    ) {
                        return '@navikt';
                    }
                    return undefined;
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
