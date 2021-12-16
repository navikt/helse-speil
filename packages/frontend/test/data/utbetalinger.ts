import { testArbeidsgiverfagsystemId } from './person';
import { umappetSimuleringsdata } from './simulering';

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

export const utbetalingV2 = (): ExternalUtbetalingV2 => ({
    korrelasjonsId: 'korrelasjonsId',
    utbetalingId: 'utbetalingId',
    beregningId: 'beregningId',
    utbetalingstidslinje: [],
    type: 'type',
    maksdato: '1990-09-29',
    status: 'status',
    gjenståendeSykedager: 1,
    forbrukteSykedager: 1,
    arbeidsgiverNettoBeløp: 1,
    personNettoBeløp: 1,
    personOppdrag: {
        fagsystemId: 'personOppdrag',
        utbetalingslinjer: [],
    },
    arbeidsgiverOppdrag: {
        fagsystemId: 'arbeidsgiverOppdrag',
        utbetalingslinjer: [],
        simuleringsResultat: umappetSimuleringsdata,
    },
});
