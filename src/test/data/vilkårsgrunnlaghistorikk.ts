import { testOrganisasjonsnummer, testSkjæringstidspunkt } from './person';

export const etSpleisgrunnlag = (grunnlag?: Partial<ExternalSpleisVilkårsgrunnlag>): ExternalSpleisVilkårsgrunnlag => {
    return {
        skjæringstidspunkt: `${testSkjæringstidspunkt}`,
        omregnetÅrsinntekt: 231000,
        sammenligningsgrunnlag: 189000,
        sykepengegrunnlag: 231000,
        inntekter: [
            {
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
        oppfyllerKravOmMinstelønn: true,
        grunnbeløp: 106399,
        medlemskapstatus: 'VET_IKKE',
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
