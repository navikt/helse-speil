require('jest-axe/extend-expect');
require('@testing-library/jest-dom/extend-expect');

global.console = {
    ...global.console,
    error: jest.fn(),
    log: jest.fn(),
};
