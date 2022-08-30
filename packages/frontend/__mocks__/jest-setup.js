global.console = {
    ...global.console,
    error: jest.fn(),
    log: jest.fn(),
};

window.ResizeObserver = class {
    observe() {}

    unobserve() {}

    disconnect() {}
};
