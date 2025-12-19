import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';

import tsmEslintReact from '@navikt/tsm-eslint-react';

import importAlias from '@limegrass/eslint-plugin-import-alias';

const eslintConfig = defineConfig([
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
    ...nextVitals,
    ...nextTs,
    ...tsmEslintReact,
    reactHooks.configs.flat['recommended-latest'],
    {
        extends: [eslintPluginPrettierRecommended],
        rules: {
            'prettier/prettier': 'warn',
            'import/order': 'off',
            'import/no-extraneous-dependencies': 'error',
            '@typescript-eslint/array-type': 'error',
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
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
]);

export default eslintConfig;
