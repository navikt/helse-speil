import { describe, expect, it } from 'vitest';

import { finnOverstyringerForInntektsforhold } from '@state/overstyringer';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enDagoverstyring } from '@test-data/overstyring';

const forArbeidsgiver = enDagoverstyring({ organisasjonsnummer: '111' });
const forAnnenArbeidsgiver = enDagoverstyring({ organisasjonsnummer: '222' });
const forSelvstendig = enDagoverstyring({ organisasjonsnummer: 'SELVSTENDIG' });
const overstyringer = [forArbeidsgiver, forAnnenArbeidsgiver, forSelvstendig];

describe('finnOverstyringerForInntektsforhold', () => {
    it('gir overstyringene til arbeidsgiveren', () => {
        expect(
            finnOverstyringerForInntektsforhold(overstyringer, enArbeidsgiver({ organisasjonsnummer: '111' })),
        ).toEqual([forArbeidsgiver]);
    });

    it('gir overstyringene til selvstendig næringsdrivende', () => {
        expect(finnOverstyringerForInntektsforhold(overstyringer, { behandlinger: [], overstyringer: [] })).toEqual([
            forSelvstendig,
        ]);
    });

    it('gir tom liste uten inntektsforhold', () => {
        expect(finnOverstyringerForInntektsforhold(overstyringer, null)).toEqual([]);
    });
});
