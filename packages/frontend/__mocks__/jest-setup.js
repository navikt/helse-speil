require('jest-axe/extend-expect');
require('@testing-library/jest-dom');

global.console = {
    ...global.console,
    error: jest.fn(),
    log: jest.fn(),
};
