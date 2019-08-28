const { debug, error, info, warning } = global.console;

global.console = {
    log: jest.fn(),
    debug,
    error,
    info,
    warning
};
