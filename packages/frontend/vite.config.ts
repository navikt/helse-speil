import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import path from 'path';

export default defineConfig({
    plugins: [reactRefresh()],
    build: {
        outDir: '../../dist/client',
        sourcemap: true,
        assetsDir: 'static',
        emptyOutDir: true,
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
    resolve: {
        alias: {
            '@io/graphql': path.resolve(__dirname, './io/graphql'),
        },
    },
});
