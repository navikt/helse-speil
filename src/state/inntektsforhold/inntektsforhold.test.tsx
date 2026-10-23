import { Mock, vi } from 'vitest';

import {
    finnInntektsforholdForPeriode,
    useAktivtInntektsforhold,
    useSerPåTidligereBehandling,
} from '@state/inntektsforhold/inntektsforhold';
import { useActivePeriod } from '@state/periode';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBehandling } from '@test-data/behandling';
import { enBeregnetPeriode, enGhostPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { renderHook } from '@test-utils';

vi.mock('@state/person');
vi.mock('@state/periode');
vi.unmock('@state/inntektsforhold/arbeidsgiver');

describe('finnInntektsforholdForPeriode', () => {
    it('returnerer arbeidsgiver som inneholder gitt periode', () => {
        const periode = enBeregnetPeriode();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const arbeidsgivere = [enArbeidsgiver(), arbeidsgiver, enArbeidsgiver()];
        const person = enPerson().medArbeidsgivere(arbeidsgivere);

        expect(finnInntektsforholdForPeriode(person, periode)).toEqual(arbeidsgiver);
    });

    it('returnerer null hvis perioden ikke finnes hos en arbeidsgiver', () => {
        const periode = enBeregnetPeriode();
        const arbeidsgivere = [enArbeidsgiver(), enArbeidsgiver(), enArbeidsgiver()];
        const person = enPerson().medArbeidsgivere(arbeidsgivere);

        expect(finnInntektsforholdForPeriode(person, periode)).toBeUndefined();
    });
});

describe('useAktivtInntektsforhold', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('returnerer null hvis det ikke finnes en aktiv periode', () => {
        const { result } = renderHook(() => useAktivtInntektsforhold(enPerson()));

        expect(result.current).toBeUndefined();
    });

    it('returnerer arbeidsgiveren som er tilknyttet den aktive perioden', () => {
        const periode = enBeregnetPeriode();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useActivePeriod as Mock).mockReturnValueOnce(periode);

        const { result } = renderHook(() => useAktivtInntektsforhold(person));

        expect(result.current).toEqual(arbeidsgiver);
    });
});

describe('useSerPåTidligereBehandling', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('returnerer false hvis det ikke finnes en aktiv periode', () => {
        const { result } = renderHook(() => useSerPåTidligereBehandling(enPerson()));

        expect(result.current).toBe(false);
    });

    it('returnerer false når aktiv periode er i siste behandling', () => {
        const nyestePeriode = enBeregnetPeriode();
        const tidligerePeriode = enBeregnetPeriode();
        const arbeidsgiver = enArbeidsgiver({
            behandlinger: [enBehandling({ perioder: [nyestePeriode] }), enBehandling({ perioder: [tidligerePeriode] })],
        });
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useActivePeriod as Mock).mockReturnValue(nyestePeriode);

        const { result } = renderHook(() => useSerPåTidligereBehandling(person));

        expect(result.current).toBe(false);
    });

    it('returnerer true når aktiv periode er i en tidligere behandling', () => {
        const nyestePeriode = enBeregnetPeriode();
        const tidligerePeriode = enBeregnetPeriode();
        const arbeidsgiver = enArbeidsgiver({
            behandlinger: [enBehandling({ perioder: [nyestePeriode] }), enBehandling({ perioder: [tidligerePeriode] })],
        });
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useActivePeriod as Mock).mockReturnValue(tidligerePeriode);

        const { result } = renderHook(() => useSerPåTidligereBehandling(person));

        expect(result.current).toBe(true);
    });

    it('returnerer false for ghostperioder, siden de ikke har tidligere behandlinger', () => {
        const ghostPeriode = enGhostPeriode();
        const arbeidsgiver = enArbeidsgiver().medGhostPerioder([ghostPeriode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useActivePeriod as Mock).mockReturnValue(ghostPeriode);

        const { result } = renderHook(() => useSerPåTidligereBehandling(person));

        expect(result.current).toBe(false);
    });
});
