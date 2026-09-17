import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
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
            '@': resolve(import.meta.dirname, './src'),
            '@app': resolve(import.meta.dirname, './src/app'),
            '@assets': resolve(import.meta.dirname, './src/assets'),
            '@auth': resolve(import.meta.dirname, './src/auth'),
            '@components': resolve(import.meta.dirname, './src/components'),
            '@external': resolve(import.meta.dirname, './src/external'),
            '@hooks': resolve(import.meta.dirname, './src/hooks'),
            '@io': resolve(import.meta.dirname, './src/io'),
            '@nais': resolve(import.meta.dirname, './src/nais'),
            '@observability': resolve(import.meta.dirname, './src/observability'),
            '@routes': resolve(import.meta.dirname, './src/routes'),
            '@saksbilde': resolve(import.meta.dirname, './src/routes/saksbilde'),
            '@oversikt': resolve(import.meta.dirname, './src/routes/oversikt'),
            '@spesialist-mock': resolve(import.meta.dirname, './src/spesialist-mock'),
            '@state': resolve(import.meta.dirname, './src/state'),
            '@test-utils': resolve(import.meta.dirname, './src/test/test-utils'),
            '@test-wrappers': resolve(import.meta.dirname, './src/test/wrappers'),
            '@test-data': resolve(import.meta.dirname, './src/test/data'),
            '@typer': resolve(import.meta.dirname, './src/types'),
            '@utils': resolve(import.meta.dirname, './src/utils'),
        },
    },
});
