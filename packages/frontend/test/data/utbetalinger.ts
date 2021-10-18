import { testArbeidsgiverfagsystemId } from './person';

const utbetaling = (tidslinje: ExternalUtbetalingsdag[], fagsystemId: string): ExternalUtbetaling | undefined => {
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
    tidslinje: ExternalUtbetalingsdag[],
    tilArbeidsgiver: boolean = false,
    tilPerson: boolean = false,
    fagsystemId: string = testArbeidsgiverfagsystemId
) => ({
    arbeidsgiverUtbetaling: tilArbeidsgiver ? utbetaling(tidslinje, fagsystemId) : undefined,
    personUtbetaling: tilPerson ? utbetaling(tidslinje, fagsystemId) : undefined,
});

export const totalbeløpArbeidstaker = (utbetalingsdager: ExternalUtbetalingsdag[]) =>
    utbetalingsdager.reduce(
        (totalbeløp: number, { utbetaling }: ExternalUtbetalingsdag) =>
            utbetaling ? totalbeløp + utbetaling : totalbeløp,
        0
    );
