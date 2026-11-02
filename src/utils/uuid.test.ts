import { isUuid } from './uuid';

describe('isUuid', () => {
    it.each([
        '7d3ea8f3-8e4f-513b-a900-99c62a2e53e9',
        'B6B56FFE-4C3E-5191-941D-5148EF1EA2C2',
        '00000000-0000-0000-0000-000000000000',
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
    ])('godtar %s', (value) => {
        expect(isUuid(value)).toBe(true);
    });

    it.each([
        '',
        '12345678910',
        '7d3ea8f3-8e4f-513b-a900-99c62a2e53e',
        '7d3ea8f3-8e4f-913b-a900-99c62a2e53e9',
        '7d3ea8f3-8e4f-513b-c900-99c62a2e53e9',
        ' 7d3ea8f3-8e4f-513b-a900-99c62a2e53e9',
    ])('avviser %j', (value) => {
        expect(isUuid(value)).toBe(false);
    });
});
