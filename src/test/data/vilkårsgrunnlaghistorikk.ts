export const etSpleisgrunnlag = (grunnlag?: Partial<ExternalSpleisVilkårsgrunnlag>): ExternalSpleisVilkårsgrunnlag => {
    return {
        skjæringstidspunkt: '2021-07-01',
        omregnetÅrsinntekt: 231000,
        sammenligningsgrunnlag: 189000,
        sykepengegrunnlag: 231000,
        inntekter: [
            {
                organisasjonsnummer: '972674818',
                omregnetÅrsinntekt: {
                    kilde: 'Inntektsmelding',
                    beløp: 231000,
                    månedsbeløp: 19250,
                    inntekterFraAOrdningen: null,
                },
                sammenligningsgrunnlag: 189000,
            },
        ],
        avviksprosent: 22.22222222222222,
        oppfyllerKravOmMinstelønn: true,
        grunnbeløp: 106399,
        medlemskapstatus: 'VET_IKKE',
        vilkårsgrunnlagtype: 'SPLEIS',
        ...grunnlag,
    };
};
