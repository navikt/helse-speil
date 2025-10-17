import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

import js from '@eslint/js';
import next from '@next/eslint-plugin-next';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
    js.configs.recommended,
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
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            '@typescript-eslint': typescript,
            'jsx-a11y': jsxA11y,
            import: importPlugin,
            'react-hooks': reactHooks,
            '@next/next': next,
        },
        rules: {
            'import/no-extraneous-dependencies': 'error',
            'react/display-name': 'off',
            '@typescript-eslint/array-type': 'error',
            '@typescript-eslint/no-namespace': 'off',
            'no-undef': 'off',
            'no-unused-vars': 'off',
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
            ...jsxA11y.configs.recommended.rules,
        },
    },
    {
        files: ['**/*.test.{js,ts,jsx,tsx}', '**/__tests__/**'],
        languageOptions: {
            globals: {
                describe: 'readonly',
                it: 'readonly',
                test: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly',
                jest: 'readonly',
            },
        },
    },
];
