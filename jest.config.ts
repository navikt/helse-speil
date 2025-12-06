// @ts-ignore - https://thedrlambda.medium.com/nodejs-typescript-and-the-infuriating-esm-errors-828b77e7ecd3
import { compilerOptions } from './tsconfig.json' with { type: 'json' };
import type { Config } from 'jest';
import nextJest from 'next/jest.js';
import { pathsToModuleNameMapper } from 'ts-jest';

const createJestConfig = nextJest({
    dir: './',
});

const config: Config = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    setupFiles: ['<rootDir>/jest.setup.ts'],
    setupFilesAfterEnv: ['<rootDir>/jest.setupAfterEnv.ts'],
    transformIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/.next'],
    watchPathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/.next'],
    moduleNameMapper: {
        ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
        '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
        '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
        '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    },
};

export default createJestConfig(config);
