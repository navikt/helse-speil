import { vi } from 'vitest';

import {
    finnArbeidsgiverForGhostPeriode,
    finnArbeidsgiverMedOrganisasjonsnummer,
} from '@state/inntektsforhold/arbeidsgiver';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enGhostPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { renderHook } from '@test-utils';
import { generateId } from '@utils/generateId';

vi.mock('@state/person');
vi.mock('@state/periode');
vi.unmock('@state/inntektsforhold/arbeidsgiver');

describe('findArbeidsgiverWithGhostPeriode', () => {
    it('returnerer arbeidsgiver som inneholder gitt ghost-periode', () => {
        const ghostPeriode = enGhostPeriode();
        const arbeidsgiver = enArbeidsgiver({ ghostPerioder: [ghostPeriode] });
        const arbeidsgivere = [enArbeidsgiver(), arbeidsgiver, enArbeidsgiver()];
        const person = enPerson().medArbeidsgivere(arbeidsgivere);

        expect(finnArbeidsgiverForGhostPeriode(person, ghostPeriode)).toEqual(arbeidsgiver);
    });

    it('returnerer undefined hvis ghost-perioden ikke finnes hos en arbeidsgiver', () => {
        const ghostPeriode = enGhostPeriode();
        const arbeidsgivere = [enArbeidsgiver(), enArbeidsgiver(), enArbeidsgiver()];
        const person = enPerson().medArbeidsgivere(arbeidsgivere);

        expect(finnArbeidsgiverForGhostPeriode(person, ghostPeriode)).toBeUndefined();
    });
});

describe('useArbeidsgiver', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('returnerer arbeidsgiver med gitt organisasjonsnummer', () => {
        const organisasjonsnummer = generateId();
        const arbeidsgiver = enArbeidsgiver({ organisasjonsnummer });
        const person = enPerson().medArbeidsgivere([enArbeidsgiver(), arbeidsgiver, enArbeidsgiver()]);

        const { result } = renderHook(() => finnArbeidsgiverMedOrganisasjonsnummer(person, organisasjonsnummer));

        expect(result.current).toEqual(arbeidsgiver);
    });

    it('returnerer null hvis arbeidsgiver med gitt organisasjonsnummer ikke finnes', () => {
        const organisasjonsnummer = generateId();
        const person = enPerson().medArbeidsgivere([enArbeidsgiver(), enArbeidsgiver(), enArbeidsgiver()]);

        const { result } = renderHook(() => finnArbeidsgiverMedOrganisasjonsnummer(person, organisasjonsnummer));

        expect(result.current).toBeNull();
    });
});
