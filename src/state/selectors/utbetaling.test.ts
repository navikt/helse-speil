import { getRequiredTimestamp, isGodkjent } from '@state/selectors/utbetaling';
import { enUtbetaling, enVurdering } from '@test-data/utbetaling';

describe('isGodkjent', () => {
    it('returnerer true om en utbetaling er godkjent', () => {
        const vurdering = enVurdering({ godkjent: true });
        const utbetaling = enUtbetaling({ vurdering });

        expect(isGodkjent(utbetaling)).toEqual(true);
    });

    it('returnerer false om en utbetaling ikke er godkjent', () => {
        const vurdering = enVurdering({ godkjent: false });
        const utbetaling = enUtbetaling({ vurdering });

        expect(isGodkjent(utbetaling)).toEqual(false);
    });
});

describe('getRequiredTimestamp', () => {
    it('returnerer tidsstempelet for en utbetaling', () => {
        const tidsstempel = '2021-02-12';
        const vurdering = enVurdering({ tidsstempel });
        const utbetaling = enUtbetaling({ vurdering });

        expect(getRequiredTimestamp(utbetaling)).toEqual(tidsstempel);
    });

    it('thrower om utbetalingen ikke har et tidsstempel', () => {
        const utbetaling = enUtbetaling({ vurdering: null });

        expect(() => getRequiredTimestamp(utbetaling)).toThrow();
    });
});
