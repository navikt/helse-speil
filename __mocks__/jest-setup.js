const { debug, error, info, warning, log } = global.console;

global.console = {
    log,
    debug,
    error,
    info,
    warning,
};
