module.exports = {
    useOppgaver: jest.fn(),
    useMineOppgaver: jest.fn(),
    useOppgaverLoadable: jest.fn(),
    useRefetchOppgaver: jest.fn().mockReturnValue(() => null),
    useRefetchFerdigstilteOppgaver: jest.fn().mockReturnValue(() => null),
    useTildelOppgave: jest.fn().mockReturnValue(() => null),
};
