module.exports = {
    preset: 'ts-jest',
    moduleFileExtensions: ['js', 'json', 'ts'],
    transform: {
        '^.+\\.js$': 'babel-jest',
        '^.+\\.ts$': 'ts-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules'],
    watchPathIgnorePatterns: ['<rootDir>/node_modules'],
    setupFilesAfterEnv: ['<rootDir>/__mocks__/jest-setup.js'],
};
process.env.TZ = 'UTC';
