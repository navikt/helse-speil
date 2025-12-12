import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./vitest.setup.tsx'],
        include: ['**/*.test.{ts,tsx}'],
        exclude: ['node_modules', '.next'],
        css: {
            modules: {
                classNameStrategy: 'non-scoped',
            },
        },
        coverage: {
            provider: 'v8',
        },
        env: {
            NEXT_PUBLIC_RUNTIME_ENV: 'test',
            NEXT_PUBLIC_ASSET_PREFIX: '',
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '@app': resolve(__dirname, './src/app'),
            '@assets': resolve(__dirname, './src/assets'),
            '@auth': resolve(__dirname, './src/auth'),
            '@components': resolve(__dirname, './src/components'),
            '@external': resolve(__dirname, './src/external'),
            '@hooks': resolve(__dirname, './src/hooks'),
            '@io': resolve(__dirname, './src/io'),
            '@nais': resolve(__dirname, './src/nais'),
            '@observability': resolve(__dirname, './src/observability'),
            '@routes': resolve(__dirname, './src/routes'),
            '@saksbilde': resolve(__dirname, './src/routes/saksbilde'),
            '@oversikt': resolve(__dirname, './src/routes/oversikt'),
            '@spesialist-mock': resolve(__dirname, './src/spesialist-mock'),
            '@state': resolve(__dirname, './src/state'),
            '@apollo-mocks': resolve(__dirname, './src/test/tiny-collection-of-mocks'),
            '@test-utils': resolve(__dirname, './src/test/test-utils'),
            '@test-wrappers': resolve(__dirname, './src/test/wrappers'),
            '@test-data': resolve(__dirname, './src/test/data'),
            '@typer': resolve(__dirname, './src/types'),
            '@utils': resolve(__dirname, './src/utils'),
        },
    },
});
