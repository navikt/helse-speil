import { Mock, vi } from 'vitest';

import { finnInntektsforholdForPeriode, useAktivtInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { useActivePeriod } from '@state/periode';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBeregnetPeriode } from '@test-data/periode';
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
