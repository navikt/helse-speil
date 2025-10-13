import { nanoid } from 'nanoid';

import { findArbeidsgiverWithGhostPeriode, finnArbeidsgiver } from '@state/inntektsforhold/arbeidsgiver';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enGhostPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { renderHook } from '@test-utils';

jest.mock('@state/person');
jest.mock('@state/periode');
jest.unmock('@state/inntektsforhold/arbeidsgiver');

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
