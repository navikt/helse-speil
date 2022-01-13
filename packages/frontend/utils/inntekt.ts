import dayjs from 'dayjs';

export const sorterInntekterFraAOrdningen = (
    inntekterFraAOrdningen: ExternalInntekterFraAOrdningen[] | null
): ExternalInntekterFraAOrdningen[] | null =>
    inntekterFraAOrdningen == null
        ? null
        : inntekterFraAOrdningen
              .map((inntektFraAOrdningen) => ({
                  måned: dayjs(inntektFraAOrdningen.måned, 'YYYY-MM'),
                  sum: inntektFraAOrdningen.sum,
              }))
              .sort((a, b) => (a.måned.isAfter(b.måned) ? -1 : 1))
              .map((it) => ({
                  måned: it.måned.format('YYYY-MM'),
                  sum: it.sum,
              }));
