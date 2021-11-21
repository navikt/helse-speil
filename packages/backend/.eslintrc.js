module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    env: {
        node: true,
        browser: false,
    },
    rules: {
        'no-console': 'off',
    },
};
