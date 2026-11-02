import { uuidV5 } from './uuidV5';

const NAMESPACE = '0e4ec8b1-8fad-4003-b4a4-69d90be4eee0';

describe('uuidV5', () => {
    // Fasit hentet fra uuid-pakken (v5) før den ble fjernet
    it.each([
        ['12345678910', '7d3ea8f3-8e4f-513b-a900-99c62a2e53e9'],
        ['01017012345', 'b6b56ffe-4c3e-5191-941d-5148ef1ea2c2'],
    ])('gir samme UUID som uuid-pakken for %s', (name, expected) => {
        expect(uuidV5(name, NAMESPACE)).toBe(expected);
    });
});
