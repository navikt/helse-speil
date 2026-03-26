import { Infotrygdutbetaling } from '@io/graphql';
import { renderHook } from '@test-utils';

import { useInfotrygdPerioder } from './useInfotrygdPerioder';

const enInfotrygdutbetaling = (overrides?: Partial<Infotrygdutbetaling>): Infotrygdutbetaling => ({
    __typename: 'Infotrygdutbetaling',
    fom: '2020-01-01',
    tom: '2020-01-31',
    dagsats: 1000,
    grad: '100',
    organisasjonsnummer: '123456789',
    typetekst: 'Utbetaling',
    ...overrides,
});

describe('useInfotrygdTidslinje', () => {
    it('returnerer tom liste for tom input', () => {
        const { result } = renderHook(() => useInfotrygdPerioder([]));
        expect(result.current).toHaveLength(0);
    });

    it('filtrerer ut perioder med typetekst "Tilbakeført"', () => {
        const { result } = renderHook(() =>
            useInfotrygdPerioder([enInfotrygdutbetaling({ typetekst: 'Tilbakeført' })]),
        );
        expect(result.current).toHaveLength(0);
    });

    it('filtrerer ut perioder med typetekst "Ukjent.."', () => {
        const { result } = renderHook(() => useInfotrygdPerioder([enInfotrygdutbetaling({ typetekst: 'Ukjent..' })]));
        expect(result.current).toHaveLength(0);
    });

    it('slår sammen sammenhengende perioder til én', () => {
        const utbetalinger = [
            enInfotrygdutbetaling({ fom: '2020-01-01', tom: '2020-01-15' }),
            enInfotrygdutbetaling({ fom: '2020-01-16', tom: '2020-01-31' }),
        ];
        const { result } = renderHook(() => useInfotrygdPerioder(utbetalinger));
        expect(result.current).toHaveLength(1);
        expect(result.current[0]?.fom).toBe('2020-01-01');
        expect(result.current[0]?.tom).toBe('2020-01-31');
    });

    it('beholder separate perioder når det er gap mellom dem', () => {
        const utbetalinger = [
            enInfotrygdutbetaling({ fom: '2020-01-01', tom: '2020-01-10' }),
            enInfotrygdutbetaling({ fom: '2020-01-15', tom: '2020-01-31' }),
        ];
        const { result } = renderHook(() => useInfotrygdPerioder(utbetalinger));
        expect(result.current).toHaveLength(2);
    });
});
