import baseConfig from '@navikt/tsm-prettier';

const config = {
    ...baseConfig,
    plugins: [...(baseConfig.plugins || []), 'prettier-plugin-tailwindcss'],
    tailwindStylesheet: './src/styles/globals.css',
    tailwindFunctions: ['classNames', 'cn'],
};

export default config;
