console.error('DET MOCKES');

module.exports = {
    useCurrentPerson: jest.fn(),
    useFetchPersonQuery: jest.fn().mockReturnValue({
        data: undefined,
    }),
};
