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
        'MinimumSykdomsgradOverstyring',
    ],
    Periode: ['BeregnetPeriode', 'UberegnetPeriode'],
    VilkarsgrunnlagV2: ['VilkarsgrunnlagInfotrygdV2', 'VilkarsgrunnlagSpleisV2'],
};
