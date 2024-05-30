// eslint-disable-next-line @typescript-eslint/no-var-requires
const { pathsToModuleNameMapper } = require('ts-jest');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { compilerOptions } = require('./tsconfig');

module.exports = {
    moduleFileExtensions: ['js', 'jsx', 'json', 'tsx', 'ts'],
    transform: {
        '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': '@swc/jest',
        '^.+\\.(t|j)sx?$': '@swc/jest',
    },
    testEnvironment: 'jsdom',
    modulePaths: [compilerOptions.baseUrl],
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': '__mocks__/styleMock.js',
        '\\.(gif|ttf|eot|svg|png|graphql\\?raw)$': '__mocks__/fileMock.js',
        '^nanoid$': require.resolve('nanoid'),
        ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
    },
    transformIgnorePatterns: ['<rootDir>/node_modules'],
    watchPathIgnorePatterns: ['<rootDir>/node_modules'],
    setupFilesAfterEnv: ['<rootDir>/__mocks__/jest-setup.js'],
};
process.env.TZ = 'UTC';
