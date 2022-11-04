module.exports = {
    ...jest.requireActual('@state/arbeidsgiver'),
    useArbeidsgiver: jest.fn(),
    useEndringerForPeriode: jest.fn(),
};
