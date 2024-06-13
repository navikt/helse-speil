export const possibleTypes: Record<string, string[]> = {
    Hendelse: [
        'Inntektsmelding',
        'SoknadArbeidsgiver',
        'SoknadArbeidsledig',
        'SoknadFrilans',
        'SoknadNav',
        'SoknadSelvstendig',
        'Sykmelding',
    ],
    Overstyring: [
        'Arbeidsforholdoverstyring',
        'Dagoverstyring',
        'Inntektoverstyring',
        'Sykepengegrunnlagskjonnsfastsetting',
    ],
    Periode: ['BeregnetPeriode', 'UberegnetPeriode'],
    Vilkarsgrunnlag: ['VilkarsgrunnlagInfotrygd', 'VilkarsgrunnlagSpleis'],
};
