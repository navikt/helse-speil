module.exports = {
    useKanBeslutteEgneOppgaver: jest.fn().mockReturnValue(false),
    useHarBeslutterrolle: jest.fn().mockReturnValue(false),
    useTotrinnsvurderingErAktiv: jest.fn().mockReturnValue(false),
    useReadonly: jest.fn().mockReturnValue({
        value: false,
        override: true,
    }),
    useKanFrigiOppgaver: jest.fn(),
};
