import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';

import tsmEslintReact from '@navikt/tsm-eslint-react';

import importAlias from '@limegrass/eslint-plugin-import-alias';

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    ...tsmEslintReact,
    {
        extends: [eslintPluginPrettierRecommended],
        rules: {
            'prettier/prettier': 'warn',
            'import/order': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
        },
    },
    {
        ignores: [
            'src/io/graphql/generated/graphql.ts',
            'src/io/rest/generated/**',
            'src/spesialist-mock/schemaTypes.ts',
            '.next/**',
            'node_modules/**',
            'out/**',
            'dist/**',
        ],
    },
    {
        rules: {
            'react-hooks/refs': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
        },
    },
    {
        files: ['src/**/*.ts', 'src/**/*.tsx'],
        plugins: { 'import-alias': importAlias },
        rules: {
            'import-alias/import-alias': [
                'error',
                {
                    relativeImportOverrides: [{ depth: 1, path: '.' }],
                },
            ],
        },
    },
    {
        files: ['**/*.test.{js,ts,jsx,tsx}', '**/__tests__/**'],
        rules: {
            'import/no-extraneous-dependencies': 'off',
        },
    },
]);

export default eslintConfig;
