const { parseDate } = require('./utils');

describe('date validation', () => {
    test('accepts norwegian and ISO-8601 date formats', () => {
        ['01.01.2019', '01.01.19', '2019-01-01'].forEach(async input => {
            await parseDate(input).then(date => {
                console.log('meh');
                expect(date.isSame('2019-01-01')).toBeTruthy();
            });
        });
    });

    test('throws if input does not parse', () => {
        expect(() => parseDate('bomb')).toThrow(Error);
    });
});
