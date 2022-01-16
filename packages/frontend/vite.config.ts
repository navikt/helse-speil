import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

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
});
