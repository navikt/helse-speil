import { SpleisUtbetalingsdag, SpleisUtbetalingsdagtype } from 'external-types';
import { Dayjs } from 'dayjs';

const finnDagType = (dato: Dayjs, i: number): SpleisUtbetalingsdagtype => {
    if (i < 16) return SpleisUtbetalingsdagtype.ARBEIDSGIVERPERIODE;
    if (erHelg(dato)) return SpleisUtbetalingsdagtype.NAVHELG; //I love the USA
    return SpleisUtbetalingsdagtype.NAVDAG;
};

const tidslengde = (fom: Dayjs, tom: Dayjs): number => {
    return tom.diff(fom, 'day');
};

const erHelg = (dato: Dayjs): boolean => {
    return dato.day() === 0 || dato.day() === 6;
};

function erArbeidsgiverperiode(dagType: SpleisUtbetalingsdagtype) {
    return dagType === SpleisUtbetalingsdagtype.ARBEIDSGIVERPERIODE;
}

export const tidslinjegenerator = (
    fom: Dayjs,
    tom: Dayjs,
    inntekt: number,
    utbetaling: number,
    grad: number,
    totalGrad: number
): SpleisUtbetalingsdag[] => {
    let lengde = tidslengde(fom, tom);
    let result = [];
    for (let i = 0; i <= lengde; i++) {
        let dato = fom.add(i, 'day');
        const dagType = finnDagType(dato, i);
        result.push({
            type: dagType,
            inntekt: erHelg(dato) && !erArbeidsgiverperiode(dagType) ? 0 : inntekt,
            dato: dato.format('YYYY-MM-DD'),
            utbetaling: erHelg(dato) || erArbeidsgiverperiode(dagType) ? undefined : utbetaling,
            grad: erArbeidsgiverperiode(dagType) ? undefined : grad,
            totalGrad: erHelg(dato) || erArbeidsgiverperiode(dagType) ? undefined : totalGrad,
        });
    }
    return result;
};
