import { SpleisUtbetaling, SpleisUtbetalingsdag } from 'external-types';

const utbetaling = (tidslinje: SpleisUtbetalingsdag[], fagsystemId: string): SpleisUtbetaling | undefined => {
    const førsteUtbetalingsdag = tidslinje.find(({ utbetaling }) => utbetaling !== undefined);
    const sisteUtbetalingsdag = [...tidslinje].reverse().find(({ utbetaling }) => utbetaling !== undefined);

    if (!førsteUtbetalingsdag || !sisteUtbetalingsdag) return undefined;

    return {
        fagsystemId,
        linjer: [
            {
                fom: førsteUtbetalingsdag.dato,
                tom: sisteUtbetalingsdag.dato,
                dagsats: førsteUtbetalingsdag.utbetaling!,
                grad: førsteUtbetalingsdag.grad!,
            },
        ],
    };
};

export const utbetalinger = (
    tidslinje: SpleisUtbetalingsdag[],
    tilArbeidsgiver: boolean = false,
    tilPerson: boolean = false,
    fagsystemId: string = 'en-fagsystem-id'
) => ({
    arbeidsgiverUtbetaling: tilArbeidsgiver ? utbetaling(tidslinje, fagsystemId) : undefined,
    personUtbetaling: tilPerson ? utbetaling(tidslinje, fagsystemId) : undefined,
});

export const totalbeløpArbeidstaker = (utbetalingsdager: SpleisUtbetalingsdag[]) =>
    utbetalingsdager.reduce(
        (totalbeløp: number, { utbetaling }: SpleisUtbetalingsdag) =>
            utbetaling ? totalbeløp + utbetaling : totalbeløp,
        0
    );
