import {
    getFormattedDateString,
    getFormattedDatetimeString,
    minusEnDag,
    plussEnDag,
    somDate,
    somDato,
    somNorskDato,
} from '@utils/date';

describe('date', () => {
    it('skal formattere dato til norsk format', () => {
        expect(getFormattedDateString()).toBe('');
        expect(getFormattedDateString(undefined)).toBe('');
        expect(getFormattedDateString(null)).toBe('');
        expect(getFormattedDateString('2020-01-01')).toBe('01.01.2020');
    });
    it('skal formattere dato til norsk format eller undefined', () => {
        expect(somNorskDato(undefined)).toBe(undefined);
        expect(somNorskDato('2020-01-01')).toBe('01.01.2020');
    });
    it('skal formattere dato med klokkeslett til norsk format', () => {
        expect(getFormattedDatetimeString()).toBe('');
        expect(getFormattedDatetimeString(undefined)).toBe('');
        expect(getFormattedDatetimeString(null)).toBe('');
        expect(getFormattedDatetimeString('2020-01-01T13:37:00')).toBe('01.01.2020 kl. 13.37');
    });
    it('skal gjøre string til dayjs', () => {
        expect(somDato('2020-01-01').format()).toEqual('2020-01-01T00:00:00+01:00');
    });
    it('skal gjøre string til Date', () => {
        expect(somDate()).toBeUndefined();
        expect(somDate('hei')).toBeUndefined();
        expect(somDate('2020-20-20')).toBeUndefined();
        expect(somDate('2020-01-01')).toEqual(new Date('2019-12-31T23:00:00.000Z'));
    });
    it('skal kunne legge til en dag på dato', () => {
        expect(plussEnDag('2020-01-01')).toBe('2020-01-02');
    });
    it('skal kunne trekke fra en dag på dato', () => {
        expect(minusEnDag('2020-01-02')).toBe('2020-01-01');
    });
});
