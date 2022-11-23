module.exports = {
    useCurrentPerson: jest.fn(),
    useFetchPerson: jest.fn().mockReturnValue(() => null),
    fetchPerson: jest.fn(),
    useResetPerson: jest.fn().mockReturnValue(() => null),
};
