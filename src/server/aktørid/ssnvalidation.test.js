const { isValidSsn } = require('./ssnvalidation');

const validSsn = '02010171337';

test('valid social security numbers', () => {
    expect(isValidSsn(validSsn)).toBeTruthy();
    [
        '02010171175',
        '02010170977',
        '02010170705',
        '02010170543',
        '02010170381',
        '02010169731',
        '02010169308',
        '02010169146',
        '02010168948',
        '02010168786',
        '02010168514',
        '02010168352',
        '02010168190',
        '02010167992',
        '02010167720'
    ].map(fødselsnummer => {
        expect(isValidSsn(fødselsnummer)).toBeTruthy();
    });
});

test('invalid social security numbers', () => {
    expect(isValidSsn(validSsn.substring(0, 10) + '8')).toBeFalsy();

    const ssnWithSpaceInTheMiddle = validSsn.substring(0, 5) + ' ' + validSsn.substring(6, 11);
    expect(isValidSsn(ssnWithSpaceInTheMiddle)).toBeFalsy();

    const ssnWithLetterInTheMiddle = validSsn.substring(0, 5) + 'x' + validSsn.substring(6, 11);
    expect(isValidSsn(ssnWithLetterInTheMiddle)).toBeFalsy();
});

test('other length than 11 is invalid', () => {
    expect(isValidSsn(undefined)).toBeFalsy();
    expect(isValidSsn(validSsn.substring(0, 10))).toBeFalsy();
    expect(isValidSsn(' ' + validSsn.substring(1, 11))).toBeFalsy();
    expect(isValidSsn(validSsn + '1')).toBeFalsy();
});

test('empty string is invalid', () => {
    expect(isValidSsn('')).toBeFalsy();
});
