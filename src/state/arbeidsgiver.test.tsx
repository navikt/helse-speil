import { nanoid } from 'nanoid';

import {
    findArbeidsgiverWithGhostPeriode,
    finnInntektsforholdForPeriode,
    useAktivtInntektsforhold,
} from '@state/arbeidsgiver';
import { finnArbeidsgiver } from '@state/arbeidsgiverHelpers';
import { useActivePeriod } from '@state/periode';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBeregnetPeriode, enGhostPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { renderHook } from '@test-utils';

jest.mock('@state/person');
jest.mock('@state/periode');
jest.unmock('@state/arbeidsgiver');

describe('findArbeidsgiverWithGhostPeriode', () => {
    it('returnerer arbeidsgiver som inneholder gitt ghost-periode', () => {
        const ghostPeriode = enGhostPeriode();
        const arbeidsgiver = enArbeidsgiver({ ghostPerioder: [ghostPeriode] });
        const arbeidsgivere = [enArbeidsgiver(), arbeidsgiver, enArbeidsgiver()];

        expect(findArbeidsgiverWithGhostPeriode(ghostPeriode, arbeidsgivere)).toEqual(arbeidsgiver);
    });

    it('returnerer null hvis ghost-perioden ikke finnes hos en arbeidsgiver', () => {
        const ghostPeriode = enGhostPeriode();
        const arbeidsgivere = [enArbeidsgiver(), enArbeidsgiver(), enArbeidsgiver()];

        expect(findArbeidsgiverWithGhostPeriode(ghostPeriode, arbeidsgivere)).toBeNull();
    });
});

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
        jest.clearAllMocks();
    });

    it('returnerer null hvis det ikke finnes en aktiv periode', () => {
        const { result } = renderHook(() => useAktivtInntektsforhold(enPerson()));

        expect(result.current).toBeUndefined();
    });

    it('returnerer arbeidsgiveren som er tilknyttet den aktive perioden', () => {
        const periode = enBeregnetPeriode();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useActivePeriod as jest.Mock).mockReturnValueOnce(periode);

        const { result } = renderHook(() => useAktivtInntektsforhold(person));

        expect(result.current).toEqual(arbeidsgiver);
    });
});

describe('useArbeidsgiver', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returnerer arbeidsgiver med gitt organisasjonsnummer', () => {
        const organisasjonsnummer = nanoid();
        const arbeidsgiver = enArbeidsgiver({ organisasjonsnummer });
        const person = enPerson().medArbeidsgivere([enArbeidsgiver(), arbeidsgiver, enArbeidsgiver()]);

        const { result } = renderHook(() => finnArbeidsgiver(person, organisasjonsnummer));

        expect(result.current).toEqual(arbeidsgiver);
    });

    it('returnerer null hvis arbeidsgiver med gitt organisasjonsnummer ikke finnes', () => {
        const organisasjonsnummer = nanoid();
        const person = enPerson().medArbeidsgivere([enArbeidsgiver(), enArbeidsgiver(), enArbeidsgiver()]);

        const { result } = renderHook(() => finnArbeidsgiver(person, organisasjonsnummer));

        expect(result.current).toBeNull();
    });
});
