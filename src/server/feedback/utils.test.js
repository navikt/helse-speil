const { parseDate } = require('./utils');

global.console = {
    warn: jest.fn(),
    log: jest.fn()
};

describe('date validation', () => {
    test('accepts norwegian and ISO-8601 date formats', () => {
        ['01.01.2019', '01.01.19', '2019-01-01'].forEach(input => {
            expect(parseDate(input).isSame('2019-01-01')).toBeTruthy();
        });
    });

    test('returns undefined if input does not parse', () => {
        expect(parseDate('bomb')).toBeFalsy();
    });
});
