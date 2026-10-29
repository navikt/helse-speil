import { describe, expect, it } from 'vitest';

import { finnArbeidsforholdForInntektsforhold } from '@state/arbeidsforhold';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';

const arbeidsforhold = [
    { organisasjonsnummer: '111', stillingstittel: 'A', stillingsprosent: 100, startdato: '2020-01-01' },
    { organisasjonsnummer: '222', stillingstittel: 'B', stillingsprosent: 50, startdato: '2021-01-01' },
];

describe('finnArbeidsforholdForInntektsforhold', () => {
    it('gir arbeidsforholdene til arbeidsgiveren', () => {
        expect(
            finnArbeidsforholdForInntektsforhold(arbeidsforhold, enArbeidsgiver({ organisasjonsnummer: '222' })),
        ).toEqual([arbeidsforhold[1]]);
    });

    it('gir tom liste for selvstendig næringsdrivende', () => {
        expect(finnArbeidsforholdForInntektsforhold(arbeidsforhold, { behandlinger: [] })).toEqual([]);
    });
});
