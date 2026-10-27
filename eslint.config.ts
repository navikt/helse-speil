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
            'src/io/rest/generated/**',
            'src/io/sanity/generated/**',
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
    {
        files: ['src/**/*.tsx'],
        rules: {
            'no-restricted-syntax': [
                'error',
                {
                    selector:
                        "JSXAttribute[name.name='icon'] JSXOpeningElement[name.name=/Icon$/]:not(:has(JSXAttribute[name.name='aria-hidden']))",
                    message:
                        'Ikon i icon-prop skal ha aria-hidden. Ikonknapper uten tekst får navn via <Tooltip content="…">. Se «Ikoner, tooltips og tilgjengelige navn» i .github/copilot-instructions.md.',
                },
                {
                    selector: "JSXOpeningElement[name.name=/^(Button|CopyButton)$/] > JSXAttribute[name.name='title']",
                    message:
                        'Ikke bruk title på knapper. Pakk knappen inn i <Tooltip content="…">. Se «Ikoner, tooltips og tilgjengelige navn» i .github/copilot-instructions.md.',
                },
            ],
        },
    },
    {
        files: [
            'src/app/**/route.ts',
            'src/app/api/**/common.ts',
            'src/app/api/sanity/stubEllerVideresendTilSanity.ts',
        ],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['**/stub', '**/*Stub', '@spesialist-mock/*', '!@spesialist-mock/constants'],
                            message:
                                'Mockkode skal ikke lastes i produksjon. Last den med import() inne i mock-grenen, f.eks. via stubEllerVideresend*.',
                        },
                    ],
                },
            ],
        },
    },
]);

export default eslintConfig;
