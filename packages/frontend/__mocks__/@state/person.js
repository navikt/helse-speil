module.exports = {
    useCurrentPerson: jest.fn(),
    useLazyFetchPersonQuery: jest.fn().mockReturnValue([() => {}]),
    useFetchPersonQuery: jest.fn().mockReturnValue({
        data: undefined,
    }),
};
