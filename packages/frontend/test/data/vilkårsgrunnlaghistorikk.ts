import dayjs from 'dayjs';

import { testOrganisasjonsnummer, testSkjæringstidspunkt } from './person';

export const etSpleisgrunnlag = (grunnlag?: Partial<ExternalSpleisVilkårsgrunnlag>): ExternalSpleisVilkårsgrunnlag => {
    return {
        skjæringstidspunkt: `${testSkjæringstidspunkt}`,
        omregnetÅrsinntekt: 231000,
        sammenligningsgrunnlag: 189000,
        sykepengegrunnlag: 231000,
        inntekter: [
            {
                deaktivert: false,
                organisasjonsnummer: `${testOrganisasjonsnummer}`,
                omregnetÅrsinntekt: {
                    kilde: 'Inntektsmelding',
                    beløp: 231000,
                    månedsbeløp: 19250,
                    inntekterFraAOrdningen: null,
                },
                sammenligningsgrunnlag: 189000,
            },
        ],
        avviksprosent: 5.0,
        grunnbeløp: 106399,
        oppfyllerKravOmMinstelønn: true,
        oppfyllerKravOmMedlemskap: null,
        oppfyllerKravOmOpptjening: true,
        opptjeningFra: dayjs(testSkjæringstidspunkt).subtract(10, 'years').toISOString(),
        antallOpptjeningsdagerErMinst: 365,
        vilkårsgrunnlagtype: 'SPLEIS',
        ...grunnlag,
    };
};

export const etInfotrygdgrunnlag = (
    grunnlag?: Partial<ExternalInfotrygdVilkårsgrunnlag>
): ExternalInfotrygdVilkårsgrunnlag => {
    return {
        skjæringstidspunkt: `${testSkjæringstidspunkt}`,
        omregnetÅrsinntekt: 231000,
        sammenligningsgrunnlag: 189000,
        sykepengegrunnlag: 231000,
        inntekter: [
            {
                deaktivert: false,
                organisasjonsnummer: `${testOrganisasjonsnummer}`,
                omregnetÅrsinntekt: {
                    kilde: 'Inntektsmelding',
                    beløp: 231000,
                    månedsbeløp: 19250,
                    inntekterFraAOrdningen: null,
                },
                sammenligningsgrunnlag: 189000,
            },
        ],
        vilkårsgrunnlagtype: 'INFOTRYGD',
        ...grunnlag,
    };
};
