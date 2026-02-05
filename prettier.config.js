import baseConfig from '@navikt/tsm-prettier';

const config = {
    ...baseConfig,
    semi: true,
    singleQuote: true,
    tabWidth: 4,
    printWidth: 120,
    plugins: [...(baseConfig.plugins || []), '@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
    importOrder: [
        '^./globals.css$',
        '<THIRD_PARTY_MODULES>',
        '^@navikt/(.*)$',
        '^(@(.*)|@(.*)/(.*))',
        '^([.]{1,2}/)+[æøåÆØÅa-zA-Z]+((/[æøåÆØÅa-zA-Z]+)+)?$',
        '^.*([.]css)|.*([.]scss)$',
    ],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    trailingComma: 'all',
    tailwindStylesheet: './src/app/globals.css',
    tailwindFunctions: ['classNames', 'cn'],
    overrides: [
        {
            files: ['*.yml', '*.yaml'],
            options: {
                bracketSpacing: false,
                tabWidth: 2,
            },
        },
    ],
};

export default config;
