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
    setupFiles: ['<rootDir>/jest.setup.ts'],
    setupFilesAfterEnv: ['<rootDir>/jest.setupAfterEnv.ts'],
    transformIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/.next'],
    watchPathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/.next'],
    moduleNameMapper: {
        ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
    },
};

export default createJestConfig(config);
