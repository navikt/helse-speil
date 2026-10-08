import mockRouter from 'next-router-mock';

import { useActivePeriod, useSetActivePeriodIdUtenPerson, useSistValgtePeriode } from '@state/periode';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBeregnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { act, renderHook } from '@test-utils';

describe('useSistValgtePeriode', () => {
    const eldrePeriode = enBeregnetPeriode({
        id: 'eldre-periode',
        fom: '2025-09-01',
        tom: '2025-09-30',
    });
    const nyerePeriode = enBeregnetPeriode({
        id: 'nyere-periode',
        fom: '2026-09-01',
        tom: '2026-09-30',
    });
    const person = enPerson({
        arbeidsgivere: [enArbeidsgiver().medPerioder([eldrePeriode, nyerePeriode])],
    });

    it('bruker automatisk valgt periode uten et klikk i tidslinjen, også på legg til-siden', () => {
        mockRouter.setCurrentUrl('/person/person-a');
        const { result, rerender } = renderHook(() => ({
            aktivPeriode: useActivePeriod(person),
            sistValgtePeriode: useSistValgtePeriode(person),
        }));

        expect(result.current.aktivPeriode?.fom).toBe('2026-09-01');
        expect(result.current.sistValgtePeriode).toEqual(result.current.aktivPeriode);

        act(() => mockRouter.setCurrentUrl('/person/person-a/leggtil'));
        rerender();

        expect(result.current.aktivPeriode).toBeNull();
        expect(result.current.sistValgtePeriode?.fom).toBe('2026-09-01');
    });

    it('beholder en eksplisitt valgt periode', () => {
        const { result } = renderHook(() => ({
            periode: useSistValgtePeriode(person),
            velgPeriode: useSetActivePeriodIdUtenPerson(),
        }));

        act(() => result.current.velgPeriode(eldrePeriode.id));

        expect(result.current.periode?.fom).toBe('2025-09-01');
    });

    it('returnerer null uten person', () => {
        const { result } = renderHook(() => useSistValgtePeriode(null));

        expect(result.current).toBeNull();
    });
});
