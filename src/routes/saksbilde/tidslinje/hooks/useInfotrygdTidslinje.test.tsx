import { Infotrygdutbetaling } from '@io/graphql';
import { renderHook } from '@test-utils';

import { useInfotrygdTidslinje } from './useInfotrygdTidslinje';

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
        const { result } = renderHook(() => useInfotrygdTidslinje([]));
        expect(result.current).toHaveLength(0);
    });

    it('filtrerer ut perioder med typetekst "Tilbakeført"', () => {
        const { result } = renderHook(() =>
            useInfotrygdTidslinje([enInfotrygdutbetaling({ typetekst: 'Tilbakeført' })]),
        );
        expect(result.current).toHaveLength(0);
    });

    it('filtrerer ut perioder med typetekst "Ukjent.."', () => {
        const { result } = renderHook(() => useInfotrygdTidslinje([enInfotrygdutbetaling({ typetekst: 'Ukjent..' })]));
        expect(result.current).toHaveLength(0);
    });

    it('gir status "success" for typetekst "Utbetaling"', () => {
        const { result } = renderHook(() =>
            useInfotrygdTidslinje([enInfotrygdutbetaling({ typetekst: 'Utbetaling' })]),
        );
        expect(result.current[0]?.status).toBe('success');
    });

    it('gir status "success" for typetekst "ArbRef"', () => {
        const { result } = renderHook(() => useInfotrygdTidslinje([enInfotrygdutbetaling({ typetekst: 'ArbRef' })]));
        expect(result.current[0]?.status).toBe('success');
    });

    it('gir status "neutral" for typetekst "Ferie"', () => {
        const { result } = renderHook(() => useInfotrygdTidslinje([enInfotrygdutbetaling({ typetekst: 'Ferie' })]));
        expect(result.current[0]?.status).toBe('neutral');
    });

    it('gir status "ukjent" for ukjent typetekst', () => {
        const { result } = renderHook(() => useInfotrygdTidslinje([enInfotrygdutbetaling({ typetekst: 'Ukjent' })]));
        expect(result.current[0]?.status).toBe('ukjent');
    });

    it('slår sammen sammenhengende perioder til én', () => {
        const utbetalinger = [
            enInfotrygdutbetaling({ fom: '2020-01-01', tom: '2020-01-15' }),
            enInfotrygdutbetaling({ fom: '2020-01-16', tom: '2020-01-31' }),
        ];
        const { result } = renderHook(() => useInfotrygdTidslinje(utbetalinger));
        expect(result.current).toHaveLength(1);
        expect(result.current[0]?.fom).toBe('2020-01-01');
        expect(result.current[0]?.tom).toBe('2020-01-31');
    });

    it('beholder separate perioder når det er gap mellom dem', () => {
        const utbetalinger = [
            enInfotrygdutbetaling({ fom: '2020-01-01', tom: '2020-01-10' }),
            enInfotrygdutbetaling({ fom: '2020-01-15', tom: '2020-01-31' }),
        ];
        const { result } = renderHook(() => useInfotrygdTidslinje(utbetalinger));
        expect(result.current).toHaveLength(2);
    });

    it('setter infotrygdPeriode på hvert element', () => {
        const { result } = renderHook(() => useInfotrygdTidslinje([enInfotrygdutbetaling()]));
        expect(result.current[0]?.infotrygdPeriode?.fom).toBe('2020-01-01');
        expect(result.current[0]?.infotrygdPeriode?.tom).toBe('2020-01-31');
    });

    it('setter generasjonIndex til 0 for alle elementer', () => {
        const { result } = renderHook(() => useInfotrygdTidslinje([enInfotrygdutbetaling()]));
        expect(result.current[0]?.generasjonIndex).toBe(0);
    });
});
