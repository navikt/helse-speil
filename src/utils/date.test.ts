import { DatePeriod, DateString } from '@typer/shared';
import {
    ISO_DATOFORMAT,
    erEtter,
    erFør,
    erIPeriode,
    getFormattedDateString,
    getFormattedDatetimeString,
    minusEnDag,
    plussEnDag,
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
        expect(somDato('2020-01-01').format(ISO_DATOFORMAT)).toEqual('2020-01-01');
    });
    it('skal kunne legge til en dag på dato', () => {
        expect(plussEnDag('2020-01-01')).toBe('2020-01-02');
    });
    it('skal kunne trekke fra en dag på dato', () => {
        expect(minusEnDag('2020-01-02')).toBe('2020-01-01');
    });
});

describe('periode', () => {
    it('skal identifisere dato innenfor periode', () => {
        const periode: DatePeriod = { fom: '2020-01-02', tom: '2020-01-30' };
        const datoInnenfor: DateString = '2020-01-02';
        const datoFør: DateString = '2020-01-01';
        const datoEtter: DateString = '2020-01-31';

        expect(erIPeriode(datoInnenfor, periode)).toBeTruthy();
        expect(erIPeriode(datoFør, periode)).toBeFalsy();
        expect(erIPeriode(datoEtter, periode)).toBeFalsy();
    });
    it('skal identifisere dato etter dato', () => {
        const baseDato: DateString = '2020-01-02';
        const datoFør: DateString = '2020-01-01';
        const datoEtter: DateString = '2020-01-03';

        expect(erEtter(datoFør, baseDato)).toBeFalsy();
        expect(erEtter(baseDato, baseDato)).toBeFalsy();
        expect(erEtter(datoEtter, baseDato)).toBeTruthy();
    });
    it('skal identifisere dato før dato', () => {
        const baseDato: DateString = '2020-01-02';
        const datoFør: DateString = '2020-01-01';
        const datoEtter: DateString = '2020-01-03';

        expect(erFør(datoFør, baseDato)).toBeTruthy();
        expect(erFør(baseDato, baseDato)).toBeFalsy();
        expect(erFør(datoEtter, baseDato)).toBeFalsy();
    });
});
