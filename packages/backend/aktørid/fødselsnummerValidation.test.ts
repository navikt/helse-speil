import { erGyldigFødselsnummer } from './fødselsnummerValidation';

const validSsn = '02010171337';

test('gyldige fødselsnumre aksepteres', () => {
    expect(erGyldigFødselsnummer(validSsn)).toBeTruthy();
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
        '02010167720',
    ].map((fødselsnummer) => {
        expect(erGyldigFødselsnummer(fødselsnummer)).toBeTruthy();
    });
});

test('ugyldige fødselsnumre avvises', () => {
    expect(erGyldigFødselsnummer(validSsn.substring(0, 10) + '8')).toBeFalsy();

    const ssnWithSpaceInTheMiddle = validSsn.substring(0, 5) + ' ' + validSsn.substring(6, 11);
    expect(erGyldigFødselsnummer(ssnWithSpaceInTheMiddle)).toBeFalsy();

    const ssnWithLetterInTheMiddle = validSsn.substring(0, 5) + 'x' + validSsn.substring(6, 11);
    expect(erGyldigFødselsnummer(ssnWithLetterInTheMiddle)).toBeFalsy();
});

test('numre som ikke inneholder nøyaktig 11 sifre avvises', () => {
    expect(erGyldigFødselsnummer(validSsn.substring(0, 10))).toBeFalsy();
    expect(erGyldigFødselsnummer(' ' + validSsn.substring(1, 11))).toBeFalsy();
    expect(erGyldigFødselsnummer(validSsn + '1')).toBeFalsy();
    expect(erGyldigFødselsnummer('')).toBeFalsy();
});
