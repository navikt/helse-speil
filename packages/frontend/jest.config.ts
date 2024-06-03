import { compilerOptions } from './tsconfig.json';
import type { Config } from 'jest';
import nextJest from 'next/jest.js';
import { pathsToModuleNameMapper } from 'ts-jest';

const createJestConfig = nextJest({
    dir: './',
});

const config: Config = {
    preset: 'ts-jest',
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    transformIgnorePatterns: ['<rootDir>/node_modules'],
    watchPathIgnorePatterns: ['<rootDir>/node_modules'],
    moduleNameMapper: {
        ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
        '^nanoid$': require.resolve('nanoid'),
    },
};

export default createJestConfig(config);
