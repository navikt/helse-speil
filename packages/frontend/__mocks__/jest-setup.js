require('jest-axe/extend-expect');
require('@testing-library/jest-dom');
require('./constants');

global.console = {
    ...global.console,
    error: jest.fn(),
    log: jest.fn(),
};
