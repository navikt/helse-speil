import dayjs from 'dayjs';

export const mappetInntektsgrunnlag: Inntektsgrunnlag = {
    organisasjonsnummer: '987654321',
    skjæringstidspunkt: dayjs('2020-01-01T00:00:00.000Z'),
    sykepengegrunnlag: 372000,
    omregnetÅrsinntekt: 372000,
    maksUtbetalingPerDag: 1430.7692307692,
    inntekter: [
        {
            arbeidsgivernavn: 'Potetsekk AS',
            organisasjonsnummer: '987654321',
            omregnetÅrsinntekt: {
                kilde: 'Inntektsmelding',
                beløp: 372000,
                månedsbeløp: 31000.0,
                inntekterFraAOrdningen: undefined,
            },
            bransjer: ['Rotvekst', 'Gårdsgreier'],
            forskuttering: false,
            refusjon: true,
            arbeidsforhold: [
                {
                    stillingstittel: 'Potetplukker',
                    stillingsprosent: 100,
                    startdato: dayjs('2018-01-01T00:00:00.000Z'),
                },
            ],
        },
    ],
};

export const umappetInntektsgrunnlag = (
    inntektskilde: ExternalInntektkilde = 'Inntektsmelding'
): ExternalInntektsgrunnlag => ({
    skjæringstidspunkt: '2020-01-01',
    sykepengegrunnlag: 372000.0,
    omregnetÅrsinntekt: 372000.0,
    sammenligningsgrunnlag: inntektskilde === 'Inntektsmelding' ? 372000.0 : undefined,
    avviksprosent: 0.0,
    maksUtbetalingPerDag: 1430.7692307692,
    inntekter: [
        {
            arbeidsgiver: '987654321',
            omregnetÅrsinntekt: {
                kilde: inntektskilde,
                beløp: 372000.0,
                månedsbeløp: 31000.0,
                inntekterFraAOrdningen: null,
            },
            sammenligningsgrunnlag:
                inntektskilde === 'Inntektsmelding'
                    ? {
                          beløp: 372000.0,
                          inntekterFraAOrdningen: [
                              { måned: '2019-01', sum: 31000.0 },
                              { måned: '2019-02', sum: 31000.0 },
                              { måned: '2019-03', sum: 31000.0 },
                              { måned: '2019-04', sum: 31000.0 },
                              { måned: '2019-05', sum: 31000.0 },
                              { måned: '2019-06', sum: 31000.0 },
                              { måned: '2019-07', sum: 31000.0 },
                              { måned: '2019-08', sum: 31000.0 },
                              { måned: '2019-09', sum: 31000.0 },
                              { måned: '2019-10', sum: 31000.0 },
                              { måned: '2019-11', sum: 31000.0 },
                              { måned: '2019-12', sum: 31000.0 },
                          ],
                      }
                    : undefined,
        },
    ],
});
