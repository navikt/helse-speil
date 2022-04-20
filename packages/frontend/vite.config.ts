import { defineConfig, splitVendorChunkPlugin } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import path from 'path';

export default defineConfig({
    plugins: [reactRefresh(), splitVendorChunkPlugin()],
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
