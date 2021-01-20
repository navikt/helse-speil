import { SpesialistInntektkilde } from 'external-types';

export const umappetInntektsgrunnlag = {
    skjæringstidspunkt: '2020-01-01',
    sykepengegrunnlag: 744000.0,
    omregnetÅrsinntekt: 740000.0,
    sammenligningsgrunnlag: undefined,
    avviksprosent: undefined,
    maksUtbetalingPerDag: 1430.7692307692307,
    inntekter: [
        {
            arbeidsgiver: '987654321',
            omregnetÅrsinntekt: {
                kilde: SpesialistInntektkilde.Infotrygd,
                beløp: 372000.0,
                månedsbeløp: 31000.0,
                inntekterFraAOrdningen: undefined,
            },
            sammenligningsgrunnlag: undefined,
        },
        {
            arbeidsgiver: '345687654',
            omregnetÅrsinntekt: {
                kilde: SpesialistInntektkilde.Infotrygd,
                beløp: 372000.0,
                månedsbeløp: 31000.0,
                inntekterFraAOrdningen: undefined,
            },
            sammenligningsgrunnlag: undefined,
        },
    ],
};
