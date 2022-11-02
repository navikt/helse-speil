import {
    Inntekter,
    getInntektFraAOrdningen,
    getInntektFraInntektsmelding,
    getInntekter,
} from '@state/selectors/person';
import { enArbeidsgiverinntekt } from '@test-data/arbeidsgiverinntekt';
import { etVilkårsgrunnlagFraSpleis } from '@test-data/vilkårsgrunnlag';

describe('getInntektFraAOrdningen', () => {
    it('returnerer inntekt fra AOrdningen for en arbeidsgiver', () => {
        const arbeidsgiver = 'en-arbeidsgiver';
        const inntektFraAOrdningen = enArbeidsgiverinntekt({ arbeidsgiver }).medInntektFraAOrdningen();
        const inntektFraInntektsmelding = enArbeidsgiverinntekt({ arbeidsgiver });
        const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis().medInntekter([
            inntektFraInntektsmelding,
            inntektFraAOrdningen,
        ]);

        expect(getInntektFraAOrdningen(vilkårsgrunnlag, arbeidsgiver)).toEqual(inntektFraAOrdningen);
    });

    it('returnerer null hvis inntekt fra AOrdningen ikke finnes', () => {
        const arbeidsgiver = 'en-arbeidsgiver';
        const inntektFraInntektsmelding = enArbeidsgiverinntekt({ arbeidsgiver });
        const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis().medInntekter([inntektFraInntektsmelding]);

        expect(getInntektFraAOrdningen(vilkårsgrunnlag, arbeidsgiver)).toBeNull();
    });
});

describe('getInntektFraInntektsmelding', () => {
    it('returnerer inntekt fra inntektsmelding for en arbeidsgiver', () => {
        const arbeidsgiver = 'en-arbeidsgiver';
        const inntektFraAOrdningen = enArbeidsgiverinntekt({ arbeidsgiver }).medInntektFraAOrdningen();
        const inntektFraInntektsmelding = enArbeidsgiverinntekt({ arbeidsgiver });
        const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis().medInntekter([
            inntektFraInntektsmelding,
            inntektFraAOrdningen,
        ]);

        expect(getInntektFraInntektsmelding(vilkårsgrunnlag, arbeidsgiver)).toEqual(inntektFraInntektsmelding);
    });

    it('returnerer null hvis inntekt fra inntektsmelding ikke finnes', () => {
        const arbeidsgiver = 'en-arbeidsgiver';
        const inntektFraAOrdningen = enArbeidsgiverinntekt({ arbeidsgiver }).medInntektFraAOrdningen();
        const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis().medInntekter([inntektFraAOrdningen]);

        expect(getInntektFraInntektsmelding(vilkårsgrunnlag, arbeidsgiver)).toBeNull();
    });
});

describe('getInntekter', () => {
    it('returnerer inntekter fra inntektsmelding og AOrdningen', () => {
        const arbeidsgiver = 'en-arbeidsgiver';
        const inntektFraAOrdningen = enArbeidsgiverinntekt({ arbeidsgiver }).medInntektFraAOrdningen();
        const inntektFraInntektsmelding = enArbeidsgiverinntekt({ arbeidsgiver });
        const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis().medInntekter([
            inntektFraInntektsmelding,
            inntektFraAOrdningen,
        ]);

        const expected: Inntekter = {
            fraInntektsmelding: inntektFraInntektsmelding,
            fraAOrdningen: inntektFraAOrdningen,
        };

        expect(getInntekter(vilkårsgrunnlag, arbeidsgiver)).toEqual(expected);
    });

    it('kaster exception om inntekt mangler fra både inntektsmeldingen og AOrdningen', () => {
        const arbeidsgiver = 'en-arbeidsgiver';
        const inntektFraInntektsmelding = enArbeidsgiverinntekt({ arbeidsgiver });
        const vilkårsgrunnlagMedInntektFraIM = etVilkårsgrunnlagFraSpleis().medInntekter([inntektFraInntektsmelding]);

        expect(getInntekter(vilkårsgrunnlagMedInntektFraIM, arbeidsgiver)).toEqual({
            fraInntektsmelding: inntektFraInntektsmelding,
            fraAOrdningen: null,
        });

        const inntektFraAOrdningen = enArbeidsgiverinntekt({ arbeidsgiver }).medInntektFraAOrdningen();
        const vilkårsgrunnlagMedInntektFraAO = etVilkårsgrunnlagFraSpleis().medInntekter([inntektFraAOrdningen]);

        expect(getInntekter(vilkårsgrunnlagMedInntektFraAO, arbeidsgiver)).toEqual({
            fraInntektsmelding: null,
            fraAOrdningen: inntektFraAOrdningen,
        });

        const vilkårsgrunnlagUtenInntekter = etVilkårsgrunnlagFraSpleis({ inntekter: [] });
        expect(() => getInntekter(vilkårsgrunnlagUtenInntekter, arbeidsgiver)).toThrow();
    });
});
