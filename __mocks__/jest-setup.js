const { debug, error, info, warning, log } = global.console;

global.console = {
    log: jest.fn(),
    debug,
    error,
    info,
    warning,
};
