export interface PossibleTypesResultData {
    possibleTypes: {
        [key: string]: string[];
    };
}
const result: PossibleTypesResultData = {
    possibleTypes: {
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
        Periode: ['BeregnetPeriode', 'UberegnetPeriode', 'UberegnetVilkarsprovdPeriode'],
        Spennoppdrag: ['Arbeidsgiveroppdrag', 'Personoppdrag'],
        Vilkarsgrunnlag: ['VilkarsgrunnlagInfotrygd', 'VilkarsgrunnlagSpleis'],
    },
};
export default result;
