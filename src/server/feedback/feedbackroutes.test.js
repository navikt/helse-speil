const { _convertToMoment } = require('./feedbackroutes');

describe('date validation', () => {
    test('accepts norwegian and ISO-8601 date formats', () => {
        ['01.01.2019', '01.01.19', '2019-01-01'].forEach(input => {
            expect(_convertToMoment(input).isSame('2019-01-01')).toBeTruthy();
        });
    });

    test('throws if input does not parse', () => {
        expect(() => _convertToMoment('bomb')).toThrow(Error);
    });
});
