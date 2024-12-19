import { DatePeriod, DateString } from '@typer/shared';
import { erEtter, erFør, erIPeriode } from '@utils/periode';

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
