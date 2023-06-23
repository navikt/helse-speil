export interface PossibleTypesResultData {
    possibleTypes: {
        [key: string]: string[];
    };
}
const result: PossibleTypesResultData = {
    possibleTypes: {
        Hendelse: ['Inntektsmelding', 'SoknadArbeidsgiver', 'SoknadNav', 'Sykmelding'],
        Overstyring: ['Arbeidsforholdoverstyring', 'Dagoverstyring', 'Inntektoverstyring'],
        Periode: ['BeregnetPeriode', 'UberegnetPeriode'],
        Spennoppdrag: ['Arbeidsgiveroppdrag', 'Personoppdrag'],
        Vilkarsgrunnlag: ['VilkarsgrunnlagInfotrygd', 'VilkarsgrunnlagSpleis'],
    },
};
export default result;
