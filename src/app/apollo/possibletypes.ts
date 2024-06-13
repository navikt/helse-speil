interface PossibleTypesResultData {
    [key: string]: string[];
}

export const possibleTypes: PossibleTypesResultData = {
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
